"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import apiService from "../../../services/api";
import ProtectedRoute from "../../../components/ProtectedRoute";

export default function AppealDetail() {
  const [userInfo, setUserInfo] = useState(null);
  const [appeal, setAppeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (!storedUserInfo) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(storedUserInfo);
    if (user.role !== "student") {
      router.push("/login");
      return;
    }

    setUserInfo(user);
  }, [router]);

  // Fetch appeal from API
  useEffect(() => {
    const fetchAppeal = async () => {
      if (!userInfo || !params.id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getStudentAppeal(params.id);
        console.log("Appeal data received:", response.appeal);
        console.log("Evidence data:", response.appeal.evidence);
        setAppeal(response.appeal);
      } catch (error) {
        console.error("Failed to fetch appeal:", error);
        setError("Failed to load appeal details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppeal();
  }, [userInfo, params.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-100 text-blue-800";
      case "Under Initial Review":
        return "bg-yellow-100 text-yellow-800";
      case "In Review":
        return "bg-yellow-100 text-yellow-800";
      case "Additional Information Requested":
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
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!userInfo || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Error Loading Appeal
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push("/student")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!appeal) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Appeal Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The appeal you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
            <button
              onClick={() => router.push("/student")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="student">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {appeal.appealType || "Appeal Details"}
                </h2>
                <div className="flex items-center space-x-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      appeal.status
                    )}`}
                  >
                    {appeal.status || "Unknown"}
                  </span>
                  <span className="text-sm text-gray-600">
                    Appeal ID: {appeal._id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <svg
                className="h-5 w-5 text-red-400 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Appeal Cannot Be Edited
                </h3>
                <div className="mt-1 text-sm text-red-700">
                  Once submitted, appeals cannot be modified. If you need to
                  provide additional information, please contact the appeals
                  team directly.
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Appeal Statement
                </h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line break-words overflow-hidden">
                    {appeal.statement || "No statement provided."}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Supporting Evidence
                </h3>
                {console.log("Rendering evidence section:", appeal.evidence)}
                {Array.isArray(appeal.evidence) &&
                appeal.evidence.length > 0 ? (
                  <div className="space-y-3">
                    {appeal.evidence.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center">
                          <svg
                            className="h-8 w-8 text-gray-400 mr-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {file.originalName ||
                                file.filename ||
                                file.name ||
                                "Unknown file"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {file.fileSize
                                ? `${(file.fileSize / 1024 / 1024).toFixed(
                                    2
                                  )} MB`
                                : "Unknown size"}{" "}
                              • Uploaded {formatDate(file.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No evidence files uploaded.</p>
                )}
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Status History & Comments
                </h3>
                {appeal.timeline && appeal.timeline.length > 0 ? (
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {appeal.timeline.map((event, eventIdx) => (
                        <li key={eventIdx}>
                          <div className="relative pb-8">
                            {eventIdx !== appeal.timeline.length - 1 ? (
                              <span
                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span
                                  className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getStatusColor(
                                    event.action
                                  )
                                    .replace("text-", "bg-")
                                    .replace("bg-blue-100", "bg-blue-500")
                                    .replace("bg-yellow-100", "bg-yellow-500")
                                    .replace("bg-orange-100", "bg-orange-500")
                                    .replace("bg-green-100", "bg-green-500")}`}
                                >
                                  <svg
                                    className="h-4 w-4 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {event.action}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {event.description}
                                  </p>
                                  {event.performedBy && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      by {event.performedBy.firstName}{" "}
                                      {event.performedBy.lastName}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  {formatDate(event.date)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-500">No status history available.</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Appeal Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <p className="text-gray-600">
                      {appeal.appealType || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Grounds:</span>
                    {appeal.grounds && appeal.grounds.length > 0 ? (
                      <ul className="text-gray-600 mt-1">
                        {appeal.grounds.map((ground, index) => (
                          <li key={index}>• {ground}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">N/A</p>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Submitted:
                    </span>
                    <p className="text-gray-600">
                      {formatDate(appeal.createdAt)}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Last Updated:
                    </span>
                    <p className="text-gray-600">
                      {formatDate(appeal.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Personal Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <p className="text-gray-600">
                      {appeal.student?.firstName || "N/A"}{" "}
                      {appeal.student?.lastName || ""}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Student ID:
                    </span>
                    <p className="text-gray-600">
                      {appeal.student?.studentId || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-600">
                      {appeal.student?.email || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-blue-400 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Need Help?
                    </h3>
                    <div className="mt-1 text-sm text-blue-700">
                      If you have questions about your appeal or need to provide
                      additional information, contact the Appeals Team at
                      appeals@sheffield.ac.uk
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
