import axios from "axios";
import { getCachedOrFetch } from "./cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error("Network Error:", error.message);
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    }

    // Handle API errors
    const { status, data } = error.response;

    switch (status) {
      case 401:
        // Unauthorized - clear auth tokens and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("adminToken");
          window.location.href = "/auth/login";
        }
        return Promise.reject(
          new Error("Your session has expired. Please log in again.")
        );

      case 403:
        return Promise.reject(
          new Error("You do not have permission to perform this action.")
        );

      case 404:
        return Promise.reject(
          new Error("The requested resource was not found.")
        );

      case 422:
        // Validation errors
        const validationMessage =
          data.message || "Validation failed. Please check your input.";
        return Promise.reject(new Error(validationMessage));

      case 500:
        return Promise.reject(
          new Error("Server error. Please try again later.")
        );

      default:
        return Promise.reject(error);
    }
  }
);

// Add a request interceptor to include auth token
if (typeof window !== "undefined") {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}

// Set up axios interceptors for JWT token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

// User Authentication
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  if (response.data.token) {
    setAuthToken(response.data.token);
  }
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const logout = () => {
  setAuthToken(null);
  // For Next.js client components
  if (typeof window !== "undefined") {
    window.location.href = "/auth/login";
  }
};

// Lands
export const getAvailableLands = async () => {
  // Use caching for available lands (5 minutes TTL)
  return getCachedOrFetch(
    "available-lands",
    async () => {
      const response = await api.get("/lands");
      return response.data;
    },
    5 * 60 * 1000
  );
};

export const getLandDetails = async (landId) => {
  // Use caching for land details (10 minutes TTL)
  return getCachedOrFetch(
    `land-details-${landId}`,
    async () => {
      const response = await api.get(`/lands/${landId}`);
      return response.data;
    },
    10 * 60 * 1000
  );
};

// Add New Land
export const addLand = async (landData) => {
  const response = await api.post("/lands", landData);
  return response.data;
};

// Edit Land
export const editLand = async (landId, landData) => {
  const response = await api.put(`/lands/${landId}`, landData);
  return response.data;
};

// Delete Land
export const deleteLand = async (landId) => {
  const response = await api.delete(`/lands/${landId}`);
  return response.data;
};

// Fetch My Lands (purchased properties)
export const getMyLands = async () => {
  // Use caching for my lands (2 minutes TTL)
  return getCachedOrFetch(
    "my-lands",
    async () => {
      const response = await api.get("/lands/my-lands");
      return response.data;
    },
    2 * 60 * 1000
  );
};

// Fetch My Favorite Lands
export const getFavoriteLands = async () => {
  // Use caching for favorites (2 minutes TTL)
  return getCachedOrFetch(
    "my-favorites",
    async () => {
      const response = await api.get("/lands/favorites");
      return response.data;
    },
    2 * 60 * 1000
  );
};

// Add Land to Favorites
export const addToFavorites = async (landId) => {
  const response = await api.post(`/lands/favorites/${landId}`);
  return response.data;
};

// Remove Land from Favorites
export const removeFromFavorites = async (landId) => {
  const response = await api.delete(`/lands/favorites/${landId}`);
  return response.data;
};

// Payments
export const getPaymentHistory = async (userId) => {
  const response = await api.get(`/payments/history/${userId}`);
  return response.data;
};

export const addPayment = async (paymentData) => {
  const response = await api.post("/payments", paymentData);
  return response.data;
};

// Fetch Payment Plan
export const getPaymentPlan = async () => {
  const response = await api.get("/payments/plan");
  return response.data;
};

// Fetch Payments
export const getPayments = async () => {
  const response = await api.get("/payments");
  return response.data;
};

// Fetch Admin Stats
export const getAdminStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

export const getUserProfile = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

// Mark Payment as Completed
export const markPaymentCompleted = async (paymentId) => {
  const response = await api.put(`/payments/${paymentId}/complete`);
  return response.data;
};

// Admin API functions
export const adminLogin = async (credentials) => {
  const response = await api.post("/admin/login", credentials);
  if (response.data.token) {
    localStorage.setItem("adminToken", response.data.token);
  }
  return response.data;
};

export const adminLogout = () => {
  localStorage.removeItem("adminToken");
  // For Next.js client components
  if (typeof window !== "undefined") {
    window.location.href = "/admin/login";
  }
};

export default api;
