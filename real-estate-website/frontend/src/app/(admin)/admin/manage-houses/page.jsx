"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import {
  getAdminHouses,
  addAdminHouse,
  editAdminHouse,
  deleteAdminHouse,
} from "../../../../utils/api";
import {
  uploadImages,
  validateImages,
} from "../../../../utils/cloudinaryUpload";

export default function ManageHouses() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    status: "Available",
    bedrooms: "",
    bathrooms: "",
    area: "",
    description: "",
    features: [],
    landmarks: [],
    images: [],
  });
  const [formErrors, setFormErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
  });
  const router = useRouter();

  // Refs for file inputs
  const imageInputRef = useRef(null);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "price" || name === "bedrooms" || name === "bathrooms"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    });

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // Handle features
  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ""],
    });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      features: newFeatures,
    });
  };

  const handleFeatureInput = (e, index) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = e.target.value;
    setFormData({
      ...formData,
      features: newFeatures,
    });
  };

  // Handle landmarks
  const addLandmark = () => {
    setFormData({
      ...formData,
      landmarks: [...formData.landmarks, ""],
    });
  };

  const removeLandmark = (index) => {
    const newLandmarks = formData.landmarks.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      landmarks: newLandmarks,
    });
  };

  const handleLandmarkInput = (e, index) => {
    const newLandmarks = [...formData.landmarks];
    newLandmarks[index] = e.target.value;
    setFormData({
      ...formData,
      landmarks: newLandmarks,
    });
  };

  // Handle image input
  const handleImageInput = (e) => {
    try {
      if (e.target.files && e.target.files.length > 0) {
        const newFiles = Array.from(e.target.files);

        // Validate file types
        const validFiles = newFiles.filter((file) => {
          const isValidType = file.type.startsWith("image/");
          if (!isValidType) {
            console.warn(`Skipping invalid file type: ${file.type}`);
          }
          return isValidType;
        });

        if (validFiles.length === 0) {
          alert("Please select valid image files.");
          return;
        }

        // Create preview URLs for the images
        const newImages = validFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }));

        setFormData({
          ...formData,
          images: [...formData.images, ...newImages],
        });
      }
    } catch (error) {
      console.error("Error handling image input:", error);
      alert("Error processing images. Please try again.");
    }
  };

  // Remove image
  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages,
    });
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.price) {
      errors.price = "Price is required";
    } else if (isNaN(formData.price) || formData.price <= 0) {
      errors.price = "Price must be a positive number";
    }

    if (!formData.bedrooms) {
      errors.bedrooms = "Number of bedrooms is required";
    } else if (isNaN(formData.bedrooms) || formData.bedrooms < 0) {
      errors.bedrooms = "Bedrooms must be a non-negative number";
    }

    if (!formData.bathrooms) {
      errors.bathrooms = "Number of bathrooms is required";
    } else if (isNaN(formData.bathrooms) || formData.bathrooms < 0) {
      errors.bathrooms = "Bathrooms must be a non-negative number";
    }

    if (!formData.area.trim()) {
      errors.area = "Area is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open add modal
  const openAddModal = () => {
    setFormData({
      title: "",
      price: "",
      status: "Available",
      bedrooms: "",
      bathrooms: "",
      area: "",
      description: "",
      features: [],
      landmarks: [],
      images: [],
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (property) => {
    setCurrentProperty(property);
    setFormData({
      title: property.title,
      price: property.price,
      status: property.status,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      description: property.description || "",
      features: Array.isArray(property.features)
        ? property.features.filter((f) => typeof f === "string")
        : [],
      landmarks: Array.isArray(property.landmarks)
        ? property.landmarks
            .map((l) => {
              // Handle both string and object formats
              if (typeof l === "string") {
                return l;
              } else if (l && typeof l === "object" && l.name) {
                return l.name;
              }
              return "";
            })
            .filter((l) => l.trim() !== "")
        : [],
      images: property.images
        ? property.images.map((url) => ({ preview: url, isExisting: true }))
        : [],
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // Open view modal
  const openViewModal = (property) => {
    setCurrentProperty(property);
    setIsViewModalOpen(true);
  };

  // Close modals
  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
  };

  // Handle add property
  const handleAddProperty = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setUploading(true);
    setUploadProgress({ current: 0, total: 0 });

    try {
      // Prepare image files for upload
      const imageFiles = formData.images
        .filter((img) => img.file)
        .map((img) => img.file);

      // Validate images if any
      if (imageFiles.length > 0) {
        const imageErrors = validateImages(imageFiles);
        if (imageErrors.length > 0) {
          alert("Image validation errors:\n" + imageErrors.join("\n"));
          return;
        }
      }

      // Calculate total files to upload
      const totalFiles = imageFiles.length;
      setUploadProgress({ current: 0, total: totalFiles });

      // Upload images to Cloudinary
      let imageUrls = [];
      if (imageFiles.length > 0) {
        imageUrls = await uploadImages(imageFiles, (current, total) => {
          setUploadProgress({ current, total: totalFiles });
        });
      }

      // Prepare features and landmarks
      const filteredFeatures = formData.features.filter(
        (f) => typeof f === "string" && f.trim() !== ""
      );
      const filteredLandmarks = formData.landmarks
        .filter((l) => typeof l === "string" && l.trim() !== "")
        .map((landmark) => ({
          name: landmark,
          distance: "Distance TBD",
        }));

      const houseData = {
        title: formData.title,
        price: Number(formData.price),
        status: formData.status,
        propertyType: "Detached", // Default property type
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        size: formData.area,
        description: formData.description,
        location: "Location TBD", // Default location
        images: imageUrls,
        features: JSON.stringify(filteredFeatures),
        landmarks: JSON.stringify(filteredLandmarks),
      };

      const response = await addAdminHouse(houseData);

      if (response.success) {
        // Refresh the properties list
        await fetchProperties();
        closeModals();
        alert("House property added successfully!");
      } else {
        throw new Error(response.message || "Failed to add house");
      }
    } catch (error) {
      console.error("Error adding house:", error);
      if (error.message === "Access denied. No token provided.") {
        router.push("/admin/login");
      } else {
        alert("Failed to add house: " + error.message);
      }
    } finally {
      setUploading(false);
    }
  };

  // Handle edit property
  const handleEditProperty = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setUploading(true);
    setUploadProgress({ current: 0, total: 0 });

    try {
      // Separate new images from existing ones
      const newImageFiles = formData.images
        .filter((img) => img.file && !img.isExisting)
        .map((img) => img.file);
      const existingImageUrls = formData.images
        .filter((img) => img.isExisting)
        .map((img) => img.preview);

      // Validate new images if any
      if (newImageFiles.length > 0) {
        const imageErrors = validateImages(newImageFiles);
        if (imageErrors.length > 0) {
          alert("Image validation errors:\n" + imageErrors.join("\n"));
          return;
        }
      }

      // Calculate total files to upload
      const totalFiles = newImageFiles.length;
      setUploadProgress({ current: 0, total: totalFiles });

      // Upload new images to Cloudinary
      let newImageUrls = [];
      if (newImageFiles.length > 0) {
        newImageUrls = await uploadImages(newImageFiles, (current, total) => {
          setUploadProgress({ current, total: totalFiles });
        });
      }

      // Combine existing and new image URLs
      const allImageUrls = [...existingImageUrls, ...newImageUrls];

      // Prepare features and landmarks
      const filteredFeatures = formData.features.filter(
        (f) => typeof f === "string" && f.trim() !== ""
      );
      const filteredLandmarks = formData.landmarks
        .filter((l) => typeof l === "string" && l.trim() !== "")
        .map((landmark) => ({
          name: landmark,
          distance: "Distance TBD",
        }));

      const houseData = {
        title: formData.title,
        price: Number(formData.price),
        status: formData.status,
        propertyType: currentProperty.propertyType || "Detached", // Keep existing or default
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        size: formData.area,
        description: formData.description,
        location: currentProperty.location || "Location TBD", // Keep existing or default
        images: allImageUrls,
        features: JSON.stringify(filteredFeatures),
        landmarks: JSON.stringify(filteredLandmarks),
      };

      const response = await editAdminHouse(currentProperty.id, houseData);

      if (response.success) {
        // Refresh the properties list
        await fetchProperties();
        closeModals();
        alert("House property updated successfully!");
      } else {
        throw new Error(response.message || "Failed to update house");
      }
    } catch (error) {
      console.error("Error updating house:", error);
      if (error.message === "Access denied. No token provided.") {
        router.push("/admin/login");
      } else {
        alert("Failed to update house: " + error.message);
      }
    } finally {
      setUploading(false);
    }
  };

  // Handle delete property
  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        const response = await deleteAdminHouse(propertyId);

        if (response.success) {
          // Refresh the properties list
          await fetchProperties();
          alert("House property deleted successfully!");
        } else {
          throw new Error(response.message || "Failed to delete house");
        }
      } catch (error) {
        console.error("Error deleting house:", error);
        if (error.message === "Access denied. No token provided.") {
          router.push("/admin/login");
        } else {
          alert("Failed to delete house: " + error.message);
        }
      }
    }
  };

  // Fetch properties data
  const fetchProperties = async () => {
    try {
      setLoading(true);

      const response = await getAdminHouses();

      if (!response.success) {
        throw new Error("Failed to fetch houses");
      }

      // Format the data to match the expected structure
      const formattedProperties = response.data.map((house) => ({
        id: house._id || house.id,
        title: house.title,
        price: house.price,
        status: house.status,
        bedrooms: house.bedrooms,
        bathrooms: house.bathrooms,
        area: house.size || house.area,
        description: house.description,
        features: Array.isArray(house.features)
          ? house.features.filter((f) => typeof f === "string")
          : [],
        landmarks: Array.isArray(house.landmarks)
          ? house.landmarks
              .map((l) => {
                // Handle both string and object formats
                if (typeof l === "string") {
                  return l;
                } else if (l && typeof l === "object" && l.name) {
                  return l.name;
                }
                return "";
              })
              .filter((l) => l.trim() !== "")
          : [],
        images: Array.isArray(house.images) ? house.images : [],
        createdAt: house.createdAt,
      }));

      setProperties(formattedProperties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      if (error.message === "Access denied. No token provided.") {
        router.push("/admin/login");
      } else {
        alert("Failed to load houses: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if admin is authenticated
    const adminToken = Cookies.get("adminToken");
    if (!adminToken) {
      router.push("/admin/login");
      return;
    }

    fetchProperties().catch((error) => {
      console.error("Error in useEffect fetchProperties:", error);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Houses</h1>
        <button
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover"
          onClick={openAddModal}
        >
          Add New House
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Bedrooms
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Bathrooms
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Area
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {properties.map((property) => (
                <tr key={property.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      <button
                        className="hover:text-primary focus:outline-none"
                        onClick={() => openViewModal(property)}
                      >
                        {property.title}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      ${property.price.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        property.status === "Available"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {property.bedrooms}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {property.bathrooms}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {property.area}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-primary-text hover:text-primary-text mr-3"
                      onClick={() => openEditModal(property)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteProperty(property.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add House Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New House</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeModals}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddProperty}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {/* Basic Information Section */}
                  <h3 className="text-lg font-semibold mb-4">
                    Basic Information
                  </h3>

                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Title*
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.title ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.title && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.title}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="price"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Price ($)*
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.price ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.price && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.price}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="bedrooms"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Bedrooms*
                      </label>
                      <input
                        type="number"
                        id="bedrooms"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                          formErrors.bedrooms
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formErrors.bedrooms && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.bedrooms}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="bathrooms"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Bathrooms*
                      </label>
                      <input
                        type="number"
                        id="bathrooms"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        step="0.5"
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                          formErrors.bathrooms
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formErrors.bathrooms && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.bathrooms}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="status"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Available">Available</option>
                        <option value="Sold">Sold</option>
                        <option value="Reserved">Reserved</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="area"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Area*
                      </label>
                      <input
                        type="text"
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        placeholder="e.g., 2000 sqft"
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                          formErrors.area ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {formErrors.area && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.area}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="description"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    ></textarea>
                  </div>
                </div>

                <div>
                  {/* Features Section */}
                  <h3 className="text-lg font-semibold mb-4">
                    Features & Landmarks
                  </h3>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Features
                    </label>
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex mb-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureInput(e, index)}
                          className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="e.g., Swimming Pool"
                        />
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="ml-2 bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addFeature}
                      className="mt-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                      Add Feature
                    </button>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Nearby Landmarks
                    </label>
                    {formData.landmarks.map((landmark, index) => (
                      <div key={index} className="flex mb-2">
                        <input
                          type="text"
                          value={landmark}
                          onChange={(e) => handleLandmarkInput(e, index)}
                          className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="e.g., Shopping Mall (2km)"
                        />
                        <button
                          type="button"
                          onClick={() => removeLandmark(index)}
                          className="ml-2 bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addLandmark}
                      className="mt-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                      Add Landmark
                    </button>
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Property Images</h3>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    House Images
                  </label>
                  <div className="mb-2">
                    <input
                      type="file"
                      ref={imageInputRef}
                      onChange={handleImageInput}
                      className="hidden"
                      multiple
                      accept="image/*"
                    />
                    <button
                      type="button"
                      onClick={() => imageInputRef.current.click()}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                      Upload Images
                    </button>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                            <img
                              src={img.preview}
                              alt={`Preview ${index}`}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">
                      Uploading files...
                    </span>
                    <span className="text-sm text-blue-600">
                      {uploadProgress.current} / {uploadProgress.total}
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width:
                          uploadProgress.total > 0
                            ? `${
                                (uploadProgress.current /
                                  uploadProgress.total) *
                                100
                              }%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 mr-2"
                  onClick={closeModals}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover"
                >
                  Add House
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit House Modal */}
      {isEditModalOpen && currentProperty && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit House</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeModals}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditProperty}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {/* Basic Information Section */}
                  <h3 className="text-lg font-semibold mb-4">
                    Basic Information
                  </h3>

                  <div className="mb-4">
                    <label
                      htmlFor="edit-title"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Title*
                    </label>
                    <input
                      type="text"
                      id="edit-title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.title ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.title && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.title}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="edit-price"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Price ($)*
                    </label>
                    <input
                      type="number"
                      id="edit-price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.price ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.price && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.price}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="edit-bedrooms"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Bedrooms*
                      </label>
                      <input
                        type="number"
                        id="edit-bedrooms"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                          formErrors.bedrooms
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formErrors.bedrooms && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.bedrooms}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="edit-bathrooms"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Bathrooms*
                      </label>
                      <input
                        type="number"
                        id="edit-bathrooms"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        step="0.5"
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                          formErrors.bathrooms
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formErrors.bathrooms && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.bathrooms}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="edit-status"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Status
                      </label>
                      <select
                        id="edit-status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Available">Available</option>
                        <option value="Sold">Sold</option>
                        <option value="Reserved">Reserved</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="edit-area"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Area*
                      </label>
                      <input
                        type="text"
                        id="edit-area"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        placeholder="e.g., 2000 sqft"
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                          formErrors.area ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {formErrors.area && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.area}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="edit-description"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Description
                    </label>
                    <textarea
                      id="edit-description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    ></textarea>
                  </div>
                </div>

                <div>
                  {/* Features Section */}
                  <h3 className="text-lg font-semibold mb-4">
                    Features & Landmarks
                  </h3>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Features
                    </label>
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex mb-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureInput(e, index)}
                          className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="e.g., Swimming Pool"
                        />
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="ml-2 bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addFeature}
                      className="mt-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                      Add Feature
                    </button>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Nearby Landmarks
                    </label>
                    {formData.landmarks.map((landmark, index) => (
                      <div key={index} className="flex mb-2">
                        <input
                          type="text"
                          value={landmark}
                          onChange={(e) => handleLandmarkInput(e, index)}
                          className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="e.g., Shopping Mall (2km)"
                        />
                        <button
                          type="button"
                          onClick={() => removeLandmark(index)}
                          className="ml-2 bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addLandmark}
                      className="mt-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                      Add Landmark
                    </button>
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Property Images</h3>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    House Images
                  </label>
                  <div className="mb-2">
                    <input
                      type="file"
                      ref={imageInputRef}
                      onChange={handleImageInput}
                      className="hidden"
                      multiple
                      accept="image/*"
                    />
                    <button
                      type="button"
                      onClick={() => imageInputRef.current.click()}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                      Upload Images
                    </button>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                            <img
                              src={img.preview}
                              alt={`Preview ${index}`}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">
                      Uploading files...
                    </span>
                    <span className="text-sm text-blue-600">
                      {uploadProgress.current} / {uploadProgress.total}
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width:
                          uploadProgress.total > 0
                            ? `${
                                (uploadProgress.current /
                                  uploadProgress.total) *
                                100
                              }%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 mr-2"
                  onClick={closeModals}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View House Modal */}
      {isViewModalOpen && currentProperty && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{currentProperty.title}</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeModals}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="bg-gray-200 h-48 rounded-md flex items-center justify-center mb-4">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 22V12h6v10"
                    />
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-xs text-gray-500">Price</p>
                    <p className="text-lg font-semibold">
                      ${currentProperty.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="text-lg font-semibold">
                      {currentProperty.status}
                    </p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-xs text-gray-500">Bedrooms</p>
                    <p className="text-lg font-semibold">
                      {currentProperty.bedrooms}
                    </p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-xs text-gray-500">Bathrooms</p>
                    <p className="text-lg font-semibold">
                      {currentProperty.bathrooms}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Property Details</h3>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Area</p>
                  <p className="font-medium">{currentProperty.area}</p>
                </div>
                <p className="text-gray-600 mb-4">
                  {currentProperty.description ||
                    "No description available for this property."}
                </p>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Additional Information
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-gray-500">Listed Date:</span>
                      <span>
                        {new Date(
                          currentProperty.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500">Property ID:</span>
                      <span>#{currentProperty.id}</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover"
                    onClick={() => {
                      closeModals();
                      openEditModal(currentProperty);
                    }}
                  >
                    Edit Property
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
