"use client";

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Icons
const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </svg>
);

const TripIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
    <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
    <path d="M3 9l2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
    <path d="M12 3v6" />
  </svg>
);

const LogIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 9H8" />
  </svg>
);

const ProfileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const CreateTripIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const MobileMenu = ({ isOpen, onClose }) => {
  const { currentUser, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const isActive = (path) => {
    return location.pathname === path ? "bg-amber-700" : "";
  };

  // Function to handle navigation
  const handleNavigation = (path) => {
    onClose();
    navigate(path);
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
      <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-black shadow-lg transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h1 className="text-xl font-bold text-amber-500">LogMaster</h1>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-800 text-amber-500 transition-colors"
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="py-4 flex-1 overflow-y-auto">
            <div className="px-4 py-2 mb-4">
              <div>
                <p className="text-sm text-gray-400">Welcome,</p>
                <p className="font-semibold text-amber-500">
                  {currentUser?.full_name}
                </p>
                <p className="text-xs text-gray-400">{currentUser?.role}</p>
              </div>
            </div>

            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigation("/")}
                  className={`w-full flex items-center px-4 py-3 hover:bg-gray-800 hover:text-amber-500 transition-colors text-left ${isActive(
                    "/"
                  )}`}
                >
                  <DashboardIcon />
                  <span className="ml-3">Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/trips")}
                  className={`w-full flex items-center px-4 py-3 hover:bg-gray-800 hover:text-amber-500 transition-colors text-left ${isActive(
                    "/trips"
                  )}`}
                >
                  <TripIcon />
                  <span className="ml-3">Trips</span>
                </button>
              </li>
              {currentUser?.role === "driver" && (
                <li>
                  <button
                    onClick={() => handleNavigation("/trips/create")}
                    className={`w-full flex items-center px-4 py-3 hover:bg-gray-800 hover:text-amber-500 transition-colors text-left ${isActive(
                      "/trips/create"
                    )}`}
                  >
                    <CreateTripIcon />
                    <span className="ml-3">Create Trip</span>
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => handleNavigation("/logs")}
                  className={`w-full flex items-center px-4 py-3 hover:bg-gray-800 hover:text-amber-500 transition-colors text-left ${isActive(
                    "/logs"
                  )}`}
                >
                  <LogIcon />
                  <span className="ml-3">Logs</span>
                </button>
              </li>
              {isAdmin && (
                <li>
                  <button
                    onClick={() => handleNavigation("/users")}
                    className={`w-full flex items-center px-4 py-3 hover:bg-gray-800 hover:text-amber-500 transition-colors text-left ${isActive(
                      "/users"
                    )}`}
                  >
                    <UsersIcon />
                    <span className="ml-3">Users</span>
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => handleNavigation("/profile")}
                  className={`w-full flex items-center px-4 py-3 hover:bg-gray-800 hover:text-amber-500 transition-colors text-left ${isActive(
                    "/profile"
                  )}`}
                >
                  <ProfileIcon />
                  <span className="ml-3">Profile</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="p-4 border-t border-gray-800">
            <button
              onClick={() => {
                logout();
                onClose();
                navigate("/login");
              }}
              className="w-full flex items-center px-4 py-3 bg-red-900/20 hover:bg-red-900/40 text-white rounded-md transition-colors"
            >
              <LogoutIcon />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop click to close */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      ></div>
    </div>
  );
};

export default MobileMenu;
