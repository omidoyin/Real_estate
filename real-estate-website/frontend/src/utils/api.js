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

export const resetPassword = async (token, password) => {
  const response = await api.post(`/auth/reset-password/${token}`, {
    password,
  });
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await api.get(`/auth/verify-email/${token}`);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put("/auth/profile", profileData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.post("/auth/change-password", passwordData);
  return response.data;
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
    setAuthToken(null);
    // For Next.js client components
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  }
};

// Lands
export const getAvailableLands = async (page = 1, limit = 10) => {
  // Use caching for available lands (5 minutes TTL)
  return getCachedOrFetch(
    `available-lands-${page}-${limit}`,
    async () => {
      const response = await api.get(`/lands?page=${page}&limit=${limit}`);
      return response.data;
    },
    5 * 60 * 1000
  );
};

export const searchLands = async (query, page = 1, limit = 10) => {
  const response = await api.get(
    `/lands/search?query=${query}&page=${page}&limit=${limit}`
  );
  return response.data;
};

export const filterLands = async (filters, page = 1, limit = 10) => {
  // Convert filters object to query string
  const queryParams = new URLSearchParams();

  // Add pagination
  queryParams.append("page", page);
  queryParams.append("limit", limit);

  // Add filters
  if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
  if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
  if (filters.location) queryParams.append("location", filters.location);
  if (filters.size) queryParams.append("size", filters.size);
  if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
  if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder);

  const response = await api.get(`/lands/filter?${queryParams.toString()}`);
  return response.data;
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
  // Create FormData for file uploads
  const formData = new FormData();

  // Add text fields
  Object.keys(landData).forEach((key) => {
    if (key !== "images" && key !== "video" && key !== "brochure") {
      if (typeof landData[key] === "object") {
        formData.append(key, JSON.stringify(landData[key]));
      } else {
        formData.append(key, landData[key]);
      }
    }
  });

  // Add media files
  if (landData.images && landData.images.length) {
    landData.images.forEach((image) => {
      formData.append("media", image);
    });
  }

  if (landData.video) {
    formData.append("media", landData.video);
  }

  if (landData.brochure) {
    formData.append("media", landData.brochure);
  }

  const response = await api.post("/lands", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Edit Land
export const editLand = async (landId, landData) => {
  // Create FormData for file uploads
  const formData = new FormData();

  // Add text fields
  Object.keys(landData).forEach((key) => {
    if (key !== "images" && key !== "video" && key !== "brochure") {
      if (typeof landData[key] === "object") {
        formData.append(key, JSON.stringify(landData[key]));
      } else {
        formData.append(key, landData[key]);
      }
    }
  });

  // Add media files
  if (landData.images && landData.images.length) {
    landData.images.forEach((image) => {
      if (image instanceof File) {
        formData.append("media", image);
      }
    });
  }

  if (landData.video && landData.video instanceof File) {
    formData.append("media", landData.video);
  }

  if (landData.brochure && landData.brochure instanceof File) {
    formData.append("media", landData.brochure);
  }

  const response = await api.put(`/lands/${landId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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
    "favorite-lands",
    async () => {
      const response = await api.get("/lands/favorites");
      return response.data;
    },
    2 * 60 * 1000
  );
};

// Add Land to Favorites
export const addLandToFavorites = async (landId) => {
  const response = await api.post(`/lands/favorites/${landId}`);
  return response.data;
};

// Remove Land from Favorites
export const removeLandFromFavorites = async (landId) => {
  const response = await api.delete(`/lands/favorites/${landId}`);
  return response.data;
};

// Payments
export const getPaymentHistory = async () => {
  const response = await api.get("/payments/history");
  return response.data;
};

export const getPaymentDetails = async (paymentId) => {
  const response = await api.get(`/payments/${paymentId}`);
  return response.data;
};

export const getInstallmentDetails = async (paymentId) => {
  const response = await api.get(`/payments/installments/${paymentId}`);
  return response.data;
};

export const processPayment = async (paymentData) => {
  const response = await api.post("/payments/process", paymentData);
  return response.data;
};

// Admin payment functions
export const addPayment = async (paymentData) => {
  const response = await api.post("/payments", paymentData);
  return response.data;
};

// Fetch Payment Plan
export const getPaymentPlan = async () => {
  const response = await api.get("/payments/plan");
  return response.data;
};

// Update Payment Plan (admin only)
export const updatePaymentPlan = async (userId, planData) => {
  const response = await api.put(`/payments/plan/${userId}`, planData);
  return response.data;
};

// Fetch All Payments (admin only)
export const getAllPayments = async () => {
  const response = await api.get("/payments");
  return response.data;
};

// Fetch Admin Stats
export const getAdminStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

export const getOtherUserProfile = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

// Service API Functions
export const getAllServices = async (page = 1, limit = 10) => {
  // Use caching for all services (5 minutes TTL)
  return getCachedOrFetch(
    `all-services-${page}-${limit}`,
    async () => {
      const response = await api.get(`/services?page=${page}&limit=${limit}`);
      return response.data;
    },
    5 * 60 * 1000
  );
};

export const getServiceDetails = async (serviceId) => {
  // Use caching for service details (10 minutes TTL)
  return getCachedOrFetch(
    `service-details-${serviceId}`,
    async () => {
      const response = await api.get(`/services/${serviceId}`);
      return response.data;
    },
    10 * 60 * 1000
  );
};

export const getEstateManagementServices = async (page = 1, limit = 10) => {
  // Use caching for estate management services (5 minutes TTL)
  return getCachedOrFetch(
    `estate-management-services-${page}-${limit}`,
    async () => {
      const response = await api.get(
        `/services/estate-management?page=${page}&limit=${limit}`
      );
      return response.data;
    },
    5 * 60 * 1000
  );
};

export const getArchitecturalDesignServices = async (page = 1, limit = 10) => {
  // Use caching for architectural design services (5 minutes TTL)
  return getCachedOrFetch(
    `architectural-design-services-${page}-${limit}`,
    async () => {
      const response = await api.get(
        `/services/architectural-design?page=${page}&limit=${limit}`
      );
      return response.data;
    },
    5 * 60 * 1000
  );
};

export const getPropertyValuationServices = async (page = 1, limit = 10) => {
  // Use caching for property valuation services (5 minutes TTL)
  return getCachedOrFetch(
    `property-valuation-services-${page}-${limit}`,
    async () => {
      const response = await api.get(
        `/services/property-valuation?page=${page}&limit=${limit}`
      );
      return response.data;
    },
    5 * 60 * 1000
  );
};

export const getLegalConsultationServices = async (page = 1, limit = 10) => {
  // Use caching for legal consultation services (5 minutes TTL)
  return getCachedOrFetch(
    `legal-consultation-services-${page}-${limit}`,
    async () => {
      const response = await api.get(
        `/services/legal-consultation?page=${page}&limit=${limit}`
      );
      return response.data;
    },
    5 * 60 * 1000
  );
};

// Add Service
export const addService = async (serviceData) => {
  // Create FormData for file uploads
  const formData = new FormData();

  // Add text fields
  Object.keys(serviceData).forEach((key) => {
    if (key !== "images") {
      if (typeof serviceData[key] === "object") {
        formData.append(key, JSON.stringify(serviceData[key]));
      } else {
        formData.append(key, serviceData[key]);
      }
    }
  });

  // Add media files
  if (serviceData.images && serviceData.images.length) {
    serviceData.images.forEach((image) => {
      formData.append("media", image);
    });
  }

  const response = await api.post("/services", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Edit Service
export const editService = async (serviceId, serviceData) => {
  // Create FormData for file uploads
  const formData = new FormData();

  // Add text fields
  Object.keys(serviceData).forEach((key) => {
    if (key !== "images") {
      if (typeof serviceData[key] === "object") {
        formData.append(key, JSON.stringify(serviceData[key]));
      } else {
        formData.append(key, serviceData[key]);
      }
    }
  });

  // Add media files
  if (serviceData.images && serviceData.images.length) {
    serviceData.images.forEach((image) => {
      if (image instanceof File) {
        formData.append("media", image);
      }
    });
  }

  const response = await api.put(`/services/${serviceId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Delete Service
export const deleteService = async (serviceId) => {
  const response = await api.delete(`/services/${serviceId}`);
  return response.data;
};

// Subscribe to Service
export const subscribeToService = async (serviceId) => {
  const response = await api.post(`/services/subscribe/${serviceId}`);
  return response.data;
};

// Unsubscribe from Service
export const unsubscribeFromService = async (serviceId) => {
  const response = await api.delete(`/services/subscribe/${serviceId}`);
  return response.data;
};

// Get User Subscribed Services
export const getUserSubscribedServices = async () => {
  // Use caching for subscribed services (2 minutes TTL)
  return getCachedOrFetch(
    "my-services",
    async () => {
      const response = await api.get("/services/my-services");
      return response.data;
    },
    2 * 60 * 1000
  );
};

// Houses API Functions
export const getAvailableHouses = async (page = 1, limit = 10) => {
  // Use caching for available houses (5 minutes TTL)
  return getCachedOrFetch(
    `available-houses-${page}-${limit}`,
    async () => {
      const response = await api.get(`/houses?page=${page}&limit=${limit}`);
      return response.data;
    },
    5 * 60 * 1000
  );
};

export const searchHouses = async (query, page = 1, limit = 10) => {
  const response = await api.get(
    `/houses/search?query=${query}&page=${page}&limit=${limit}`
  );
  return response.data;
};

export const filterHouses = async (filters, page = 1, limit = 10) => {
  // Convert filters object to query string
  const queryParams = new URLSearchParams();

  // Add pagination
  queryParams.append("page", page);
  queryParams.append("limit", limit);

  // Add filters
  if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
  if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
  if (filters.location) queryParams.append("location", filters.location);
  if (filters.size) queryParams.append("size", filters.size);
  if (filters.bedrooms) queryParams.append("bedrooms", filters.bedrooms);
  if (filters.bathrooms) queryParams.append("bathrooms", filters.bathrooms);
  if (filters.propertyType)
    queryParams.append("propertyType", filters.propertyType);
  if (filters.status) queryParams.append("status", filters.status);
  if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
  if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder);

  const response = await api.get(`/houses/filter?${queryParams.toString()}`);
  return response.data;
};

export const getHouseDetails = async (houseId) => {
  // Use caching for house details (10 minutes TTL)
  return getCachedOrFetch(
    `house-details-${houseId}`,
    async () => {
      const response = await api.get(`/houses/${houseId}`);
      return response.data;
    },
    10 * 60 * 1000
  );
};

// Add New House
export const addHouse = async (houseData) => {
  // Create FormData for file uploads
  const formData = new FormData();

  // Add text fields
  Object.keys(houseData).forEach((key) => {
    if (key !== "images" && key !== "video" && key !== "brochure") {
      if (typeof houseData[key] === "object") {
        formData.append(key, JSON.stringify(houseData[key]));
      } else {
        formData.append(key, houseData[key]);
      }
    }
  });

  // Add media files
  if (houseData.images && houseData.images.length) {
    houseData.images.forEach((image) => {
      formData.append("media", image);
    });
  }

  if (houseData.video) {
    formData.append("media", houseData.video);
  }

  if (houseData.brochure) {
    formData.append("media", houseData.brochure);
  }

  const response = await api.post("/houses", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Edit House
export const editHouse = async (houseId, houseData) => {
  // Create FormData for file uploads
  const formData = new FormData();

  // Add text fields
  Object.keys(houseData).forEach((key) => {
    if (key !== "images" && key !== "video" && key !== "brochure") {
      if (typeof houseData[key] === "object") {
        formData.append(key, JSON.stringify(houseData[key]));
      } else {
        formData.append(key, houseData[key]);
      }
    }
  });

  // Add media files
  if (houseData.images && houseData.images.length) {
    houseData.images.forEach((image) => {
      if (image instanceof File) {
        formData.append("media", image);
      }
    });
  }

  if (houseData.video && houseData.video instanceof File) {
    formData.append("media", houseData.video);
  }

  if (houseData.brochure && houseData.brochure instanceof File) {
    formData.append("media", houseData.brochure);
  }

  const response = await api.put(`/houses/${houseId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Delete House
export const deleteHouse = async (houseId) => {
  const response = await api.delete(`/houses/${houseId}`);
  return response.data;
};

// Fetch My Houses (purchased properties)
export const getMyHouses = async () => {
  // Use caching for my houses (2 minutes TTL)
  return getCachedOrFetch(
    "my-houses",
    async () => {
      const response = await api.get("/houses/my-houses");
      return response.data;
    },
    2 * 60 * 1000
  );
};

// Fetch My Favorite Houses
export const getFavoriteHouses = async () => {
  // Use caching for favorites (2 minutes TTL)
  return getCachedOrFetch(
    "favorite-houses",
    async () => {
      const response = await api.get("/houses/favorites");
      return response.data;
    },
    2 * 60 * 1000
  );
};

// Add House to Favorites
export const addHouseToFavorites = async (houseId) => {
  const response = await api.post(`/houses/favorites/${houseId}`);
  return response.data;
};

// Remove House from Favorites
export const removeHouseFromFavorites = async (houseId) => {
  const response = await api.delete(`/houses/favorites/${houseId}`);
  return response.data;
};

// Apartments API Functions
export const getAvailableApartments = async (page = 1, limit = 10) => {
  // Use caching for available apartments (5 minutes TTL)
  return getCachedOrFetch(
    `available-apartments-${page}-${limit}`,
    async () => {
      const response = await api.get(`/apartments?page=${page}&limit=${limit}`);
      return response.data;
    },
    5 * 60 * 1000
  );
};

export const searchApartments = async (query, page = 1, limit = 10) => {
  const response = await api.get(
    `/apartments/search?query=${query}&page=${page}&limit=${limit}`
  );
  return response.data;
};

export const filterApartments = async (filters, page = 1, limit = 10) => {
  // Convert filters object to query string
  const queryParams = new URLSearchParams();

  // Add pagination
  queryParams.append("page", page);
  queryParams.append("limit", limit);

  // Add filters
  if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
  if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
  if (filters.location) queryParams.append("location", filters.location);
  if (filters.size) queryParams.append("size", filters.size);
  if (filters.bedrooms) queryParams.append("bedrooms", filters.bedrooms);
  if (filters.bathrooms) queryParams.append("bathrooms", filters.bathrooms);
  if (filters.floor) queryParams.append("floor", filters.floor);
  if (filters.status) queryParams.append("status", filters.status);
  if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
  if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder);

  const response = await api.get(
    `/apartments/filter?${queryParams.toString()}`
  );
  return response.data;
};

export const getApartmentDetails = async (apartmentId) => {
  // Use caching for apartment details (10 minutes TTL)
  return getCachedOrFetch(
    `apartment-details-${apartmentId}`,
    async () => {
      const response = await api.get(`/apartments/${apartmentId}`);
      return response.data;
    },
    10 * 60 * 1000
  );
};

// Add New Apartment
export const addApartment = async (apartmentData) => {
  // Create FormData for file uploads
  const formData = new FormData();

  // Add text fields
  Object.keys(apartmentData).forEach((key) => {
    if (key !== "images" && key !== "video" && key !== "brochure") {
      if (typeof apartmentData[key] === "object") {
        formData.append(key, JSON.stringify(apartmentData[key]));
      } else {
        formData.append(key, apartmentData[key]);
      }
    }
  });

  // Add media files
  if (apartmentData.images && apartmentData.images.length) {
    apartmentData.images.forEach((image) => {
      formData.append("media", image);
    });
  }

  if (apartmentData.video) {
    formData.append("media", apartmentData.video);
  }

  if (apartmentData.brochure) {
    formData.append("media", apartmentData.brochure);
  }

  const response = await api.post("/apartments", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Edit Apartment
export const editApartment = async (apartmentId, apartmentData) => {
  // Create FormData for file uploads
  const formData = new FormData();

  // Add text fields
  Object.keys(apartmentData).forEach((key) => {
    if (key !== "images" && key !== "video" && key !== "brochure") {
      if (typeof apartmentData[key] === "object") {
        formData.append(key, JSON.stringify(apartmentData[key]));
      } else {
        formData.append(key, apartmentData[key]);
      }
    }
  });

  // Add media files
  if (apartmentData.images && apartmentData.images.length) {
    apartmentData.images.forEach((image) => {
      if (image instanceof File) {
        formData.append("media", image);
      }
    });
  }

  if (apartmentData.video && apartmentData.video instanceof File) {
    formData.append("media", apartmentData.video);
  }

  if (apartmentData.brochure && apartmentData.brochure instanceof File) {
    formData.append("media", apartmentData.brochure);
  }

  const response = await api.put(`/apartments/${apartmentId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Delete Apartment
export const deleteApartment = async (apartmentId) => {
  const response = await api.delete(`/apartments/${apartmentId}`);
  return response.data;
};

// Fetch My Apartments (purchased properties)
export const getMyApartments = async () => {
  // Use caching for my apartments (2 minutes TTL)
  return getCachedOrFetch(
    "my-apartments",
    async () => {
      const response = await api.get("/apartments/my-apartments");
      return response.data;
    },
    2 * 60 * 1000
  );
};

// Fetch My Favorite Apartments
export const getFavoriteApartments = async () => {
  // Use caching for favorites (2 minutes TTL)
  return getCachedOrFetch(
    "favorite-apartments",
    async () => {
      const response = await api.get("/apartments/favorites");
      return response.data;
    },
    2 * 60 * 1000
  );
};

// Add Apartment to Favorites
export const addApartmentToFavorites = async (apartmentId) => {
  const response = await api.post(`/apartments/favorites/${apartmentId}`);
  return response.data;
};

// Remove Apartment from Favorites
export const removeApartmentFromFavorites = async (apartmentId) => {
  const response = await api.delete(`/apartments/favorites/${apartmentId}`);
  return response.data;
};

// Mark Payment as Completed
export const markPaymentCompleted = async (paymentId) => {
  const response = await api.patch(`/payments/${paymentId}/complete`);
  return response.data;
};

// Portfolio API Functions
export const getUserPortfolio = async () => {
  const response = await api.get("/portfolio");
  return response.data;
};

export const getPortfolioLands = async () => {
  const response = await api.get("/portfolio/lands");
  return response.data;
};

export const getPortfolioHouses = async () => {
  const response = await api.get("/portfolio/houses");
  return response.data;
};

export const getPortfolioApartments = async () => {
  const response = await api.get("/portfolio/apartments");
  return response.data;
};

export const getPortfolioServices = async () => {
  const response = await api.get("/portfolio/services");
  return response.data;
};

export const getPortfolioStats = async () => {
  const response = await api.get("/portfolio/stats");
  return response.data;
};

// Portfolio Page API Functions
export const getPortfolioPageData = async (
  serviceType,
  filters,
  page = 1,
  limit = 6
) => {
  try {
    let endpoint;
    let params = new URLSearchParams();

    // Add pagination parameters
    params.append("page", page);
    params.append("limit", limit);

    // Add sorting parameters if provided
    if (filters.sortBy) {
      let sortBy, sortOrder;

      switch (filters.sortBy) {
        case "newest":
          sortBy = "createdAt";
          sortOrder = "desc";
          break;
        case "priceAsc":
          sortBy = "price";
          sortOrder = "asc";
          break;
        case "priceDesc":
          sortBy = "price";
          sortOrder = "desc";
          break;
        case "sizeAsc":
          sortBy = "size";
          sortOrder = "asc";
          break;
        case "sizeDesc":
          sortBy = "size";
          sortOrder = "desc";
          break;
        default:
          sortBy = "createdAt";
          sortOrder = "desc";
      }

      params.append("sortBy", sortBy);
      params.append("sortOrder", sortOrder);
    }

    // Add search parameter if provided
    if (filters.search) {
      params.append("query", filters.search);
    }

    // Add price range parameters if provided
    if (filters.priceRange && filters.priceRange.length === 2) {
      if (filters.priceRange[0] > 0) {
        params.append("minPrice", filters.priceRange[0]);
      }
      if (filters.priceRange[1] < 1000000) {
        params.append("maxPrice", filters.priceRange[1]);
      }
    }

    // Add location parameter if provided
    if (filters.location && filters.location !== "any") {
      params.append("location", filters.location);
    }

    // Determine endpoint based on service type
    switch (serviceType) {
      case "lands":
        endpoint = filters.search ? "/lands/search" : "/lands/filter";
        break;
      case "houses":
        endpoint = filters.search ? "/houses/search" : "/houses/filter";
        break;
      case "apartments":
        endpoint = filters.search ? "/apartments/search" : "/apartments/filter";
        break;
      case "estateManagement":
        endpoint = "/services/estate-management";
        break;
      case "architecturalDesign":
        endpoint = "/services/architectural-design";
        break;
      case "landSurvey":
        endpoint = "/services/property-valuation";
        break;
      case "generalContracts":
        endpoint = "/services/legal-consultation";
        break;
      default:
        endpoint = "/lands";
    }

    const response = await api.get(`${endpoint}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${serviceType} data:`, error);
    throw error;
  }
};

// Favorites API Functions
export const getUserFavorites = async () => {
  const response = await api.get("/favorites");
  return response.data;
};

export const getFavoritesByType = async (type) => {
  const response = await api.get(`/favorites/${type}`);
  return response.data;
};

export const addToFavorites = async (favoriteData) => {
  const response = await api.post("/favorites", favoriteData);
  return response.data;
};

export const removeFromFavorites = async (favoriteId) => {
  const response = await api.delete(`/favorites/${favoriteId}`);
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

export const getAdminDashboardData = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

// Admin User Management
export const getUsers = async (page = 1, limit = 10) => {
  const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
  return response.data;
};

export const getUserDetails = async (userId) => {
  const response = await api.get(`/admin/users/${userId}`);
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await api.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

// Admin Announcement Management
export const getAnnouncements = async () => {
  const response = await api.get("/admin/announcements");
  return response.data;
};

export const addAnnouncement = async (announcementData) => {
  const response = await api.post("/admin/announcements", announcementData);
  return response.data;
};

export const updateAnnouncement = async (id, announcementData) => {
  const response = await api.put(
    `/admin/announcements/${id}`,
    announcementData
  );
  return response.data;
};

export const deleteAnnouncement = async (id) => {
  const response = await api.delete(`/admin/announcements/${id}`);
  return response.data;
};

// Admin Team Management
export const getTeams = async () => {
  const response = await api.get("/admin/teams");
  return response.data;
};

export const addTeamMember = async (teamData) => {
  // Create FormData for file uploads
  const formData = new FormData();

  // Add text fields
  Object.keys(teamData).forEach((key) => {
    if (key !== "photo") {
      if (typeof teamData[key] === "object") {
        formData.append(key, JSON.stringify(teamData[key]));
      } else {
        formData.append(key, teamData[key]);
      }
    }
  });

  // Add photo
  if (teamData.photo) {
    formData.append("media", teamData.photo);
  }

  const response = await api.post("/admin/teams", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateTeamMember = async (id, teamData) => {
  // Create FormData for file uploads
  const formData = new FormData();

  // Add text fields
  Object.keys(teamData).forEach((key) => {
    if (key !== "photo") {
      if (typeof teamData[key] === "object") {
        formData.append(key, JSON.stringify(teamData[key]));
      } else {
        formData.append(key, teamData[key]);
      }
    }
  });

  // Add photo
  if (teamData.photo && teamData.photo instanceof File) {
    formData.append("media", teamData.photo);
  }

  const response = await api.put(`/admin/teams/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteTeamMember = async (id) => {
  const response = await api.delete(`/admin/teams/${id}`);
  return response.data;
};

// Admin Inspection Management
export const getInspections = async () => {
  const response = await api.get("/admin/inspections");
  return response.data;
};

export const addInspection = async (inspectionData) => {
  const response = await api.post("/admin/inspections", inspectionData);
  return response.data;
};

export const updateInspection = async (id, inspectionData) => {
  const response = await api.put(`/admin/inspections/${id}`, inspectionData);
  return response.data;
};

export const deleteInspection = async (id) => {
  const response = await api.delete(`/admin/inspections/${id}`);
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
