"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../components/ProtectedRoute";
import Footer from "../../components/Footer";
import apiService from "../../services/api";

export default function StudentDashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setUserInfo(JSON.parse(userInfo));
    }
  }, []);

  // Fetch appeals from API
  useEffect(() => {
    const fetchAppeals = async () => {
      if (!userInfo) return;

      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getStudentAppeals();
        setAppeals(response.appeals || []);
      } catch (error) {
        console.error("Failed to fetch appeals:", error);
        setError("Failed to load appeals. Please try again later.");
        // Fallback to empty array
        setAppeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppeals();
  }, [userInfo]);

  const handleSignOut = () => {
    localStorage.removeItem("userInfo");
    router.push("/login");
  };

  const handleNewAppeal = () => {
    router.push("/student/new");
  };

  const handleViewAppeal = (appealId) => {
    router.push(`/student/${appealId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-100 text-blue-800";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "In Review":
        return "bg-yellow-100 text-yellow-800";
      case "Awaiting Info":
        return "bg-orange-100 text-orange-800";
      case "Review Complete":
        return "bg-green-100 text-green-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (!userInfo) {
    return (
      <ProtectedRoute requiredRole="student">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRole="student">
        <div className="min-h-screen bg-gray-50">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading appeals...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="student">
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Student Dashboard
              </h2>
              <button
                onClick={handleNewAppeal}
                className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
              >
                Submit New Appeal
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Total Appeals
                </h3>
                <p className="text-3xl font-bold text-purple-600">
                  {appeals.length}
                </p>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Pending
                </h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {
                    appeals.filter(
                      (a) =>
                        a.status === "Submitted" || a.status === "Under Review"
                    ).length
                  }
                </p>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  In Review
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {appeals.filter((a) => a.status === "In Review").length}
                </p>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Resolved
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {
                    appeals.filter(
                      (a) =>
                        a.status === "Resolved" ||
                        a.status === "Review Complete"
                    ).length
                  }
                </p>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  My Appeals
                </h3>
              </div>
              <div className="overflow-x-auto">
                {appeals.length === 0 ? (
                  <div className="px-6 py-8 text-center">
                    <p className="text-gray-500 mb-4">No appeals found.</p>
                    <button
                      onClick={handleNewAppeal}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
                    >
                      Submit Your First Appeal
                    </button>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Appeal ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Updated
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grounds
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appeals.map((appeal) => (
                        <tr key={appeal._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {appeal._id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {appeal.appealType || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                appeal.status
                              )}`}
                            >
                              {appeal.status || "Unknown"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(appeal.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(appeal.updatedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {appeal.grounds && appeal.grounds.length > 0
                              ? appeal.grounds.slice(0, 2).join(", ") +
                                (appeal.grounds.length > 2 ? "..." : "")
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleViewAppeal(appeal._id)}
                              className="text-purple-600 hover:text-purple-900 font-medium"
                            >
                              View Appeal
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
