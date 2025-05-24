"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    property: "all",
    dateRange: "all",
    status: "all",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");
  const installmentId = searchParams.get("installmentId");

  useEffect(() => {
    // Check if user is authenticated
    const token = Cookies.get("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // Fetch payment history
    const fetchPaymentHistory = async () => {
      try {
        setLoading(true);

        // In a real app, this would fetch from your API
        // const response = await fetch('/api/payment-history', {
        //   headers: {
        //     'Authorization': `Bearer ${token}`
        //   }
        // });
        //
        // if (!response.ok) {
        //   throw new Error('Failed to fetch payment history');
        // }
        //
        // const data = await response.json();

        // For demo purposes, use mock data
        const mockData = [
          {
            id: 1,
            planId: 1,
            installmentId: 1,
            propertyId: 1,
            propertyTitle: "Premium Land in Location A",
            amount: 50000,
            date: "2023-05-15",
            status: "Completed",
            paymentMethod: "Credit Card",
            transactionId: "TXN123456789",
            receiptUrl: "#",
          },
          {
            id: 2,
            planId: 1,
            installmentId: 2,
            propertyId: 1,
            propertyTitle: "Premium Land in Location A",
            amount: 50000,
            date: "2023-06-15",
            status: "Completed",
            paymentMethod: "Bank Transfer",
            transactionId: "TXN123456790",
            receiptUrl: "#",
          },
          {
            id: 3,
            planId: 1,
            installmentId: 3,
            propertyId: 1,
            propertyTitle: "Premium Land in Location A",
            amount: 50000,
            date: "2023-07-15",
            status: "Completed",
            paymentMethod: "Credit Card",
            transactionId: "TXN123456791",
            receiptUrl: "#",
          },
          {
            id: 4,
            planId: 1,
            installmentId: 4,
            propertyId: 1,
            propertyTitle: "Premium Land in Location A",
            amount: 50000,
            date: "2023-08-15",
            status: "Completed",
            paymentMethod: "Credit Card",
            transactionId: "TXN123456792",
            receiptUrl: "#",
          },
          {
            id: 5,
            planId: 1,
            installmentId: 5,
            propertyId: 1,
            propertyTitle: "Premium Land in Location A",
            amount: 50000,
            date: "2023-09-15",
            status: "Completed",
            paymentMethod: "Bank Transfer",
            transactionId: "TXN123456793",
            receiptUrl: "#",
          },
          {
            id: 6,
            planId: 2,
            installmentId: 1,
            propertyId: 2,
            propertyTitle: "Exclusive Land in Location B",
            amount: 30000,
            date: "2023-04-10",
            status: "Completed",
            paymentMethod: "Credit Card",
            transactionId: "TXN123456794",
            receiptUrl: "#",
          },
          {
            id: 7,
            planId: 2,
            installmentId: 2,
            propertyId: 2,
            propertyTitle: "Exclusive Land in Location B",
            amount: 30000,
            date: "2023-05-10",
            status: "Completed",
            paymentMethod: "Bank Transfer",
            transactionId: "TXN123456795",
            receiptUrl: "#",
          },
          {
            id: 8,
            planId: 2,
            installmentId: 3,
            propertyId: 2,
            propertyTitle: "Exclusive Land in Location B",
            amount: 30000,
            date: "2023-06-10",
            status: "Completed",
            paymentMethod: "Credit Card",
            transactionId: "TXN123456796",
            receiptUrl: "#",
          },
          {
            id: 9,
            planId: 3,
            installmentId: 1,
            propertyId: 3,
            propertyTitle: "Strategic Land in Location C",
            amount: 40000,
            date: "2023-06-05",
            status: "Completed",
            paymentMethod: "Bank Transfer",
            transactionId: "TXN123456797",
            receiptUrl: "#",
          },
          {
            id: 10,
            planId: 3,
            installmentId: 2,
            propertyId: 3,
            propertyTitle: "Strategic Land in Location C",
            amount: 40000,
            date: "2023-07-05",
            status: "Completed",
            paymentMethod: "Credit Card",
            transactionId: "TXN123456798",
            receiptUrl: "#",
          },
          {
            id: 11,
            planId: 3,
            installmentId: 3,
            propertyId: 3,
            propertyTitle: "Strategic Land in Location C",
            amount: 40000,
            date: "2023-08-05",
            status: "Completed",
            paymentMethod: "Bank Transfer",
            transactionId: "TXN123456799",
            receiptUrl: "#",
          },
          {
            id: 12,
            planId: 3,
            installmentId: 4,
            propertyId: 3,
            propertyTitle: "Strategic Land in Location C",
            amount: 40000,
            date: "2023-09-05",
            status: "Completed",
            paymentMethod: "Credit Card",
            transactionId: "TXN123456800",
            receiptUrl: "#",
          },
        ];

        setPayments(mockData);
        setFilteredPayments(mockData);

        // If planId and installmentId are provided in the URL, show the receipt for that payment
        if (planId && installmentId) {
          const payment = mockData.find(
            (p) =>
              p.planId.toString() === planId &&
              p.installmentId.toString() === installmentId
          );

          if (payment) {
            setSelectedPayment(payment);
            setShowReceipt(true);
          }
        }
      } catch (err) {
        console.error("Error fetching payment history:", err);
        setError("Failed to load payment history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [router, planId, installmentId]);

  // Apply filters when filter options change
  useEffect(() => {
    if (payments.length > 0) {
      let filtered = [...payments];

      // Filter by property
      if (filterOptions.property !== "all") {
        filtered = filtered.filter(
          (payment) => payment.propertyId.toString() === filterOptions.property
        );
      }

      // Filter by date range
      if (filterOptions.dateRange !== "all") {
        const now = new Date();
        let startDate;

        switch (filterOptions.dateRange) {
          case "last30days":
            startDate = new Date(now.setDate(now.getDate() - 30));
            break;
          case "last3months":
            startDate = new Date(now.setMonth(now.getMonth() - 3));
            break;
          case "last6months":
            startDate = new Date(now.setMonth(now.getMonth() - 6));
            break;
          case "lastyear":
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
          default:
            startDate = null;
        }

        if (startDate) {
          filtered = filtered.filter(
            (payment) => new Date(payment.date) >= startDate
          );
        }
      }

      // Filter by status
      if (filterOptions.status !== "all") {
        filtered = filtered.filter(
          (payment) =>
            payment.status.toLowerCase() === filterOptions.status.toLowerCase()
        );
      }

      setFilteredPayments(filtered);
    }
  }, [filterOptions, payments]);

  const handleFilterChange = (filterType, value) => {
    setFilterOptions((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const viewReceipt = (payment) => {
    setSelectedPayment(payment);
    setShowReceipt(true);
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    setSelectedPayment(null);

    // Remove query parameters from URL if they exist
    if (planId || installmentId) {
      router.push("/dashboard/payment-history");
    }
  };

  const downloadReceipt = () => {
    // In a real app, this would download the receipt
    alert("Receipt download functionality would be implemented here.");
  };

  // Get unique properties for the filter
  const uniqueProperties = [
    { id: "all", title: "All Properties" },
    ...Array.from(new Set(payments.map((p) => p.propertyId))).map((id) => {
      const payment = payments.find((p) => p.propertyId === id);
      return {
        id: id.toString(),
        title: payment.propertyTitle,
      };
    }),
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Payment History</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Payment History</h1>
        <div className="bg-red-100 text-red-800 p-4 rounded-md">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Payment History</h1>

      {payments.length === 0 ? (
        <div className="bg-card-bg p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">
            You don't have any payment records yet.
          </h2>
          <p className="mb-6">
            Once you make payments for your properties, they will appear here.
          </p>
          <Link
            href="/dashboard/payment-plan"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover"
          >
            View Payment Plans
          </Link>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Filter Payments</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="property-filter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Property
                </label>
                <select
                  id="property-filter"
                  value={filterOptions.property}
                  onChange={(e) =>
                    handleFilterChange("property", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                >
                  {uniqueProperties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="date-filter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date Range
                </label>
                <select
                  id="date-filter"
                  value={filterOptions.dateRange}
                  onChange={(e) =>
                    handleFilterChange("dateRange", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="all">All Time</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last3months">Last 3 Months</option>
                  <option value="last6months">Last 6 Months</option>
                  <option value="lastyear">Last Year</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="status-filter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="status-filter"
                  value={filterOptions.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment History Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
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
                      Payment Method
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Receipt
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link
                          href={`/lands/details/${payment.propertyId}`}
                          className="hover:text-primary"
                        >
                          {payment.propertyTitle}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.paymentMethod}
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
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => viewReceipt(payment)}
                          className="text-primary hover:text-primary-text"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPayments.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-gray-500">
                  No payments match your filter criteria.
                </p>
              </div>
            )}
          </div>

          {/* Payment Summary */}
          <div className="mt-8 bg-card-bg p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold">{payments.length}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Amount Paid</p>
                <p className="text-2xl font-bold">
                  $
                  {payments
                    .reduce((total, payment) => total + payment.amount, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Last Payment</p>
                <p className="text-2xl font-bold">
                  {new Date(
                    Math.max(...payments.map((p) => new Date(p.date)))
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Receipt Modal */}
      {showReceipt && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Payment Receipt</h2>
                <button
                  onClick={closeReceipt}
                  className="text-gray-500 hover:text-gray-700"
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

              <div className="border-t border-b border-gray-200 py-6 mb-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-gray-600">Receipt Number</p>
                    <p className="font-semibold">
                      REC-{selectedPayment.id.toString().padStart(6, "0")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">Date</p>
                    <p className="font-semibold">
                      {new Date(selectedPayment.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-600">Property</p>
                  <p className="font-semibold">
                    {selectedPayment.propertyTitle}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-gray-600">Payment Method</p>
                  <p className="font-semibold">
                    {selectedPayment.paymentMethod}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-gray-600">Transaction ID</p>
                  <p className="font-semibold">
                    {selectedPayment.transactionId}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-gray-600">Status</p>
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedPayment.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : selectedPayment.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedPayment.status}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600">Payment Amount</p>
                  <p className="font-semibold">
                    ${selectedPayment.amount.toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600">Processing Fee</p>
                  <p className="font-semibold">$0.00</p>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <p>Total</p>
                  <p>${selectedPayment.amount.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={downloadReceipt}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover"
                >
                  Download Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
