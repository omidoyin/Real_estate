"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  getEstateManagementServices,
  addService,
  editService,
  deleteService,
} from "../../../../utils/api";

export default function ManageEstateManagement() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    propertyType: "Residential",
    location: "",
    description: "",
    price: "",
    features: "",
    benefits: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const router = useRouter();

  // Fetch services on component mount
  useEffect(() => {
    const token = Cookies.get("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchServices = async () => {
      try {
        setLoading(true);

        const response = await getEstateManagementServices();

        if (!response.success) {
          throw new Error("Failed to fetch estate management services");
        }

        // Format the data to match the expected structure
        const formattedServices = response.data.map((service) => ({
          id: service._id || service.id,
          title: service.title,
          propertyType: service.propertyType,
          location: service.location,
          description: service.description,
          price: service.price,
          features: Array.isArray(service.features)
            ? service.features.join(", ")
            : service.features,
          benefits: Array.isArray(service.benefits)
            ? service.benefits.join(", ")
            : service.benefits,
          createdAt: service.createdAt,
        }));

        setServices(formattedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
        if (error.message === "Access denied. No token provided.") {
          router.push("/admin/login");
        } else {
          alert("Failed to load services: " + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [router]);

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.price.trim()) {
      errors.price = "Price is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open add modal
  const openAddModal = () => {
    setFormData({
      title: "",
      propertyType: "Residential",
      location: "",
      description: "",
      price: "",
      features: "",
      benefits: "",
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (service) => {
    setCurrentService(service);
    setFormData({
      title: service.title,
      propertyType: service.propertyType,
      location: service.location,
      description: service.description,
      price: service.price,
      features: service.features,
      benefits: service.benefits,
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // Open view modal
  const openViewModal = (service) => {
    setCurrentService(service);
    setIsViewModalOpen(true);
  };

  // Close modals
  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle add service
  const handleAddService = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const serviceData = {
        title: formData.title,
        serviceType: "Estate Management",
        propertyType: formData.propertyType,
        location: formData.location,
        description: formData.description,
        price: formData.price,
        features: formData.features
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f),
        benefits: formData.benefits
          .split(",")
          .map((b) => b.trim())
          .filter((b) => b),
        status: "Active",
      };

      const response = await addService(serviceData);

      if (!response.success) {
        throw new Error(response.message || "Failed to add service");
      }

      // Format the new service to match the expected structure
      const newService = {
        id: response.data._id || response.data.id,
        title: response.data.title,
        propertyType: response.data.propertyType,
        location: response.data.location,
        description: response.data.description,
        price: response.data.price,
        features: Array.isArray(response.data.features)
          ? response.data.features.join(", ")
          : response.data.features,
        benefits: Array.isArray(response.data.benefits)
          ? response.data.benefits.join(", ")
          : response.data.benefits,
        createdAt: response.data.createdAt,
      };

      setServices([...services, newService]);
      closeModals();
      setFormData({
        title: "",
        propertyType: "Residential",
        location: "",
        description: "",
        price: "",
        features: "",
        benefits: "",
      });

      alert("Estate Management service added successfully!");
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Failed to add service: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit service
  const handleEditService = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const serviceData = {
        title: formData.title,
        serviceType: "Estate Management",
        propertyType: formData.propertyType,
        location: formData.location,
        description: formData.description,
        price: formData.price,
        features: formData.features
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f),
        benefits: formData.benefits
          .split(",")
          .map((b) => b.trim())
          .filter((b) => b),
      };

      const response = await editService(currentService.id, serviceData);

      if (!response.success) {
        throw new Error(response.message || "Failed to update service");
      }

      // Update the service in the state
      const updatedServices = services.map((service) => {
        if (service.id === currentService.id) {
          return {
            ...service,
            title: response.data.title,
            propertyType: response.data.propertyType,
            location: response.data.location,
            description: response.data.description,
            price: response.data.price,
            features: Array.isArray(response.data.features)
              ? response.data.features.join(", ")
              : response.data.features,
            benefits: Array.isArray(response.data.benefits)
              ? response.data.benefits.join(", ")
              : response.data.benefits,
          };
        }
        return service;
      });

      setServices(updatedServices);
      closeModals();

      alert("Estate Management service updated successfully!");
    } catch (error) {
      console.error("Error updating service:", error);
      alert("Failed to update service: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete service
  const handleDeleteService = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        setLoading(true);

        const response = await deleteService(id);

        if (!response.success) {
          throw new Error(response.message || "Failed to delete service");
        }

        // Remove the service from the state
        const updatedServices = services.filter((service) => service.id !== id);
        setServices(updatedServices);

        alert("Estate Management service deleted successfully!");
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Failed to delete service: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

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
        <h1 className="text-2xl font-bold">
          Manage Estate Management Services
        </h1>
        <button
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover"
          onClick={openAddModal}
        >
          Add New Service
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
                  Property Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Location
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
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      <button
                        className="hover:text-primary focus:outline-none"
                        onClick={() => openViewModal(service)}
                      >
                        {service.title}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {service.propertyType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {service.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{service.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(service.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-primary hover:text-primary-text mr-3"
                      onClick={() => openEditModal(service)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteService(service.id)}
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

      {/* Add Service Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              Add New Estate Management Service
            </h2>
            <form onSubmit={handleAddService}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
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
                    className={`w-full px-4 py-2 border ${
                      formErrors.title ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.title}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="propertyType"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Property Type*
                  </label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Vacation">Vacation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="location"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Location*
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      formErrors.location ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  />
                  {formErrors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.location}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Price*
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      formErrors.price ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                    placeholder="e.g. $200/month"
                  />
                  {formErrors.price && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.price}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full px-4 py-2 border ${
                    formErrors.description
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                ></textarea>
                {formErrors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="features"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Features (comma separated)
                </label>
                <textarea
                  id="features"
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Tenant screening, Rent collection, Maintenance coordination"
                ></textarea>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="benefits"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Benefits (comma separated)
                </label>
                <textarea
                  id="benefits"
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Reduced vacancy, Higher quality tenants"
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
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              Edit Estate Management Service
            </h2>
            <form onSubmit={handleEditService}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
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
                    className={`w-full px-4 py-2 border ${
                      formErrors.title ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.title}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="propertyType"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Property Type*
                  </label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Vacation">Vacation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="location"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Location*
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      formErrors.location ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  />
                  {formErrors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.location}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Price*
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      formErrors.price ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  />
                  {formErrors.price && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.price}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full px-4 py-2 border ${
                    formErrors.description
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                ></textarea>
                {formErrors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="features"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Features (comma separated)
                </label>
                <textarea
                  id="features"
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="benefits"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Benefits (comma separated)
                </label>
                <textarea
                  id="benefits"
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleInputChange}
                  rows="2"
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
                  Update Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Service Modal */}
      {isViewModalOpen && currentService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">{currentService.title}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-gray-600 mb-1">Property Type</p>
                <p className="text-lg">{currentService.propertyType}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Location</p>
                <p className="text-lg">{currentService.location}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-1">Price</p>
              <p className="text-lg">{currentService.price}</p>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-1">Description</p>
              <p className="text-lg">{currentService.description}</p>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-1">Features</p>
              <ul className="list-disc pl-5">
                {currentService.features.split(",").map((feature, index) => (
                  <li key={index} className="text-lg">
                    {feature.trim()}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-1">Benefits</p>
              <ul className="list-disc pl-5">
                {currentService.benefits.split(",").map((benefit, index) => (
                  <li key={index} className="text-lg">
                    {benefit.trim()}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-1">Created</p>
              <p className="text-lg">
                {new Date(currentService.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover"
                onClick={() => {
                  closeModals();
                  openEditModal(currentService);
                }}
              >
                Edit
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={closeModals}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
