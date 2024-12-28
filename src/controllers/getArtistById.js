const { Artist } = require('../models');

// GET /artistById Controller
const getArtistById = async (req, res) => {
    const { limit = 5, offset = 0, grammy, hidden } = req.query;
    const {id} = req.params;

    try {

    // Check if id is provided
        if (!id) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request",
                error: null
            });
        }

        // Only admin and editor can access hidden artists
        const canViewHidden = ['admin', 'editor'].includes(req.user.role);
        if (canViewHidden) {
            hidden = 'false'
        }

        // Build filters
        const filters = {};
        filters.artist_id = id
        if (grammy) filters.grammy = grammy;
        if (hidden) filters.hidden = hidden.toLowerCase() === 'true';

        // Fetch artists with filters and pagination
        const artists = await Artist.findOne({
          where: filters,
          limit: parseInt(limit),
          offset: parseInt(offset),
        });

        return res.status(200).json({
            status: 200,
            data: artists,
            message: "Artists retrieved successfully.",
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

module.exports = getArtistById;
