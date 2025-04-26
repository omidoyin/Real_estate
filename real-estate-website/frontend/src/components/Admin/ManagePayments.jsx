import React, { useEffect, useState } from "react";
import { getPayments, markPaymentCompleted } from "../../utils/api";
import AdminHeader from "./AdminHeader";

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await getPayments();
        setPayments(response.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleMarkCompleted = async (paymentId) => {
    try {
      await markPaymentCompleted(paymentId);
      setPayments(
        payments.map((payment) =>
          payment._id === paymentId
            ? { ...payment, status: "Completed" }
            : payment
        )
      );
    } catch (error) {
      console.error("Error marking payment as completed:", error);
    }
  };

  return (
    <div>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Manage Payments</h1>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">User ID</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Method</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td className="border px-4 py-2">{payment.userId}</td>
                <td className="border px-4 py-2">{payment.amount}</td>
                <td className="border px-4 py-2">{payment.method}</td>
                <td className="border px-4 py-2">{payment.status}</td>
                <td className="border px-4 py-2">
                  {payment.status !== "Completed" && (
                    <button
                      onClick={() => handleMarkCompleted(payment._id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Mark as Completed
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePayments;
