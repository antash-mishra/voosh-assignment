const {Track} = require('../models');

const deleteTrack = async (req, res) => {
    const {id} = req.params;

    try {
        // ENsuring only Admins and Editors can access this endpoint
        const userRole = req.user?.role;
        if (!['Admin', 'Editor'].includes(userRole)) {
            return res.status(403).json({
                status: 403,
                data: null,
                message: "Forbidden Access. Only Admins and Editors can delete tracks.",
                error: null
            });
        }

        // Fetch Track
        const track = await Track.findByPk(id);
        if (!track) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Track not found",
                error: null
            });
        }

        await track.destroy();

        return res.status(200).json({
            status: 200,
            data: {track_id: id},
            message: `Track with ID: ${id} deleted successfully.`,
            error: null
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: "Internal Server Error",
            error: error.message
        }); 
    }
}

module.exports = deleteTrack;