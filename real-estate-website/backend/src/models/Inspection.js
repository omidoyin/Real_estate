const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'propertyType',
        required: true,
    },
    propertyType: {
        type: String,
        enum: ['Land', 'House', 'Apartment'],
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true,
    },
    notes: {
        type: String,
        required: false,
    },
    feedback: {
        type: String,
        required: false,
    },
    followUpDate: {
        type: Date,
        required: false,
    }
}, { timestamps: true });

const Inspection = mongoose.model('Inspection', inspectionSchema);

module.exports = Inspection;
