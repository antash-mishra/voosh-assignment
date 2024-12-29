const {Album} = require('../models');

const updateAlbum = async (req, res) => {
    const {id} = req.params;
    const {name, year, hidden} = req.body;

    if (!name || year === undefined || hidden === undefined) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request, Reason: Missing required fields.",
            error: null
        });
    }

    try {
        // Ensuring only Admin and Editor can access this endpoint
        const userRole = req.user?.role;
        if (!['Admin', 'Editor'].includes(userRole)) {
            return res.status(403).json({
                status: 403,
                data: null,
                message: "Forbidden Access. Only Admin and Editor can access this endpoint.",
                error: null
            });
        }

        // Fetch album by id
        const album = await Album.findByPk(id);
        if (!album) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Resource doesn't exist.",
                error: null
            });
        }

        // Update the album
        if (name !== undefined) album.name = name;
        if (year !== undefined) album.year = year;
        if (hidden !== undefined) album.hidden = hidden;

        await album.save();

        return res.status(204).send();
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: "Internal Server Error.",
            error: error.message,
        });
    }
}

module.exports = updateAlbum