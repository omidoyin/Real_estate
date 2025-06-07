"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchFilters from "../../../components/Lands/SearchFilters";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import { useToast } from "../../../hooks/useToast";
import { useRouter, useSearchParams } from "next/navigation";
import { getPortfolioPageData } from "../../../utils/api";
import { safeImageUrl } from "../../../utils/dataHelpers";

// Function to fetch data based on service type with server-side pagination and filtering
async function fetchDataFromAPI(serviceType, filters, page = 1, limit = 6) {
  try {
    // Call the API to get data
    const response = await getPortfolioPageData(
      serviceType,
      filters,
      page,
      limit
    );

    // Process the response data
    const items = response.data || [];

    // Format the data to match the expected structure
    const formattedData = items.map((item) => {
      // Ensure each item has an id property (use _id from MongoDB)
      const id = item._id || item.id;

      // Get the first image using safeImageUrl helper
      const image = safeImageUrl(item.images, 0);

      // Return formatted item with consistent properties
      return {
        ...item,
        id,
        image,
        // Add type property for rendering logic
        type:
          serviceType === "lands"
            ? "land"
            : serviceType === "houses" || serviceType === "apartments"
            ? "house"
            : "service",
      };
    });

    return {
      data: formattedData,
      pagination: response.pagination || {
        total: items.length,
        page,
        limit,
        totalPages: Math.ceil(items.length / limit),
      },
    };
  } catch (error) {
    console.error(`Error fetching ${serviceType} data:`, error);
    throw error;
  }
}

