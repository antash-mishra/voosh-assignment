const { Track } = require('../models');

// GET /tracks Controller
const getTracks = async (req, res) => {
    const { limit = 5, offset = 0, album_id, artist_id, hidden } = req.query;

    try {
        // Validate pagination parameters
        if (isNaN(limit) || isNaN(offset)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request, Reason: Invalid pagination parameters.",
                error: null,
            });
        }

        if (hidden && !['true', 'false'].includes(hidden.toLowerCase())) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request.",
                error: null,
            });
        }

        // Build filters
        const filters = {};
        if (album_id) filters.album_id = album_id;
        if (artist_id) filters.artist_id = artist_id;
        if (hidden) filters.hidden = hidden.toLowerCase() === 'true';

        // Check user role for visibility
        const userRole = req.user?.role; // Assume `req.user` is populated by auth middleware
        if (userRole === 'Viewer') {
            filters.hidden = false; // Viewers can only see visible tracks
        }

        // Fetch tracks with filters and pagination
        const tracks = await Track.findAll({
            where: filters,
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        return res.status(200).json({
            status: 200,
            data: tracks,
            message: "Tracks retrieved successfully.",
            error: null,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: "Internal Server Error.",
            error: error.message,
        });
    }
};

module.exports = getTracks;
