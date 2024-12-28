const { Artist } = require('../models');

const deleteArtist = async (req, res) => {
    const { id } = req.params;

    try {
        // Ensuring only Admins and Editors can access this endpoint
        const userRole = req.user?.role;
        if(!['Admin', 'Editor'].includes(userRole)) {
            return res.status(403).json({
                status: 403,
                data: null,
                message: "Forbidden Access. Only Admins and Editors can delete artists.",
                error: null,
            });
        }

        // Fetch artist
        const artist = await Artist.findByPk(id);
        if(!artist) {
            return res.status(404).json({
                status: 404,
                data: null,
                message:  "Artist not found",
                error: null,
            });
        }

        await artist.destroy();

        return res.status(200).json({
            status: 200,
            data: {artist_id: id},
            message: `Artist with ID: ${id} deleted successfully.`,
            error: null
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 500,
            data: null,
            message: "Internal Server Error",
            error: error.message
        })
    }
};

module.exports = deleteArtist;