export default function Portfolio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  // Get current page and service type from URL or default values
  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentServiceType = searchParams.get("service") || "lands";

  const [serviceType, setServiceType] = useState(currentServiceType);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: currentPage,
    limit: 6,
    totalPages: 0,
  });

  const [activeFilters, setActiveFilters] = useState({
    search: searchParams.get("search") || "",
    priceRange: [
      parseInt(searchParams.get("minPrice") || "0"),
      parseInt(searchParams.get("maxPrice") || "1000000"),
    ],
    size: searchParams.get("size") || "any",
    location: searchParams.get("location") || "any",
    sortBy: searchParams.get("sortBy") || "newest",
  });

  // Fetch data when filters, page, or service type changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch data from API with server-side pagination and filtering
        const result = await fetchDataFromAPI(
          serviceType,
          activeFilters,
          pagination.page,
          pagination.limit
        );

        setData(result.data);
        setPagination(result.pagination);
      } catch (err) {
        console.error(`Error fetching ${serviceType} data:`, err);
        setError(`Failed to load ${serviceType} data. Please try again later.`);
        showToast(
          `Failed to load ${serviceType} data. Please try again.`,
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    activeFilters,
    pagination.page,
    pagination.limit,
    serviceType,
    showToast,
  ]);

  // Update URL when filters or service type changes
  useEffect(() => {
    // Build query parameters
    const params = new URLSearchParams();

    params.append("service", serviceType);

    if (pagination.page > 1) {
      params.append("page", pagination.page.toString());
    }

    if (activeFilters.search) {
      params.append("search", activeFilters.search);
    }

    if (activeFilters.priceRange[0] > 0) {
      params.append("minPrice", activeFilters.priceRange[0].toString());
    }

    if (activeFilters.priceRange[1] < 1000000) {
      params.append("maxPrice", activeFilters.priceRange[1].toString());
    }

    if (activeFilters.size !== "any") {
      params.append("size", activeFilters.size);
    }

    if (activeFilters.location !== "any") {
      params.append("location", activeFilters.location);
    }

    if (activeFilters.sortBy !== "newest") {
      params.append("sortBy", activeFilters.sortBy);
    }

    // Update URL without refreshing the page
    const queryString = params.toString();
    const url = queryString ? `?${queryString}` : "";

    router.replace(`/portfolio${url}`, { scroll: false });
  }, [activeFilters, pagination.page, router, serviceType]);

  const handleFilterChange = (newFilters) => {
    // Reset to page 1 when filters change
    setPagination((prev) => ({ ...prev, page: 1 }));
    setActiveFilters(newFilters);
    showToast("Filters applied", "info");
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;

    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });

    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleServiceChange = (newServiceType) => {
    setServiceType(newServiceType);
    setPagination((prev) => ({ ...prev, page: 1 }));
    showToast(
      `Switched to ${newServiceType.replace(/([A-Z])/g, " $1").trim()}`,
      "info"
    );
  };

  // Get the title based on service type
  const getServiceTitle = () => {
    switch (serviceType) {
      case "lands":
        return "Land Properties";
      case "houses":
        return "Houses & Apartments";
      case "estateManagement":
        return "Estate Management Services";
      case "architecturalDesign":
        return "Architectural Design Services";
      case "landSurvey":
        return "Land Survey Services";
      case "generalContracts":
        return "General Contracting Services";
      default:
        return "Portfolio";
    }
  };

  // Get the description based on service type
  const getServiceDescription = () => {
    switch (serviceType) {
      case "lands":
        return "Browse our selection of premium land properties in prime locations. Each property has been carefully selected for its investment potential and strategic location.";
      case "houses":
        return "Explore our collection of houses and apartments available for sale or rent. From cozy apartments to luxury villas, find your perfect home.";
      case "estateManagement":
        return "Our professional estate management services ensure your property is well-maintained and optimized for maximum returns.";
      case "architecturalDesign":
        return "Our architectural design services combine creativity with functionality to create spaces that inspire and endure.";
      case "landSurvey":
        return "Our land survey services provide accurate measurements and detailed mapping for all your property needs.";
      case "generalContracts":
        return "From construction to renovation, our general contracting services deliver quality results for projects of all sizes.";
      default:
        return "Browse our comprehensive portfolio of services and properties.";
    }
  };

  // Render different content based on service type
  const renderServiceContent = () => {
    if (loading) {
      return <LoadingSpinner text={`Loading ${serviceType} data...`} />;
    }

    if (error) {
      return (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-8">
          {error}
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="bg-card-bg p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">
            No items match your search criteria
          </h2>
          <p className="mb-6">
            Try adjusting your filters or search terms to find more results.
          </p>
        </div>
      );
    }

    // Render properties (lands, houses, and apartments)
    if (
      serviceType === "lands" ||
      serviceType === "houses" ||
      serviceType === "apartments"
    ) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 relative">
                <Image
                  src={safeImageUrl(item.image)}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  priority={pagination.page === 1 && item.id <= 3}
                  loading={
                    pagination.page === 1 && item.id <= 3 ? "eager" : "lazy"
                  }
                  className="rounded-t-lg"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <div className="mb-4">
                  <p className="text-gray-600">{item.location}</p>
                  <p className="text-gray-600">Size: {item.size}</p>
                  {(serviceType === "houses" ||
                    serviceType === "apartments") && (
                    <>
                      <p className="text-gray-600">Bedrooms: {item.bedrooms}</p>
                      <p className="text-gray-600">
                        Bathrooms: {item.bathrooms}
                      </p>
                      {(item.status === "for-rent" ||
                        item.status === "For Rent") && (
                        <p className="text-gray-600">
                          Rent: ${item.rentPrice || item.price}/
                          {item.rentPeriod || "month"}
                        </p>
                      )}
                    </>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold">
                    {item.status === "for-rent" || item.status === "For Rent"
                      ? `$${item.rentPrice || item.price || 0}/${
                          item.rentPeriod || "month"
                        }`
                      : `$${item.price ? item.price.toLocaleString() : "0"}`}
                  </span>
                  <Link
                    href={`/${
                      serviceType === "apartments" ? "houses" : serviceType
                    }/details/${item.id}`}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition-colors duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Render service cards (estate management, architectural design, land survey, general contracts)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="h-48 relative">
              <Image
                src={safeImageUrl(item.image)}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
                priority={pagination.page === 1 && item.id <= 3}
                loading={
                  pagination.page === 1 && item.id <= 3 ? "eager" : "lazy"
                }
                className="rounded-t-lg"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>

              {/* Display specific fields based on service type */}
              {serviceType === "estateManagement" && (
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Property Type:</span>{" "}
                  {item.propertyType}
                </p>
              )}

              {serviceType === "architecturalDesign" && (
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Category:</span>{" "}
                  {item.category}
                </p>
              )}

              {serviceType === "landSurvey" && (
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Survey Type:</span>{" "}
                  {item.surveyType}
                </p>
              )}

              {serviceType === "generalContracts" && (
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Contract Type:</span>{" "}
                  {item.contractType}
                </p>
              )}

              <div className="mt-4">
                <Link
                  href={`/services/${
                    serviceType === "estateManagement"
                      ? "estate-management"
                      : serviceType === "architecturalDesign"
                      ? "architectural-design"
                      : serviceType === "landSurvey"
                      ? "land-survey"
                      : "general-contracts"
                  }/${item.id}`}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition-colors duration-200 inline-block"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Portfolio</h1>

      <div className="mb-8">
        <p className="text-center text-gray-700 max-w-3xl mx-auto">
          {getServiceDescription()}
        </p>
      </div>

      {/* Service Type Selector */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center">Our Services</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => handleServiceChange("lands")}
            className={`px-4 py-2 rounded-md ${
              serviceType === "lands"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Land Properties
          </button>
          <button
            onClick={() => handleServiceChange("houses")}
            className={`px-4 py-2 rounded-md ${
              serviceType === "houses"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Houses & Apartments
          </button>
          <button
            onClick={() => handleServiceChange("estateManagement")}
            className={`px-4 py-2 rounded-md ${
              serviceType === "estateManagement"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Estate Management
          </button>
          <button
            onClick={() => handleServiceChange("architecturalDesign")}
            className={`px-4 py-2 rounded-md ${
              serviceType === "architecturalDesign"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Architectural Design
          </button>
          <button
            onClick={() => handleServiceChange("landSurvey")}
            className={`px-4 py-2 rounded-md ${
              serviceType === "landSurvey"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Land Survey
          </button>
          <button
            onClick={() => handleServiceChange("generalContracts")}
            className={`px-4 py-2 rounded-md ${
              serviceType === "generalContracts"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            General Contracts
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center">
        {getServiceTitle()}
      </h2>

      {/* Search and Filter Component - Only show for properties */}
      {(serviceType === "lands" ||
        serviceType === "houses" ||
        serviceType === "apartments") && (
        <SearchFilters
          onFilterChange={handleFilterChange}
          initialFilters={activeFilters}
        />
      )}

      {/* Results Summary */}
      {!loading && !error && data.length > 0 && (
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {data.length} of {pagination.total}{" "}
            {pagination.total === 1 ? "item" : "items"}
            {activeFilters.search && ` matching "${activeFilters.search}"`}
          </p>

          {(serviceType === "lands" ||
            serviceType === "houses" ||
            serviceType === "apartments") && (
            <button
              onClick={() => {
                const defaultFilters = {
                  search: "",
                  priceRange: [0, 1000000],
                  size: "any",
                  location: "any",
                  sortBy: "newest",
                };
                setActiveFilters(defaultFilters);
                handleFilterChange(defaultFilters);
              }}
              className="text-primary hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Service Content */}
      {renderServiceContent()}

      {/* Pagination */}
      {!loading && !error && data.length > 0 && pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`px-4 py-2 border border-gray-300 rounded-l-md ${
                pagination.page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>

            {/* Generate page buttons */}
            {[...Array(pagination.totalPages).keys()].map((i) => {
              const pageNumber = i + 1;
              // Show current page, first page, last page, and pages around current page
              if (
                pageNumber === 1 ||
                pageNumber === pagination.totalPages ||
                (pageNumber >= pagination.page - 1 &&
                  pageNumber <= pagination.page + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-4 py-2 border-t border-b border-r border-gray-300 ${
                      pageNumber === pagination.page
                        ? "bg-primary text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              }

              // Show ellipsis for skipped pages
              if (
                (pageNumber === 2 && pagination.page > 3) ||
                (pageNumber === pagination.totalPages - 1 &&
                  pagination.page < pagination.totalPages - 2)
              ) {
                return (
                  <span
                    key={pageNumber}
                    className="px-4 py-2 border-t border-b border-r border-gray-300 bg-white text-gray-700"
                  >
                    ...
                  </span>
                );
              }

              return null;
            })}

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className={`px-4 py-2 border-t border-b border-r border-gray-300 rounded-r-md ${
                pagination.page === pagination.totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Looking for Something Specific?
        </h2>
        <p className="text-gray-700 mb-6">
          Contact our team to discuss your requirements and we'll help you find
          the perfect solution for your needs.
        </p>
        <Link
          href="/contact"
          className="bg-primary text-white px-6 py-3 rounded-lg text-lg hover:bg-primary-hover"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
