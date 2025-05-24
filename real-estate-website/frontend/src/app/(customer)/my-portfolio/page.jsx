"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getMyLands } from "../../../utils/api";
import { isAuthenticated } from "../../../utils/auth";
import { useRouter } from "next/navigation";
import SortOptions from "../../../components/Shared/SortOptions";

export default function MyPortfolio() {
  const [properties, setProperties] = useState([]);
  const [displayedProperties, setDisplayedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("purchaseDateDesc");
  const router = useRouter();

  const sortOptions = [
    { value: "purchaseDateDesc", label: "Purchase Date: Newest First" },
    { value: "purchaseDateAsc", label: "Purchase Date: Oldest First" },
    { value: "priceAsc", label: "Price: Low to High" },
    { value: "priceDesc", label: "Price: High to Low" },
    { value: "titleAsc", label: "Title: A-Z" },
    { value: "titleDesc", label: "Title: Z-A" },
    { value: "paymentStatus", label: "Payment Status" },
  ];

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }

    // Fetch purchased properties
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // In a real app, this would fetch from your API
        // const data = await getMyLands();

        // For demo purposes, use mock data
        const data = [
          {
            id: 1,
            title: "Premium Land in Location A",
            location: "City A, State X",
            purchasePrice: 250000,
            size: "500 sqm",
            image: "/placeholder.jpg",
            purchaseDate: "2023-05-15",
            paymentStatus: "Completed",
          },
          {
            id: 2,
            title: "Exclusive Land in Location B",
            location: "City B, State Y",
            purchasePrice: 180000,
            size: "450 sqm",
            image: "/placeholder.jpg",
            purchaseDate: "2023-04-10",
            paymentStatus: "In Progress",
          },
          {
            id: 3,
            title: "Strategic Land in Location C",
            location: "City C, State Z",
            purchasePrice: 320000,
            size: "600 sqm",
            image: "/placeholder.jpg",
            purchaseDate: "2023-06-05",
            paymentStatus: "Completed",
          },
        ];

        setProperties(data);
        setDisplayedProperties(sortProperties(data, sortOption));
      } catch (err) {
        console.error("Error fetching portfolio:", err);
        setError("Failed to load your properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [router]);

  // Apply sorting whenever sort option changes
  useEffect(() => {
    if (properties.length > 0) {
      setDisplayedProperties(sortProperties(properties, sortOption));
    }
  }, [sortOption, properties]);

  const sortProperties = (items, sortBy) => {
    const sortedItems = [...items];

    switch (sortBy) {
      case "purchaseDateDesc":
        return sortedItems.sort(
          (a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)
        );
      case "purchaseDateAsc":
        return sortedItems.sort(
          (a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate)
        );
      case "priceAsc":
        return sortedItems.sort((a, b) => a.purchasePrice - b.purchasePrice);
      case "priceDesc":
        return sortedItems.sort((a, b) => b.purchasePrice - a.purchasePrice);
      case "titleAsc":
        return sortedItems.sort((a, b) => a.title.localeCompare(b.title));
      case "titleDesc":
        return sortedItems.sort((a, b) => b.title.localeCompare(a.title));
      case "paymentStatus":
        return sortedItems.sort((a, b) => {
          // Sort completed first, then in progress
          if (
            a.paymentStatus === "Completed" &&
            b.paymentStatus !== "Completed"
          )
            return -1;
          if (
            a.paymentStatus !== "Completed" &&
            b.paymentStatus === "Completed"
          )
            return 1;
          return 0;
        });
      default:
        return sortedItems;
    }
  };

  const handleSortChange = (newSortOption) => {
    setSortOption(newSortOption);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Property Portfolio</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Property Portfolio</h1>
        <div className="bg-red-100 text-red-800 p-4 rounded-md">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Property Portfolio</h1>

      {properties.length === 0 ? (
        <div className="bg-card-bg p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">
            You don't have any properties in your portfolio yet.
          </h2>
          <p className="mb-6">
            Browse our available properties and make a purchase to start
            building your portfolio.
          </p>
          <Link
            href="/lands/available"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover"
          >
            Browse Available Properties
          </Link>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {displayedProperties.length}{" "}
              {displayedProperties.length === 1 ? "property" : "properties"} in
              your portfolio
            </p>
            <SortOptions
              onSortChange={handleSortChange}
              options={sortOptions}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayedProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative h-48">
                  {property.image ? (
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div className="h-48 bg-gray-300"></div>
                  )}
                  <div className="absolute top-2 left-2 bg-primary-text text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Owned
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 mb-2">{property.location}</p>
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium text-gray-700 mr-2">
                        Purchase Date:
                      </span>
                      {new Date(property.purchaseDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium text-gray-700 mr-2">
                        Purchase Price:
                      </span>
                      ${property.purchasePrice?.toLocaleString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium text-gray-700 mr-2">
                        Status:
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          property.paymentStatus === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {property.paymentStatus || "In Progress"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/lands/details/${property.id}`}
                      className="text-primary hover:underline"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/dashboard/payment-plan`}
                      className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover"
                    >
                      Payment Plan
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Portfolio Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card-bg p-4 rounded-lg">
                <p className="text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold">{properties.length}</p>
              </div>
              <div className="bg-card-bg p-4 rounded-lg">
                <p className="text-gray-600">Total Investment</p>
                <p className="text-2xl font-bold">
                  $
                  {properties
                    .reduce(
                      (total, property) =>
                        total + (property.purchasePrice || 0),
                      0
                    )
                    .toLocaleString()}
                </p>
              </div>
              <div className="bg-card-bg p-4 rounded-lg">
                <p className="text-gray-600">Fully Paid Properties</p>
                <p className="text-2xl font-bold">
                  {
                    properties.filter(
                      (property) => property.paymentStatus === "Completed"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
