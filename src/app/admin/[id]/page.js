"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProtectedRoute from "../../../components/ProtectedRoute";

export default function AppealManagement() {
  const params = useParams();
  const appealId = params.id;

  const [appeal, setAppeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

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

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockAppeal = {
      id: appealId,
      studentName: "John Doe",
      studentId: "STU001",
      studentEmail: "john.doe@university.edu",
      department: "Computer Science",
      course: "CS101 - Introduction to Programming",
      status: "In Review",
      grounds: "Late Submission",
      submissionDate: "2024-01-15",
      priority: "High",
      description:
        "I was unable to submit my assignment on time due to a family emergency that required my immediate attention. I have attached supporting documentation.",
      evidence: [
        {
          name: "medical_certificate.pdf",
          type: "Medical Certificate",
          uploadedAt: "2024-01-15",
        },
        {
          name: "family_emergency_letter.pdf",
          type: "Family Emergency Letter",
          uploadedAt: "2024-01-15",
        },
      ],
      internalNotes: [
        {
          note: "Student provided medical documentation. Need to verify authenticity.",
          admin: "Admin User",
          timestamp: "2024-01-16 10:30",
        },
        {
          note: "Contacted medical office for verification. Awaiting response.",
          admin: "Admin User",
          timestamp: "2024-01-16 14:15",
        },
      ],
      comments: [
        {
          comment:
            "Thank you for your submission. We are reviewing your case and will get back to you within 3-5 business days.",
          admin: "Admin User",
          timestamp: "2024-01-16 10:30",
          visibleToStudent: true,
        },
        {
          comment:
            "We have received your supporting documents and are currently reviewing them.",
          admin: "Admin User",
          timestamp: "2024-01-16 14:15",
          visibleToStudent: true,
        },
      ],
      staffDocuments: [
        {
          name: "verification_request.pdf",
          type: "Verification Request",
          uploadedAt: "2024-01-16 14:15",
          admin: "Admin User",
        },
      ],
    };

    setAppeal(mockAppeal);
    setNewStatus(mockAppeal.status);
    setLoading(false);
  }, [appealId]);

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note = {
      note: newNote,
      admin: "Admin User",
      timestamp: new Date().toLocaleString(),
    };

    setAppeal((prev) => ({
      ...prev,
      internalNotes: [...prev.internalNotes, note],
    }));
    setNewNote("");
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      comment: newComment,
      admin: "Admin User",
      timestamp: new Date().toLocaleString(),
      visibleToStudent: true,
    };

    setAppeal((prev) => ({
      ...prev,
      comments: [...prev.comments, comment],
    }));
    setNewComment("");
  };

  const handleStatusChange = () => {
    if (!newStatus) return;

    setAppeal((prev) => ({
      ...prev,
      status: newStatus,
    }));

    // Add a note about status change
    const note = {
      note: `Status changed to: ${newStatus}`,
      admin: "Admin User",
      timestamp: new Date().toLocaleString(),
    };

    setAppeal((prev) => ({
      ...prev,
      internalNotes: [...prev.internalNotes, note],
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleUploadDocument = () => {
    if (!uploadedFile) return;

    const document = {
      name: uploadedFile.name,
      type: "Staff Document",
      uploadedAt: new Date().toLocaleString(),
      admin: "Admin User",
    };

    setAppeal((prev) => ({
      ...prev,
      staffDocuments: [...prev.staffDocuments, document],
    }));

    setUploadedFile(null);
    setShowUploadForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Review":
        return "bg-blue-100 text-blue-800";
      case "Awaiting Info":
        return "bg-orange-100 text-orange-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
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
        <div className="text-xl">Appeal not found</div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                      {appeal.status}
                    </span>
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(
                        appeal.priority
                      )}`}
                    >
                      {appeal.priority} Priority
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Student Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {appeal.studentName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Student ID
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {appeal.studentId}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {appeal.studentEmail}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Department
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {appeal.department}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Course
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {appeal.course}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Submission Date
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(appeal.submissionDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Grounds for Appeal
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{appeal.grounds}</p>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {appeal.description}
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
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Review">In Review</option>
                    <option value="Awaiting Info">Awaiting Info</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  <button
                    onClick={handleStatusChange}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    Update Status
                  </button>
                </div>
              </div>

              {/* Student Comments */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Comments Visible to Student
                </h3>
                <div className="space-y-4">
                  {appeal.comments.map((comment, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-indigo-500 pl-4 py-2"
                    >
                      <p className="text-sm text-gray-900">{comment.comment}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {comment.admin} • {comment.timestamp}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <textarea
                    placeholder="Add a comment visible to the student..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    rows="3"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button
                    onClick={handleAddComment}
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    Add Comment
                  </button>
                </div>
              </div>

              {/* Evidence */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Uploaded Evidence
                </h3>
                <div className="space-y-2">
                  {appeal.evidence.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {file.type} • {file.uploadedAt}
                        </p>
                      </div>
                      <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                        View
                      </button>
                    </div>
                  ))}
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
                  {appeal.internalNotes.map((note, index) => (
                    <div key={index} className="p-3 bg-yellow-50 rounded-md">
                      <p className="text-sm text-gray-900">{note.note}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {note.admin} • {note.timestamp}
                      </p>
                    </div>
                  ))}
                </div>

                <div>
                  <textarea
                    placeholder="Add internal note..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    rows="3"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <button
                    onClick={handleAddNote}
                    className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700"
                  >
                    Add Note
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
                    />
                    {uploadedFile && (
                      <button
                        onClick={handleUploadDocument}
                        className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                      >
                        Upload
                      </button>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  {appeal.staffDocuments.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {doc.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {doc.admin} • {doc.uploadedAt}
                        </p>
                      </div>
                      <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                    Approve Appeal
                  </button>
                  <button className="w-full bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700">
                    Reject Appeal
                  </button>
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                    Request More Info
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
