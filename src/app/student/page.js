"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [appeals, setAppeals] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setUserInfo(JSON.parse(userInfo));
    }

    const mockAppeals = [
      {
        id: "APL-2024-001",
        title: "Academic Appeal - Semester 1 Results",
        status: "In Review",
        submittedDate: "2024-01-15",
        grounds: "Extenuating circumstances",
        lastUpdated: "2024-01-20",
      },
      {
        id: "APL-2024-002",
        title: "Appeal against Module Assessment",
        status: "Submitted",
        submittedDate: "2024-01-10",
        grounds: "Procedural irregularity",
        lastUpdated: "2024-01-10",
      },
      {
        id: "APL-2023-015",
        title: "Final Year Project Appeal",
        status: "Resolved",
        submittedDate: "2023-12-05",
        grounds: "Academic judgment",
        lastUpdated: "2023-12-20",
        outcome: "Appeal upheld - Grade adjusted",
      },
    ];

    setAppeals(mockAppeals);
  }, [router]);

  const handleSignOut = () => {
    sessionStorage.removeItem("userInfo");
    router.push("/login");
  };

  const handleNewAppeal = () => {
    router.push("/student/new");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-100 text-blue-800";
      case "In Review":
        return "bg-yellow-100 text-yellow-800";
      case "Awaiting Info":
        return "bg-orange-100 text-orange-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src="/images/logo.png"
                alt="TUOS Logo"
                className="w-30  object-contain"
              />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {userInfo.name}
              </span>
              <button
                onClick={handleSignOut}
                className="text-sm text-purple-600 hover:text-purple-800"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

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
                {appeals.filter((a) => a.status === "Submitted").length}
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
                {appeals.filter((a) => a.status === "Resolved").length}
              </p>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">My Appeals</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Appeal ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appeals.map((appeal) => (
                    <tr key={appeal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {appeal.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appeal.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            appeal.status
                          )}`}
                        >
                          {appeal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appeal.submittedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appeal.lastUpdated}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appeal.grounds}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
