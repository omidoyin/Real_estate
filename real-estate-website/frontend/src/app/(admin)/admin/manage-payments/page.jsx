"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function ManagePayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [formData, setFormData] = useState({
    user: "",
    property: "",
    amount: "",
    status: "Pending",
    method: "Credit Card",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const router = useRouter();

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? (value === "" ? "" : Number(value)) : value,
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

    if (!formData.user.trim()) {
      errors.user = "User is required";
    }

    if (!formData.property.trim()) {
      errors.property = "Property is required";
    }

    if (!formData.amount) {
      errors.amount = "Amount is required";
    } else if (isNaN(formData.amount) || formData.amount <= 0) {
      errors.amount = "Amount must be a positive number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open add modal
  const openAddModal = () => {
    setFormData({
      user: "",
      property: "",
      amount: "",
      status: "Pending",
      method: "Credit Card",
      notes: "",
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Open view modal
  const openViewModal = (payment) => {
    setCurrentPayment(payment);
    setIsViewModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (payment) => {
    setCurrentPayment(payment);
    setFormData({
      user: payment.user,
      property: payment.property,
      amount: payment.amount,
      status: payment.status,
      method: payment.method,
      notes: payment.notes || "",
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // Close modals
  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
  };

  // Handle add payment
  const handleAddPayment = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // In a real app, this would be an API call
    // For demo purposes, just add to the state
    const newPayment = {
      id: payments.length + 1,
      user: formData.user,
      property: formData.property,
      amount: Number(formData.amount),
      status: formData.status,
      method: formData.method,
      notes: formData.notes,
      date: new Date().toISOString().split("T")[0],
    };

    setPayments([...payments, newPayment]);
    closeModals();

    // Show success message (in a real app)
    alert("Payment added successfully!");
  };

  // Handle edit payment
  const handleEditPayment = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // In a real app, this would be an API call
    // For demo purposes, just update the state
    const updatedPayments = payments.map((payment) => {
      if (payment.id === currentPayment.id) {
        return {
          ...payment,
          user: formData.user,
          property: formData.property,
          amount: Number(formData.amount),
          status: formData.status,
          method: formData.method,
          notes: formData.notes,
        };
      }
      return payment;
    });

    setPayments(updatedPayments);
    closeModals();

    // Show success message (in a real app)
    alert("Payment updated successfully!");
  };

  // Handle approve payment
  const handleApprovePayment = (paymentId) => {
    if (window.confirm("Are you sure you want to approve this payment?")) {
      // In a real app, this would be an API call
      // For demo purposes, just update the state
      const updatedPayments = payments.map((payment) => {
        if (payment.id === paymentId) {
          return {
            ...payment,
            status: "Completed",
          };
        }
        return payment;
      });

      setPayments(updatedPayments);

      // Show success message (in a real app)
      alert("Payment approved successfully!");
    }
  };

  useEffect(() => {
    // Check if admin is authenticated
    const adminToken = Cookies.get("adminToken");
    if (!adminToken) {
      router.push("/admin/login");
      return;
    }

    // Fetch payments data
    const fetchPayments = async () => {
      try {
        setLoading(true);

        // In a real app, this would fetch from your API
        // const response = await fetch('/api/admin/payments', {
        //   headers: {
        //     'Authorization': `Bearer ${adminToken}`
        //   }
        // });
        //
        // if (!response.ok) {
        //   throw new Error('Failed to fetch payments');
        // }
        //
        // const data = await response.json();

        // For demo purposes, use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockPayments = [
          {
            id: 1,
            user: "John Doe",
            property: "Premium Land in Location A",
            amount: 25000,
            status: "Completed",
            date: "2023-04-15",
            method: "Credit Card",
          },
          {
            id: 2,
            user: "Jane Smith",
            property: "Exclusive Land in Location B",
            amount: 35000,
            status: "Pending",
            date: "2023-04-20",
            method: "Bank Transfer",
          },
          {
            id: 3,
            user: "Robert Johnson",
            property: "Strategic Land in Location C",
            amount: 18000,
            status: "Completed",
            date: "2023-04-10",
            method: "Credit Card",
          },
          {
            id: 4,
            user: "Emily Davis",
            property: "Residential Land in Location D",
            amount: 22000,
            status: "Failed",
            date: "2023-04-05",
            method: "PayPal",
          },
          {
            id: 5,
            user: "Michael Wilson",
            property: "Commercial Land in Location E",
            amount: 40000,
            status: "Completed",
            date: "2023-04-01",
            method: "Bank Transfer",
          },
        ];

        setPayments(mockPayments);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [router]);

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
        <h1 className="text-2xl font-bold">Manage Payments</h1>
        <div>
          <button
            className="bg-primary-blue text-white px-4 py-2 rounded-md hover:bg-accent-green mr-2"
            onClick={openAddModal}
          >
            Add Payment
          </button>
          <button className="bg-primary-blue text-white px-4 py-2 rounded-md hover:bg-accent-green mr-2">
            Export CSV
          </button>
          <button className="bg-primary-blue text-white px-4 py-2 rounded-md hover:bg-accent-green">
            Generate Report
          </button>
        </div>
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
                  User
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
                  Amount
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
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Method
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
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.user}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {payment.property}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      ${payment.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : payment.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-primary-blue hover:text-accent-green mr-3"
                      onClick={() => openViewModal(payment)}
                    >
                      View
                    </button>
                    {payment.status === "Pending" && (
                      <button
                        className="text-green-600 hover:text-green-800"
                        onClick={() => handleApprovePayment(payment.id)}
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Payment</h2>
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

            <form onSubmit={handleAddPayment}>
              <div className="mb-4">
                <label
                  htmlFor="user"
                  className="block text-gray-700 font-medium mb-2"
                >
                  User
                </label>
                <input
                  type="text"
                  id="user"
                  name="user"
                  value={formData.user}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                    formErrors.user ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.user && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.user}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="property"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Property
                </label>
                <input
                  type="text"
                  id="property"
                  name="property"
                  value={formData.property}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                    formErrors.property ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.property && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.property}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="amount"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Amount ($)
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                    formErrors.amount ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.amount && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.amount}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="method"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Payment Method
                  </label>
                  <select
                    id="method"
                    name="method"
                    value={formData.method}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
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
                  Add Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Payment Modal */}
      {isEditModalOpen && currentPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Payment</h2>
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

            <form onSubmit={handleEditPayment}>
              <div className="mb-4">
                <label
                  htmlFor="edit-user"
                  className="block text-gray-700 font-medium mb-2"
                >
                  User
                </label>
                <input
                  type="text"
                  id="edit-user"
                  name="user"
                  value={formData.user}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                    formErrors.user ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.user && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.user}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="edit-property"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Property
                </label>
                <input
                  type="text"
                  id="edit-property"
                  name="property"
                  value={formData.property}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                    formErrors.property ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.property && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.property}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="edit-amount"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Amount ($)
                </label>
                <input
                  type="number"
                  id="edit-amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                    formErrors.amount ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.amount && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.amount}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="edit-method"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Payment Method
                  </label>
                  <select
                    id="edit-method"
                    name="method"
                    value={formData.method}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Payment Modal */}
      {isViewModalOpen && currentPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Payment Details</h2>
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

            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">
                  Payment #{currentPayment.id}
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    currentPayment.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : currentPayment.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {currentPayment.status}
                </span>
              </div>
              <p className="text-2xl font-bold text-primary-blue">
                ${currentPayment.amount.toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">User</h4>
                <p className="text-gray-900">{currentPayment.user}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Property
                </h4>
                <p className="text-gray-900">{currentPayment.property}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Payment Method
                </h4>
                <p className="text-gray-900">{currentPayment.method}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Date</h4>
                <p className="text-gray-900">
                  {new Date(currentPayment.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            {currentPayment.notes && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Notes
                </h4>
                <p className="text-gray-900 bg-gray-50 p-3 rounded">
                  {currentPayment.notes}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              {currentPayment.status === "Pending" && (
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  onClick={() => {
                    closeModals();
                    handleApprovePayment(currentPayment.id);
                  }}
                >
                  Approve Payment
                </button>
              )}
              <button
                className="bg-primary-blue text-white px-4 py-2 rounded-md hover:bg-accent-green"
                onClick={() => {
                  closeModals();
                  openEditModal(currentPayment);
                }}
              >
                Edit Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
