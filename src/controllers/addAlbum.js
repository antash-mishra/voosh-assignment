const { Album } = require('../models');

const addAlbum = async (req, res) => {
    const {name, year, artist_id, hidden = false} = req.body;

    // Validate input
    if (!name || !year || !artist_id) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request, Reason: Missing required fields.",
            error: null
        });
    }

    try {
        // ENsuring only Admin and Editor can access this endpoint
        const userRole = req.user?.role;
        if (!['Admin', 'Editor'].includes(userRole)) {
            return res.status(403).json({
                status: 403,
                data: null,
                message: "Forbidden Access. Only Admin and Editor can access this endpoint.",
                error: null
            });
        }

        // Check if Artist exists
        const existingArtist = await Artist.findOne({ where: { artist_id } });
        if (!existingArtist) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Artist not found, not valid artist ID.",
                error: null
            });
        }

        // Check if an album with the same name already exists for the artist
        const existingAlbum = await Album.findOne({ where: { name, artist_id } });
        if (existingAlbum) {
            return res.status(409).json({
                status: 409,
                data: null,
                message: "Album with the same name already exists for the artist.",
                error: null,
            });
        }

        // Cretaing new album
        await Album.create({
            album_id: uuidv4(),
            name,
            year,
            artist_id,
            hidden
        });

        return res.status(201).json({
            status: 201,
            data: null,
            message: "Album added successfully.",
            error: null
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: "Internal Server Error.",
            error: error.message
        });
    }
}

module.exports = addAlbum;