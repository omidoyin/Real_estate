"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function ManageGeneralContracts() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    contractType: "Residential",
    price: "",
    description: "",
    features: "",
    services: "",
    estimatedTimeline: "",
    projectManager: "",
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
        // In a real app, this would be an API call
        // For now, we'll use mock data
        const mockServices = [
          {
            id: 1,
            title: "Residential Construction",
            contractType: "Residential",
            price: "$150,000 - $500,000",
            description:
              "Complete residential construction services from foundation to finishing touches.",
            features:
              "Complete project management, Quality craftsmanship, Transparent pricing, Adherence to timelines",
            services:
              "New home construction, Home additions, Kitchen and bathroom remodeling, Basement finishing",
            estimatedTimeline: "6-12 months",
            projectManager: "John Smith",
            createdAt: "2023-01-20",
          },
          {
            id: 2,
            title: "Commercial Building Construction",
            contractType: "Commercial",
            price: "$500,000 - $5,000,000",
            description:
              "Professional commercial construction services for office buildings, retail spaces, and more.",
            features:
              "Building code compliance, Regular progress updates, Warranty on workmanship, Post-construction support",
            services:
              "Office buildings, Retail spaces, Restaurants, Medical facilities",
            estimatedTimeline: "12-24 months",
            projectManager: "Sarah Johnson",
            createdAt: "2023-02-15",
          },
          {
            id: 3,
            title: "Renovation Services",
            contractType: "Renovation",
            price: "$50,000 - $200,000",
            description:
              "Expert renovation services to transform existing spaces into beautiful, functional environments.",
            features:
              "Minimal disruption, Quality materials, Expert craftsmen, Detailed planning",
            services:
              "Home renovations, Commercial renovations, Historic renovations, Green renovations",
            estimatedTimeline: "3-6 months",
            projectManager: "Michael Brown",
            createdAt: "2023-03-10",
          },
        ];

        setServices(mockServices);
      } catch (error) {
        console.error("Error fetching services:", error);
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

    if (!formData.price.trim()) {
      errors.price = "Price is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.estimatedTimeline.trim()) {
      errors.estimatedTimeline = "Estimated timeline is required";
    }

    if (!formData.projectManager.trim()) {
      errors.projectManager = "Project manager is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open add modal
  const openAddModal = () => {
    setFormData({
      title: "",
      contractType: "Residential",
      price: "",
      description: "",
      features: "",
      services: "",
      estimatedTimeline: "",
      projectManager: "",
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (service) => {
    setCurrentService(service);
    setFormData({
      title: service.title,
      contractType: service.contractType,
      price: service.price,
      description: service.description,
      features: service.features,
      services: service.services,
      estimatedTimeline: service.estimatedTimeline,
      projectManager: service.projectManager,
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
  const handleAddService = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // In a real app, this would be an API call
    // For demo purposes, just add to the state
    const newService = {
      id: services.length + 1,
      title: formData.title,
      contractType: formData.contractType,
      price: formData.price,
      description: formData.description,
      features: formData.features,
      services: formData.services,
      estimatedTimeline: formData.estimatedTimeline,
      projectManager: formData.projectManager,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setServices([...services, newService]);
    closeModals();

    // Show success message (in a real app)
    alert("General Contract service added successfully!");
  };

  // Handle edit service
  const handleEditService = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // In a real app, this would be an API call
    // For demo purposes, just update the state
    const updatedServices = services.map((service) => {
      if (service.id === currentService.id) {
        return {
          ...service,
          title: formData.title,
          contractType: formData.contractType,
          price: formData.price,
          description: formData.description,
          features: formData.features,
          services: formData.services,
          estimatedTimeline: formData.estimatedTimeline,
          projectManager: formData.projectManager,
        };
      }
      return service;
    });

    setServices(updatedServices);
    closeModals();

    // Show success message (in a real app)
    alert("General Contract service updated successfully!");
  };

  // Handle delete service
  const handleDeleteService = (id) => {
    // In a real app, this would be an API call
    // For demo purposes, just update the state
    const updatedServices = services.filter((service) => service.id !== id);
    setServices(updatedServices);

    // Show success message (in a real app)
    alert("General Contract service deleted successfully!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Manage General Contracts Services
        </h1>
        <button
          className="bg-primary-blue text-white px-4 py-2 rounded-md hover:bg-accent-green"
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
                  Contract Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price Range
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Timeline
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
                        className="hover:text-primary-blue focus:outline-none"
                        onClick={() => openViewModal(service)}
                      >
                        {service.title}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {service.contractType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{service.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {service.estimatedTimeline}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(service.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-primary-blue hover:text-accent-green mr-3"
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
              Add New General Contract Service
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
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue`}
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.title}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="contractType"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Contract Type*
                  </label>
                  <select
                    id="contractType"
                    name="contractType"
                    value={formData.contractType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Renovation">Renovation</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
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
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue`}
                    placeholder="e.g. $150,000 - $500,000"
                  />
                  {formErrors.price && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.price}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="estimatedTimeline"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Estimated Timeline*
                  </label>
                  <input
                    type="text"
                    id="estimatedTimeline"
                    name="estimatedTimeline"
                    value={formData.estimatedTimeline}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      formErrors.estimatedTimeline
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue`}
                    placeholder="e.g. 6-12 months"
                  />
                  {formErrors.estimatedTimeline && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.estimatedTimeline}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="projectManager"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Project Manager*
                </label>
                <input
                  type="text"
                  id="projectManager"
                  name="projectManager"
                  value={formData.projectManager}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border ${
                    formErrors.projectManager
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue`}
                />
                {formErrors.projectManager && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.projectManager}
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
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue`}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  placeholder="e.g. Complete project management, Quality craftsmanship, Transparent pricing"
                ></textarea>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="services"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Services Offered (comma separated)
                </label>
                <textarea
                  id="services"
                  name="services"
                  value={formData.services}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  placeholder="e.g. New home construction, Home additions, Kitchen and bathroom remodeling"
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
                  className="bg-primary-blue text-white px-4 py-2 rounded-md hover:bg-accent-green"
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
              Edit General Contract Service
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
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue`}
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.title}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="contractType"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Contract Type*
                  </label>
                  <select
                    id="contractType"
                    name="contractType"
                    value={formData.contractType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Renovation">Renovation</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
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
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue`}
                  />
                  {formErrors.price && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.price}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="estimatedTimeline"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Estimated Timeline*
                  </label>
                  <input
                    type="text"
                    id="estimatedTimeline"
                    name="estimatedTimeline"
                    value={formData.estimatedTimeline}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      formErrors.estimatedTimeline
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue`}
                  />
                  {formErrors.estimatedTimeline && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.estimatedTimeline}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="projectManager"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Project Manager*
                </label>
                <input
                  type="text"
                  id="projectManager"
                  name="projectManager"
                  value={formData.projectManager}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border ${
                    formErrors.projectManager
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue`}
                />
                {formErrors.projectManager && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.projectManager}
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
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue`}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                ></textarea>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="services"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Services Offered (comma separated)
                </label>
                <textarea
                  id="services"
                  name="services"
                  value={formData.services}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
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
                  className="bg-primary-blue text-white px-4 py-2 rounded-md hover:bg-accent-green"
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
                <p className="text-gray-600 mb-1">Contract Type</p>
                <p className="text-lg">{currentService.contractType}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Price Range</p>
                <p className="text-lg">{currentService.price}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-gray-600 mb-1">Estimated Timeline</p>
                <p className="text-lg">{currentService.estimatedTimeline}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Project Manager</p>
                <p className="text-lg">{currentService.projectManager}</p>
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
              <p className="text-gray-600 mb-1">Services Offered</p>
              <ul className="list-disc pl-5">
                {currentService.services.split(",").map((service, index) => (
                  <li key={index} className="text-lg">
                    {service.trim()}
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
                className="bg-primary-blue text-white px-4 py-2 rounded-md hover:bg-accent-green"
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
