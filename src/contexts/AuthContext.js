"use client";

import { createContext, useContext, useState, useEffect } from "react";
import apiService from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (apiService.isAuthenticated()) {
          const response = await apiService.getProfile();
          setUser(response.user);
          // Store user info in localStorage
          localStorage.setItem("userInfo", JSON.stringify(response.user));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        apiService.removeToken();
        localStorage.removeItem("userInfo");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);

      const response = await apiService.login(credentials);

      // Store token
      apiService.setToken(response.token, credentials.rememberMe);

      localStorage.setItem("token", response.token);

      // Set user data
      setUser(response.user);

      // Store user info in localStorage
      localStorage.setItem("userInfo", JSON.stringify(response.user));

      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await apiService.register(userData);

      // Store token
      apiService.setToken(response.token, false);

      // Set user data
      setUser(response.user);

      // Store user info in localStorage
      localStorage.setItem("userInfo", JSON.stringify(response.user));

      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setError(null);
      // Remove user info from localStorage
      localStorage.removeItem("userInfo");
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await apiService.updateProfile(profileData);
      setUser(response.user);
      // Update user info in localStorage
      localStorage.setItem("userInfo", JSON.stringify(response.user));
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
