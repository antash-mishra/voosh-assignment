const { Track } = require('../models');

// GET /tracks/:id - Get Track by ID
const getTrackById = async (req, res) => {
    const { id } = req.params;

    try {
        const track = await Track.findByPk(id);

        if (!track) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Track not found.Resource Doesn't Exist.",
                error: null
            });
        }

        if (track.hidden) {
            const userRole = req.user?.role;
            if (!['Admin', 'Editor'].includes(userRole)) {
                return res.status(403).json({
                    status: 403,
                    data: null,
                    message: "Forbidden Access. Viewers cannot access hidden tracks.",
                    error: null,
                });
            }
        }

        return res.status(200).json({
            status: 200,
            data: track,
            message: "Track retrieved successfully.",
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

module.exports = getTrackById;