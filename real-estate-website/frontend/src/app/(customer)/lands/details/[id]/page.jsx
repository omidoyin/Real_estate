"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getLandDetails,
  addToFavorites,
  removeFromFavorites,
} from "../../../../../utils/api";
import { isAuthenticated } from "../../../../../utils/auth";

// Function to fetch mock land details
async function fetchLandDetailsFromAPI(id) {
  // In a real app, this would fetch from your API
  // For now, we'll return mock data based on the ID
  const landDetails = {
    id: parseInt(id),
    title: `Premium Land in Location ${id}`,
    description:
      "This premium land property is located in a prime area with excellent investment potential. The property features easy access to major roads, proximity to essential amenities, and is situated in a rapidly developing region.",
    price: 250000 + parseInt(id) * 50000,
    size: "500 sqm",
    location: `City ${id}, State X`,
    features: [
      "Prime location",
      "Clear title",
      "Proximity to major roads",
      "Near essential amenities",
      "Rapidly developing area",
      "High appreciation potential",
    ],
    images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
    inspectionDates: [
      "June 15, 2023 - 10:00 AM",
      "June 22, 2023 - 2:00 PM",
      "June 29, 2023 - 11:00 AM",
    ],
    landmarks: [
      "Shopping Mall (2km)",
      "Hospital (3.5km)",
      "School (1.8km)",
      "Park (0.5km)",
    ],
  };

  return landDetails;
}

export default function LandDetails({ params }) {
  const [land, setLand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setIsUserAuthenticated(authStatus);
    };

    // Fetch land details
    const getLandData = async () => {
      try {
        setLoading(true);
        // In a real app, you would use the API call
        // const data = await getLandDetails(params.id);

        // For now, use the mock function
        const data = await fetchLandDetailsFromAPI(params.id);
        setLand(data);

        // Check if this land is in favorites (in a real app)
        // const favoritesResponse = await getFavoriteLands();
        // const isFav = favoritesResponse.some(fav => fav.id === parseInt(params.id));
        // setIsFavorite(isFav);

        // For demo purposes, randomly set as favorite
        setIsFavorite(Math.random() > 0.5);
      } catch (err) {
        console.error("Error fetching land details:", err);
        setError("Failed to load property details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    getLandData();
  }, [params.id]);

  const handleToggleFavorite = async () => {
    if (!isUserAuthenticated) {
      // Redirect to login or show login prompt
      alert("Please log in to add properties to favorites");
      return;
    }

    try {
      setIsAddingToFavorites(true);

      if (isFavorite) {
        // In a real app, you would call the API
        // await removeFromFavorites(params.id);

        // For demo purposes, just toggle the state
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
        setIsFavorite(false);
      } else {
        // In a real app, you would call the API
        // await addToFavorites(params.id);

        // For demo purposes, just toggle the state
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Error toggling favorite status:", err);
      alert("Failed to update favorites. Please try again.");
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"></div>
        </div>
      </div>
    );
  }

  if (error || !land) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 text-red-800 p-4 rounded-md">
          {error || "Failed to load property details. Please try again later."}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link
          href="/lands/available"
          className="text-primary-blue hover:text-accent-green"
        >
          ← Back to Available Lands
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{land.title}</h1>
          <p className="text-gray-600 mb-4">{land.location}</p>

          <div className="mb-8">
            <div className="h-96 bg-gray-300 mb-4 relative">
              {/* Main image placeholder */}
              <div className="h-96 bg-gray-300"></div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {land.images.map((image, index) => (
                <div key={index} className="h-24 bg-gray-300 relative">
                  {/* Thumbnail placeholder */}
                  <div className="h-24 bg-gray-300"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Property Details</h2>
              <p className="text-gray-700 mb-6">{land.description}</p>

              <h3 className="text-xl font-bold mb-3">Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {land.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-accent-green mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-bold mb-3">Nearby Landmarks</h3>
              <ul className="mb-6">
                {land.landmarks.map((landmark, index) => (
                  <li key={index} className="mb-1">
                    {landmark}
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-bold mb-3">Inspection Dates</h3>
              <ul className="mb-6">
                {land.inspectionDates.map((date, index) => (
                  <li key={index} className="mb-1">
                    {date}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="bg-light-blue p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Property Summary</h2>
                <div className="mb-4">
                  <p className="text-gray-600">Price</p>
                  <p className="text-2xl font-bold text-primary-blue">
                    ${land.price.toLocaleString()}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">Size</p>
                  <p className="text-xl font-bold">{land.size}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">Location</p>
                  <p className="text-xl">{land.location}</p>
                </div>

                <div className="mt-6 space-y-4">
                  <Link
                    href={`/lands/purchase/${land.id}`}
                    className="block w-full bg-accent-green text-white text-center py-3 rounded-lg hover:bg-green-600"
                  >
                    Purchase Now
                  </Link>

                  <button
                    onClick={handleToggleFavorite}
                    disabled={isAddingToFavorites}
                    className={`block w-full text-center py-3 rounded-lg border transition-colors ${
                      isFavorite
                        ? "bg-red-50 text-red-600 border-red-300 hover:bg-red-100"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    } ${
                      isAddingToFavorites ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <svg
                        className={`w-5 h-5 ${
                          isFavorite ? "text-red-500" : "text-gray-400"
                        } mr-2`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {isAddingToFavorites
                        ? "Processing..."
                        : isFavorite
                        ? "Remove from Favorites"
                        : "Add to Favorites"}
                    </div>
                  </button>

                  <Link
                    href="/book-inspection"
                    className="block w-full bg-primary-blue text-white text-center py-3 rounded-lg hover:bg-accent-green"
                  >
                    Book Inspection
                  </Link>

                  <Link
                    href="/contact"
                    className="block w-full bg-white text-primary-blue text-center py-3 rounded-lg border border-primary-blue hover:bg-light-blue"
                  >
                    Contact Agent
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
