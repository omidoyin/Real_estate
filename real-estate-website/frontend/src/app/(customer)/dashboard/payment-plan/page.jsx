"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";

export default function PaymentPlan() {
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = Cookies.get("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // Fetch payment plans
    const fetchPaymentPlans = async () => {
      try {
        setLoading(true);

        // In a real app, this would fetch from your API
        // const response = await fetch('/api/payment-plans', {
        //   headers: {
        //     'Authorization': `Bearer ${token}`
        //   }
        // });
        //
        // if (!response.ok) {
        //   throw new Error('Failed to fetch payment plans');
        // }
        //
        // const data = await response.json();

        // For demo purposes, use mock data
        const mockData = [
          {
            id: 1,
            propertyId: 1,
            propertyTitle: "Premium Land in Location A",
            propertyImage: "/placeholder.jpg",
            totalAmount: 250000,
            paidAmount: 250000,
            remainingAmount: 0,
            paymentStatus: "Completed",
            nextPaymentDate: null,
            nextPaymentAmount: 0,
            installments: [
              { id: 1, amount: 50000, date: "2023-05-15", status: "Paid" },
              { id: 2, amount: 50000, date: "2023-06-15", status: "Paid" },
              { id: 3, amount: 50000, date: "2023-07-15", status: "Paid" },
              { id: 4, amount: 50000, date: "2023-08-15", status: "Paid" },
              { id: 5, amount: 50000, date: "2023-09-15", status: "Paid" },
            ],
          },
          {
            id: 2,
            propertyId: 2,
            propertyTitle: "Exclusive Land in Location B",
            propertyImage: "/placeholder.jpg",
            totalAmount: 180000,
            paidAmount: 90000,
            remainingAmount: 90000,
            paymentStatus: "In Progress",
            nextPaymentDate: "2023-10-10",
            nextPaymentAmount: 30000,
            installments: [
              { id: 1, amount: 30000, date: "2023-04-10", status: "Paid" },
              { id: 2, amount: 30000, date: "2023-05-10", status: "Paid" },
              { id: 3, amount: 30000, date: "2023-06-10", status: "Paid" },
              { id: 4, amount: 30000, date: "2023-07-10", status: "Due" },
              { id: 5, amount: 30000, date: "2023-08-10", status: "Due" },
              { id: 6, amount: 30000, date: "2023-09-10", status: "Due" },
            ],
          },
          {
            id: 3,
            propertyId: 3,
            propertyTitle: "Strategic Land in Location C",
            propertyImage: "/placeholder.jpg",
            totalAmount: 320000,
            paidAmount: 160000,
            remainingAmount: 160000,
            paymentStatus: "In Progress",
            nextPaymentDate: "2023-10-05",
            nextPaymentAmount: 40000,
            installments: [
              { id: 1, amount: 40000, date: "2023-06-05", status: "Paid" },
              { id: 2, amount: 40000, date: "2023-07-05", status: "Paid" },
              { id: 3, amount: 40000, date: "2023-08-05", status: "Paid" },
              { id: 4, amount: 40000, date: "2023-09-05", status: "Paid" },
              { id: 5, amount: 40000, date: "2023-10-05", status: "Due" },
              { id: 6, amount: 40000, date: "2023-11-05", status: "Due" },
              { id: 7, amount: 40000, date: "2023-12-05", status: "Due" },
              { id: 8, amount: 40000, date: "2024-01-05", status: "Due" },
            ],
          },
        ];

        setPaymentPlans(mockData);
      } catch (err) {
        console.error("Error fetching payment plans:", err);
        setError("Failed to load payment plans. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentPlans();
  }, [router]);

  const handleMakePayment = (planId, installmentId) => {
    // In a real app, this would make an API call to process the payment
    // For demo purposes, we'll just show an alert
    alert(
      `Processing payment for plan ${planId}, installment ${installmentId}`
    );

    // In a real app, you would redirect to a payment gateway or show a payment form
    // router.push(`/dashboard/payment/${planId}/${installmentId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Payment Plans</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Payment Plans</h1>
        <div className="bg-red-100 text-red-800 p-4 rounded-md">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Payment Plans</h1>

      {paymentPlans.length === 0 ? (
        <div className="bg-card-bg p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">
            You don't have any payment plans yet.
          </h2>
          <p className="mb-6">
            Browse our available properties and make a purchase to start a
            payment plan.
          </p>
          <Link
            href="/lands/available"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover"
          >
            Browse Available Properties
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {paymentPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center mb-6">
                  <div className="md:w-1/4 mb-4 md:mb-0">
                    <div className="h-40 w-full md:w-40 bg-gray-300 rounded-md relative overflow-hidden">
                      {plan.propertyImage ? (
                        <Image
                          src={plan.propertyImage}
                          alt={plan.propertyTitle}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div className="h-40 bg-gray-300"></div>
                      )}
                    </div>
                  </div>

                  <div className="md:w-3/4 md:pl-6">
                    <h2 className="text-xl font-semibold mb-2">
                      <Link
                        href={`/lands/details/${plan.propertyId}`}
                        className="hover:text-primary"
                      >
                        {plan.propertyTitle}
                      </Link>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-gray-600 text-sm">Total Amount</p>
                        <p className="font-semibold">
                          ${plan.totalAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Paid Amount</p>
                        <p className="font-semibold">
                          ${plan.paidAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">
                          Remaining Amount
                        </p>
                        <p className="font-semibold">
                          ${plan.remainingAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-gray-600 mr-2">Status:</span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            plan.paymentStatus === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {plan.paymentStatus}
                        </span>
                      </div>

                      {plan.paymentStatus === "In Progress" && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Next Payment</p>
                          <p className="font-semibold">
                            ${plan.nextPaymentAmount.toLocaleString()} on{" "}
                            {new Date(
                              plan.nextPaymentDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Payment Schedule
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Installment
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
                            Due Date
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
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {plan.installments.map((installment, index) => (
                          <tr key={installment.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${installment.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(installment.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  installment.status === "Paid"
                                    ? "bg-green-100 text-green-800"
                                    : installment.status === "Due"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {installment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {installment.status === "Due" ? (
                                <button
                                  onClick={() =>
                                    handleMakePayment(plan.id, installment.id)
                                  }
                                  className="text-primary hover:text-primary-text"
                                >
                                  Make Payment
                                </button>
                              ) : installment.status === "Paid" ? (
                                <Link
                                  href={`/dashboard/payment-history?planId=${plan.id}&installmentId=${installment.id}`}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  View Receipt
                                </Link>
                              ) : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {plan.paymentStatus === "In Progress" && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() =>
                        handleMakePayment(
                          plan.id,
                          plan.installments.find((i) => i.status === "Due")?.id
                        )
                      }
                      className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover"
                    >
                      Pay Next Installment
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-card-bg p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
        <p className="mb-4">
          For any questions regarding your payment plan or to discuss
          alternative payment options, please contact our finance team:
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li className="mb-2">Email: finance@realestate.com</li>
          <li className="mb-2">Phone: (123) 456-7890</li>
          <li>Office Hours: Monday to Friday, 9:00 AM - 5:00 PM</li>
        </ul>
        <Link
          href="/dashboard/payment-history"
          className="text-primary hover:underline"
        >
          View your complete payment history →
        </Link>
      </div>
    </div>
  );
}
