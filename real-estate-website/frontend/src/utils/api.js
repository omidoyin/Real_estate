import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Adjust the URL as needed

// User Authentication
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/auth/forgot-password`, {
    email,
  });
  return response.data;
};

// Lands
export const getAvailableLands = async () => {
  const response = await axios.get(`${API_URL}/lands`);
  return response.data;
};

export const getLandDetails = async (landId) => {
  const response = await axios.get(`${API_URL}/lands/${landId}`);
  return response.data;
};

// Add New Land
export const addLand = async (landData) => {
  const response = await axios.post(`${API_URL}/lands`, landData);
  return response.data;
};

// Edit Land
export const editLand = async (landId, landData) => {
  const response = await axios.put(`${API_URL}/lands/${landId}`, landData);
  return response.data;
};

// Delete Land
export const deleteLand = async (landId) => {
  const response = await axios.delete(`${API_URL}/lands/${landId}`);
  return response.data;
};

// Fetch My Lands
export const getMyLands = async () => {
  const response = await axios.get(`${API_URL}/lands/my-lands`);
  return response.data;
};

// Payments
export const getPaymentHistory = async (userId) => {
  const response = await axios.get(`${API_URL}/payments/history/${userId}`);
  return response.data;
};

export const addPayment = async (paymentData) => {
  const response = await axios.post(`${API_URL}/payments`, paymentData);
  return response.data;
};

// Fetch Payment Plan
export const getPaymentPlan = async () => {
  const response = await axios.get(`${API_URL}/payments/plan`);
  return response.data;
};

// Fetch Payments
export const getPayments = async () => {
  const response = await axios.get(`${API_URL}/payments`);
  return response.data;
};

// Fetch Admin Stats
export const getAdminStats = async () => {
  const response = await axios.get(`${API_URL}/admin/stats`);
  return response.data;
};

// Set up axios interceptors for JWT token
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const getUserProfile = async (userId) => {
  const response = await axios.get(`${API_URL}/users/${userId}`);
  return response.data;
};

// Mark Payment as Completed
export const markPaymentCompleted = async (paymentId) => {
  const response = await axios.put(`${API_URL}/payments/${paymentId}/complete`);
  return response.data;
};
