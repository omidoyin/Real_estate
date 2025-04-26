import React, { useEffect, useState } from 'react';
import { getPaymentPlan } from '../../utils/api';

const PaymentPlan = () => {
    const [paymentPlan, setPaymentPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPaymentPlan = async () => {
            try {
                const data = await getPaymentPlan();
                setPaymentPlan(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentPlan();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="payment-plan">
            <h2>Your Payment Plan</h2>
            {paymentPlan ? (
                <div>
                    <h3>Installment Amount: ${paymentPlan.installmentAmount}</h3>
                    <h4>Due Dates:</h4>
                    <ul>
                        {paymentPlan.dueDates.map((date, index) => (
                            <li key={index}>{date}</li>
                        ))}
                    </ul>
                    <h4>Status: {paymentPlan.status}</h4>
                </div>
            ) : (
                <p>No payment plan available.</p>
            )}
        </div>
    );
};

export default PaymentPlan;