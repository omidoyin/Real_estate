"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchFilters from "../../../components/Lands/SearchFilters";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import { useToast } from "../../../context/ToastContext";
import { useRouter, useSearchParams } from "next/navigation";

// Mock data for different service types
const mockServiceData = {
  lands: [
    {
      id: 1,
      title: "Premium Land in Location A",
      description: "Prime location with excellent investment potential",
      price: 250000,
      location: "City A",
      size: "500 sqm",
      image: "/placeholder.jpg",
      type: "land",
    },
    {
      id: 2,
      title: "Exclusive Land in Location B",
      description: "Scenic views with modern amenities nearby",
      price: 180000,
      location: "City B",
      size: "400 sqm",
      image: "/placeholder.jpg",
      type: "land",
    },
    {
      id: 3,
      title: "Strategic Land in Location C",
      description: "Perfect for commercial development",
      price: 320000,
      location: "City C",
      size: "800 sqm",
      image: "/placeholder.jpg",
      type: "land",
    },
  ],
  houses: [
    {
      id: 101,
      title: "Modern 3-Bedroom House",
      description: "Newly built house with modern amenities",
      price: 450000,
      location: "City A",
      size: "250 sqm",
      bedrooms: 3,
      bathrooms: 2,
      image: "/placeholder.jpg",
      type: "house",
      status: "for-sale",
    },
    {
      id: 102,
      title: "Luxury Villa with Pool",
      description: "Spacious villa with private pool and garden",
      price: 750000,
      location: "City B",
      size: "400 sqm",
      bedrooms: 5,
      bathrooms: 4,
      image: "/placeholder.jpg",
      type: "house",
      status: "for-sale",
    },
    {
      id: 103,
      title: "Apartment for Rent",
      description: "Modern apartment in the city center",
      price: 1500,
      location: "City C",
      size: "120 sqm",
      bedrooms: 2,
      bathrooms: 1,
      image: "/placeholder.jpg",
      type: "house",
      status: "for-rent",
      rentPeriod: "monthly",
    },
  ],
  estateManagement: [
    {
      id: 201,
      title: "Commercial Complex Management",
      description: "Full-service management for commercial properties",
      location: "City A",
      propertyType: "Commercial",
      image: "/placeholder.jpg",
    },
    {
      id: 202,
      title: "Residential Estate Management",
      description: "Comprehensive management services for residential estates",
      location: "City B",
      propertyType: "Residential",
      image: "/placeholder.jpg",
    },
    {
      id: 203,
      title: "Mixed-Use Property Management",
      description: "Specialized management for mixed-use developments",
      location: "City C",
      propertyType: "Mixed-Use",
      image: "/placeholder.jpg",
    },
  ],
  architecturalDesign: [
    {
      id: 301,
      title: "Modern Residential Design",
      description: "Contemporary design solutions for residential properties",
      image: "/placeholder.jpg",
      category: "Residential",
    },
    {
      id: 302,
      title: "Commercial Space Planning",
      description: "Functional and aesthetic design for commercial spaces",
      image: "/placeholder.jpg",
      category: "Commercial",
    },
    {
      id: 303,
      title: "Sustainable Architecture",
      description: "Eco-friendly design solutions for modern buildings",
      image: "/placeholder.jpg",
      category: "Sustainable",
    },
  ],
  landSurvey: [
    {
      id: 401,
      title: "Boundary Survey",
      description: "Accurate determination of property boundaries",
      image: "/placeholder.jpg",
      surveyType: "Boundary",
    },
    {
      id: 402,
      title: "Topographic Survey",
      description: "Detailed mapping of land features and elevations",
      image: "/placeholder.jpg",
      surveyType: "Topographic",
    },
    {
      id: 403,
      title: "Construction Survey",
      description: "Precise measurements for construction projects",
      image: "/placeholder.jpg",
      surveyType: "Construction",
    },
  ],
  generalContracts: [
    {
      id: 501,
      title: "Residential Construction",
      description: "Complete construction services for residential properties",
      image: "/placeholder.jpg",
      contractType: "Residential",
    },
    {
      id: 502,
      title: "Commercial Development",
      description: "End-to-end development services for commercial projects",
      image: "/placeholder.jpg",
      contractType: "Commercial",
    },
    {
      id: 503,
      title: "Renovation Projects",
      description: "Expert renovation services for all property types",
      image: "/placeholder.jpg",
      contractType: "Renovation",
    },
  ],
};

