"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  getArchitecturalDesignServices,
  getAdminServices,
  addService,
  editService,
  deleteService,
} from "../../../../utils/api";
import {
  getAdminServices,
  addAdminService,
  editAdminService,
  deleteAdminService,
} from "../../../../utils/api";

export default function ManageArchitecturalDesign() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    designType: "Residential",
    price: "",
    description: "",
    features: "",
    process: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const router = useRouter();

  // Fetch services function
  const fetchServices = async () => {
    try {
      const response = await getAdminServices();

      if (!response.success) {
        throw new Error("Failed to fetch services");
      }

      // Filter for architectural design services and format the data
      const architecturalServices = response.data
        .filter(
          (service) =>
            service.category === "Architectural Design" ||
            service.type === "Architectural Design" ||
            service.title.toLowerCase().includes("design") ||
            service.title.toLowerCase().includes("architectural")
        )
        .map((service) => ({
          id: service._id || service.id,
          title: service.title,
          designType: service.designType || service.type || "Residential",
          price: service.price || "Contact for pricing",
          description: service.description,
          features: service.features || "",
          process: service.process || "",
          createdAt: service.createdAt,
        }));

      setServices(architecturalServices);
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

  // Fetch services on component mount
  useEffect(() => {
    const token = Cookies.get("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchServices().catch((error) => {
      console.error("Error in useEffect fetchServices:", error);
    });
  }, [router]);

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.price.trim()) {
      errors.price = "Price is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open add modal
  const openAddModal = () => {
    setFormData({
      title: "",
      designType: "Residential",
      price: "",
      description: "",
      features: "",
      process: "",
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (service) => {
    setCurrentService(service);
    setFormData({
      title: service.title,
      designType: service.designType,
      price: service.price,
      description: service.description,
      features: service.features,
      process: service.process,
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
      const serviceData = {
        title: formData.title,
        category: "Architectural Design",
        type: formData.designType,
        price: formData.price,
        description: formData.description,
        features: formData.features,
        process: formData.process,
      };

      const response = await addService(serviceData);

      if (response.success) {
        // Refresh the services list
        await fetchServices();
        closeModals();
        alert("Architectural Design service added successfully!");
      } else {
        throw new Error(response.message || "Failed to add service");
      }
    } catch (error) {
      console.error("Error adding service:", error);
      if (error.message === "Access denied. No token provided.") {
        router.push("/admin/login");
      } else {
        alert("Failed to add service: " + error.message);
      }
    }
  };

  // Handle edit service
  const handleEditService = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const serviceData = {
        title: formData.title,
        category: "Architectural Design",
        type: formData.designType,
        price: formData.price,
        description: formData.description,
        features: formData.features,
        process: formData.process,
      };

      const response = await editService(currentService.id, serviceData);

      if (response.success) {
        // Refresh the services list
        await fetchServices();
        closeModals();
        alert("Architectural Design service updated successfully!");
      } else {
        throw new Error(response.message || "Failed to update service");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      if (error.message === "Access denied. No token provided.") {
        router.push("/admin/login");
      } else {
        alert("Failed to update service: " + error.message);
      }
    }
  };

  // Handle delete service
  const handleDeleteService = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        const response = await deleteService(id);

        if (response.success) {
          // Refresh the services list
          await fetchServices();
          alert("Architectural Design service deleted successfully!");
        } else {
          throw new Error(response.message || "Failed to delete service");
        }
      } catch (error) {
        console.error("Error deleting service:", error);
        if (error.message === "Access denied. No token provided.") {
          router.push("/admin/login");
        } else {
          alert("Failed to delete service: " + error.message);
        }
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
          Manage Architectural Design Services
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
                  Design Type
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
                      {service.designType}
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
              Add New Architectural Design Service
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
                    htmlFor="designType"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Design Type*
                  </label>
                  <select
                    id="designType"
                    name="designType"
                    value={formData.designType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Renovation">Renovation</option>
                    <option value="Interior">Interior</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="price"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Price Range*
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
                  placeholder="e.g. $5,000 - $10,000"
                />
                {formErrors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.price}
                  </p>
                )}
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
                  placeholder="e.g. Custom floor plans, 3D visualization, Interior design integration"
                ></textarea>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="process"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Design Process (comma separated)
                </label>
                <textarea
                  id="process"
                  name="process"
                  value={formData.process}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Initial consultation, Concept development, Design refinement"
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
              Edit Architectural Design Service
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
                    htmlFor="designType"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Design Type*
                  </label>
                  <select
                    id="designType"
                    name="designType"
                    value={formData.designType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Renovation">Renovation</option>
                    <option value="Interior">Interior</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="price"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Price Range*
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
                  htmlFor="process"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Design Process (comma separated)
                </label>
                <textarea
                  id="process"
                  name="process"
                  value={formData.process}
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
                <p className="text-gray-600 mb-1">Design Type</p>
                <p className="text-lg">{currentService.designType}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Price Range</p>
                <p className="text-lg">{currentService.price}</p>
              </div>
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
              <p className="text-gray-600 mb-1">Design Process</p>
              <ol className="list-decimal pl-5">
                {currentService.process.split(",").map((step, index) => (
                  <li key={index} className="text-lg">
                    {step.trim()}
                  </li>
                ))}
              </ol>
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
