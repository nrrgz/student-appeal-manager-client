"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ViewSubmittedAppeal() {
  const [userInfo, setUserInfo] = useState(null);
  const [appeal, setAppeal] = useState(null);
  const [loading, setLoading] = useState(true);
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

    const mockAppeal = {
      id: params.id,
      title: "Academic Appeal - Semester 1 Results",
      status: "In Review",
      submittedDate: "2024-01-15T10:30:00Z",
      lastUpdated: "2024-01-20T14:45:00Z",
      appealType: "Extenuating Circumstances",
      grounds: ["Illness or medical condition", "Personal circumstances"],
      statement:
        "I am submitting this appeal due to significant health issues that affected my performance during the examination period. I was diagnosed with severe anxiety and depression in December 2023, which significantly impacted my ability to concentrate and perform at my usual academic standard.\n\nDuring the examination period, I experienced panic attacks and was unable to complete several assessments to the best of my ability. I have supporting medical documentation from my GP and the university counseling service.\n\nI believe that these extenuating circumstances significantly affected my academic performance and request that my case be reviewed with consideration of these factors.",
      evidence: [
        {
          name: "Medical Certificate - GP.pdf",
          size: "245 KB",
          uploadDate: "2024-01-15",
        },
        {
          name: "Counseling Service Report.pdf",
          size: "189 KB",
          uploadDate: "2024-01-15",
        },
        {
          name: "Academic Transcript.pdf",
          size: "156 KB",
          uploadDate: "2024-01-15",
        },
      ],
      personalInfo: {
        firstName: "John",
        lastName: "Smith",
        studentId: "12345678",
        email: "john.smith@sheffield.ac.uk",
        phone: "+44 7123 456789",
      },
      adviser: {
        hasAdviser: true,
        name: "Dr. Sarah Johnson",
        email: "s.johnson@sheffield.ac.uk",
        phone: "+44 114 222 3333",
      },
      statusHistory: [
        {
          status: "Submitted",
          date: "2024-01-15T10:30:00Z",
          comment: "Appeal submitted successfully",
          author: "System",
        },
        {
          status: "Under Initial Review",
          date: "2024-01-16T09:15:00Z",
          comment: "Appeal has been assigned to the review team",
          author: "Admin Team",
        },
        {
          status: "In Review",
          date: "2024-01-18T11:20:00Z",
          comment:
            "Medical documentation has been verified. Case is now under academic review.",
          author: "Dr. Michael Brown",
        },
        {
          status: "Additional Information Requested",
          date: "2024-01-20T14:45:00Z",
          comment:
            "Please provide additional details about the specific assessments affected and the dates when symptoms were most severe.",
          author: "Academic Review Panel",
        },
      ],
    };

    setAppeal(mockAppeal);
    setLoading(false);
  }, [router, params.id]);

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
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!userInfo || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!appeal) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src="/images/logo.png"
                  alt="TUOS Logo"
                  className="w-8 h-8 object-contain mr-4"
                />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Student Appeal Manager
                  </h1>
                  <p className="text-sm text-gray-600">Appeal not found</p>
                </div>
              </div>
              <button
                onClick={() => router.push("/student")}
                className="text-gray-600 hover:text-purple-600 font-medium text-sm transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </header>
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
              <button className="text-gray-600 hover:text-purple-600 font-medium text-sm transition-colors">
                Help
              </button>
              <button className="text-gray-600 hover:text-purple-600 font-medium text-sm transition-colors">
                Contact
              </button>
              <button
                onClick={() => router.push("/student")}
                className="text-gray-600 hover:text-purple-600 font-medium text-sm transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {appeal.title}
              </h2>
              <div className="flex items-center space-x-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    appeal.status
                  )}`}
                >
                  {appeal.status}
                </span>
                <span className="text-sm text-gray-600">
                  Appeal ID: {appeal.id}
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
                provide additional information, please contact the appeals team
                directly.
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
                <p className="text-gray-700 whitespace-pre-line">
                  {appeal.statement}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Supporting Evidence
              </h3>
              {appeal.evidence.length > 0 ? (
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
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {file.size} • Uploaded{" "}
                            {formatDate(file.uploadDate + "T00:00:00Z")}
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
              <div className="flow-root">
                <ul className="-mb-8">
                  {appeal.statusHistory.map((event, eventIdx) => (
                    <li key={eventIdx}>
                      <div className="relative pb-8">
                        {eventIdx !== appeal.statusHistory.length - 1 ? (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span
                              className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getStatusColor(
                                event.status
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
                                {event.status}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {event.comment}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                by {event.author}
                              </p>
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
                  <p className="text-gray-600">{appeal.appealType}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Grounds:</span>
                  <ul className="text-gray-600 mt-1">
                    {appeal.grounds.map((ground, index) => (
                      <li key={index}>• {ground}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Submitted:</span>
                  <p className="text-gray-600">
                    {formatDate(appeal.submittedDate)}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Last Updated:
                  </span>
                  <p className="text-gray-600">
                    {formatDate(appeal.lastUpdated)}
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
                    {appeal.personalInfo.firstName}{" "}
                    {appeal.personalInfo.lastName}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Student ID:</span>
                  <p className="text-gray-600">
                    {appeal.personalInfo.studentId}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <p className="text-gray-600">{appeal.personalInfo.email}</p>
                </div>
                {appeal.personalInfo.phone && (
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <p className="text-gray-600">{appeal.personalInfo.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {appeal.adviser.hasAdviser && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Adviser Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <p className="text-gray-600">{appeal.adviser.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-600">{appeal.adviser.email}</p>
                  </div>
                  {appeal.adviser.phone && (
                    <div>
                      <span className="font-medium text-gray-700">Phone:</span>
                      <p className="text-gray-600">{appeal.adviser.phone}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

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
  );
}
