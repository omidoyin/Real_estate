"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getFavoriteLands, removeLandFromFavorites } from "../../../utils/api";
import { isAuthenticated } from "../../../utils/auth";
import { useRouter } from "next/navigation";
import SortOptions from "../../../components/Shared/SortOptions";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import ConfirmationDialog from "../../../components/Shared/ConfirmationDialog";
import { useToast } from "../../../context/ToastContext";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [displayedFavorites, setDisplayedFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [landToRemove, setLandToRemove] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "priceAsc", label: "Price: Low to High" },
    { value: "priceDesc", label: "Price: High to Low" },
    { value: "titleAsc", label: "Title: A-Z" },
    { value: "titleDesc", label: "Title: Z-A" },
  ];

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }

    // Fetch favorite lands
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        // Fetch data from the API
        const response = await getFavoriteLands();
        const data = response.data;

        // Add addedAt property if it doesn't exist (using createdAt from the API)
        const processedData = data.map((item) => ({
          ...item,
          id: item._id, // Ensure we have an id property for compatibility
          addedAt: item.addedAt || item.createdAt || new Date().toISOString(),
        }));

        setFavorites(processedData);
        setDisplayedFavorites(sortFavorites(processedData, sortOption));
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("Failed to load favorite properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [router]);

  // Apply sorting whenever sort option changes
  useEffect(() => {
    if (favorites.length > 0) {
      setDisplayedFavorites(sortFavorites(favorites, sortOption));
    }
  }, [sortOption, favorites]);

  const sortFavorites = (items, sortBy) => {
    const sortedItems = [...items];

    switch (sortBy) {
      case "newest":
        return sortedItems.sort(
          (a, b) => new Date(b.addedAt) - new Date(a.addedAt)
        );
      case "oldest":
        return sortedItems.sort(
          (a, b) => new Date(a.addedAt) - new Date(b.addedAt)
        );
      case "priceAsc":
        return sortedItems.sort((a, b) => a.price - b.price);
      case "priceDesc":
        return sortedItems.sort((a, b) => b.price - a.price);
      case "titleAsc":
        return sortedItems.sort((a, b) => a.title.localeCompare(b.title));
      case "titleDesc":
        return sortedItems.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sortedItems;
    }
  };

  // Show confirmation dialog before removing
  const confirmRemoveFromFavorites = (land) => {
    setLandToRemove(land);
    setShowConfirmDialog(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setShowConfirmDialog(false);
    setLandToRemove(null);
  };

  // Actually remove from favorites after confirmation
  const handleRemoveFromFavorites = async () => {
    if (!landToRemove) return;

    try {
      setShowConfirmDialog(false);

      // Show loading toast
      showToast("Removing from favorites...", "info");

      // Call the API to remove from favorites
      await removeLandFromFavorites(landToRemove.id);

      // Update the favorites list
      const updatedFavorites = favorites.filter(
        (land) => land.id !== landToRemove.id
      );
      setFavorites(updatedFavorites);
      setDisplayedFavorites(sortFavorites(updatedFavorites, sortOption));

      // Show success toast
      showToast(`${landToRemove.title} removed from favorites`, "success");

      // Reset landToRemove
      setLandToRemove(null);
    } catch (err) {
      console.error("Error removing from favorites:", err);
      showToast("Failed to remove from favorites. Please try again.", "error");
    }
  };

  const handleSortChange = (newSortOption) => {
    setSortOption(newSortOption);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Favorite Properties</h1>
        <LoadingSpinner text="Loading your favorite properties..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Favorite Properties</h1>
        <div className="bg-red-100 text-red-800 p-4 rounded-md">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Favorite Properties</h1>

      {favorites.length === 0 ? (
        <div className="bg-card-bg p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">
            You haven't added any properties to your favorites yet.
          </h2>
          <p className="mb-6">
            Browse our available properties and click the heart icon to add them
            to your favorites.
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
              {displayedFavorites.length}{" "}
              {displayedFavorites.length === 1 ? "property" : "properties"} in
              your favorites
            </p>
            <SortOptions
              onSortChange={handleSortChange}
              options={sortOptions}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedFavorites.map((land) => (
              <div
                key={land.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48">
                  {land.image ? (
                    <Image
                      src={land.image}
                      alt={land.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={false}
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-48 bg-gray-300"></div>
                  )}
                  <button
                    onClick={() => confirmRemoveFromFavorites(land)}
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-100 transition-colors duration-200"
                    aria-label="Remove from favorites"
                  >
                    <svg
                      className="w-5 h-5 text-red-500"
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
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{land.title}</h3>
                  <p className="text-gray-600 mb-4">{land.location}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold">
                      ${land.price?.toLocaleString() || "Price on request"}
                    </span>
                    <Link
                      href={`/lands/details/${land.id}`}
                      className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition-colors duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={handleDialogClose}
        onConfirm={handleRemoveFromFavorites}
        title="Remove from Favorites"
        message={
          landToRemove
            ? `Are you sure you want to remove ${landToRemove.title} from your favorites?`
            : ""
        }
        confirmText="Remove"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
