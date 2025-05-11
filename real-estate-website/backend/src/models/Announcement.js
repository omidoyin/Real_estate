const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['General', 'Promotion', 'News', 'Update'],
        default: 'General'
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Scheduled'],
        default: 'Active'
    },
    target: {
        type: String,
        enum: ['All Users', 'Customers', 'Admins'],
        default: 'All Users'
    },
    image: {
        type: String,
        required: false,
    }
}, { timestamps: true });

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
