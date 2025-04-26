import React, { useEffect, useState } from 'react';
import { getPaymentHistory } from '../../utils/api';

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            try {
                const response = await getPaymentHistory();
                setPayments(response.data);
            } catch (err) {
                setError('Failed to fetch payment history');
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentHistory();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="payment-history">
            <h2 className="text-xl font-bold">Payment History</h2>
            <table className="min-w-full mt-4">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Method</th>
                        <th className="px-4 py-2">Amount</th>
                        <th className="px-4 py-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) => (
                        <tr key={payment._id}>
                            <td className="border px-4 py-2">{new Date(payment.date).toLocaleDateString()}</td>
                            <td className="border px-4 py-2">{payment.method}</td>
                            <td className="border px-4 py-2">${payment.amount.toFixed(2)}</td>
                            <td className="border px-4 py-2">{payment.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentHistory;