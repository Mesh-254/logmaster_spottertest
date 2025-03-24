"use client";

import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Logs = () => {
  const { currentUser, isAdmin } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    date: "",
    status: "all",
  });

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const params = {};
        if (filter.date) params.date = filter.date;
        if (filter.status !== "all") params.status = filter.status;

        const response = await axios.get("/api/logs", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params,
        });
        setLogs(response.data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [filter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "off_duty":
        return "bg-gray-100 text-gray-800";
      case "sleeper":
        return "bg-blue-100 text-blue-800";
      case "driving":
        return "bg-green-100 text-green-800";
      case "on_duty":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Layout>
      <div className="pb-6">
        <h1 className="text-2xl font-bold text-gray-800">ELD Logs</h1>
        <p className="text-gray-600">
          View and manage your electronic logging device entries
        </p>
      </div>

      <div className="bg-black border border-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex flex-wrap gap-4 items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Log Entries</h2>
          <div className="flex flex-wrap gap-4">
            <input
              type="date"
              name="date"
              value={filter.date}
              onChange={handleFilterChange}
              className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <select
              name="status"
              value={filter.status}
              onChange={handleFilterChange}
              className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Statuses</option>
              <option value="off_duty">Off Duty</option>
              <option value="sleeper">Sleeper Berth</option>
              <option value="driving">Driving</option>
              <option value="on_duty">On Duty</option>
            </select>
          </div>
        </div>
        <div className="p-4">
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-800 rounded"></div>
              ))}
            </div>
          ) : logs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Trip
                    </th>
                    {isAdmin && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Driver
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            log.status
                          )}`}
                        >
                          {formatStatus(log.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {log.duration} hrs
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {log.log_sheet?.trip?.id ? (
                          <a
                            href={`/trips/${log.log_sheet.trip.id}`}
                            className="text-amber-500 hover:text-amber-400"
                          >
                            Trip #{log.log_sheet.trip.id}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {log.log_sheet?.trip?.driver?.full_name || "N/A"}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">No logs found.</p>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-black border border-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Off Duty</h2>
          </div>
          <div className="p-6 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">
                {logs
                  .filter((log) => log.status === "off_duty")
                  .reduce((total, log) => total + log.duration, 0)
                  .toFixed(1)}
              </p>
              <p className="text-gray-400 text-sm">Hours</p>
            </div>
          </div>
        </div>
        <div className="bg-black border border-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Sleeper Berth</h2>
          </div>
          <div className="p-6 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">
                {logs
                  .filter((log) => log.status === "sleeper")
                  .reduce((total, log) => total + log.duration, 0)
                  .toFixed(1)}
              </p>
              <p className="text-gray-400 text-sm">Hours</p>
            </div>
          </div>
        </div>
        <div className="bg-black border border-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Driving</h2>
          </div>
          <div className="p-6 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">
                {logs
                  .filter((log) => log.status === "driving")
                  .reduce((total, log) => total + log.duration, 0)
                  .toFixed(1)}
              </p>
              <p className="text-gray-400 text-sm">Hours</p>
            </div>
          </div>
        </div>
        <div className="bg-black border border-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">On Duty</h2>
          </div>
          <div className="p-6 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">
                {logs
                  .filter((log) => log.status === "on_duty")
                  .reduce((total, log) => total + log.duration, 0)
                  .toFixed(1)}
              </p>
              <p className="text-gray-400 text-sm">Hours</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Logs;
