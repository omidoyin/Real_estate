"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  getInspections,
  addInspection,
  updateInspection,
  deleteInspection,
} from "../../../../utils/api";

export default function ManageInspections() {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentInspection, setCurrentInspection] = useState(null);
  const [formData, setFormData] = useState({
    client: "",
    property: "",
    date: "",
    time: "",
    status: "Scheduled",
    agent: "",
    contact: "",
    notes: "",
    // Additional fields for API integration
    clientId: "",
    propertyId: "",
    propertyType: "Land",
    agentId: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const router = useRouter();

  // Helper function to format inspection data
  const formatInspectionData = (data) => {
    return data.map((inspection) => {
      // Extract client name and contact from client object
      const clientName = inspection.client
        ? inspection.client.name
        : "Unknown Client";
      const clientContact = inspection.client
        ? inspection.client.email
        : "No contact";

      // Extract property name
      const propertyName = inspection.property
        ? inspection.property.title
        : "Unknown Property";

      // Extract agent name
      const agentName = inspection.agent
        ? inspection.agent.name
        : "Unknown Agent";

      return {
        id: inspection._id,
        client: clientName,
        property: propertyName,
        date: inspection.date,
        status: inspection.status,
        agent: agentName,
        contact: clientContact,
        notes: inspection.notes || "",
        feedback: inspection.feedback || "",
        followUpDate: inspection.followUpDate,
        // Store original references for API calls
        clientId: inspection.client ? inspection.client._id : null,
        propertyId: inspection.property ? inspection.property._id : null,
        propertyType: inspection.propertyType,
        agentId: inspection.agent ? inspection.agent._id : null,
      };
    });
  };

  // Format date for input field
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Format time for input field
  const formatTimeForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toTimeString().split(" ")[0].substring(0, 5);
  };

  // Combine date and time into ISO string
  const combineDateAndTime = (date, time) => {
    return `${date}T${time}:00`;
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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

    if (!formData.client.trim()) {
      errors.client = "Client name is required";
    }

    if (!formData.property.trim()) {
      errors.property = "Property is required";
    }

    if (!formData.date) {
      errors.date = "Date is required";
    }

    if (!formData.time) {
      errors.time = "Time is required";
    }

    if (!formData.agent.trim()) {
      errors.agent = "Agent is required";
    }

    if (!formData.contact.trim()) {
      errors.contact = "Contact information is required";
    } else if (
      formData.contact.includes("@") &&
      !/\S+@\S+\.\S+/.test(formData.contact)
    ) {
      errors.contact = "Email is invalid";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open add modal
  const openAddModal = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    const formattedTime = "10:00";

    setFormData({
      client: "",
      property: "",
      date: formattedDate,
      time: formattedTime,
      status: "Scheduled",
      agent: "",
      contact: "",
      notes: "",
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (inspection) => {
    setCurrentInspection(inspection);
    setFormData({
      client: inspection.client,
      property: inspection.property,
      date: formatDateForInput(inspection.date),
      time: formatTimeForInput(inspection.date),
      status: inspection.status,
      agent: inspection.agent,
      contact: inspection.contact,
      notes: inspection.notes || "",
      // Additional fields for API integration
      clientId: inspection.clientId || "",
      propertyId: inspection.propertyId || "",
      propertyType: inspection.propertyType || "Land",
      agentId: inspection.agentId || "",
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // Open view modal
  const openViewModal = (inspection) => {
    setCurrentInspection(inspection);
    setIsViewModalOpen(true);
  };

  // Close modals
  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
  };

  // Handle add inspection
  const handleAddInspection = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Prepare data for API
      const inspectionData = {
        client: formData.clientId, // This would need to be selected from a dropdown
        property: formData.propertyId, // This would need to be selected from a dropdown
        propertyType: formData.propertyType || "Land", // Default to Land if not specified
        date: combineDateAndTime(formData.date, formData.time),
        status: formData.status,
        agent: formData.agentId, // This would need to be selected from a dropdown
        notes: formData.notes,
      };

      const response = await addInspection(inspectionData);

      if (!response.success) {
        throw new Error(response.message || "Failed to add inspection");
      }

      // Refresh the inspections list
      const response2 = await getInspections();

      if (response2.success) {
        const formattedInspections = formatInspectionData(response2.data);

        setInspections(formattedInspections);
      }

      closeModals();
      alert("Inspection scheduled successfully!");
    } catch (error) {
      console.error("Error adding inspection:", error);
      alert("Failed to add inspection: " + error.message);
    }
  };

  // Handle edit inspection
  const handleEditInspection = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Prepare data for API
      const inspectionData = {
        client: formData.clientId,
        property: formData.propertyId,
        propertyType: formData.propertyType,
        date: combineDateAndTime(formData.date, formData.time),
        status: formData.status,
        agent: formData.agentId,
        notes: formData.notes,
      };

      const response = await updateInspection(
        currentInspection.id,
        inspectionData
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to update inspection");
      }

      // Refresh the inspections list
      const response2 = await getInspections();

      if (response2.success) {
        const formattedInspections = formatInspectionData(response2.data);

        setInspections(formattedInspections);
      }

      closeModals();
      alert("Inspection updated successfully!");
    } catch (error) {
      console.error("Error updating inspection:", error);
      alert("Failed to update inspection: " + error.message);
    }
  };

  // Handle cancel inspection
  const handleCancelInspection = async (inspectionId) => {
    if (window.confirm("Are you sure you want to cancel this inspection?")) {
      try {
        const response = await updateInspection(inspectionId, {
          status: "Cancelled",
        });

        if (!response.success) {
          throw new Error(response.message || "Failed to cancel inspection");
        }

        // Refresh the inspections list
        const response2 = await getInspections();

        if (response2.success) {
          const formattedInspections = formatInspectionData(response2.data);

          setInspections(formattedInspections);
        }

        alert("Inspection cancelled successfully!");
      } catch (error) {
        console.error("Error cancelling inspection:", error);
        alert("Failed to cancel inspection: " + error.message);
      }
    }
  };

  // Handle complete inspection
  const handleCompleteInspection = async (inspectionId) => {
    if (window.confirm("Mark this inspection as completed?")) {
      try {
        const response = await updateInspection(inspectionId, {
          status: "Completed",
        });

        if (!response.success) {
          throw new Error(response.message || "Failed to complete inspection");
        }

        // Refresh the inspections list
        const response2 = await getInspections();

        if (response2.success) {
          const formattedInspections = formatInspectionData(response2.data);

          setInspections(formattedInspections);
        }

        alert("Inspection marked as completed!");
      } catch (error) {
        console.error("Error completing inspection:", error);
        alert("Failed to complete inspection: " + error.message);
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

    // Fetch inspections data
    const fetchInspections = async () => {
      try {
        setLoading(true);

        const response = await getInspections();

        if (!response.success) {
          throw new Error("Failed to fetch inspections");
        }

        const formattedInspections = formatInspectionData(response.data);

        setInspections(formattedInspections);
      } catch (error) {
        console.error("Error fetching inspections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInspections();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Inspections</h1>
          <button
            onClick={openAddModal}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover"
          >
            Schedule Inspection
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
                    Client
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Property
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date & Time
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
                    Agent
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contact
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
                {inspections.map((inspection) => (
                  <tr key={inspection.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {inspection.client}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {inspection.property}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(inspection.date).toLocaleDateString()} at{" "}
                        {new Date(inspection.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          inspection.status === "Scheduled"
                            ? "bg-blue-100 text-blue-800"
                            : inspection.status === "Confirmed"
                            ? "bg-green-100 text-green-800"
                            : inspection.status === "Completed"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {inspection.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {inspection.agent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {inspection.contact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openViewModal(inspection)}
                        className="text-gray-600 hover:text-gray-900 mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditModal(inspection)}
                        className="text-primary hover:text-primary-text mr-3"
                      >
                        Edit
                      </button>
                      {inspection.status !== "Completed" &&
                        inspection.status !== "Cancelled" && (
                          <>
                            <button
                              onClick={() =>
                                handleCancelInspection(inspection.id)
                              }
                              className="text-red-600 hover:text-red-800 mr-3"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() =>
                                handleCompleteInspection(inspection.id)
                              }
                              className="text-green-600 hover:text-green-800"
                            >
                              Complete
                            </button>
                          </>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Inspection Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Schedule Inspection</h2>
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

            <form onSubmit={handleAddInspection}>
              <div className="mb-4">
                <label
                  htmlFor="client"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Client Name*
                </label>
                <input
                  type="text"
                  id="client"
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border ${
                    formErrors.client ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                />
                {formErrors.client && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.client}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="property"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Property*
                </label>
                <input
                  type="text"
                  id="property"
                  name="property"
                  value={formData.property}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border ${
                    formErrors.property ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                />
                {formErrors.property && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.property}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Date*
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      formErrors.date ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  />
                  {formErrors.date && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.date}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="time"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Time*
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      formErrors.time ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  />
                  {formErrors.time && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.time}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
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
                  <option value="Scheduled">Scheduled</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="agent"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Agent*
                </label>
                <input
                  type="text"
                  id="agent"
                  name="agent"
                  value={formData.agent}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border ${
                    formErrors.agent ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                />
                {formErrors.agent && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.agent}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="contact"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Contact Information*
                </label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border ${
                    formErrors.contact ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  placeholder="Email or phone number"
                />
                {formErrors.contact && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.contact}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="notes"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
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
                  Schedule Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Inspection Modal */}
      {isEditModalOpen && currentInspection && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Inspection</h2>
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

            <form onSubmit={handleEditInspection}>
              <div className="mb-4">
                <label
                  htmlFor="edit-client"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Client Name*
                </label>
                <input
                  type="text"
                  id="edit-client"
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border ${
                    formErrors.client ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                />
                {formErrors.client && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.client}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="edit-property"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Property*
                </label>
                <input
                  type="text"
                  id="edit-property"
                  name="property"
                  value={formData.property}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border ${
                    formErrors.property ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                />
                {formErrors.property && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.property}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="edit-date"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Date*
                  </label>
                  <input
                    type="date"
                    id="edit-date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      formErrors.date ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  />
                  {formErrors.date && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.date}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="edit-time"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Time*
                  </label>
                  <input
                    type="time"
                    id="edit-time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      formErrors.time ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  />
                  {formErrors.time && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.time}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
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
                  <option value="Scheduled">Scheduled</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="edit-agent"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Agent*
                </label>
                <input
                  type="text"
                  id="edit-agent"
                  name="agent"
                  value={formData.agent}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border ${
                    formErrors.agent ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                />
                {formErrors.agent && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.agent}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="edit-contact"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Contact Information*
                </label>
                <input
                  type="text"
                  id="edit-contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border ${
                    formErrors.contact ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  placeholder="Email or phone number"
                />
                {formErrors.contact && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.contact}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="edit-notes"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Notes
                </label>
                <textarea
                  id="edit-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
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

      {/* View Inspection Modal */}
      {isViewModalOpen && currentInspection && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Inspection Details</h2>
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
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">
                    Client Information
                  </h3>
                  <p className="text-gray-700">
                    <span className="font-semibold">Name:</span>{" "}
                    {currentInspection.client}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Contact:</span>{" "}
                    {currentInspection.contact}
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Property</h3>
                  <p className="text-gray-700">{currentInspection.property}</p>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">
                    Inspection Details
                  </h3>
                  <p className="text-gray-700">
                    <span className="font-semibold">Date & Time:</span>{" "}
                    {new Date(currentInspection.date).toLocaleDateString()} at{" "}
                    {new Date(currentInspection.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Status:</span>{" "}
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        currentInspection.status === "Scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : currentInspection.status === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : currentInspection.status === "Completed"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {currentInspection.status}
                    </span>
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Agent:</span>{" "}
                    {currentInspection.agent}
                  </p>
                </div>
              </div>
            </div>

            {currentInspection.notes && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4 mt-2">
                <h3 className="text-lg font-medium mb-2">Notes</h3>
                <p className="text-gray-700">{currentInspection.notes}</p>
              </div>
            )}

            <div className="flex justify-end space-x-2 mt-6">
              <button
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover"
                onClick={() => {
                  closeModals();
                  openEditModal(currentInspection);
                }}
              >
                Edit Inspection
              </button>
              {currentInspection.status !== "Completed" &&
                currentInspection.status !== "Cancelled" && (
                  <>
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                      onClick={() => {
                        closeModals();
                        handleCancelInspection(currentInspection.id);
                      }}
                    >
                      Cancel Inspection
                    </button>
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                      onClick={() => {
                        closeModals();
                        handleCompleteInspection(currentInspection.id);
                      }}
                    >
                      Mark as Completed
                    </button>
                  </>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
