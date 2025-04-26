exports.getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is stored in the JWT token
        const payments = await Payment.find({ userId }).populate('landId'); // Populate land details if needed
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment history', error });
    }
};

exports.addPayment = async (req, res) => {
    try {
        const { amount, method, landId } = req.body;
        const userId = req.user.id; // Assuming user ID is stored in the JWT token

        const newPayment = new Payment({
            userId,
            amount,
            method,
            landId,
            status: 'Pending', // Default status
        });

        await newPayment.save();
        res.status(201).json(newPayment);
    } catch (error) {
        res.status(500).json({ message: 'Error adding payment', error });
    }
};

exports.markPaymentCompleted = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const payment = await Payment.findByIdAndUpdate(paymentId, { status: 'Completed' }, { new: true });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Error marking payment as completed', error });
    }
};