const { Album } = require('../models');

const deleteAlbum = async (req, res) => {
    const { id } = req.params;

    try {
        // Ensuring only Admins and Editors can access this endpoint
        const userRole = req.user?.role;
        if(!['Admin', 'Editor'].includes(userRole)) {
            return res.status(403).json({
                status: 403,
                data: null,
                message: "Forbidden Access. Only Admins and Editors can delete albums.",
                error: null,
            });
        }

        // Fetch Album
        const album = await Album.findByPk(id);
        if (!album) {
            return res.status(404).json({
                status: 404,
                data: null,
                message:  "Album not found",
                error: null,
            });
        }

        await album.destroy();

        return res.status(200).json({
            status: 200,
            data: { album_id: id },
            message: `Album with ID: ${id} deleted successfully.`,
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
}

module.exports = deleteAlbum;