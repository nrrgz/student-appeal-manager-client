"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function AppealReview() {
  const [userInfo, setUserInfo] = useState(null);
  const [appeal, setAppeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [recommendation, setRecommendation] = useState("");
  const [decision, setDecision] = useState("");

  const router = useRouter();
  const params = useParams();
  const appealId = params.appealId;

  useEffect(() => {
    const user = localStorage.getItem("userInfo");
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
    const mockAppeal = {
      id: appealId,
      studentName: "John Doe",
      studentId: "STU001",
      studentEmail: "john.doe@university.edu",
      department: "Computer Science",
      course: "CS101 - Introduction to Programming",
      status: "Under Review",
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
      academicHistory: {
        previousGrades: ["A", "B+", "A-", "B"],
        attendance: "85%",
        previousAppeals: 0,
      },
      deadline: "2024-01-20",
      assignedReviewer: "Dr. Sarah Johnson",
      reviewDeadline: "2024-01-25",
    };

    setAppeal(mockAppeal);
    setNewStatus(mockAppeal.status);
    setLoading(false);
  }, [router, appealId]);

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note = {
      note: newNote,
      reviewer: userInfo.name,
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
      reviewer: userInfo.name,
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
    if (!newStatus.trim()) return;

    setAppeal((prev) => ({
      ...prev,
      status: newStatus,
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmitReview = () => {
    if (!recommendation.trim() || !decision.trim()) return;

    // Here you would typically submit the review to your backend
    console.log("Review submitted:", { recommendation, decision });

    // Update appeal status
    setAppeal((prev) => ({
      ...prev,
      status: "Review Complete",
      recommendation,
      decision,
    }));
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
          <p className="mt-4 text-gray-600">Loading appeal details...</p>
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
                  localStorage.removeItem("userInfo");
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
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Appeal Review - {appeal.id}
              </h1>
              <p className="text-gray-600 mt-1">
                Reviewing appeal for {appeal.studentName}
              </p>
            </div>
            <button
              onClick={() => router.push("/reviewer")}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getStatusColor(
                  appeal.status
                )}`}
              >
                {appeal.status}
              </span>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">Priority</h3>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getPriorityColor(
                  appeal.priority
                )}`}
              >
                {appeal.priority}
              </span>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">Deadline</h3>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {new Date(appeal.deadline).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">
                Review Deadline
              </h3>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {new Date(appeal.reviewDeadline).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Student Information */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Student Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {appeal.studentName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Student ID</p>
                    <p className="text-sm font-medium text-gray-900">
                      {appeal.studentId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">
                      {appeal.studentEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="text-sm font-medium text-gray-900">
                      {appeal.department}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Course</p>
                    <p className="text-sm font-medium text-gray-900">
                      {appeal.course}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Submission Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(appeal.submissionDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Appeal Details */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Appeal Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Grounds for Appeal</p>
                    <p className="text-sm font-medium text-gray-900">
                      {appeal.grounds}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {appeal.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Evidence */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Supporting Evidence
                </h3>
                <div className="space-y-3">
                  {appeal.evidence.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {doc.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {doc.type} • Uploaded {doc.uploadedAt}
                        </p>
                      </div>
                      <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic History */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Academic History
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Previous Grades</p>
                    <p className="text-sm font-medium text-gray-900">
                      {appeal.academicHistory.previousGrades.join(", ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Attendance</p>
                    <p className="text-sm font-medium text-gray-900">
                      {appeal.academicHistory.attendance}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Previous Appeals</p>
                    <p className="text-sm font-medium text-gray-900">
                      {appeal.academicHistory.previousAppeals}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Review Actions */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Review Actions
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status Update
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                    >
                      <option value="Under Review">Under Review</option>
                      <option value="Awaiting Info">Awaiting Info</option>
                      <option value="Review Complete">Review Complete</option>
                      <option value="Referred to Panel">
                        Referred to Panel
                      </option>
                    </select>
                    <button
                      onClick={handleStatusChange}
                      className="mt-2 w-full bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700"
                    >
                      Update Status
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recommendation
                    </label>
                    <textarea
                      value={recommendation}
                      onChange={(e) => setRecommendation(e.target.value)}
                      placeholder="Enter your recommendation..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-20 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Decision
                    </label>
                    <select
                      value={decision}
                      onChange={(e) => setDecision(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                    >
                      <option value="">Select decision...</option>
                      <option value="Appeal Upheld">Appeal Upheld</option>
                      <option value="Appeal Rejected">Appeal Rejected</option>
                      <option value="Partial Uphold">Partial Uphold</option>
                      <option value="Referred to Academic Panel">
                        Referred to Academic Panel
                      </option>
                    </select>
                  </div>

                  <button
                    onClick={handleSubmitReview}
                    disabled={!recommendation.trim() || !decision.trim()}
                    className="w-full bg-purple-600 text-white px-3 py-2 rounded-md text-sm hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Submit Review
                  </button>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Internal Notes
                </h3>
                <div className="space-y-3 mb-4">
                  {appeal.internalNotes.map((note, index) => (
                    <div key={index} className="text-sm">
                      <p className="text-gray-900">{note.note}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {note.admin} • {note.timestamp}
                      </p>
                    </div>
                  ))}
                </div>
                <div>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add internal note..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-20 text-gray-900"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="mt-2 w-full bg-gray-600 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Add Note
                  </button>
                </div>
              </div>

              {/* Student Comments */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Student Comments
                </h3>
                <div className="space-y-3 mb-4">
                  {appeal.comments.map((comment, index) => (
                    <div key={index} className="text-sm">
                      <p className="text-gray-900">{comment.comment}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {comment.admin} • {comment.timestamp}
                      </p>
                    </div>
                  ))}
                </div>
                <div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add comment visible to student..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-20 text-gray-900"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="mt-2 w-full bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Add Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
