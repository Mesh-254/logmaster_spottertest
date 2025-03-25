"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Layout from "../components/Layout"
import { useAuth } from "../context/AuthContext"
import axios from "axios"

const Dashboard = () => {
  const { currentUser, isAdmin } = useAuth()
  const [stats, setStats] = useState({
    totalTrips: 0,
    completedTrips: 0,
    ongoingTrips: 0,
    cycleHoursUsed: 0,
    cycleHoursRemaining: 0,
  })
  const [recentTrips, setRecentTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsResponse = await axios.get("/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })

        const tripsResponse = await axios.get("/api/trips/recent", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })

        setStats(statsResponse.data)
        setRecentTrips(tripsResponse.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-black border border-gray-800 rounded-lg p-4 md:p-6 shadow-lg hover:border-amber-500 transition-all duration-200 transform hover:-translate-y-1">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} text-white mr-4`}>{icon}</div>
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-xl md:text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  )

  return (
    <Layout>
      <div className="pb-4 md:pb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {currentUser?.full_name}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-black border border-gray-800 rounded-lg p-4 md:p-6 shadow-lg animate-pulse">
              <div className="flex items-center">
                <div className="bg-gray-700 p-3 rounded-full mr-4 h-10 w-10 md:h-12 md:w-12"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-16 md:w-24"></div>
                  <div className="h-5 md:h-6 bg-gray-700 rounded w-12 md:w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <StatCard
              title="Total Trips"
              value={stats.totalTrips}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 md:h-6 md:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              }
              color="bg-blue-500"
            />
            <StatCard
              title="Completed Trips"
              value={stats.completedTrips}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 md:h-6 md:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
              color="bg-green-500"
            />
            <StatCard
              title="Ongoing Trips"
              value={stats.ongoingTrips}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 md:h-6 md:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              color="bg-amber-500"
            />
            <StatCard
              title="Cycle Hours Used"
              value={`${stats.cycleHoursUsed}/${stats.cycleHoursUsed + stats.cycleHoursRemaining} hrs`}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 md:h-6 md:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              color="bg-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-black border border-gray-800 rounded-lg shadow-lg overflow-hidden hover:border-amber-500 transition-all duration-300">
              <div className="p-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold text-white">Recent Trips</h2>
              </div>
              <div className="p-4">
                {recentTrips.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-800">
                      <thead>
                        <tr>
                          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Pickup
                          </th>
                          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Dropoff
                          </th>
                          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {recentTrips.map((trip) => (
                          <tr key={trip.id}>
                            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {trip.pickup_location}
                            </td>
                            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {trip.dropoff_location}
                            </td>
                            <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  trip.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              <Link to={`/trips/${trip.id}`} className="text-amber-500 hover:text-amber-400">
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-4">No recent trips found.</p>
                )}
              </div>
            </div>

            <div className="bg-black border border-gray-800 rounded-lg shadow-lg overflow-hidden hover:border-amber-500 transition-all duration-300">
              <div className="p-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold text-white">Cycle Status</h2>
              </div>
              <div className="p-4 md:p-6">
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-300">Hours Used</span>
                    <span className="text-sm font-medium text-gray-300">
                      {stats.cycleHoursUsed} / {stats.cycleHoursUsed + stats.cycleHoursRemaining} hrs
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-amber-500 h-2.5 rounded-full"
                      style={{
                        width: `${(stats.cycleHoursUsed / (stats.cycleHoursUsed + stats.cycleHoursRemaining)) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 md:mt-6">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Cycle Type</p>
                    <p className="text-white font-semibold">
                      {currentUser?.current_cycle?.cycle_type || "Not assigned"}
                    </p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Last Reset</p>
                    <p className="text-white font-semibold">
                      {currentUser?.current_cycle?.last_reset
                        ? new Date(currentUser.current_cycle.last_reset).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  )
}

export default Dashboard