// Function to fetch data based on service type with server-side pagination and filtering
async function fetchDataFromAPI(serviceType, filters, page = 1, limit = 6) {
  try {
    // In a real app, this would fetch from your API
    // For now, we'll return mock data

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let data = mockServiceData[serviceType] || [];

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      data = data.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          (item.location && item.location.toLowerCase().includes(searchLower))
      );
    }

    if (
      filters.priceRange &&
      filters.priceRange.length === 2 &&
      "price" in (data[0] || {})
    ) {
      data = data.filter(
        (item) =>
          item.price >= filters.priceRange[0] &&
          item.price <= filters.priceRange[1]
      );
    }

    if (filters.size && filters.size !== "any" && "size" in (data[0] || {})) {
      // This is simplified - in a real app you'd have more sophisticated size filtering
      data = data.filter((item) => {
        if (filters.size === "small")
          return item.size.includes("120") || item.size.includes("250");
        if (filters.size === "medium")
          return item.size.includes("300") || item.size.includes("400");
        if (filters.size === "large")
          return item.size.includes("500") || item.size.includes("600");
        if (filters.size === "xlarge")
          return item.size.includes("800") || parseInt(item.size) > 800;
        return true;
      });
    }

    if (
      filters.location &&
      filters.location !== "any" &&
      "location" in (data[0] || {})
    ) {
      data = data.filter((item) => item.location === filters.location);
    }

    // Apply sorting
    if (filters.sortBy) {
      data = [...data].sort((a, b) => {
        if (filters.sortBy === "newest") return b.id - a.id;
        if (filters.sortBy === "priceAsc" && "price" in a)
          return a.price - b.price;
        if (filters.sortBy === "priceDesc" && "price" in a)
          return b.price - a.price;
        if (filters.sortBy === "sizeAsc" && "size" in a) {
          return parseInt(a.size) - parseInt(b.size);
        }
        if (filters.sortBy === "sizeDesc" && "size" in a) {
          return parseInt(b.size) - parseInt(a.size);
        }
        return 0;
      });
    }

    // Calculate pagination
    const total = data.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = data.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        total,
        page,
        limit,
        totalPages,
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
        <div className="bg-light-blue p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">
            No items match your search criteria
          </h2>
          <p className="mb-6">
            Try adjusting your filters or search terms to find more results.
          </p>
        </div>
      );
    }

    // Render properties (lands and houses)
    if (serviceType === "lands" || serviceType === "houses") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 relative">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                    priority={pagination.page === 1 && item.id <= 3}
                    loading={
                      pagination.page === 1 && item.id <= 3 ? "eager" : "lazy"
                    }
                  />
                ) : (
                  <div className="h-48 bg-gray-300"></div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <div className="mb-4">
                  <p className="text-gray-600">{item.location}</p>
                  <p className="text-gray-600">Size: {item.size}</p>
                  {serviceType === "houses" && (
                    <>
                      <p className="text-gray-600">Bedrooms: {item.bedrooms}</p>
                      <p className="text-gray-600">
                        Bathrooms: {item.bathrooms}
                      </p>
                      {item.status === "for-rent" && (
                        <p className="text-gray-600">
                          Rent: ${item.price}/{item.rentPeriod}
                        </p>
                      )}
                    </>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-blue font-bold">
                    {item.status === "for-rent"
                      ? `$${item.price || 0}/${item.rentPeriod || "month"}`
                      : `$${item.price ? item.price.toLocaleString() : "0"}`}
                  </span>
                  <Link
                    href={`/${serviceType}/details/${item.id}`}
                    className="bg-primary-blue text-white px-4 py-2 rounded hover:bg-accent-green transition-colors duration-200"
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
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  priority={pagination.page === 1 && item.id <= 3}
                  loading={
                    pagination.page === 1 && item.id <= 3 ? "eager" : "lazy"
                  }
                />
              ) : (
                <div className="h-48 bg-gray-300"></div>
              )}
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
                  className="bg-primary-blue text-white px-4 py-2 rounded hover:bg-accent-green transition-colors duration-200 inline-block"
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
                ? "bg-primary-blue text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Land Properties
          </button>
          <button
            onClick={() => handleServiceChange("houses")}
            className={`px-4 py-2 rounded-md ${
              serviceType === "houses"
                ? "bg-primary-blue text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Houses & Apartments
          </button>
          <button
            onClick={() => handleServiceChange("estateManagement")}
            className={`px-4 py-2 rounded-md ${
              serviceType === "estateManagement"
                ? "bg-primary-blue text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Estate Management
          </button>
          <button
            onClick={() => handleServiceChange("architecturalDesign")}
            className={`px-4 py-2 rounded-md ${
              serviceType === "architecturalDesign"
                ? "bg-primary-blue text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Architectural Design
          </button>
          <button
            onClick={() => handleServiceChange("landSurvey")}
            className={`px-4 py-2 rounded-md ${
              serviceType === "landSurvey"
                ? "bg-primary-blue text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Land Survey
          </button>
          <button
            onClick={() => handleServiceChange("generalContracts")}
            className={`px-4 py-2 rounded-md ${
              serviceType === "generalContracts"
                ? "bg-primary-blue text-white"
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
      {(serviceType === "lands" || serviceType === "houses") && (
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

          {(serviceType === "lands" || serviceType === "houses") && (
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
              className="text-primary-blue hover:underline"
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
                        ? "bg-primary-blue text-white"
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
          className="bg-primary-blue text-white px-6 py-3 rounded-lg text-lg hover:bg-accent-green"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
