"use client";

import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useToast } from "../hooks/UseToast";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access_token")
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refresh_token")
  );
  const { addToast } = useToast();

  useEffect(() => {
    if (accessToken) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (error.response?.status === 401) {
        // Token expired, try to refresh
        refreshAccessToken();
      } else {
        addToast("Session expired. Please login again.", "error");
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post("/api/auth/refresh", {
        refresh: refreshToken,
      });
      const { access } = response.data;
      localStorage.setItem("access_token", access);
      setAccessToken(access);
      // Retry fetching user data with new token
      fetchUserData();
    } catch (error) {
      console.error("Error refreshing token:", error);
      addToast("Session expired. Please login again.", "error");
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const { access, refresh, user } = response.data;

      // Store tokens securely
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      setAccessToken(access);
      setRefreshToken(refresh);
      setCurrentUser(user);

      // Show success toast
      addToast("Successfully signed in!", "success");

      return user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      addToast(errorMessage, "error");
      throw new Error(errorMessage);
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post("/api/auth/signup", userData);
      const { access, refresh, user } = response.data;

      // Store tokens securely
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      setAccessToken(access);
      setRefreshToken(refresh);
      setCurrentUser(user);

      // Show success toast
      addToast("Account created successfully!", "success");

      return user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed";
      addToast(errorMessage, "error");
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAccessToken(null);
    setRefreshToken(null);
    setCurrentUser(null);
    addToast("You have been logged out", "info");
  };

  // Set up axios interceptor to handle token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh the token yet
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          refreshToken
        ) {
          originalRequest._retry = true;

          try {
            const response = await axios.post("/api/auth/refresh", {
              refresh: refreshToken,
            });
            const { access } = response.data;

            localStorage.setItem("access_token", access);
            setAccessToken(access);

            // Update the authorization header
            originalRequest.headers["Authorization"] = `Bearer ${access}`;
            return axios(originalRequest);
          } catch (refreshError) {
            // If refresh token is invalid, logout
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [refreshToken]);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    isAdmin: currentUser?.role === "admin",
    isDriver: currentUser?.role === "driver",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
