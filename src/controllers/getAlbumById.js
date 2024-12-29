const { Album } = require('../models');

// GET /albumById Controller
const getAlbumById = async (req, res) => {
    const {id} = req.params;

    try {
        const album = await Album.findByPk(id);

        // Check if album exists
        if (!album) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Album not found",
                error: null
            });
        }

        // Check access for hidden albums
        if(album.hidden) {
            const userRole = req.user?.role; // Assume req.user is populated by auth middleware
            if (!['Admin', 'Editor'].includes(userRole)) {
                return res.status(403).json({
                    status: 403,
                    data: null,
                    message: "Forbidden Access. Viewers cannot access hidden albums.",
                    error: null,
                });
            }
        }

        return res.status(200).json({
            status: 200,
            data: album,
            message: "Album retrieved successfully.",
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
}

module.exports = getAlbumById;