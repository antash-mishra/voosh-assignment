const { Artist } = require('../models');

// GET /artistById Controller
const getArtistById = async (req, res) => {
    const {id} = req.params;

    try {

        const artist = await Artist.findByPk(id);
        
        // Check if artist exists
        if (!artist) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Artist not found",
                error: null
            });
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
        return res.status(200).json({
            status: 200,
            data: artist,
            message: "Artist retrieved successfully.",
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
