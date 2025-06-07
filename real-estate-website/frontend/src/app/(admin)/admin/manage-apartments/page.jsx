"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  getAdminApartments,
  addAdminApartment,
  editAdminApartment,
  deleteAdminApartment,
} from "../../../../utils/api";

export default function ManageApartments() {
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
    floor: "",
    unit: "",
    area: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const router = useRouter();

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "price" ||
        name === "bedrooms" ||
        name === "bathrooms" ||
        name === "floor"
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

    if (!formData.floor) {
      errors.floor = "Floor number is required";
    } else if (isNaN(formData.floor)) {
      errors.floor = "Floor must be a number";
    }

    if (!formData.unit.trim()) {
      errors.unit = "Unit number is required";
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
      floor: "",
      unit: "",
      area: "",
      description: "",
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
      floor: property.floor,
      unit: property.unit,
      area: property.area,
      description: property.description || "",
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

    try {
      const apartmentData = {
        title: formData.title,
        price: Number(formData.price),
        status: formData.status,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        floor: Number(formData.floor),
        unit: formData.unit,
        size: formData.area,
        description: formData.description,
        location: "Location TBD", // Default location
        images: [], // No images for now
        features: [],
        landmarks: [],
      };

      const response = await addAdminApartment(apartmentData);

      if (response.success) {
        // Refresh the properties list
        await fetchProperties();
        closeModals();
        alert("Apartment property added successfully!");
      } else {
        throw new Error(response.message || "Failed to add apartment");
      }
    } catch (error) {
      console.error("Error adding apartment:", error);
      if (error.message === "Access denied. No token provided.") {
        router.push("/admin/login");
      } else {
        alert("Failed to add apartment: " + error.message);
      }
    }
  };

  // Handle edit property
  const handleEditProperty = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const apartmentData = {
        title: formData.title,
        price: Number(formData.price),
        status: formData.status,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        floor: Number(formData.floor),
        unit: formData.unit,
        size: formData.area,
        description: formData.description,
      };

      const response = await editAdminApartment(
        currentProperty.id,
        apartmentData
      );

      if (response.success) {
        // Refresh the properties list
        await fetchProperties();
        closeModals();
        alert("Apartment property updated successfully!");
      } else {
        throw new Error(response.message || "Failed to update apartment");
      }
    } catch (error) {
      console.error("Error updating apartment:", error);
      if (error.message === "Access denied. No token provided.") {
        router.push("/admin/login");
      } else {
        alert("Failed to update apartment: " + error.message);
      }
    }
  };

  // Handle delete property
  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        const response = await deleteAdminApartment(propertyId);

        if (response.success) {
          // Refresh the properties list
          await fetchProperties();
          alert("Apartment property deleted successfully!");
        } else {
          throw new Error(response.message || "Failed to delete apartment");
        }
      } catch (error) {
        console.error("Error deleting apartment:", error);
        if (error.message === "Access denied. No token provided.") {
          router.push("/admin/login");
        } else {
          alert("Failed to delete apartment: " + error.message);
        }
      }
    }
  };

  useEffect(() => {
    // Check if admin is authenticated
    const adminToken = Cookies.get("adminToken");
    if (!adminToken) {
      router.push("/admin/login");
      return;
    }

    // Fetch properties data
    const fetchProperties = async () => {
      try {
        setLoading(true);

        const response = await getAdminApartments();

        if (!response.success) {
          throw new Error("Failed to fetch apartments");
        }

        // Format the data to match the expected structure
        const formattedProperties = response.data.map((apartment) => ({
          id: apartment._id || apartment.id,
          title: apartment.title,
          price: apartment.price,
          status: apartment.status,
          bedrooms: apartment.bedrooms,
          bathrooms: apartment.bathrooms,
          floor: apartment.floor || 1,
          unit: apartment.unit || "N/A",
          area: apartment.size || apartment.area,
          description: apartment.description,
          createdAt: apartment.createdAt,
        }));

        setProperties(formattedProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
        if (error.message === "Access denied. No token provided.") {
          router.push("/admin/login");
        } else {
          alert("Failed to load apartments: " + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

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
        <h1 className="text-2xl font-bold">Manage Apartments</h1>
        <button
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover"
          onClick={openAddModal}
        >
          Add New Apartment
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
                  Floor/Unit
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Beds/Baths
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
                    Floor {property.floor}, Unit {property.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {property.bedrooms} bd / {property.bathrooms} ba
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {property.area}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-primary hover:text-primary-text mr-3"
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

      {/* Add Apartment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Apartment</h2>
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
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Title
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
                  Price ($)
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
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      formErrors.bedrooms ? "border-red-500" : "border-gray-300"
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
                    Bathrooms
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
                    htmlFor="floor"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Floor
                  </label>
                  <input
                    type="number"
                    id="floor"
                    name="floor"
                    value={formData.floor}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      formErrors.floor ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.floor && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.floor}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="unit"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Unit
                  </label>
                  <input
                    type="text"
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      formErrors.unit ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.unit && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.unit}
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
                    Area
                  </label>
                  <input
                    type="text"
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="e.g., 1200 sqft"
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
                  Add Apartment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Apartment Modal */}
      {isEditModalOpen && currentProperty && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Apartment</h2>
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
              <div className="mb-4">
                <label
                  htmlFor="edit-title"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Title
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
                  Price ($)
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
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    id="edit-bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      formErrors.bedrooms ? "border-red-500" : "border-gray-300"
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
                    Bathrooms
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
                    htmlFor="edit-floor"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Floor
                  </label>
                  <input
                    type="number"
                    id="edit-floor"
                    name="floor"
                    value={formData.floor}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      formErrors.floor ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.floor && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.floor}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="edit-unit"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Unit
                  </label>
                  <input
                    type="text"
                    id="edit-unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      formErrors.unit ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.unit && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.unit}
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
                    Area
                  </label>
                  <input
                    type="text"
                    id="edit-area"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="e.g., 1200 sqft"
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

      {/* View Apartment Modal */}
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
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Floor</p>
                    <p className="font-medium">{currentProperty.floor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Unit</p>
                    <p className="font-medium">{currentProperty.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Area</p>
                    <p className="font-medium">{currentProperty.area}</p>
                  </div>
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
