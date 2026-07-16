import Stat from '../models/membercount.models.js';

// GET /api/member-count -> Fetch all statistics
export const getStats = async (req, res) => {
    try {
        const stats = await Stat.find();
        
        // BULLETPROOF CACHE BUSTING (Fixes the 304 issue)
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        res.set('Surrogate-Control', 'no-store');
        
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching stats', error: error.message });
    }
};

// GET /api/member-count/:id -> Fetch a single statistic by ID
export const getStatById = async (req, res) => {
    try {
        const stat = await Stat.findById(req.params.id);
        if (!stat) {
            return res.status(404).json({ message: 'Stat not found' });
        }
        res.status(200).json(stat);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stat', error: error.message });
    }
};

// PUT /api/member-count/:id -> Update a single statistic
export const updateStat = async (req, res) => {
    try {
        const updatedStat = await Stat.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } 
        );
        
        if (!updatedStat) {
            return res.status(404).json({ message: 'Stat not found' });
        }
        res.status(200).json({ message: 'Stat updated successfully', data: updatedStat });
    } catch (error) {
        res.status(500).json({ message: 'Error updating stat', error: error.message });
    }
};

// DELETE /api/member-count/:id -> Delete a single statistic
export const deleteStat = async (req, res) => {
    try {
        const deletedStat = await Stat.findByIdAndDelete(req.params.id);
        if (!deletedStat) {
            return res.status(404).json({ message: 'Stat not found' });
        }
        res.status(200).json({ message: 'Stat deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting stat', error: error.message });
    }
};

// PUT /api/member-count/bulk-update -> Update multiple stats
export const bulkUpdateStats = async (req, res) => {
    try {
        const { updates } = req.body;
        
        if (!updates || !Array.isArray(updates)) {
            return res.status(400).json({ message: 'Please provide an array of updates.' });
        }

        const operations = updates.map(update => ({
            updateOne: {
                filter: { _id: update.id },
                update: { $set: update.data }
            }
        }));

        const result = await Stat.bulkWrite(operations);
        res.status(200).json({ message: 'Bulk update successful', result });
    } catch (error) {
        res.status(500).json({ message: 'Error performing bulk update', error: error.message });
    }
};

// DELETE /api/member-count/bulk-delete -> Delete multiple stats
export const bulkDeleteStats = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ message: 'Please provide an array of IDs to delete.' });
        }

        const result = await Stat.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: 'Bulk delete successful', deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ message: 'Error performing bulk delete', error: error.message });
    }
};

// POST /api/member-count -> Create a single new statistic
export const createStat = async (req, res) => {
    try {
        const newStat = new Stat(req.body);
        const savedStat = await newStat.save();
        
        res.status(201).json({ 
            message: 'Stat created successfully', 
            data: savedStat 
        });
    } catch (error) {
        res.status(400).json({ 
            message: 'Error creating stat', 
            error: error.message 
        });
    }
};