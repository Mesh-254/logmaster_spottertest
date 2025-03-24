"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

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
)

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
)

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
)

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
)

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
)

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
)

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
)

const Sidebar = ({ onStateChange }) => {
  const [collapsed, setCollapsed] = useState(false)
  const { currentUser, logout, isAdmin } = useAuth()
  const location = useLocation()

  const toggleSidebar = () => {
    const newState = !collapsed
    setCollapsed(newState)
    if (onStateChange) {
      onStateChange(newState)
    }
  }

  // Notify parent component of sidebar state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(collapsed)
    }
  }, [collapsed, onStateChange])

  const isActive = (path) => {
    return location.pathname === path ? "bg-amber-700" : ""
  }

  return (
    <div
      className={`${collapsed ? "w-20" : "w-64"} fixed h-full bg-black text-white transition-all duration-300 ease-in-out z-10`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {!collapsed && <h1 className="text-xl font-bold text-amber-500">FastTip</h1>}
        <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-800 text-amber-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="py-4">
        <div className="px-4 py-2 mb-4">
          {!collapsed ? (
            <div>
              <p className="text-sm text-gray-400">Welcome,</p>
              <p className="font-semibold text-amber-500">{currentUser?.full_name}</p>
              <p className="text-xs text-gray-400">{currentUser?.role}</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold">
                {currentUser?.full_name?.charAt(0)}
              </div>
            </div>
          )}
        </div>

        <ul className="space-y-2">
          <li>
            <Link to="/" className={`flex items-center px-4 py-3 hover:bg-gray-800 transition-colors ${isActive("/")}`}>
              <DashboardIcon />
              {!collapsed && <span className="ml-3">Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/trips"
              className={`flex items-center px-4 py-3 hover:bg-gray-800 transition-colors ${isActive("/trips")}`}
            >
              <TripIcon />
              {!collapsed && <span className="ml-3">Trips</span>}
            </Link>
          </li>
          {currentUser?.role === "driver" && (
            <li>
              <Link
                to="/trips/create"
                className={`flex items-center px-4 py-3 hover:bg-gray-800 transition-colors ${isActive("/trips/create")}`}
              >
                <CreateTripIcon />
                {!collapsed && <span className="ml-3">Create Trip</span>}
              </Link>
            </li>
          )}
          <li>
            <Link
              to="/logs"
              className={`flex items-center px-4 py-3 hover:bg-gray-800 transition-colors ${isActive("/logs")}`}
            >
              <LogIcon />
              {!collapsed && <span className="ml-3">Logs</span>}
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link
                to="/users"
                className={`flex items-center px-4 py-3 hover:bg-gray-800 transition-colors ${isActive("/users")}`}
              >
                <UsersIcon />
                {!collapsed && <span className="ml-3">Users</span>}
              </Link>
            </li>
          )}
          <li>
            <Link
              to="/profile"
              className={`flex items-center px-4 py-3 hover:bg-gray-800 transition-colors ${isActive("/profile")}`}
            >
              <ProfileIcon />
              {!collapsed && <span className="ml-3">Profile</span>}
            </Link>
          </li>
          <li>
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-3 hover:bg-gray-800 transition-colors text-left"
            >
              <LogoutIcon />
              {!collapsed && <span className="ml-3">Logout</span>}
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar

