"use client";

import { useState } from "react";

export default function SearchFilters({ onFilterChange, initialFilters }) {
  const [filters, setFilters] = useState(
    initialFilters || {
      search: "",
      priceRange: [0, 1000000],
      size: "any",
      location: "any",
      sortBy: "newest",
    }
  );

  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    const priceRange = [...filters.priceRange];

    if (name === "minPrice") {
      priceRange[0] = parseInt(value);
    } else {
      priceRange[1] = parseInt(value);
    }

    setFilters((prev) => ({
      ...prev,
      priceRange,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    const defaultFilters = {
      search: "",
      priceRange: [0, 1000000],
      size: "any",
      location: "any",
      sortBy: "newest",
    };

    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <form onSubmit={handleSubmit}>
        {/* Always visible: Search and Apply button with expand toggle */}
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
          {/* Search Input */}
          <div className="flex-1">
            <label
              htmlFor="search"
              className="block text-gray-700 font-medium mb-2"
            >
              Search
            </label>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleInputChange}
              placeholder="Search by title or location"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Apply Button and Expand Toggle */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-hover whitespace-nowrap"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-1"
              title={isExpanded ? "Hide filters" : "Show filters"}
            >
              <span className="text-sm">Filters</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Collapsible Filters Section */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 pt-4 border-t border-gray-200">
            {/* Price Range */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Price Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.priceRange[0]}
                  onChange={handlePriceRangeChange}
                  placeholder="Min"
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.priceRange[1]}
                  onChange={handlePriceRangeChange}
                  placeholder="Max"
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Size */}
            <div>
              <label
                htmlFor="size"
                className="block text-gray-700 font-medium mb-2"
              >
                Size
              </label>
              <select
                id="size"
                name="size"
                value={filters.size}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="any">Any Size</option>
                <option value="small">Small (Under 300 sqm)</option>
                <option value="medium">Medium (300-500 sqm)</option>
                <option value="large">Large (500-1000 sqm)</option>
                <option value="xlarge">Extra Large (1000+ sqm)</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-gray-700 font-medium mb-2"
              >
                Location
              </label>
              <select
                id="location"
                name="location"
                value={filters.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="any">Any Location</option>
                <option value="City A">City A</option>
                <option value="City B">City B</option>
                <option value="City C">City C</option>
                <option value="City D">City D</option>
                <option value="City E">City E</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label
                htmlFor="sortBy"
                className="block text-gray-700 font-medium mb-2"
              >
                Sort By
              </label>
              <select
                id="sortBy"
                name="sortBy"
                value={filters.sortBy}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="newest">Newest</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="sizeAsc">Size: Small to Large</option>
                <option value="sizeDesc">Size: Large to Small</option>
              </select>
            </div>
          </div>

          {/* Reset button in expanded section */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
