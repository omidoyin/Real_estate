const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    propertyType: {
        type: String,
        enum: ['Land', 'House', 'Apartment'],
        required: true
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'propertyType'
    }
}, { timestamps: true });

// Compound index to ensure a user can only favorite a property once
favoriteSchema.index({ userId: 1, propertyType: 1, propertyId: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
