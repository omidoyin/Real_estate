const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: false,
    },
    bio: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'On Leave'],
        default: 'Active'
    },
    socialMedia: {
        linkedin: {
            type: String,
            required: false,
        },
        twitter: {
            type: String,
            required: false,
        },
        facebook: {
            type: String,
            required: false,
        },
        instagram: {
            type: String,
            required: false,
        }
    }
}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
