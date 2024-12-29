const { Artist } = require('../models');

const updateArtist = async (req, res) => {
    const { id } = req.params;
    const { name, grammy, hidden } = req.body;

    // Validate input
    if (!name && !grammy && !['true', 'false'].includes(hidden)) {
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

        // Fetch artist by id
        const artist = await Artist.findByPk(id);
        if (!artist) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Artist not found",
                error: null
            });
        }

            // Update the artist
        if (name !== undefined) artist.name = name;
        if (grammy !== undefined) artist.grammy = grammy;
        if (hidden !== undefined) artist.hidden = hidden;

        await artist.save();

        return res.status(204).send();
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

module.exports= updateArtist