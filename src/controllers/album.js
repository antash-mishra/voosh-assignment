const { Album } = require('../models');

// POST /albums/add-album Controller
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

// DELETE /album/:id Controller - Deletes an album by ID
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

// GET /albums Controller - Fetches albums with pagination
const getAlbums = async (req, res) => {
    const { limit = 5, offset=0, artist_id, hidden} = req.query;

    try {
        // Validate Query Parameter
        if (isNaN(limit) || isNaN(offset)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request, Reason: Invalid pagination parameters.",
                error: null
            })
        }

        if (hidden && !['true', 'false'].includes(hidden.toLowerCase())) { 
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request.",
                error: null,
            })
        }

        // Check if artist_id is provided
        if (!artist_id) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request, Reason: Missing artist_id.",
                error: null
            })
        }

        // Check if artist exists
        const artist = await Artist.findOne({ where: { artist_id } });
        if (!artist) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Artist not found, not valid artist ID.",
                error: null
            })
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

        // Build filters
        const filters = { artist_id };
        if (hidden) filters.hidden = hidden.toLowerCase() === 'true';

        // Fetch albums with filters and pagination
        const albums = await Album.findAll({
            where: filters,
            limit: parseInt(limit),
            offset: parseInt(offset)
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

// GET /albums/:id Controller - Fetches an album by ID
const getAlbumById = async (req, res) => {
    const {id} = req.params;

    try {
        const album = await Album.findByPk(id);

        // Check if album exists
        if (!album) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Album not found",
                error: null
            });
        }

        // Check access for hidden albums
        if(album.hidden) {
            const userRole = req.user?.role; // Assume req.user is populated by auth middleware
            if (!['Admin', 'Editor'].includes(userRole)) {
                return res.status(403).json({
                    status: 403,
                    data: null,
                    message: "Forbidden Access. Viewers cannot access hidden albums.",
                    error: null,
                });
            }
        }

        return res.status(200).json({
            status: 200,
            data: album,
            message: "Album retrieved successfully.",
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

// PUT /albums/:id Controller - Updates an album by ID
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
};

module.exports = { addAlbum, deleteAlbum, getAlbums, getAlbumById, updateAlbum };

