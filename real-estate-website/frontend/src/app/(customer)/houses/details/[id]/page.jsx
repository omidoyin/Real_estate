"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "../../../../../context/ToastContext";
import {
  addToFavorites,
  removeFromFavorites,
} from "../../../../../utils/api";
import { isAuthenticated } from "../../../../../utils/auth";

// Function to fetch mock house details
async function fetchHouseDetailsFromAPI(id) {
  // In a real app, this would fetch from your API
  // For now, we'll return mock data based on the ID
  const houseDetails = {
    id: parseInt(id),
    title: id === "103" ? "Apartment for Rent" : `Modern House in Location ${id}`,
    description:
      "This beautiful property offers modern living spaces with high-quality finishes throughout. Featuring an open floor plan, abundant natural light, and premium fixtures, this home provides the perfect balance of comfort and style. The property is situated in a desirable neighborhood with easy access to schools, shopping, and recreational facilities.",
    price: id === "103" ? 1500 : 450000 + parseInt(id) * 50000,
    size: id === "103" ? "120 sqm" : "250 sqm",
    location: `City ${id}, State X`,
    bedrooms: id === "103" ? 2 : 3 + (parseInt(id) % 3),
    bathrooms: id === "103" ? 1 : 2 + (parseInt(id) % 2),
    status: id === "103" ? "for-rent" : "for-sale",
    rentPeriod: id === "103" ? "monthly" : null,
    features: [
      "Modern design",
      "Open floor plan",
      "High ceilings",
      "Energy-efficient appliances",
      "Smart home technology",
      "Hardwood floors",
      "Custom cabinetry",
      "Walk-in closets",
      "Private backyard",
      "Attached garage",
    ],
    images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
    yearBuilt: 2020 + (parseInt(id) % 3),
    propertyType: id === "103" ? "Apartment" : "Single Family Home",
    amenities: [
      "Swimming pool",
      "Fitness center",
      "Playground",
      "Clubhouse",
      "Tennis court",
      "Walking trails",
    ],
    nearbyPlaces: [
      "Shopping Mall (1.5km)",
      "Hospital (2.8km)",
      "School (1.2km)",
      "Park (0.5km)",
      "Restaurant District (3km)",
    ],
  };

  return houseDetails;
}

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
    setIsUserAuthenticated(isAuthenticated());

    // Fetch house details
    const getHouseData = async () => {
      try {
        setLoading(true);
        // In a real app, you would use the API call
        // const data = await getHouseDetails(params.id);

        // For now, use the mock function
        const data = await fetchHouseDetailsFromAPI(params.id);
        setHouse(data);

        // For demo purposes, randomly set as favorite
        setIsFavorite(Math.random() > 0.5);
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
        // In a real app, you would use the API call
        // await removeFromFavorites(house.id);
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
        setIsFavorite(false);
        showToast("Removed from favorites", "success");
      } else {
        // In a real app, you would use the API call
        // await addToFavorites(house.id);
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"></div>
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
          className="text-primary-blue hover:text-accent-green"
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
              {house.images[0] ? (
                <Image
                  src={house.images[0]}
                  alt={house.title}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              ) : (
                <div className="h-96 bg-gray-300"></div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {house.images.map((image, index) => (
                <div key={index} className="h-24 bg-gray-300 relative">
                  {image ? (
                    <Image
                      src={image}
                      alt={`Image ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div className="h-24 bg-gray-300"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Property Details</h2>
              <p className="text-gray-700 mb-6">{house.description}</p>

              <h3 className="text-xl font-bold mb-3">Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {house.features.map((feature, index) => (
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

              <h3 className="text-xl font-bold mb-3">Amenities</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {house.amenities.map((amenity, index) => (
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
                    {amenity}
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-bold mb-3">Nearby Places</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {house.nearbyPlaces.map((place, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-primary-blue mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {place}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="bg-light-blue p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Property Summary</h2>
                <div className="mb-4">
                  <p className="text-gray-600">
                    {house.status === "for-rent" ? "Rent" : "Price"}
                  </p>
                  <p className="text-2xl font-bold text-primary-blue">
                    ${house.price.toLocaleString()}
                    {house.status === "for-rent" && `/${house.rentPeriod}`}
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
                  {house.status === "for-rent" ? (
                    <Link
                      href={`/contact?property=${house.id}&type=rent`}
                      className="block w-full bg-accent-green text-white text-center py-3 rounded-lg hover:bg-green-600"
                    >
                      Inquire About Renting
                    </Link>
                  ) : (
                    <Link
                      href={`/houses/purchase/${house.id}`}
                      className="block w-full bg-accent-green text-white text-center py-3 rounded-lg hover:bg-green-600"
                    >
                      Purchase Now
                    </Link>
                  )}

                  <button
                    onClick={toggleFavorite}
                    disabled={isAddingToFavorites}
                    className={`block w-full border text-center py-3 rounded-lg transition-colors duration-200 ${
                      isFavorite
                        ? "bg-white border-primary-blue text-primary-blue hover:bg-light-blue"
                        : "bg-primary-blue text-white hover:bg-blue-700"
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
                    className="block w-full bg-white border border-primary-blue text-primary-blue text-center py-3 rounded-lg hover:bg-light-blue"
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
