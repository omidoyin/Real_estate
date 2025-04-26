// backend/src/controllers/landController.js

const Land = require('../models/Land');

// Get all available lands
const getAvailableLands = async (req, res) => {
    try {
        const lands = await Land.find();
        res.status(200).json(lands);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lands', error });
    }
};

// Get land details by ID
const getLandDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const land = await Land.findById(id);
        if (!land) {
            return res.status(404).json({ message: 'Land not found' });
        }
        res.status(200).json(land);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching land details', error });
    }
};

// Add a new land
const addLand = async (req, res) => {
    const { title, location, price, images, video } = req.body;
    try {
        const newLand = new Land({ title, location, price, images, video });
        await newLand.save();
        res.status(201).json(newLand);
    } catch (error) {
        res.status(500).json({ message: 'Error adding land', error });
    }
};

// Edit an existing land
const editLand = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const updatedLand = await Land.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedLand) {
            return res.status(404).json({ message: 'Land not found' });
        }
        res.status(200).json(updatedLand);
    } catch (error) {
        res.status(500).json({ message: 'Error updating land', error });
    }
};

// Delete a land
const deleteLand = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedLand = await Land.findByIdAndDelete(id);
        if (!deletedLand) {
            return res.status(404).json({ message: 'Land not found' });
        }
        res.status(200).json({ message: 'Land deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting land', error });
    }
};

module.exports = {
    getAvailableLands,
    getLandDetails,
    addLand,
    editLand,
    deleteLand,
};