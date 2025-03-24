"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const CreateTrip = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    current_location: "",
    pickup_location: "",
    dropoff_location: "",
    vehicle_id: "",
    start_time: "",
    estimated_end_time: "",
    distance: "",
    cycle_hours_used: "",
  });
  const [vehicles, setVehicles] = useState([
    { id: 1, truck_number: "TRK-001", trailer_number: "TRL-001" },
    { id: 2, truck_number: "TRK-002", trailer_number: "TRL-002" },
    { id: 3, truck_number: "TRK-003", trailer_number: null },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/api/trips", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      navigate(`/trips/${response.data.id}`);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="pb-6">
        <h1 className="text-2xl font-bold text-gray-800">Create New Trip</h1>
        <p className="text-gray-600">Enter the details for your new trip</p>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-black border border-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="current_location"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Current Location
                </label>
                <input
                  type="text"
                  id="current_location"
                  name="current_location"
                  value={formData.current_location}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter your current location"
                />
              </div>
              <div>
                <label
                  htmlFor="pickup_location"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Pickup Location
                </label>
                <input
                  type="text"
                  id="pickup_location"
                  name="pickup_location"
                  value={formData.pickup_location}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter pickup location"
                />
              </div>
              <div>
                <label
                  htmlFor="dropoff_location"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Dropoff Location
                </label>
                <input
                  type="text"
                  id="dropoff_location"
                  name="dropoff_location"
                  value={formData.dropoff_location}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter dropoff location"
                />
              </div>
              <div>
                <label
                  htmlFor="vehicle_id"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Vehicle
                </label>
                <select
                  id="vehicle_id"
                  name="vehicle_id"
                  value={formData.vehicle_id}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.truck_number}{" "}
                      {vehicle.trailer_number
                        ? `/ ${vehicle.trailer_number}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="start_time"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  id="start_time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label
                  htmlFor="estimated_end_time"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Estimated End Time
                </label>
                <input
                  type="datetime-local"
                  id="estimated_end_time"
                  name="estimated_end_time"
                  value={formData.estimated_end_time}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label
                  htmlFor="distance"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Distance (miles)
                </label>
                <input
                  type="number"
                  id="distance"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter estimated distance"
                />
              </div>
              <div>
                <label
                  htmlFor="cycle_hours_used"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Cycle Hours Used
                </label>
                <input
                  type="number"
                  id="cycle_hours_used"
                  name="cycle_hours_used"
                  value={formData.cycle_hours_used}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.5"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter estimated cycle hours"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/trips")}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-amber-500 text-black rounded-md hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Trip"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateTrip;
