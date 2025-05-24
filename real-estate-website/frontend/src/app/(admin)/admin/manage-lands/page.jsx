"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";

export default function ManageLands() {
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
    type: "Residential",
    area: "",
    description: "",
    features: [],
    landmarks: [],
    documents: [],
    images: [],
    brochure: null,
  });

  // Refs for file inputs
  const imageInputRef = useRef(null);
  const brochureInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});
  const router = useRouter();

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" ? (value === "" ? "" : Number(value)) : value,
    });

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // Handle feature input
  const handleFeatureInput = (e, index) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = e.target.value;
    setFormData({
      ...formData,
      features: newFeatures,
    });
  };

  // Add new feature field
  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ""],
    });
  };

  // Remove feature field
  const removeFeature = (index) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(index, 1);
    setFormData({
      ...formData,
      features: newFeatures,
    });
  };

  // Handle landmark input
  const handleLandmarkInput = (e, index) => {
    const newLandmarks = [...formData.landmarks];
    newLandmarks[index] = e.target.value;
    setFormData({
      ...formData,
      landmarks: newLandmarks,
    });
  };

  // Add new landmark field
  const addLandmark = () => {
    setFormData({
      ...formData,
      landmarks: [...formData.landmarks, ""],
    });
  };

  // Remove landmark field
  const removeLandmark = (index) => {
    const newLandmarks = [...formData.landmarks];
    newLandmarks.splice(index, 1);
    setFormData({
      ...formData,
      landmarks: newLandmarks,
    });
  };

  // Handle document input
  const handleDocumentInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFormData({
        ...formData,
        documents: [...formData.documents, ...newFiles],
      });
    }
  };

  // Remove document
  const removeDocument = (index) => {
    const newDocuments = [...formData.documents];
    newDocuments.splice(index, 1);
    setFormData({
      ...formData,
      documents: newDocuments,
    });
  };

  // Handle image input
  const handleImageInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      // Create preview URLs for the images
      const newImages = newFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setFormData({
        ...formData,
        images: [...formData.images, ...newImages],
      });
    }
  };

  // Remove image
  const removeImage = (index) => {
    // Revoke the object URL to avoid memory leaks
    if (formData.images[index].preview) {
      URL.revokeObjectURL(formData.images[index].preview);
    }

    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({
      ...formData,
      images: newImages,
    });
  };

  // Handle brochure input
  const handleBrochureInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        brochure: {
          file,
          name: file.name,
        },
      });
    }
  };

  // Remove brochure
  const removeBrochure = () => {
    setFormData({
      ...formData,
      brochure: null,
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
      type: "Residential",
      area: "",
      description: "",
      features: [],
      landmarks: [],
      documents: [],
      images: [],
      brochure: null,
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
      type: property.type,
      area: property.area,
      description: property.description || "",
      features: property.features || [],
      landmarks: property.landmarks || [],
      documents: property.documents || [],
      images: property.images || [],
      brochure: property.brochure || null,
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
  const handleAddProperty = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // In a real app, this would be an API call with FormData to handle file uploads
    // For demo purposes, just add to the state

    // Process images for the demo (in a real app, you'd upload these to a server)
    const processedImages = formData.images.map((img) => ({
      url: img.preview,
      alt: "Property image",
    }));

    // Process documents for the demo
    const processedDocuments = formData.documents.map((doc) => ({
      name: doc.name,
      type: doc.type,
      size: doc.size,
    }));

    // Process brochure for the demo
    const processedBrochure = formData.brochure
      ? {
          name: formData.brochure.name,
          type: formData.brochure.file.type,
          size: formData.brochure.file.size,
        }
      : null;

    const newProperty = {
      id: properties.length + 1,
      title: formData.title,
      price: Number(formData.price),
      status: formData.status,
      type: formData.type,
      area: formData.area,
      description: formData.description,
      features: formData.features,
      landmarks: formData.landmarks,
      documents: processedDocuments,
      images: processedImages,
      brochure: processedBrochure,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setProperties([...properties, newProperty]);
    closeModals();

    // Show success message (in a real app)
    alert("Property added successfully!");
  };

  // Handle edit property
  const handleEditProperty = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Process images for the demo (in a real app, you'd upload these to a server)
    const processedImages = formData.images.map((img) => {
      // If it's a new image (has a file property), use the preview URL
      if (img.file) {
        return {
          url: img.preview,
          alt: "Property image",
        };
      }
      // If it's an existing image, just return it as is
      return img;
    });

    // Process documents for the demo
    const processedDocuments = formData.documents.map((doc) => {
      // If it's a new document (has a File object properties), process it
      if (doc instanceof File) {
        return {
          name: doc.name,
          type: doc.type,
          size: doc.size,
        };
      }
      // If it's an existing document, just return it as is
      return doc;
    });

    // Process brochure for the demo
    const processedBrochure = formData.brochure
      ? formData.brochure.file
        ? {
            name: formData.brochure.name,
            type: formData.brochure.file.type,
            size: formData.brochure.file.size,
          }
        : formData.brochure
      : null;

    // In a real app, this would be an API call
    // For demo purposes, just update the state
    const updatedProperties = properties.map((property) => {
      if (property.id === currentProperty.id) {
        return {
          ...property,
          title: formData.title,
          price: Number(formData.price),
          status: formData.status,
          type: formData.type,
          area: formData.area,
          description: formData.description,
          features: formData.features,
          landmarks: formData.landmarks,
          documents: processedDocuments,
          images: processedImages,
          brochure: processedBrochure,
        };
      }
      return property;
    });

    setProperties(updatedProperties);
    closeModals();

    // Show success message (in a real app)
    alert("Property updated successfully!");
  };

  // Handle delete property
  const handleDeleteProperty = (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      // In a real app, this would be an API call
      // For demo purposes, just update the state
      const updatedProperties = properties.filter(
        (property) => property.id !== propertyId
      );
      setProperties(updatedProperties);

      // Show success message (in a real app)
      alert("Property deleted successfully!");
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

        // In a real app, this would fetch from your API
        // const response = await fetch('/api/admin/properties', {
        //   headers: {
        //     'Authorization': `Bearer ${adminToken}`
        //   }
        // });
        //
        // if (!response.ok) {
        //   throw new Error('Failed to fetch properties');
        // }
        //
        // const data = await response.json();

        // For demo purposes, use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockProperties = [
          {
            id: 1,
            title: "Premium Land in Location A",
            price: 250000,
            status: "Available",
            type: "Residential",
            area: "500 sqm",
            createdAt: "2023-01-15",
          },
          {
            id: 2,
            title: "Exclusive Land in Location B",
            price: 350000,
            status: "Sold",
            type: "Commercial",
            area: "750 sqm",
            createdAt: "2023-02-20",
          },
          {
            id: 3,
            title: "Strategic Land in Location C",
            price: 180000,
            status: "Available",
            type: "Residential",
            area: "450 sqm",
            createdAt: "2023-03-10",
          },
          {
            id: 4,
            title: "Residential Land in Location D",
            price: 220000,
            status: "Available",
            type: "Residential",
            area: "520 sqm",
            createdAt: "2023-04-05",
          },
          {
            id: 5,
            title: "Commercial Land in Location E",
            price: 400000,
            status: "Sold",
            type: "Commercial",
            area: "900 sqm",
            createdAt: "2023-01-01",
          },
        ];

        setProperties(mockProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
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
        <h1 className="text-2xl font-bold">Manage Lands</h1>
        <button
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover"
          onClick={openAddModal}
        >
          Add New Property
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
                  Type
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
                    {property.type}
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

      {/* Add Property Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Property</h2>
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
                        htmlFor="type"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Type
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Agricultural">Agricultural</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
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
                      placeholder="e.g., 500 sqm"
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

              {/* Documents and Images Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">
                  Documents & Images
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Land Documents
                    </label>
                    <div className="mb-2">
                      <input
                        type="file"
                        ref={documentInputRef}
                        onChange={handleDocumentInput}
                        className="hidden"
                        multiple
                        accept=".pdf,.doc,.docx"
                      />
                      <button
                        type="button"
                        onClick={() => documentInputRef.current.click()}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                      >
                        Upload Documents
                      </button>
                    </div>

                    {formData.documents.length > 0 && (
                      <ul className="mt-2 border border-gray-200 rounded-md divide-y">
                        {formData.documents.map((doc, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center p-3"
                          >
                            <div className="flex items-center">
                              <svg
                                className="w-5 h-5 mr-2 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              <span className="text-sm truncate max-w-xs">
                                {doc.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeDocument(index)}
                              className="text-red-500 hover:text-red-700"
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Brochure
                    </label>
                    <div className="mb-2">
                      <input
                        type="file"
                        ref={brochureInputRef}
                        onChange={handleBrochureInput}
                        className="hidden"
                        accept=".pdf"
                      />
                      <button
                        type="button"
                        onClick={() => brochureInputRef.current.click()}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                      >
                        Upload Brochure
                      </button>
                    </div>

                    {formData.brochure && (
                      <div className="mt-2 border border-gray-200 rounded-md p-3 flex justify-between items-center">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="text-sm truncate max-w-xs">
                            {formData.brochure.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={removeBrochure}
                          className="text-red-500 hover:text-red-700"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Property Images
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

              <div className="flex justify-end mt-6">
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
                  Add Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Property Modal */}
      {isEditModalOpen && currentProperty && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Property</h2>
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
                        htmlFor="edit-type"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Type
                      </label>
                      <select
                        id="edit-type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Agricultural">Agricultural</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
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
                      placeholder="e.g., 500 sqm"
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

              {/* Documents and Images Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">
                  Documents & Images
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Land Documents
                    </label>
                    <div className="mb-2">
                      <input
                        type="file"
                        ref={documentInputRef}
                        onChange={handleDocumentInput}
                        className="hidden"
                        multiple
                        accept=".pdf,.doc,.docx"
                      />
                      <button
                        type="button"
                        onClick={() => documentInputRef.current.click()}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                      >
                        Upload Documents
                      </button>
                    </div>

                    {formData.documents.length > 0 && (
                      <ul className="mt-2 border border-gray-200 rounded-md divide-y">
                        {formData.documents.map((doc, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center p-3"
                          >
                            <div className="flex items-center">
                              <svg
                                className="w-5 h-5 mr-2 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              <span className="text-sm truncate max-w-xs">
                                {doc.name ? doc.name : `Document ${index + 1}`}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeDocument(index)}
                              className="text-red-500 hover:text-red-700"
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Brochure
                    </label>
                    <div className="mb-2">
                      <input
                        type="file"
                        ref={brochureInputRef}
                        onChange={handleBrochureInput}
                        className="hidden"
                        accept=".pdf"
                      />
                      <button
                        type="button"
                        onClick={() => brochureInputRef.current.click()}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                      >
                        {formData.brochure
                          ? "Replace Brochure"
                          : "Upload Brochure"}
                      </button>
                    </div>

                    {formData.brochure && (
                      <div className="mt-2 border border-gray-200 rounded-md p-3 flex justify-between items-center">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="text-sm truncate max-w-xs">
                            {formData.brochure.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={removeBrochure}
                          className="text-red-500 hover:text-red-700"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Property Images
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
                      Add More Images
                    </button>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                            <img
                              src={img.preview || img.url}
                              alt={img.alt || `Property image ${index + 1}`}
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

              <div className="flex justify-end mt-6">
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

      {/* View Property Modal */}
      {isViewModalOpen && currentProperty && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
                {currentProperty.images && currentProperty.images.length > 0 ? (
                  <div className="mb-6">
                    <div className="bg-gray-100 rounded-md overflow-hidden h-48 mb-4">
                      <img
                        src={currentProperty.images[0].url}
                        alt={
                          currentProperty.images[0].alt || "Property main image"
                        }
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {currentProperty.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {currentProperty.images
                          .slice(1, 5)
                          .map((image, index) => (
                            <div
                              key={index}
                              className="bg-gray-100 rounded-md overflow-hidden h-20"
                            >
                              <img
                                src={image.url}
                                alt={image.alt || `Property image ${index + 2}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ) : (
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
                )}

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
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="text-lg font-semibold">
                      {currentProperty.type}
                    </p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-xs text-gray-500">Area</p>
                    <p className="text-lg font-semibold">
                      {currentProperty.area}
                    </p>
                  </div>
                </div>

                {currentProperty.features &&
                  currentProperty.features.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Features</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {currentProperty.features.map((feature, index) => (
                          <li key={index} className="text-gray-600">
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {currentProperty.landmarks &&
                  currentProperty.landmarks.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">
                        Nearby Landmarks
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {currentProperty.landmarks.map((landmark, index) => (
                          <li key={index} className="text-gray-600">
                            {landmark}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Property Details</h3>
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

                {currentProperty.documents &&
                  currentProperty.documents.length > 0 && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h3 className="text-lg font-semibold mb-2">Documents</h3>
                      <ul className="border border-gray-200 rounded-md divide-y">
                        {currentProperty.documents.map((doc, index) => (
                          <li key={index} className="flex items-center p-3">
                            <svg
                              className="w-5 h-5 mr-2 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span className="text-sm text-gray-600">
                              {doc.name || `Document ${index + 1}`}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {currentProperty.brochure && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h3 className="text-lg font-semibold mb-2">Brochure</h3>
                    <div className="border border-gray-200 rounded-md p-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="text-sm text-gray-600">
                        {currentProperty.brochure.name}
                      </span>
                    </div>
                  </div>
                )}

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
