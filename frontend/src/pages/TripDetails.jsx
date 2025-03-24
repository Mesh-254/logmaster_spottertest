"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import { useAuth } from "../context/AuthContext"
import axios from "axios"

const TripDetails = () => {
  const { id } = useParams()
  const { currentUser, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const mapRef = useRef(null)
  const [waypoints, setWaypoints] = useState([])

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await axios.get(`/api/trips/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        setTrip(response.data)

        // Fetch waypoints
        const waypointsResponse = await axios.get(`/api/trips/${id}/waypoints`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        setWaypoints(waypointsResponse.data)
      } catch (error) {
        console.error("Error fetching trip details:", error)
        setError("Failed to load trip details")
      } finally {
        setLoading(false)
      }
    }

    fetchTripDetails()
  }, [id])

  const handleCompleteTrip = async () => {
    try {
      await axios.patch(
        `/api/trips/${id}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )
      setTrip((prev) => ({ ...prev, status: "completed" }))
    } catch (error) {
      console.error("Error completing trip:", error)
      setError("Failed to complete trip")
    }
  }

  const handleDownloadPDF = async () => {
    try {
      const response = await axios.get(`/api/trips/${id}/pdf`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `trip-${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error("Error downloading PDF:", error)
      setError("Failed to download PDF")
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
          <div className="space-y-3">
            <div className="h-6 bg-gray-300 rounded"></div>
            <div className="h-6 bg-gray-300 rounded"></div>
            <div className="h-6 bg-gray-300 rounded"></div>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </Layout>
    )
  }

  if (!trip) {
    return (
      <Layout>
        <div className="text-center py-10">
          <p className="text-gray-600">Trip not found</p>
          <button
            onClick={() => navigate("/trips")}
            className="mt-4 px-4 py-2 bg-amber-500 text-black rounded-md hover:bg-amber-600 transition-colors"
          >
            Back to Trips
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Trip Details</h1>
          <p className="text-gray-600">Trip #{trip.id}</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Download PDF
          </button>
          {trip.status === "ongoing" && currentUser?.role === "driver" && (
            <button
              onClick={handleCompleteTrip}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Complete Trip
            </button>
          )}
          {isAdmin && (
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
              Delete Trip
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-black border border-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Route Map</h2>
            </div>
            <div className="p-0 h-96 bg-gray-700" ref={mapRef}>
              {/* Map would be rendered here with MapBox */}
              <div className="h-full flex items-center justify-center text-white">
                <p>Map will be rendered here with MapBox</p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-black border border-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Trip Timeline</h2>
            </div>
            <div className="p-4">
              <div className="relative">
                {waypoints.map((waypoint, index) => (
                  <div key={index} className="mb-8 flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-3 h-3 bg-amber-500 rounded-full z-10"></div>
                      {index < waypoints.length - 1 && <div className="h-full w-0.5 bg-gray-700"></div>}
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-medium">
                            {waypoint.stop_type.charAt(0).toUpperCase() + waypoint.stop_type.slice(1)} Stop
                          </h3>
                          <p className="text-gray-400 text-sm">
                            Lat: {waypoint.latitude}, Long: {waypoint.longitude}
                          </p>
                        </div>
                        <span className="text-gray-400 text-sm">{new Date(waypoint.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-black border border-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Trip Information</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className="text-white font-medium">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        trip.status === "completed" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Pickup Location</p>
                  <p className="text-white font-medium">{trip.pickup_location}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Dropoff Location</p>
                  <p className="text-white font-medium">{trip.dropoff_location}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Start Time</p>
                  <p className="text-white font-medium">{new Date(trip.start_time).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Estimated End Time</p>
                  <p className="text-white font-medium">{new Date(trip.estimated_end_time).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Distance</p>
                  <p className="text-white font-medium">{trip.distance} miles</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Cycle Hours Used</p>
                  <p className="text-white font-medium">{trip.cycle_hours_used} hours</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black border border-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Vehicle Information</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Truck Number</p>
                  <p className="text-white font-medium">{trip.vehicle?.truck_number || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Trailer Number</p>
                  <p className="text-white font-medium">{trip.vehicle?.trailer_number || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Fuel Efficiency</p>
                  <p className="text-white font-medium">{trip.vehicle?.fuel_efficiency || "N/A"} mpg</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black border border-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Driver Information</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Driver Name</p>
                  <p className="text-white font-medium">{trip.driver?.full_name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Current Cycle</p>
                  <p className="text-white font-medium">{trip.driver?.current_cycle?.cycle_type || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Hours Used</p>
                  <p className="text-white font-medium">
                    {trip.driver?.current_cycle?.total_hours_used || "N/A"} hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default TripDetails

