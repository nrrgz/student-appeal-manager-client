"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewerDashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [appeals, setAppeals] = useState([]);
  const [filteredAppeals, setFilteredAppeals] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    department: "",
    date: "",
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = sessionStorage.getItem("userInfo");
    if (!user) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(user);
    if (parsedUser.role !== "reviewer") {
      router.push("/login");
      return;
    }

    setUserInfo(parsedUser);

    // Mock data - replace with actual API calls
    const mockAppeals = [
      {
        id: "APL-2024-001",
        studentName: "John Doe",
        studentId: "STU001",
        department: "Computer Science",
        course: "CS101 - Introduction to Programming",
        status: "Under Review",
        grounds: "Late Submission",
        submissionDate: "2024-01-15",
        priority: "High",
        deadline: "2024-01-20",
        reviewDeadline: "2024-01-25",
        assignedReviewer: "Dr. Sarah Johnson",
      },
      {
        id: "APL-2024-002",
        studentName: "Jane Smith",
        studentId: "STU002",
        department: "Mathematics",
        course: "MATH201 - Advanced Calculus",
        status: "Pending",
        grounds: "Medical Circumstances",
        submissionDate: "2024-01-14",
        priority: "Medium",
        deadline: "2024-01-19",
        reviewDeadline: "2024-01-24",
        assignedReviewer: "Dr. Sarah Johnson",
      },
      {
        id: "APL-2024-003",
        studentName: "Mike Johnson",
        studentId: "STU003",
        department: "Physics",
        course: "PHYS101 - Mechanics",
        status: "Awaiting Info",
        grounds: "Technical Issues",
        submissionDate: "2024-01-13",
        priority: "Low",
        deadline: "2024-01-18",
        reviewDeadline: "2024-01-23",
        assignedReviewer: "Dr. Sarah Johnson",
      },
      {
        id: "APL-2024-004",
        studentName: "Emily Brown",
        studentId: "STU004",
        department: "Computer Science",
        course: "CS201 - Data Structures",
        status: "Review Complete",
        grounds: "Academic Judgment",
        submissionDate: "2024-01-12",
        priority: "Medium",
        deadline: "2024-01-17",
        reviewDeadline: "2024-01-22",
        assignedReviewer: "Dr. Sarah Johnson",
        outcome: "Appeal Upheld",
      },
      {
        id: "APL-2024-005",
        studentName: "David Wilson",
        studentId: "STU005",
        department: "Engineering",
        course: "ENG101 - Engineering Principles",
        status: "Under Review",
        grounds: "Procedural Irregularity",
        submissionDate: "2024-01-11",
        priority: "High",
        deadline: "2024-01-16",
        reviewDeadline: "2024-01-21",
        assignedReviewer: "Dr. Sarah Johnson",
      },
    ];

    setAppeals(mockAppeals);
    setFilteredAppeals(mockAppeals);
    setLoading(false);
  }, [router]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    let filtered = appeals;

    if (newFilters.status) {
      filtered = filtered.filter(
        (appeal) => appeal.status === newFilters.status
      );
    }
    if (newFilters.priority) {
      filtered = filtered.filter(
        (appeal) => appeal.priority === newFilters.priority
      );
    }
    if (newFilters.department) {
      filtered = filtered.filter(
        (appeal) => appeal.department === newFilters.department
      );
    }
    if (newFilters.date) {
      filtered = filtered.filter((appeal) => {
        const appealDate = new Date(appeal.submissionDate);
        const filterDate = new Date(newFilters.date);
        return appealDate.toDateString() === filterDate.toDateString();
      });
    }

    setFilteredAppeals(filtered);
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      priority: "",
      department: "",
      date: "",
    });
    setFilteredAppeals(appeals);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Under Review":
        return "bg-blue-100 text-blue-800";
      case "Review Complete":
        return "bg-green-100 text-green-800";
      case "Awaiting Info":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusCount = (status) => {
    return appeals.filter((appeal) => appeal.status === status).length;
  };

  const navigateToAppeal = (appealId) => {
    router.push(`/reviewer/${appealId}`);
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appeals...</p>
        </div>
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
                className="w-30 object-contain"
              />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {userInfo.name}
              </span>
              <button
                onClick={() => {
                  sessionStorage.removeItem("userInfo");
                  router.push("/login");
                }}
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Academic Reviewer Dashboard
          </h2>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Total Assigned
              </h3>
              <p className="text-3xl font-bold text-purple-600">
                {appeals.length}
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Pending Review
              </h3>
              <p className="text-3xl font-bold text-yellow-600">
                {getStatusCount("Pending")}
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Under Review
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {getStatusCount("Under Review")}
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Completed
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {getStatusCount("Review Complete")}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Awaiting Info">Awaiting Info</option>
                  <option value="Review Complete">Review Complete</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) =>
                    handleFilterChange("priority", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={filters.department}
                  onChange={(e) =>
                    handleFilterChange("department", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Engineering">Engineering</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Submission Date
                </label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => handleFilterChange("date", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Appeals Table */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Cases for Review ({filteredAppeals.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Appeal ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deadline
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppeals.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No appeals found matching the current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredAppeals.map((appeal) => (
                      <tr key={appeal.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {appeal.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {appeal.studentName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appeal.studentId}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {appeal.department}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appeal.course}
                          </div>
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                              appeal.priority
                            )}`}
                          >
                            {appeal.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div>
                              Deadline:{" "}
                              {new Date(appeal.deadline).toLocaleDateString()}
                            </div>
                            <div className="text-gray-500">
                              Review:{" "}
                              {new Date(
                                appeal.reviewDeadline
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => navigateToAppeal(appeal.id)}
                            className="text-purple-600 hover:text-purple-900 bg-purple-100 hover:bg-purple-200 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                          >
                            Review Appeal
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
