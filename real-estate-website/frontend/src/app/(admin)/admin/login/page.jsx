"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/admin/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Invalid credentials');
      // }
      //
      // const data = await response.json();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, check if using admin credentials
      if (
        formData.email === "admin@example.com" &&
        formData.password === "admin123"
      ) {
        // Set admin token in cookies
        const adminToken = "admin-token-" + Date.now();
        localStorage.setItem("adminToken", adminToken);
        Cookies.set("adminToken", adminToken, { expires: 7, path: "/" });

        // Redirect to admin dashboard
        router.push("/admin/dashboard");
      } else {
        throw new Error("Invalid admin credentials");
      }
    } catch (error) {
      setError(error.message || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-gray-600 mt-2">
              Enter your credentials to access the admin panel
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                placeholder="admin@example.com"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-primary-blue text-white py-3 px-4 rounded-md hover:bg-accent-green transition-colors ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Demo credentials for testing */}
          <div className="mt-6 bg-gray-100 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Demo Admin Credentials
            </h3>
            <p className="text-xs text-gray-600">Email: admin@example.com</p>
            <p className="text-xs text-gray-600">Password: admin123</p>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-primary-blue hover:text-accent-green"
            >
              ← Back to Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
