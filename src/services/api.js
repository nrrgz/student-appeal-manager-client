const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to make HTTP requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    // Add auth token if available
    const token = this.getToken();
    console.log("API Request - URL:", url);
    console.log("API Request - Token:", token ? "Token exists" : "No token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("API Request - Authorization header added");
    } else {
      console.log("API Request - No Authorization header (no token)");
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Get stored token
  getToken() {
    if (typeof window !== "undefined") {
      // First try to get token from dedicated storage
      let token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      // If no dedicated token, try to get from userInfo
      if (!token) {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
          try {
            const user = JSON.parse(userInfo);
            token = user.token || user.authToken;
          } catch (e) {
            console.error("Failed to parse userInfo:", e);
          }
        }
      }

      return token;
    }
    return null;
  }

  // Store token
  setToken(token, rememberMe = false) {
    if (typeof window !== "undefined") {
      if (rememberMe) {
        localStorage.setItem("authToken", token);
      } else {
        sessionStorage.setItem("authToken", token);
      }
    }
  }

  // Remove token
  removeToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
    }
  }

  // Auth methods
  async login(credentials) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return this.request("/auth/profile");
  }

  async updateProfile(profileData) {
    return this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  async logout() {
    try {
      await this.request("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      this.removeToken();
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Appeals methods
  async getStudentAppeals() {
    return this.request("/appeals");
  }

  async getStudentAppeal(appealId) {
    return this.request(`/appeals/${appealId}`);
  }

  async createAppeal(appealData) {
    // Check if appealData is FormData (for file uploads)
    if (appealData instanceof FormData) {
      const token = this.getToken();
      const url = `${this.baseURL}/appeals`;

      const config = {
        method: "POST",
        body: appealData,
        headers: {},
      };

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Don't set Content-Type for FormData - let the browser set it with boundary
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } else {
      // Handle regular JSON data
      return this.request("/appeals", {
        method: "POST",
        body: JSON.stringify(appealData),
      });
    }
  }

  // Reviewer methods
  async getReviewerAppeals() {
    return this.request("/reviewer/appeals");
  }

  async getReviewerAppeal(appealId) {
    return this.request(`/reviewer/appeals/${appealId}`);
  }

  async updateAppealStatus(appealId, data) {
    return this.request(`/reviewer/appeals/${appealId}/status`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async addAppealNote(appealId, data) {
    return this.request(`/reviewer/appeals/${appealId}/notes`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async downloadReviewerEvidenceFile(appealId, filename) {
    const token = this.getToken();
    const url = `${
      this.baseURL
    }/reviewer/appeals/${appealId}/evidence/${encodeURIComponent(
      filename
    )}/download`;

    const config = {
      method: "GET",
      headers: {},
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(
        `Download failed: ${response.status} ${response.statusText}`
      );
    }

    return response.blob();
  }

  async downloadAdminEvidenceFile(appealId, filename) {
    const token = this.getToken();
    const url = `${
      this.baseURL
    }/admin/appeals/${appealId}/evidence/${encodeURIComponent(
      filename
    )}/download`;

    const config = {
      method: "GET",
      headers: {},
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(
        `Download failed: ${response.status} ${response.statusText}`
      );
    }

    return response.blob();
  }

  async uploadReviewerEvidence(appealId, files) {
    const token = this.getToken();
    const url = `${this.baseURL}/reviewer/appeals/${appealId}/evidence`;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("evidence", file);
    });

    const config = {
      method: "POST",
      body: formData,
      headers: {},
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  // Admin methods
  async getAdminAppeals(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const endpoint = queryParams.toString()
      ? `/admin/appeals?${queryParams.toString()}`
      : "/admin/appeals";

    return this.request(endpoint);
  }

  async getAdminAppeal(appealId) {
    return this.request(`/admin/appeals/${appealId}`);
  }

  async getAdminDashboard() {
    return this.request("/admin/appeals/dashboard");
  }

  async updateAppealAssignment(appealId, data) {
    return this.request(`/admin/appeals/${appealId}/assign`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async updateAppealStatusAdmin(appealId, data) {
    return this.request(`/admin/appeals/${appealId}/status`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async updateAppealPriority(appealId, data) {
    return this.request(`/admin/appeals/${appealId}/priority`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async setAppealDeadline(appealId, data) {
    return this.request(`/admin/appeals/${appealId}/deadline`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async addAdminNote(appealId, data) {
    return this.request(`/admin/appeals/${appealId}/notes`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteAdminNote(appealId, noteId) {
    return this.request(`/admin/appeals/${appealId}/notes/${noteId}`, {
      method: "DELETE",
    });
  }

  async bulkAssignAppeals(data) {
    return this.request("/admin/appeals/bulk-assign", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async searchAppeals(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const endpoint = queryParams.toString()
      ? `/admin/appeals/search?${queryParams.toString()}`
      : "/admin/appeals/search";

    return this.request(endpoint);
  }

  async getAppealReports(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const endpoint = queryParams.toString()
      ? `/admin/reports/appeals?${queryParams.toString()}`
      : "/admin/reports/appeals";

    return this.request(endpoint);
  }

  async getComprehensiveReports(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const endpoint = queryParams.toString()
      ? `/admin/reports/comprehensive?${queryParams.toString()}`
      : "/admin/reports/comprehensive";

    return this.request(endpoint);
  }

  async exportReportsCSV(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const endpoint = queryParams.toString()
      ? `/admin/reports/export-csv?${queryParams.toString()}`
      : "/admin/reports/export-csv";

    // For CSV download, we need to handle the response differently
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `appeal-reports-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
  }

  async getUsers(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const endpoint = queryParams.toString()
      ? `/admin/users?${queryParams.toString()}`
      : "/admin/users";

    return this.request(endpoint);
  }

  async getReviewers() {
    return this.request("/admin/users/reviewers");
  }

  async getAdmins() {
    return this.request("/admin/users/admins");
  }

  async getUserStats() {
    return this.request("/admin/users/stats");
  }

  async updateUser(userId, data) {
    return this.request(`/admin/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deactivateUser(userId) {
    return this.request(`/admin/users/${userId}`, {
      method: "DELETE",
    });
  }

  // Deadline management methods
  async setAppealDeadline(appealId, deadlineData) {
    return this.request(`/admin/appeals/${appealId}/deadline`, {
      method: "PUT",
      body: JSON.stringify(deadlineData),
    });
  }

  async removeAppealDeadline(appealId, reason) {
    return this.request(`/admin/appeals/${appealId}/deadline`, {
      method: "DELETE",
      body: JSON.stringify({ reason }),
    });
  }

  async getAppealsWithDeadlines(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const endpoint = queryParams.toString()
      ? `/admin/appeals/deadlines?${queryParams.toString()}`
      : "/admin/appeals/deadlines";

    return this.request(endpoint);
  }

  async setBulkDeadlines(appealIds, deadlineData) {
    return this.request("/admin/appeals/bulk-deadlines", {
      method: "PUT",
      body: JSON.stringify({
        appealIds,
        ...deadlineData,
      }),
    });
  }

  // File download methods
  async downloadEvidenceFile(appealId, filename, role = "student") {
    const endpoint = `/${role}/appeals/${appealId}/evidence/${encodeURIComponent(
      filename
    )}/download`;
    return this.request(endpoint);
  }

  async downloadStudentEvidenceFile(appealId, filename) {
    // For student downloads, the route is /api/appeals/:id/evidence/:filename/download
    const endpoint = `/appeals/${appealId}/evidence/${encodeURIComponent(
      filename
    )}/download`;
    return this.request(endpoint);
  }

  async downloadReviewerEvidenceFile(appealId, filename) {
    return this.downloadEvidenceFile(appealId, filename, "reviewer");
  }

  async downloadAdminEvidenceFile(appealId, filename) {
    return this.downloadEvidenceFile(appealId, filename, "admin");
  }
}

// Create and export a single instance
const apiService = new ApiService();
export default apiService;
