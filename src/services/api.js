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
    return this.request("/appeals", {
      method: "POST",
      body: JSON.stringify(appealData),
    });
  }

  // Reviewer methods
  async getReviewerAppeals(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.appealType)
      queryParams.append("appealType", filters.appealType);
    if (filters.page) queryParams.append("page", filters.page);
    if (filters.limit) queryParams.append("limit", filters.limit);

    const endpoint = `/reviewer/appeals${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return this.request(endpoint);
  }

  async getReviewerAppeal(appealId) {
    return this.request(`/reviewer/appeals/${appealId}`);
  }

  async updateAppealStatus(appealId, statusData) {
    return this.request(`/reviewer/appeals/${appealId}/status`, {
      method: "PUT",
      body: JSON.stringify(statusData),
    });
  }

  async addAppealNote(appealId, noteData) {
    return this.request(`/reviewer/appeals/${appealId}/notes`, {
      method: "POST",
      body: JSON.stringify(noteData),
    });
  }
}

// Create and export a single instance
const apiService = new ApiService();
export default apiService;
