"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function ManageLandSurvey() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    surveyType: "Boundary",
    price: "",
    description: "",
    features: "",
    process: "",
    equipment: "",
    typicalTimeframe: "",
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
            title: "Boundary Survey",
            surveyType: "Boundary",
            price: "$800 - $1,200",
            description: "Professional boundary survey to determine property lines and identify encroachments.",
            features: "Accurate property boundary determination, Identification of encroachments, Location of easements",
            process: "Initial consultation, Research of property records, Field work, Data processing, Report generation",
            equipment: "GPS receivers, Total stations, Laser scanners",
            typicalTimeframe: "1-2 weeks",
            createdAt: "2023-01-05",
          },
          {
            id: 2,
            title: "Topographic Survey",
            surveyType: "Topographic",
            price: "$1,500 - $3,000",
            description: "Detailed topographic survey showing elevation changes, natural features, and man-made structures.",
            features: "Elevation contours, Natural features mapping, Structure locations, Utility locations",
            process: "Site assessment, Field measurements, Data collection, Contour mapping, Final deliverables",
            equipment: "Drones, 3D scanners, GPS equipment, Advanced software",
            typicalTimeframe: "2-3 weeks",
            createdAt: "2023-02-10",
          },
          {
            id: 3,
            title: "ALTA/NSPS Land Title Survey",
            surveyType: "ALTA/NSPS",
            price: "$2,500 - $5,000",
            description: "Comprehensive survey meeting the requirements of the American Land Title Association and National Society of Professional Surveyors.",
            features: "Boundary determination, Improvement locations, Easement identification, Title commitment review",
            process: "Title review, Field survey, Data analysis, Drafting, Quality control, Certification",
            equipment: "High-precision GPS, Robotic total stations, Data collectors",
            typicalTimeframe: "3-4 weeks",
            createdAt: "2023-03-15",
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

    if (!formData.typicalTimeframe.trim()) {
      errors.typicalTimeframe = "Typical timeframe is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open add modal
  const openAddModal = () => {
    setFormData({
      title: "",
      surveyType: "Boundary",
      price: "",
      description: "",
      features: "",
      process: "",
      equipment: "",
      typicalTimeframe: "",
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (service) => {
    setCurrentService(service);
    setFormData({
      title: service.title,
      surveyType: service.surveyType,
      price: service.price,
      description: service.description,
      features: service.features,
      process: service.process,
      equipment: service.equipment,
      typicalTimeframe: service.typicalTimeframe,
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
      surveyType: formData.surveyType,
      price: formData.price,
      description: formData.description,
      features: formData.features,
      process: formData.process,
      equipment: formData.equipment,
      typicalTimeframe: formData.typicalTimeframe,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setServices([...services, newService]);
    closeModals();

    // Show success message (in a real app)
    alert("Land Survey service added successfully!");
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
          surveyType: formData.surveyType,
          price: formData.price,
          description: formData.description,
          features: formData.features,
          process: formData.process,
          equipment: formData.equipment,
          typicalTimeframe: formData.typicalTimeframe,
        };
      }
      return service;
    });

    setServices(updatedServices);
    closeModals();

    // Show success message (in a real app)
    alert("Land Survey service updated successfully!");
  };

  // Handle delete service
  const handleDeleteService = (id) => {
    // In a real app, this would be an API call
    // For demo purposes, just update the state
    const updatedServices = services.filter((service) => service.id !== id);
    setServices(updatedServices);

    // Show success message (in a real app)
    alert("Land Survey service deleted successfully!");
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
        <h1 className="text-2xl font-bold">Manage Land Survey Services</h1>
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
                  Survey Type
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
                  Timeframe
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
                    <div className="text-sm text-gray-500">{service.surveyType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{service.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{service.typicalTimeframe}</div>
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
            <h2 className="text-2xl font-bold mb-6">Add New Land Survey Service</h2>
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
                    <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="surveyType"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Survey Type*
                  </label>
                  <select
                    id="surveyType"
                    name="surveyType"
                    value={formData.surveyType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  >
                    <option value="Boundary">Boundary</option>
                    <option value="Topographic">Topographic</option>
                    <option value="ALTA/NSPS">ALTA/NSPS</option>
                    <option value="Construction">Construction</option>
                    <option value="Subdivision">Subdivision</option>
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
                    placeholder="e.g. $800 - $1,200"
                  />
                  {formErrors.price && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="typicalTimeframe"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Typical Timeframe*
                  </label>
                  <input
                    type="text"
                    id="typicalTimeframe"
                    name="typicalTimeframe"
                    value={formData.typicalTimeframe}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      formErrors.typicalTimeframe ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue`}
                    placeholder="e.g. 1-2 weeks"
                  />
                  {formErrors.typicalTimeframe && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.typicalTimeframe}</p>
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
                    formErrors.description ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue`}
                ></textarea>
                {formErrors.description && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
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
                  placeholder="e.g. Accurate property boundary determination, Identification of encroachments"
                ></textarea>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="process"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Survey Process (comma separated)
                </label>
                <textarea
                  id="process"
                  name="process"
                  value={formData.process}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  placeholder="e.g. Initial consultation, Research of property records, Field work"
                ></textarea>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="equipment"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Equipment Used (comma separated)
                </label>
                <textarea
                  id="equipment"
                  name="equipment"
                  value={formData.equipment}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  placeholder="e.g. GPS receivers, Total stations, Laser scanners"
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
            <h2 className="text-2xl font-bold mb-6">Edit Land Survey Service</h2>
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
                    <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="surveyType"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Survey Type*
                  </label>
                  <select
                    id="surveyType"
                    name="surveyType"
                    value={formData.surveyType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  >
                    <option value="Boundary">Boundary</option>
                    <option value="Topographic">Topographic</option>
                    <option value="ALTA/NSPS">ALTA/NSPS</option>
                    <option value="Construction">Construction</option>
                    <option value="Subdivision">Subdivision</option>
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
                    <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="typicalTimeframe"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Typical Timeframe*
                  </label>
                  <input
                    type="text"
                    id="typicalTimeframe"
                    name="typicalTimeframe"
                    value={formData.typicalTimeframe}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      formErrors.typicalTimeframe ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue`}
                  />
                  {formErrors.typicalTimeframe && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.typicalTimeframe}</p>
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
                    formErrors.description ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue`}
                ></textarea>
                {formErrors.description && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
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
                  htmlFor="process"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Survey Process (comma separated)
                </label>
                <textarea
                  id="process"
                  name="process"
                  value={formData.process}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                ></textarea>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="equipment"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Equipment Used (comma separated)
                </label>
                <textarea
                  id="equipment"
                  name="equipment"
                  value={formData.equipment}
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
                <p className="text-gray-600 mb-1">Survey Type</p>
                <p className="text-lg">{currentService.surveyType}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Price Range</p>
                <p className="text-lg">{currentService.price}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-1">Typical Timeframe</p>
              <p className="text-lg">{currentService.typicalTimeframe}</p>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-1">Description</p>
              <p className="text-lg">{currentService.description}</p>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-1">Features</p>
              <ul className="list-disc pl-5">
                {currentService.features.split(',').map((feature, index) => (
                  <li key={index} className="text-lg">{feature.trim()}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-1">Survey Process</p>
              <ol className="list-decimal pl-5">
                {currentService.process.split(',').map((step, index) => (
                  <li key={index} className="text-lg">{step.trim()}</li>
                ))}
              </ol>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-1">Equipment Used</p>
              <ul className="list-disc pl-5">
                {currentService.equipment.split(',').map((item, index) => (
                  <li key={index} className="text-lg">{item.trim()}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-1">Created</p>
              <p className="text-lg">{new Date(currentService.createdAt).toLocaleDateString()}</p>
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
