const { Artist } = require('../models');
const track = require('../models/track');

// POST /add-track - Add new Track
const addTrack = async (req, res) => {
    const {artist_id, album_id, name, duration, hidden = false} = req.body;

    // Validate Input
    if (!artist_id || !album_id || !name || !duration) {
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

        // Check if Artist and Album exists
        const existingArtist = await Artist.findByPk(artist_id);
        const existingAlbum = await Album.findByPk(album_id);

        if (!existingArtist || !existingAlbum) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Resource Doesn't Exist - Artist or Album not found, not valid artist or album ID.",
                error: null
            });
        }

        // Check if Track already exists
        const existingTrack = await track.fetchOne({where: {name, album_id, artist_id}});
        if (existingTrack) {
            return res.status(409).json({
                status: 409,
                data: null,
                message: "Track already exists for the album.",
                error: null,
            });
        }

        // Creating new Track
        await track.create({
            track_id: uuidv4(),
            artist_id,
            album_id,
            name,
            duration,
            hidden
        })

        return res.status(201).json({
            status:201,
            data: null,
            message: "Track added successfully.",
            error: null
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: "Internal Server Error.",
            error: error.message
        });
    }
}

module.exports = addTrack;