const { Artist } = require('../models');
const {v4: uuidv4} = require('uuid');

const addArtist = async (req, res) => {
    const { name, grammy, hidden = false } = req.body;

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

// GET /artists Controller
const getArtists = async (req, res) => {
    const { limit = 5, offset = 0, grammy, hidden } = req.query;

    try {
        // Validate query parameters
        if (isNaN(limit) || isNaN(offset)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request, Reason: Invalid pagination parameters.",
                error: null,
            });
        }

        if (grammy && isNaN(grammy)) {
          return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request, Reason: Invalid grammy parameter.",
            error: null,
          });
        }

        if (hidden && !['true', 'false'].includes(hidden.toLowerCase())) {
          return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request, Reason: Invalid hidden parameter. Use 'true' or 'false'.",
            error: null,
          });
        }
        
        // Check user role for visibility
        const userRole = req.user?.role; // Assume `req.user` is populated by auth middleware
        const canViewHidden = userRole === 'Admin' || userRole === 'Editor';
        
        // Build filters
        const filters = {};
        if (grammy) filters.grammy = grammy;
        if (hidden ) filters.hidden = hidden.toLowerCase() === 'true';

        // Fetch artists with filters and pagination
        const artists = await Artist.findAll({
          where: filters,
          limit: parseInt(limit),
          offset: parseInt(offset),
        });

        return res.status(200).json({
            status: 200,
            data: artists,
            message: "Artists retrieved successfully.",
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
};

// GET /artistById Controller
const getArtistById = async (req, res) => {
    const {id} = req.params;

    try {

        const artist = await Artist.findByPk(id);
        
        // Check if artist exists
        if (!artist) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Artist not found",
                error: null
            });
        }

        // Check access for hidden artists
        if (artist.hidden) {
            const userRole = req.user?.role; // Assume req.user is populated by auth middleware
            if (!['Admin', 'Editor'].includes(userRole)) {
            return res.status(403).json({
                status: 403,
                data: null,
                message: "Forbidden Access. Viewers cannot access hidden artists.",
                error: null,
            });
            }
        }
        return res.status(200).json({
            status: 200,
            data: artist,
            message: "Artist retrieved successfully.",
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
};

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
};

module.exports = {addArtist, deleteArtist, getArtists, getArtistById, updateArtist};