"use client";

import { useState } from "react";

export default function SortOptions({ onSortChange, options }) {
  const [sortBy, setSortBy] = useState(options[0].value);

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    onSortChange(value);
  };

  return (
    <div className="flex items-center space-x-2 mb-6">
      <label htmlFor="sortBy" className="text-gray-700 font-medium">
        Sort by:
      </label>
      <select
        id="sortBy"
        value={sortBy}
        onChange={handleSortChange}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
