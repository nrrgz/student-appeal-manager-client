"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewAppealForm() {
  const [userInfo, setUserInfo] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    declaration: false,
    deadlineCheck: false,

    firstName: "",
    lastName: "",
    studentId: "",
    email: "",
    phone: "",

    hasAdviser: false,
    adviserName: "",
    adviserEmail: "",
    adviserPhone: "",

    appealType: "",

    grounds: [],

    statement: "",

    evidence: [],

    confirmAll: false,

    submitted: false,
  });

  const router = useRouter();

  const steps = [
    {
      id: 1,
      title: "Declaration & Deadline",
      description: "Check eligibility",
    },
    { id: 2, title: "Personal Information", description: "Your details" },
    { id: 3, title: "Adviser Details", description: "Optional adviser info" },
    { id: 4, title: "Appeal Type", description: "Select appeal category" },
    { id: 5, title: "Grounds for Appeal", description: "Reason for appeal" },
    { id: 6, title: "Appeal Statement", description: "Detailed explanation" },
    { id: 7, title: "Evidence Upload", description: "Supporting documents" },
    { id: 8, title: "Final Confirmation", description: "Review and confirm" },
    { id: 9, title: "Submit", description: "Submit your appeal" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => {
    if (currentStep === 1 && !formData.deadlineCheck) {
      router.push("/student/late-submission-info");
      return;
    }
    if (currentStep < 9) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    handleInputChange("submitted", true);
    setTimeout(() => {
      router.push("/student");
    }, 3000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-yellow-800 mb-2">
                Important: Appeal Deadline
              </h3>
              <p className="text-yellow-700">
                You must submit your appeal within 10 working days of receiving
                your results. Late appeals will not be considered.
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.deadlineCheck}
                  onChange={(e) =>
                    handleInputChange("deadlineCheck", e.target.checked)
                  }
                  className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-700">
                  I confirm that I am submitting this appeal within the required
                  deadline
                </span>
              </label>

              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.declaration}
                  onChange={(e) =>
                    handleInputChange("declaration", e.target.checked)
                  }
                  className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-700">
                  I declare that the information provided in this appeal is true
                  and accurate to the best of my knowledge
                </span>
              </label>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID *
                </label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) =>
                    handleInputChange("studentId", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., 12345678"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-800 mb-2">
                Adviser Information (Optional)
              </h3>
              <p className="text-blue-700">
                You may choose to have an adviser represent you during the
                appeal process. This is not required but can be helpful for
                complex cases.
              </p>
            </div>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.hasAdviser}
                onChange={(e) =>
                  handleInputChange("hasAdviser", e.target.checked)
                }
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700">
                I would like to include an adviser in my appeal
              </span>
            </label>

            {formData.hasAdviser && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adviser Name
                    </label>
                    <input
                      type="text"
                      value={formData.adviserName}
                      onChange={(e) =>
                        handleInputChange("adviserName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adviser Email
                    </label>
                    <input
                      type="email"
                      value={formData.adviserEmail}
                      onChange={(e) =>
                        handleInputChange("adviserEmail", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adviser Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.adviserPhone}
                      onChange={(e) =>
                        handleInputChange("adviserPhone", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                What type of appeal are you submitting? *
              </label>
              <div className="space-y-3">
                {[
                  "Academic Judgment",
                  "Procedural Irregularity",
                  "Extenuating Circumstances",
                  "Assessment Irregularity",
                  "Other",
                ].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="radio"
                      name="appealType"
                      value={type}
                      checked={formData.appealType === type}
                      onChange={(e) =>
                        handleInputChange("appealType", e.target.value)
                      }
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                What are the grounds for your appeal? (Select all that apply) *
              </label>
              <div className="space-y-3">
                {[
                  "Illness or medical condition",
                  "Bereavement",
                  "Personal circumstances",
                  "Technical issues during assessment",
                  "Inadequate supervision",
                  "Unclear assessment criteria",
                  "Other",
                ].map((ground) => (
                  <label key={ground} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.grounds.includes(ground)}
                      onChange={(e) => {
                        const newGrounds = e.target.checked
                          ? [...formData.grounds, ground]
                          : formData.grounds.filter((g) => g !== ground);
                        handleInputChange("grounds", newGrounds);
                      }}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">{ground}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please provide a detailed statement explaining your appeal *
              </label>
              <textarea
                value={formData.statement}
                onChange={(e) => handleInputChange("statement", e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Please provide a clear and detailed explanation of your appeal, including relevant dates, circumstances, and any supporting evidence..."
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Be as specific as possible. Include dates, names, and any
                relevant details that support your case.
              </p>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-800 mb-2">
                Supporting Evidence
              </h3>
              <p className="text-blue-700">
                Upload any relevant documents that support your appeal (medical
                certificates, letters, etc.). Maximum file size: 10MB per file.
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="mt-4">
                <button
                  type="button"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Choose Files
                </button>
                <p className="mt-2 text-sm text-gray-500">
                  PDF, DOC, DOCX, JPG, PNG up to 10MB each
                </p>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-green-800 mb-2">
                Final Review
              </h3>
              <p className="text-green-700">
                Please review all the information you have provided before
                submitting your appeal.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Personal Information
                </h4>
                <p className="text-sm text-gray-600">
                  {formData.firstName} {formData.lastName} ({formData.studentId}
                  )
                </p>
                <p className="text-sm text-gray-600">{formData.email}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Appeal Details
                </h4>
                <p className="text-sm text-gray-600">
                  <strong>Type:</strong> {formData.appealType}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Grounds:</strong> {formData.grounds.join(", ")}
                </p>
              </div>
            </div>

            <label className="flex items-start">
              <input
                type="checkbox"
                checked={formData.confirmAll}
                onChange={(e) =>
                  handleInputChange("confirmAll", e.target.checked)
                }
                className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700">
                I confirm that all information provided is accurate and complete
                to the best of my knowledge
              </span>
            </label>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            {formData.submitted ? (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Appeal Submitted Successfully!
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Your appeal has been submitted and is under review. You will
                  receive confirmation and updates via email.
                </p>
                <p className="mt-4 text-sm text-gray-500">
                  Redirecting to dashboard...
                </p>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Submit Your Appeal
                </h3>
                <p className="text-gray-600 mb-6">
                  By clicking submit, you confirm that all information provided
                  is accurate and complete. You will not be able to edit your
                  appeal after submission.
                </p>
                <button
                  onClick={handleSubmit}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Submit Appeal
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
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
              <button className="text-gray-600 hover:text-purple-600 font-medium text-sm transition-colors">
                Help
              </button>
              <button className="text-gray-600 hover:text-purple-600 font-medium text-sm transition-colors">
                Contact
              </button>
              <button
                onClick={() => router.push("/student")}
                className="text-gray-600 hover:text-red-600 font-medium text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    step.id <= currentStep
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.id}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step.id < currentStep ? "bg-purple-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-600">
              {steps[currentStep - 1].description}
            </p>
          </div>

          {renderStepContent()}

          {currentStep !== 9 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-2 border border-gray-300 rounded-md font-medium ${
                  currentStep === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>

              <button
                onClick={nextStep}
                className="px-6 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors"
              >
                {currentStep === 8 ? "Submit" : "Next"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
