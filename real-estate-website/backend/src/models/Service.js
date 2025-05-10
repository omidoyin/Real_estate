const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    serviceType: {
        type: String,
        enum: ['Estate Management', 'Architectural Design', 'Property Valuation', 'Legal Consultation'],
        required: true
    },
    propertyType: {
        type: String,
        enum: ['Residential', 'Commercial', 'Industrial', 'Mixed-Use', 'All'],
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    images: [{
        type: String,
        required: false,
    }],
    features: {
        type: String,
        required: true,
    },
    benefits: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    subscribers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
