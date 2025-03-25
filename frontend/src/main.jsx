import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import axios from "axios"

// Set up axios defaults
axios.defaults.baseURL = "http://localhost:8000" // Replace with your API URL

// Add a mock API response for development
if (process.env.NODE_ENV === "development") {
  // Mock API responses
  const mockData = {
    users: {
      me: {
        id: 1,
        full_name: "John Doe",
        email: "john@example.com",
        role: "driver",
        current_cycle: {
          cycle_type: "70-8",
          total_hours_used: 50.5,
          last_reset: "2023-03-15T00:00:00Z",
        },
      },
    },
    auth: {
      login: {
        token: "mock-jwt-token",
        user: {
          id: 1,
          full_name: "John Doe",
          email: "john@example.com",
          role: "driver",
        },
      },
      signup: {
        token: "mock-jwt-token",
        user: {
          id: 1,
          full_name: "John Doe",
          email: "john@example.com",
          role: "driver",
        },
      },
    },
    dashboard: {
      stats: {
        totalTrips: 15,
        completedTrips: 12,
        ongoingTrips: 3,
        cycleHoursUsed: 80,
        cycleHoursRemaining: 0,
      },
    },
    trips: {
      recent: [
        {
          id: 1,
          pickup_location: "234 Beach Blvd",
          dropoff_location: "109 Collins Ave",
          status: "completed",
          start_time: "2023-03-10T08:00:00Z",
          estimated_end_time: "2023-03-10T15:00:00Z",
        },
        {
          id: 2,
          pickup_location: "2464 Royal Ln",
          dropoff_location: "6391 Elgin St",
          status: "ongoing",
          start_time: "2023-03-15T09:00:00Z",
          estimated_end_time: "2023-03-15T18:00:00Z",
        },
      ],
    },
  }

  // Mock API endpoints
  axios.interceptors.request.use(
    async (config) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  axios.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      const { url, method } = error.config

      // Mock login
      if (url === "/api/auth/login" && method === "post") {
        return { data: mockData.auth.login }
      }

      // Mock signup
      if (url === "/api/auth/signup" && method === "post") {
        return { data: mockData.auth.signup }
      }

      // Mock user data
      if (url === "/api/users/me" && method === "get") {
        return { data: mockData.users.me }
      }

      // Mock dashboard stats
      if (url === "/api/dashboard/stats" && method === "get") {
        return { data: mockData.dashboard.stats }
      }

      // Mock recent trips
      if (url === "/api/trips/recent" && method === "get") {
        return { data: mockData.trips.recent }
      }

      return Promise.reject(error)
    },
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

