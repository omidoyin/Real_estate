"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchFilters from "../../../../components/Lands/SearchFilters";
import LoadingSpinner from "../../../../components/Shared/LoadingSpinner";
import { useToast } from "../../../../context/ToastContext";
import { useRouter, useSearchParams } from "next/navigation";

// Function to fetch available lands with server-side pagination and filtering
async function fetchLandsFromAPI(filters, page = 1, limit = 6) {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (filters.search) {
      queryParams.append("search", filters.search);
    }

    if (filters.priceRange && filters.priceRange.length === 2) {
      queryParams.append("minPrice", filters.priceRange[0].toString());
      queryParams.append("maxPrice", filters.priceRange[1].toString());
    }

    if (filters.size && filters.size !== "any") {
      queryParams.append("size", filters.size);
    }

    if (filters.location && filters.location !== "any") {
      queryParams.append("location", filters.location);
    }

    if (filters.sortBy) {
      queryParams.append("sortBy", filters.sortBy);
    }

    // Make the API request
    const response = await fetch(`/api/lands?${queryParams.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch lands");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching lands:", error);
    throw error;
  }
}

export default function AvailableLands() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  // Get current page from URL or default to 1
  const currentPage = parseInt(searchParams.get("page") || "1");

  const [lands, setLands] = useState([]);
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

  // Fetch lands when filters or page changes
  useEffect(() => {
    const fetchLands = async () => {
      try {
        setLoading(true);

        // Fetch lands from API with server-side pagination and filtering
        const result = await fetchLandsFromAPI(
          activeFilters,
          pagination.page,
          pagination.limit
        );

        setLands(result.lands);
        setPagination(result.pagination);
      } catch (err) {
        console.error("Error fetching lands:", err);
        setError(
          "Failed to load available properties. Please try again later."
        );
        showToast("Failed to load properties. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchLands();
  }, [activeFilters, pagination.page, pagination.limit, showToast]);

  // Update URL when filters change
  useEffect(() => {
    // Build query parameters
    const params = new URLSearchParams();

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

    router.replace(`/lands/available${url}`, { scroll: false });
  }, [activeFilters, pagination.page, router]);

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

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Available Lands</h1>

      <div className="mb-8">
        <p className="text-center text-gray-700 max-w-3xl mx-auto">
          Browse our selection of premium land properties in prime locations.
          Each property has been carefully selected for its investment potential
          and strategic location.
        </p>
      </div>

      {/* Search and Filter Component */}
      <SearchFilters
        onFilterChange={handleFilterChange}
        initialFilters={activeFilters}
      />

      {loading ? (
        <LoadingSpinner text="Loading properties..." />
      ) : error ? (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-8">
          {error}
        </div>
      ) : (
        <>
          {/* Results Summary */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              Showing {lands.length} of {pagination.total}{" "}
              {pagination.total === 1 ? "property" : "properties"}
              {activeFilters.search && ` matching "${activeFilters.search}"`}
            </p>

            {lands.length === 0 && (
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

          {lands.length === 0 ? (
            <div className="bg-light-blue p-8 rounded-lg text-center">
              <h2 className="text-xl font-semibold mb-4">
                No properties match your search criteria
              </h2>
              <p className="mb-6">
                Try adjusting your filters or search terms to find more
                properties.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {lands.map((land) => (
                <div
                  key={land.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-48 relative">
                    {land.image ? (
                      <Image
                        src={land.image}
                        alt={land.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: "cover" }}
                        priority={pagination.page === 1 && land.id <= 3}
                        loading={
                          pagination.page === 1 && land.id <= 3
                            ? "eager"
                            : "lazy"
                        }
                      />
                    ) : (
                      <div className="h-48 bg-gray-300"></div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{land.title}</h3>
                    <div className="mb-4">
                      <p className="text-gray-600">{land.location}</p>
                      <p className="text-gray-600">Size: {land.size}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-primary-blue font-bold">
                        ${land.price.toLocaleString()}
                      </span>
                      <Link
                        href={`/lands/details/${land.id}`}
                        className="bg-primary-blue text-white px-4 py-2 rounded hover:bg-accent-green transition-colors duration-200"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {lands.length > 0 && pagination.totalPages > 1 && (
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
        </>
      )}

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Looking for Something Specific?
        </h2>
        <p className="text-gray-700 mb-6">
          Contact our team to discuss your requirements and we'll help you find
          the perfect land property.
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
