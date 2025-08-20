"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Footer from "../../../components/Footer";
import apiService from "../../../services/api";

export default function AppealManagement() {
  const params = useParams();
  const appealId = params.id;

  const [appeal, setAppeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Check authentication
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (!storedUserInfo) {
      window.location.href = "/login";
      return;
    }

    const user = JSON.parse(storedUserInfo);
    if (user.role !== "admin") {
      window.location.href = "/login";
      return;
    }

    setUserInfo(user);
  }, []);

  // Fetch appeal data
  useEffect(() => {
    if (appealId) {
      fetchAppeal();
    }
  }, [appealId]);

  const fetchAppeal = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAdminAppeal(appealId);
      setAppeal(response.appeal);
      setNewStatus(response.appeal.status);
    } catch (error) {
      console.error("Failed to fetch appeal:", error);
      setError("Failed to load appeal data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || submitting) return;

    try {
      setSubmitting(true);
      await apiService.addAdminNote(appealId, {
        content: newNote,
        isInternal: true,
      });

      // Refresh appeal data to get the new note
      await fetchAppeal();
      setNewNote("");
    } catch (error) {
      console.error("Failed to add note:", error);
      setError("Failed to add note. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || submitting) return;

    try {
      setSubmitting(true);
      await apiService.addAdminNote(appealId, {
        content: newComment,
        isInternal: false,
      });

      // Refresh appeal data to get the new comment
      await fetchAppeal();
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
      setError("Failed to add comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async () => {
    if (!newStatus || submitting) return;

    try {
      setSubmitting(true);
      await apiService.updateAppealStatusAdmin(appealId, {
        status: newStatus,
        reason: `Status updated by admin: ${userInfo?.firstName || "Admin"}`,
      });

      // Refresh appeal data to get the updated status
      await fetchAppeal();
    } catch (error) {
      console.error("Failed to update status:", error);
      setError("Failed to update status. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleUploadDocument = async () => {
    if (!uploadedFile || submitting) return;

    try {
      setSubmitting(true);
      // For now, we'll just add it to the local state
      // In a real implementation, you'd upload to the server
      const document = {
        name: uploadedFile.name,
        type: "Staff Document",
        uploadedAt: new Date().toLocaleString(),
        admin: userInfo?.firstName || "Admin",
      };

      setAppeal((prev) => ({
        ...prev,
        staffDocuments: [...prev.staffDocuments, document],
      }));

      setUploadedFile(null);
      setShowUploadForm(false);
    } catch (error) {
      console.error("Failed to upload document:", error);
      setError("Failed to upload document. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "submitted":
        return "bg-yellow-100 text-yellow-800";
      case "under review":
        return "bg-blue-100 text-blue-800";
      case "awaiting information":
        return "bg-orange-100 text-orange-800";
      case "decision made":
        return "bg-purple-100 text-purple-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleDownload = async (file) => {
    try {
      // Get the appeal ID from the current appeal
      if (!appeal || !appeal._id) {
        alert("Appeal information not available");
        return;
      }

      // Get the filename to download
      const filename = file.originalName || file.filename || file.name;
      if (!filename) {
        alert("File name not available");
        return;
      }

      // Create the download URL
      const downloadUrl = `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      }/api/admin/${appeal._id}/evidence/${encodeURIComponent(
        filename
      )}/download`;

      // Get the auth token
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication required. Please log in again.");
        return;
      }

      // For cross-origin requests, we need to fetch the file first
      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Download failed: ${response.status} ${response.statusText}`
        );
      }

      // Get the file blob
      const blob = await response.blob();

      // Create a blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download =
        file.originalName || file.filename || file.name || "download";

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      alert(`Download failed: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!appeal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">{error ? error : "Appeal not found"}</div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setError(null)}
                    className="inline-flex text-red-400 hover:text-red-600"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Appeal Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Appeal Header */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Appeal Details
                  </h2>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                        appeal.status
                      )}`}
                    >
                      {appeal.status || "Unknown"}
                    </span>
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(
                        appeal.priority
                      )}`}
                    >
                      {appeal.priority || "No"} Priority
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Student Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {appeal.student?.firstName} {appeal.student?.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Student ID
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {appeal.student?.studentId || appeal.studentId}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {appeal.student?.email || appeal.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Department
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {appeal.department || appeal.student?.department}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Appeal Type
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {appeal.appealType || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Submission Date
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(appeal.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Grounds for Appeal
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {Array.isArray(appeal.grounds)
                      ? appeal.grounds.join(", ")
                      : appeal.grounds || "Not specified"}
                  </p>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Statement
                  </label>
                  <p className="mt-1 text-sm text-gray-900 break-words overflow-hidden">
                    {appeal.statement || "No statement provided."}
                  </p>
                </div>
              </div>

              {/* Status Management */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Change Status
                </h3>
                <div className="flex items-center space-x-4">
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    disabled={submitting}
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under review">Under Review</option>
                    <option value="awaiting information">
                      Awaiting Information
                    </option>
                    <option value="decision made">Decision Made</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button
                    onClick={handleStatusChange}
                    disabled={submitting}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Updating..." : "Update Status"}
                  </button>
                </div>
              </div>

              {/* Student Comments */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Comments Visible to Student
                </h3>
                <div className="space-y-4">
                  {Array.isArray(appeal.comments) &&
                  appeal.comments.length > 0 ? (
                    appeal.comments.map((comment, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-indigo-500 pl-4 py-2"
                      >
                        <p className="text-sm text-gray-900">
                          {comment.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {comment.author?.firstName} {comment.author?.lastName}{" "}
                          • {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No comments yet.</p>
                  )}
                </div>

                <div className="mt-4">
                  <textarea
                    placeholder="Add a comment visible to the student..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    rows="3"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={submitting}
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={submitting}
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Adding..." : "Add Comment"}
                  </button>
                </div>
              </div>

              {/* Evidence */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Uploaded Evidence
                </h3>
                {console.log(
                  "Admin rendering evidence section:",
                  appeal.evidence
                )}
                <div className="space-y-2">
                  {Array.isArray(appeal.evidence) &&
                  appeal.evidence.length > 0 ? (
                    appeal.evidence.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {file.originalName ||
                              file.filename ||
                              file.name ||
                              "Unknown file"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {file.fileSize
                              ? `${(file.fileSize / 1024 / 1024).toFixed(2)} MB`
                              : "Unknown size"}{" "}
                            • {formatDate(file.uploadedAt)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDownload(file)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium hover:bg-indigo-50 px-3 py-1 rounded-md transition-colors"
                        >
                          Download
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No evidence files uploaded.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Internal Notes */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Internal Notes
                </h3>
                <div className="space-y-3 mb-4">
                  {Array.isArray(appeal.internalNotes) &&
                  appeal.internalNotes.length > 0 ? (
                    appeal.internalNotes.map((note, index) => (
                      <div key={index} className="p-3 bg-yellow-50 rounded-md">
                        <p className="text-sm text-gray-900">{note.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {note.author?.firstName} {note.author?.lastName} •{" "}
                          {formatDate(note.createdAt)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No internal notes yet.
                    </p>
                  )}
                </div>

                <div>
                  <textarea
                    placeholder="Add internal note..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    rows="3"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    disabled={submitting}
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={submitting}
                    className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Adding..." : "Add Note"}
                  </button>
                </div>
              </div>

              {/* Staff Documents */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Staff Documents
                  </h3>
                  <button
                    onClick={() => setShowUploadForm(!showUploadForm)}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    {showUploadForm ? "Cancel" : "Upload"}
                  </button>
                </div>

                {showUploadForm && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-md">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="w-full mb-2"
                      disabled={submitting}
                    />
                    {uploadedFile && (
                      <button
                        onClick={handleUploadDocument}
                        disabled={submitting}
                        className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? "Uploading..." : "Upload"}
                      </button>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  {Array.isArray(appeal.staffDocuments) &&
                  appeal.staffDocuments.length > 0 ? (
                    appeal.staffDocuments.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {doc.admin} • {formatDate(doc.uploadedAt)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium hover:bg-indigo-50 px-3 py-1 rounded-md transition-colors"
                        >
                          Download
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No staff documents uploaded.
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setNewStatus("resolved")}
                    disabled={submitting}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Approve Appeal
                  </button>
                  <button
                    onClick={() => setNewStatus("rejected")}
                    disabled={submitting}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reject Appeal
                  </button>
                  <button
                    onClick={() => setNewStatus("awaiting information")}
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Request More Info
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
