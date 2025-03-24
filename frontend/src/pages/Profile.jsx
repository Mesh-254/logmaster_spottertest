"use client"

import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import { useAuth } from "../context/AuthContext"
import axios from "axios"

const Profile = () => {
  const { currentUser, logout } = useAuth()
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    current_password: "",
    new_password: "",
    confirm_password: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        full_name: currentUser.full_name || "",
        email: currentUser.email || "",
      }))
    }
  }, [currentUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: "", text: "" })
    setLoading(true)

    // Validate passwords if changing password
    if (formData.new_password) {
      if (formData.new_password !== formData.confirm_password) {
        setMessage({ type: "error", text: "New passwords do not match" })
        setLoading(false)
        return
      }
    }

    try {
      const response = await axios.put("/api/users/profile", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setMessage({ type: "success", text: "Profile updated successfully" })

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        current_password: "",
        new_password: "",
        confirm_password: "",
      }))
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="pb-6">
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-600">Manage your account settings</p>
      </div>

      {message.text && (
        <div
          className={`${
            message.type === "error"
              ? "bg-red-100 border-red-400 text-red-700"
              : "bg-green-100 border-green-400 text-green-700"
          } px-4 py-3 rounded relative mb-6`}
          role="alert"
        >
          <span className="block sm:inline">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-black border border-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Account Information</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <h3 className="text-md font-medium text-white mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="current_password" className="block text-sm font-medium text-gray-300 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="current_password"
                        name="current_password"
                        value={formData.current_password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="new_password" className="block text-sm font-medium text-gray-300 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="new_password"
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirm_password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-amber-500 text-black rounded-md hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-black border border-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Account Details</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Role</p>
                  <p className="text-white font-medium capitalize">{currentUser?.role || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Account Created</p>
                  <p className="text-white font-medium">
                    {currentUser?.date_joined ? new Date(currentUser.date_joined).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Last Login</p>
                  <p className="text-white font-medium">
                    {currentUser?.last_login ? new Date(currentUser.last_login).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black border border-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Cycle Information</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Cycle Type</p>
                  <p className="text-white font-medium">{currentUser?.current_cycle?.cycle_type || "Not assigned"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Hours Used</p>
                  <p className="text-white font-medium">{currentUser?.current_cycle?.total_hours_used || "0"} hours</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Last Reset</p>
                  <p className="text-white font-medium">
                    {currentUser?.current_cycle?.last_reset
                      ? new Date(currentUser.current_cycle.last_reset).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-900/20 border border-red-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-red-800">
              <h2 className="text-lg font-semibold text-white">Danger Zone</h2>
            </div>
            <div className="p-4">
              <button
                onClick={logout}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile

