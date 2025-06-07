"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "../../../../../hooks/useToast";
import {
  getHouseDetails,
  addHouseToFavorites,
  removeHouseFromFavorites,
  getFavoriteHouses,
} from "../../../../../utils/api";
import { isAuthenticated } from "../../../../../utils/auth";
import {
  safeFeatureText,
  safeLandmarkData,
  safeImageUrl,
  safePropertyId,
  sanitizePropertyData,
} from "../../../../../utils/dataHelpers";

export default function HouseDetails({ params }) {
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = isAuthenticated();
    setIsUserAuthenticated(authStatus);

    // Fetch house details
    const getHouseData = async () => {
      try {
        setLoading(true);
        // Get house details from API
        const response = await getHouseDetails(params.id);
        setHouse(sanitizePropertyData(response.data));

        // Check if this house is in favorites (only if user is authenticated)
        if (authStatus) {
          try {
            const favoritesResponse = await getFavoriteHouses();
            const isFav = favoritesResponse.data.some(
              (fav) => fav._id === params.id
            );
            setIsFavorite(isFav);
          } catch (favError) {
            console.error("Error checking favorites:", favError);
            // Non-critical error, don't show toast
          }
        }
      } catch (err) {
        console.error("Error fetching house details:", err);
        setError("Failed to load property details. Please try again later.");
        showToast("Failed to load property details", "error");
      } finally {
        setLoading(false);
      }
    };

    getHouseData();
  }, [params.id, showToast]);

  // Toggle favorite status
  const toggleFavorite = async () => {
    if (!isUserAuthenticated) {
      showToast("Please log in to add properties to favorites", "warning");
      return;
    }

    try {
      setIsAddingToFavorites(true);
      if (isFavorite) {
        // Call the API to remove from favorites
        await removeHouseFromFavorites(params.id);
        setIsFavorite(false);
        showToast("Removed from favorites", "success");
      } else {
        // Call the API to add to favorites
        await addHouseToFavorites(params.id);
        setIsFavorite(true);
        showToast("Added to favorites", "success");
      }
    } catch (err) {
      console.error("Error updating favorites:", err);
      showToast("Failed to update favorites", "error");
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !house) {
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
          href="/portfolio?service=houses"
          className="text-primary hover:text-primary-text"
        >
          ← Back to Houses & Apartments
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{house.title}</h1>
          <p className="text-gray-600 mb-4">{house.location}</p>

          <div className="mb-8">
            <div className="h-96 bg-gray-300 mb-4 relative">
              {house.images && house.images.length > 0 ? (
                <Image
                  src={safeImageUrl(house.images, 0)}
                  alt={house.title}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                  className="rounded-lg"
                />
              ) : (
                <div className="h-96 bg-gray-300 flex items-center justify-center rounded-lg">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>

            {house.images && house.images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {house.images.slice(1).map((image, index) => (
                  <div key={index} className="h-24 bg-gray-300 relative">
                    <Image
                      src={safeImageUrl(image)}
                      alt={`${house.title} - Image ${index + 2}`}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-md"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Property Details</h2>
              <p className="text-gray-700 mb-6">{house.description}</p>

              {house.features && house.features.length > 0 && (
                <>
                  <h3 className="text-xl font-bold mb-3">Features</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                    {house.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg
                          className="w-5 h-5 text-primary-text mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {safeFeatureText(feature)}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Additional Property Information */}
              {(house.garage || house.hasGarden || house.hasPool) && (
                <>
                  <h3 className="text-xl font-bold mb-3">Property Amenities</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                    {house.garage && (
                      <li className="flex items-center">
                        <svg
                          className="w-5 h-5 text-primary-text mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Garage{" "}
                        {house.garageCapacity > 0 &&
                          `(${house.garageCapacity} cars)`}
                      </li>
                    )}
                    {house.hasGarden && (
                      <li className="flex items-center">
                        <svg
                          className="w-5 h-5 text-primary-text mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Garden
                      </li>
                    )}
                    {house.hasPool && (
                      <li className="flex items-center">
                        <svg
                          className="w-5 h-5 text-primary-text mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Swimming Pool
                      </li>
                    )}
                  </ul>
                </>
              )}

              {house.landmarks && house.landmarks.length > 0 && (
                <>
                  <h3 className="text-xl font-bold mb-3">Nearby Landmarks</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                    {house.landmarks.map((landmark, index) => {
                      const landmarkData = safeLandmarkData(landmark);

                      return (
                        <li
                          key={landmarkData.id || index}
                          className="flex items-center"
                        >
                          <svg
                            className="w-5 h-5 text-primary mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {landmarkData.name}
                          {landmarkData.distance &&
                            ` - ${landmarkData.distance}`}
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </div>

            <div>
              <div className="bg-card-bg p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Property Summary</h2>
                <div className="mb-4">
                  <p className="text-gray-600">
                    {house.status === "For Rent" ? "Rent" : "Price"}
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    $
                    {(house.status === "For Rent"
                      ? house.rentPrice || house.price
                      : house.price
                    ).toLocaleString()}
                    {house.status === "For Rent" &&
                      house.rentPeriod &&
                      `/${house.rentPeriod}`}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">Property Type</p>
                  <p className="text-xl font-bold">{house.propertyType}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">Size</p>
                  <p className="text-xl font-bold">{house.size}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">Bedrooms</p>
                  <p className="text-xl font-bold">{house.bedrooms}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">Bathrooms</p>
                  <p className="text-xl font-bold">{house.bathrooms}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">Year Built</p>
                  <p className="text-xl font-bold">{house.yearBuilt}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">Location</p>
                  <p className="text-xl">{house.location}</p>
                </div>

                <div className="mt-6 space-y-4">
                  {house.status === "For Rent" ? (
                    <Link
                      href={`/contact?property=${
                        house._id || house.id
                      }&type=rent`}
                      className="block w-full bg-primary-text text-white text-center py-3 rounded-lg hover:bg-green-600"
                    >
                      Inquire About Renting
                    </Link>
                  ) : (
                    <Link
                      href={`/houses/purchase/${house._id || house.id}`}
                      className="block w-full bg-primary-text text-white text-center py-3 rounded-lg hover:bg-green-600"
                    >
                      Purchase Now
                    </Link>
                  )}

                  <button
                    onClick={toggleFavorite}
                    disabled={isAddingToFavorites}
                    className={`block w-full border text-center py-3 rounded-lg transition-colors duration-200 ${
                      isFavorite
                        ? "bg-white border-primary text-primary hover:bg-card-bg"
                        : "bg-primary text-white hover:bg-blue-700"
                    }`}
                  >
                    {isAddingToFavorites ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : isFavorite ? (
                      "Remove from Favorites"
                    ) : (
                      "Add to Favorites"
                    )}
                  </button>

                  <Link
                    href="/contact"
                    className="block w-full bg-white border border-primary text-primary text-center py-3 rounded-lg hover:bg-card-bg"
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
