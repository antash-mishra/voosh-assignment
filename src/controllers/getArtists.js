const { Artist } = require('../models');

// GET /artists Controller
const getArtists = async (req, res) => {
    const { limit = 5, offset = 0, grammy, hidden } = req.query;

    try {
        // Validate query parameters
        if (isNaN(limit) || isNaN(offset)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request, Reason: Invalid pagination parameters.",
                error: null,
            });
        }

        if (grammy && isNaN(grammy)) {
          return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request, Reason: Invalid grammy parameter.",
            error: null,
          });
        }

        if (hidden && !['true', 'false'].includes(hidden.toLowerCase())) {
          return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request, Reason: Invalid hidden parameter. Use 'true' or 'false'.",
            error: null,
          });
        }

        if (canViewHidden) {
            hidden = 'false'
        }
        
        // Build filters
        const filters = {};
        if (grammy) filters.grammy = grammy;
        if (hidden) filters.hidden = hidden.toLowerCase() === 'true';

        // Fetch artists with filters and pagination
        const artists = await Artist.findAll({
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

module.exports = getArtists;
