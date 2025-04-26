import mongoose from 'mongoose';

const landSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    images: [{
        type: String,
        required: true,
    }],
    video: {
        type: String,
        required: false,
    },
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
    inspectionDates: [{
        type: Date,
        required: false,
    }],
    description: {
        type: String,
        required: true,
    },
    features: [{
        type: String,
        required: false,
    }],
}, { timestamps: true });

const Land = mongoose.model('Land', landSchema);

export default Land;