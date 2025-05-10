const User = require('../models/User');
const Land = require('../models/Land');
const House = require('../models/House');
const Apartment = require('../models/Apartment');
const Service = require('../models/Service');
const Payment = require('../models/Payment');

/**
 * Get user's portfolio (all purchased properties and subscribed services)
 * @route GET /api/portfolio
 * @access Private
 */
const getUserPortfolio = async (req, res) => {
    const userId = req.user._id;
    
    try {
        // Get user with populated fields
        const user = await User.findById(userId)
            .populate('purchasedLands')
            .populate('purchasedHouses')
            .populate('purchasedApartments')
            .populate('subscribedServices');
        
        // Combine all portfolio items
        const portfolio = {
            lands: user.purchasedLands || [],
            houses: user.purchasedHouses || [],
            apartments: user.purchasedApartments || [],
            services: user.subscribedServices || []
        };
        
        // Get total count
        const totalItems = 
            portfolio.lands.length + 
            portfolio.houses.length + 
            portfolio.apartments.length + 
            portfolio.services.length;
        
        res.status(200).json({
            success: true,
            data: portfolio,
            totalItems
        });
    } catch (error) {
        console.error('Error fetching user portfolio:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching user portfolio', 
            error: error.message 
        });
    }
};

/**
 * Get portfolio items by type
 * @route GET /api/portfolio/:type
 * @access Private
 */
const getPortfolioByType = async (req, res, type) => {
    const userId = req.user._id;
    
    try {
        let items = [];
        let model, field;
        
        // Determine model and field based on type
        switch (type) {
            case 'Land':
                model = Land;
                field = 'purchasedLands';
                break;
            case 'House':
                model = House;
                field = 'purchasedHouses';
                break;
            case 'Apartment':
                model = Apartment;
                field = 'purchasedApartments';
                break;
            case 'Service':
                model = Service;
                field = 'subscribedServices';
                break;
            default:
                return res.status(400).json({ 
                    success: false,
                    message: 'Invalid portfolio type' 
                });
        }
        
        // Get user with populated field
        const user = await User.findById(userId).populate(field);
        
        if (user && user[field]) {
            items = user[field];
        }
        
        // Apply pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        
        const paginatedItems = items.slice(startIndex, endIndex);
        
        res.status(200).json({
            success: true,
            data: paginatedItems,
            pagination: {
                total: items.length,
                page,
                limit,
                pages: Math.ceil(items.length / limit)
            }
        });
    } catch (error) {
        console.error(`Error fetching ${type} portfolio:`, error);
        res.status(500).json({ 
            success: false,
            message: `Error fetching ${type} portfolio`, 
            error: error.message 
        });
    }
};

/**
 * Get portfolio statistics
 * @route GET /api/portfolio/stats
 * @access Private
 */
const getPortfolioStats = async (req, res) => {
    const userId = req.user._id;
    
    try {
        // Get user
        const user = await User.findById(userId);
        
        // Get counts
        const landCount = user.purchasedLands ? user.purchasedLands.length : 0;
        const houseCount = user.purchasedHouses ? user.purchasedHouses.length : 0;
        const apartmentCount = user.purchasedApartments ? user.purchasedApartments.length : 0;
        const serviceCount = user.subscribedServices ? user.subscribedServices.length : 0;
        
        // Get total investment amount from payments
        const payments = await Payment.find({ 
            userId: userId,
            status: 'Completed'
        });
        
        const totalInvestment = payments.reduce((total, payment) => total + payment.amount, 0);
        
        // Get property types distribution
        const propertyDistribution = {
            lands: landCount,
            houses: houseCount,
            apartments: apartmentCount,
            services: serviceCount
        };
        
        // Get recent acquisitions
        const recentPayments = await Payment.find({ 
            userId: userId,
            status: 'Completed'
        })
        .sort({ paymentDate: -1 })
        .limit(5)
        .populate({
            path: 'propertyId',
            select: 'title location price'
        });
        
        const stats = {
            totalProperties: landCount + houseCount + apartmentCount,
            totalServices: serviceCount,
            totalInvestment,
            propertyDistribution,
            recentAcquisitions: recentPayments
        };
        
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching portfolio stats:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching portfolio stats', 
            error: error.message 
        });
    }
};

module.exports = {
    getUserPortfolio,
    getPortfolioByType,
    getPortfolioStats
};
