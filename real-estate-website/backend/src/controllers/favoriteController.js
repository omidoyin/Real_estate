const Favorite = require('../models/Favorite');
const User = require('../models/User');
const Land = require('../models/Land');
const House = require('../models/House');
const Apartment = require('../models/Apartment');

/**
 * Get all user favorites
 * @route GET /api/favorites
 * @access Private
 */
const getUserFavorites = async (req, res) => {
    const userId = req.user._id;
    
    try {
        // Get all favorites for the user
        const favorites = await Favorite.find({ userId });
        
        // Group by property type
        const landIds = [];
        const houseIds = [];
        const apartmentIds = [];
        
        favorites.forEach(fav => {
            switch (fav.propertyType) {
                case 'Land':
                    landIds.push(fav.propertyId);
                    break;
                case 'House':
                    houseIds.push(fav.propertyId);
                    break;
                case 'Apartment':
                    apartmentIds.push(fav.propertyId);
                    break;
            }
        });
        
        // Fetch details for each property type
        const [lands, houses, apartments] = await Promise.all([
            Land.find({ _id: { $in: landIds } }),
            House.find({ _id: { $in: houseIds } }),
            Apartment.find({ _id: { $in: apartmentIds } })
        ]);
        
        // Combine all favorites
        const allFavorites = {
            lands,
            houses,
            apartments
        };
        
        // Get total count
        const totalItems = lands.length + houses.length + apartments.length;
        
        res.status(200).json({
            success: true,
            data: allFavorites,
            totalItems
        });
    } catch (error) {
        console.error('Error fetching user favorites:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching user favorites', 
            error: error.message 
        });
    }
};

/**
 * Get favorites by type
 * @route GET /api/favorites/:type
 * @access Private
 */
const getFavoritesByType = async (req, res, type) => {
    const userId = req.user._id;
    
    try {
        // Get favorites of the specified type
        const favorites = await Favorite.find({ 
            userId,
            propertyType: type
        });
        
        // Extract property IDs
        const propertyIds = favorites.map(fav => fav.propertyId);
        
        // Determine model based on type
        let model;
        switch (type) {
            case 'Land':
                model = Land;
                break;
            case 'House':
                model = House;
                break;
            case 'Apartment':
                model = Apartment;
                break;
            default:
                return res.status(400).json({ 
                    success: false,
                    message: 'Invalid property type' 
                });
        }
        
        // Fetch property details
        const properties = await model.find({ _id: { $in: propertyIds } });
        
        // Apply pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        
        const paginatedProperties = properties.slice(startIndex, endIndex);
        
        res.status(200).json({
            success: true,
            data: paginatedProperties,
            pagination: {
                total: properties.length,
                page,
                limit,
                pages: Math.ceil(properties.length / limit)
            }
        });
    } catch (error) {
        console.error(`Error fetching ${type} favorites:`, error);
        res.status(500).json({ 
            success: false,
            message: `Error fetching ${type} favorites`, 
            error: error.message 
        });
    }
};

/**
 * Add property to favorites
 * @route POST /api/favorites
 * @access Private
 */
const addToFavorites = async (req, res) => {
    const userId = req.user._id;
    const { propertyType, propertyId } = req.body;
    
    try {
        // Validate property type
        if (!['Land', 'House', 'Apartment'].includes(propertyType)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid property type' 
            });
        }
        
        // Check if property exists
        let model;
        let userField;
        
        switch (propertyType) {
            case 'Land':
                model = Land;
                userField = 'favoriteLands';
                break;
            case 'House':
                model = House;
                userField = 'favoriteHouses';
                break;
            case 'Apartment':
                model = Apartment;
                userField = 'favoriteApartments';
                break;
        }
        
        const property = await model.findById(propertyId);
        if (!property) {
            return res.status(404).json({ 
                success: false,
                message: 'Property not found' 
            });
        }
        
        // Check if already in favorites
        const existingFavorite = await Favorite.findOne({
            userId,
            propertyType,
            propertyId
        });
        
        if (existingFavorite) {
            return res.status(400).json({ 
                success: false,
                message: 'Property already in favorites' 
            });
        }
        
        // Add to favorites
        const favorite = new Favorite({
            userId,
            propertyType,
            propertyId
        });
        
        await favorite.save();
        
        // Also add to user's favorites array
        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { [userField]: propertyId } }
        );
        
        res.status(200).json({ 
            success: true,
            message: 'Property added to favorites successfully' 
        });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error adding to favorites', 
            error: error.message 
        });
    }
};

/**
 * Remove property from favorites
 * @route DELETE /api/favorites/:favoriteId
 * @access Private
 */
const removeFromFavorites = async (req, res) => {
    const userId = req.user._id;
    const { favoriteId } = req.params;
    
    try {
        // Find the favorite to get property type and ID
        const favorite = await Favorite.findOne({
            _id: favoriteId,
            userId
        });
        
        if (!favorite) {
            return res.status(404).json({ 
                success: false,
                message: 'Favorite not found' 
            });
        }
        
        // Determine user field to update
        let userField;
        switch (favorite.propertyType) {
            case 'Land':
                userField = 'favoriteLands';
                break;
            case 'House':
                userField = 'favoriteHouses';
                break;
            case 'Apartment':
                userField = 'favoriteApartments';
                break;
        }
        
        // Delete the favorite
        await Favorite.findByIdAndDelete(favoriteId);
        
        // Also remove from user's favorites array
        await User.findByIdAndUpdate(
            userId,
            { $pull: { [userField]: favorite.propertyId } }
        );
        
        res.status(200).json({ 
            success: true,
            message: 'Property removed from favorites successfully' 
        });
    } catch (error) {
        console.error('Error removing from favorites:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error removing from favorites', 
            error: error.message 
        });
    }
};

module.exports = {
    getUserFavorites,
    getFavoritesByType,
    addToFavorites,
    removeFromFavorites
};
