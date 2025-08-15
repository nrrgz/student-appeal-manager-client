"use client";

import { useState, useEffect } from "react";

export default function StatisticsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30"); // days

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockStats = {
      totalAppeals: 156,
      pendingAppeals: 23,
      resolvedAppeals: 98,
      rejectedAppeals: 35,
      averageResolutionTime: 4.2, // days
      resolutionTimes: {
        "0-2 days": 45,
        "3-5 days": 38,
        "6-10 days": 12,
        "10+ days": 3,
      },
      commonGrounds: [
        { ground: "Late Submission", count: 67, percentage: 42.9 },
        { ground: "Medical Circumstances", count: 34, percentage: 21.8 },
        { ground: "Technical Issues", count: 28, percentage: 17.9 },
        { ground: "Family Emergency", count: 15, percentage: 9.6 },
        { ground: "Other", count: 12, percentage: 7.7 },
      ],
      departmentStats: [
        {
          department: "Computer Science",
          total: 45,
          resolved: 32,
          rejected: 13,
        },
        { department: "Mathematics", total: 38, resolved: 28, rejected: 10 },
        { department: "Physics", total: 32, resolved: 25, rejected: 7 },
        { department: "Engineering", total: 28, resolved: 20, rejected: 8 },
        { department: "Other", total: 13, resolved: 8, rejected: 5 },
      ],
      monthlyTrends: [
        { month: "Jan", appeals: 12, resolved: 8 },
        { month: "Feb", appeals: 15, resolved: 12 },
        { month: "Mar", appeals: 18, resolved: 15 },
        { month: "Apr", appeals: 22, resolved: 18 },
        { month: "May", appeals: 19, resolved: 16 },
        { month: "Jun", appeals: 16, resolved: 14 },
      ],
    };

    setStats(mockStats);
    setLoading(false);
  }, []);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    // In a real app, this would trigger an API call to get stats for the new range
  };

  const downloadCSV = () => {
    // Mock CSV download functionality
    const csvContent =
      `Appeal Statistics Report\n\n` +
      `Total Appeals,${stats.totalAppeals}\n` +
      `Pending Appeals,${stats.pendingAppeals}\n` +
      `Resolved Appeals,${stats.resolvedAppeals}\n` +
      `Rejected Appeals,${stats.rejectedAppeals}\n` +
      `Average Resolution Time (days),${stats.averageResolutionTime}\n`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appeal-statistics-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a
                href="/admin"
                className="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <h1 className="text-2xl font-semibold text-gray-900">
                Statistics Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={dateRange}
                onChange={(e) => handleDateRangeChange(e.target.value)}
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <button
                onClick={downloadCSV}
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
              >
                Download CSV
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("userInfo");
                  window.location.href = "/";
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Appeals
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalAppeals}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.pendingAppeals}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Resolved</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.resolvedAppeals}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Rejected</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.rejectedAppeals}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resolution Time Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Resolution Time Distribution
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.resolutionTimes).map(([range, count]) => (
                <div key={range} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{range}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (count /
                              Math.max(
                                ...Object.values(stats.resolutionTimes)
                              )) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Average resolution time:{" "}
                <span className="font-medium text-gray-900">
                  {stats.averageResolutionTime} days
                </span>
              </p>
            </div>
          </div>

          {/* Common Appeal Grounds */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Common Appeal Grounds
            </h3>
            <div className="space-y-3">
              {stats.commonGrounds.map((ground, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{ground.ground}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${ground.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {ground.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Statistics */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Department Statistics
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Appeals
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resolved
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rejected
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resolution Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.departmentStats.map((dept, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {dept.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dept.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dept.resolved}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dept.rejected}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          dept.resolved / dept.total >= 0.8
                            ? "bg-green-100 text-green-800"
                            : dept.resolved / dept.total >= 0.6
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {Math.round((dept.resolved / dept.total) * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Monthly Trends
          </h3>
          <div className="grid grid-cols-6 gap-4">
            {stats.monthlyTrends.map((month, index) => (
              <div key={index} className="text-center">
                <div className="text-sm font-medium text-gray-900">
                  {month.month}
                </div>
                <div className="mt-2 space-y-1">
                  <div className="text-xs text-gray-500">
                    Appeals: {month.appeals}
                  </div>
                  <div className="text-xs text-green-600">
                    Resolved: {month.resolved}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
            <h3 className="text-lg font-medium mb-2">Success Rate</h3>
            <p className="text-3xl font-bold">
              {Math.round(
                (stats.resolvedAppeals /
                  (stats.resolvedAppeals + stats.rejectedAppeals)) *
                  100
              )}
              %
            </p>
            <p className="text-blue-100 text-sm mt-1">
              {stats.resolvedAppeals} out of{" "}
              {stats.resolvedAppeals + stats.rejectedAppeals} appeals resolved
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
            <h3 className="text-lg font-medium mb-2">Efficiency</h3>
            <p className="text-3xl font-bold">{stats.averageResolutionTime}</p>
            <p className="text-green-100 text-sm mt-1">
              Average days to resolution
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
            <h3 className="text-lg font-medium mb-2">Workload</h3>
            <p className="text-3xl font-bold">{stats.pendingAppeals}</p>
            <p className="text-purple-100 text-sm mt-1">
              Currently pending appeals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
