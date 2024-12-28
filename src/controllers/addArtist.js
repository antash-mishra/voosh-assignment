const { Artist } = require('../models');

const addArtist = async (req, res) => {
    const { name, grammy = false, hidden = false } = req.body;

    // Validate input
    if (!name) {
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
        
        // Checkinf if Artist already exists
        const existingArtist = await Artist.findOne({ where: { name } });
        if (existingArtist) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request, Reason: Artist already exists.",
                error: null
            });
        }

        // Creating new artist
        const newArtist = await Artist.create({ 
            artist_id: uuidv4(),
            name,
            grammy,
            hidden
        });

        return res.status(201).json({
            status: 201,
            data: newArtist,
            message: "Artist added successfully.",
            error: null
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

module.exports = addArtist;