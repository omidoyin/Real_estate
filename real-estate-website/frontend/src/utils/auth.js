"use client";

import {
  loginUser as apiLoginUser,
  registerUser as apiRegisterUser,
} from "./api";
import Cookies from "js-cookie";

// Set token in both localStorage and cookies
export const setToken = (token) => {
  if (typeof window !== "undefined") {
    // Set in localStorage for backward compatibility
    localStorage.setItem("token", token);

    // Set in cookies for middleware
    Cookies.set("token", token, { expires: 7, path: "/" }); // Expires in 7 days
  }
};

// Remove token from both localStorage and cookies
export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    Cookies.remove("token", { path: "/" });
  }
};

// Register user
export const registerUser = async (userData) => {
  try {
    const data = await apiRegisterUser(userData);
    return data;
  } catch (error) {
    throw error;
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const data = await apiLoginUser(credentials);
    if (data.token) {
      setToken(data.token);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logoutUser = () => {
  removeToken();
  // Navigation should be handled by the component using this function
};

// Check if user is authenticated
export const isAuthenticated = () => {
  if (typeof window !== "undefined") {
    return !!Cookies.get("token");
  }
  return false;
};

// Get token
export const getToken = () => {
  if (typeof window !== "undefined") {
    return Cookies.get("token");
  }
  return null;
};

// Admin authentication
export const setAdminToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("adminToken", token);
    Cookies.set("adminToken", token, { expires: 7, path: "/" });
  }
};

export const removeAdminToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("adminToken");
    Cookies.remove("adminToken", { path: "/" });
  }
};

export const isAdminAuthenticated = () => {
  if (typeof window !== "undefined") {
    return !!Cookies.get("adminToken");
  }
  return false;
};
