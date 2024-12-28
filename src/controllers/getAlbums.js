const { Album} = require('../models')

const getAlbums = async (req, res) => {
    const { limit = 5, offset=0, artist_id, hidden} = req.query;

    try {
        // Validate Query Parameter
        if (isNaN(limit) || isNaN(offset)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request, Reason: Invalid pagination parameters.",
                error: null
            })
        }

        if (hidden && !['true', 'false'].includes(hidden.toLowerCase())) { 
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request.",
                error: null,
            })
        }

        // Check if artist_id is provided
        if (!artist_id) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request, Reason: Missing artist_id.",
                error: null
            })
        }

        // Check if artist exists
        const artist = await Artist.findOne({ where: { artist_id } });
        if (!artist) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Artist not found, not valid artist ID.",
                error: null
            })
        }

        // Check access for hidden artists
        if (artist.hidden) {
            const userRole = req.user?.role; // Assume req.user is populated by auth middleware
            if (!['Admin', 'Editor'].includes(userRole)) {
            return res.status(403).json({
                status: 403,
                data: null,
                message: "Forbidden Access. Viewers cannot access hidden artists.",
                error: null,
            });
            }
        }

        // Build filters
        const filters = { artist_id };
        if (hidden) filters.hidden = hidden.toLowerCase() === 'true';

        // Fetch albums with filters and pagination
        const albums = await Album.findAll({
            where: filters,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });




    }
}