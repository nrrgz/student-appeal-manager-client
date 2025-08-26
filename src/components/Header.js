"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Get user info from localStorage for backward compatibility
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const handleGetStarted = () => {
    router.push("/login");
  };

  const handleSignOut = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    if (logout) {
      logout();
    }
    router.push("/login");
  };

  const handleHelp = () => {
    // Navigate to help section on main page or show help modal
    if (pathname === "/") {
      // If on main page, dispatch custom event for smooth scrolling
      const event = new CustomEvent("navigateToSection", { detail: "help" });
      window.dispatchEvent(event);
    } else {
      // If on other pages, go to main page help section
      router.push("/#help-section");
    }
  };

  const handleContact = () => {
    // Navigate to contact section on main page or show contact modal
    if (pathname === "/") {
      // If on main page, dispatch custom event for smooth scrolling
      const event = new CustomEvent("navigateToSection", { detail: "contact" });
      window.dispatchEvent(event);
    } else {
      // If on other pages, go to main page contact section
      router.push("/#contact-section");
    }
  };

  const getBackButton = () => {
    if (pathname.startsWith("/student/")) {
      return (
        <button
          onClick={() => router.push("/student")}
          className="text-gray-600 hover:text-purple-600 font-medium text-sm transition-colors"
        >
          Back to Dashboard
        </button>
      );
    } else if (pathname.startsWith("/reviewer/")) {
      return (
        <button
          onClick={() => router.push("/reviewer")}
          className="text-gray-600 hover:text-purple-600 font-medium text-sm transition-colors"
        >
          Back to Dashboard
        </button>
      );
    } else if (pathname.startsWith("/admin/")) {
      return (
        <button
          onClick={() => router.push("/admin")}
          className="text-gray-600 hover:text-purple-600 font-medium text-sm transition-colors"
        >
          Back to Dashboard
        </button>
      );
    }
    return null;
  };

  const getDashboardButton = () => {
    if (!isAuthenticated) return null;

    // If user is on main page or other pages, show dashboard button
    if (
      pathname === "/" ||
      (!pathname.startsWith("/student") &&
        !pathname.startsWith("/reviewer") &&
        !pathname.startsWith("/admin"))
    ) {
      const userRole = userInfo?.role || user?.role;
      if (userRole === "student") {
        return (
          <button
            onClick={() => router.push("/student")}
            className="text-gray-600 hover:text-purple-600 font-medium text-sm transition-colors"
          >
            Student Dashboard
          </button>
        );
      } else if (userRole === "reviewer") {
        return (
          <button
            onClick={() => router.push("/reviewer")}
            className="text-gray-600 hover:text-purple-600 font-medium text-sm transition-colors"
          >
            Reviewer Dashboard
          </button>
        );
      } else if (userRole === "admin") {
        return (
          <button
            onClick={() => router.push("/admin")}
            className="text-gray-600 hover:text-purple-600 font-medium text-sm transition-colors"
          >
            Admin Dashboard
          </button>
        );
      }
    }
    return null;
  };

  const isAuthenticated = user || userInfo;

  console.log("userInfo", userInfo);
  console.log("user", user);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link href="/">
              <img
                src="/images/logo.png"
                alt="TUOS Logo"
                className="w-30 object-contain"
              />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {getBackButton()}
                {getDashboardButton()}
                <span className="text-sm text-gray-700">
                  Welcome, {userInfo?.name || user?.firstName || "User"}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleHelp}
                  className="text-gray-600 hover:text-purple-600 font-medium text-sm transition-colors"
                >
                  Help
                </button>
                <button
                  onClick={handleContact}
                  className="text-gray-600 hover:text-purple-600 font-medium text-sm transition-colors"
                >
                  Contact
                </button>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <button
                  onClick={handleGetStarted}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
