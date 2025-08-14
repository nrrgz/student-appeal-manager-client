"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    studentId: "",
    department: "",
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { login, register, error: authError, clearError } = useAuth();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setErrors({});
    clearError();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear auth error when user starts typing
    if (authError) {
      clearError();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";

      if (selectedRole === "student" && !formData.studentId) {
        newErrors.studentId = "Student ID is required";
      }

      if (selectedRole === "admin" && !formData.department) {
        newErrors.department = "Department is required";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (!selectedRole) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isLogin) {
        // Login
        await login({
          email: formData.email,
          password: formData.password,
          role: selectedRole,
          rememberMe,
        });

        // Redirect based on role
        if (selectedRole === "student") {
          router.push("/student");
        } else if (selectedRole === "admin") {
          router.push("/admin");
        } else if (selectedRole === "reviewer") {
          router.push("/reviewer");
        }
      } else {
        // Register
        const userData = {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: selectedRole,
          ...(selectedRole === "student" && { studentId: formData.studentId }),
          ...(selectedRole === "admin" && { department: formData.department }),
        };

        await register(userData);

        // Redirect based on role
        if (selectedRole === "student") {
          router.push("/student");
        } else if (selectedRole === "admin") {
          router.push("/admin");
        } else if (selectedRole === "reviewer") {
          router.push("/reviewer");
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      // Error is already set in the context
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      studentId: "",
      department: "",
    });
    setErrors({});
    clearError();
  };

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
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to SAM
            </h2>
            <p className="text-gray-600 mb-8">Student Appeal Manager</p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="flex justify-center mb-6">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={toggleMode}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isLogin
                      ? "bg-white text-purple-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={toggleMode}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    !isLogin
                      ? "bg-white text-purple-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Your Role
                </label>
                <div className="space-y-3">
                  {[
                    {
                      id: "student",
                      label: "Student",
                      description: "Submit and track appeals",
                      icon: "👨‍🎓",
                    },
                    {
                      id: "admin",
                      label: "Administrative Staff",
                      description: "Manage cases and communications",
                      icon: "👨‍💼",
                    },
                    {
                      id: "reviewer",
                      label: "Academic Reviewer",
                      description: "Review and provide decisions",
                      icon: "👨‍🏫",
                    },
                  ].map((role) => (
                    <div
                      key={role.id}
                      className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        selectedRole === role.id
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                      }`}
                      onClick={() => handleRoleSelect(role.id)}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="text-2xl">{role.icon}</span>
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="role"
                              value={role.id}
                              checked={selectedRole === role.id}
                              onChange={() => handleRoleSelect(role.id)}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                            />
                            <label className="ml-2 block text-sm font-medium text-gray-900">
                              {role.label}
                            </label>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {role.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
              </div>

              {!isLogin && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                          errors.firstName
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                          errors.lastName ? "border-red-300" : "border-gray-300"
                        }`}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {selectedRole === "student" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Student ID
                      </label>
                      <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleInputChange}
                        placeholder="e.g., 12345678"
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                          errors.studentId
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.studentId && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.studentId}
                        </p>
                      )}
                    </div>
                  )}

                  {selectedRole === "admin" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Department
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                          errors.department
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select Department</option>
                        <option value="student-administration">
                          Student Administration
                        </option>
                        <option value="academic-services">
                          Academic Services
                        </option>
                        <option value="student-support">Student Support</option>
                        <option value="examinations">Examinations</option>
                      </select>
                      {errors.department && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.department}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                      errors.confirmPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {isLogin && (
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>
              )}

              {(errors.general || authError) && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-600">
                    {errors.general || authError}
                  </p>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={!selectedRole}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isLogin ? "Sign In" : "Create Account"}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    System Information
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  This is a demonstration system for the University of
                  Sheffield's Student Appeal Manager (SAM).
                  <br />
                  All data is simulated for testing purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
