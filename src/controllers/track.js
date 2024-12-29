const { Track, Album, Artist } = require('../models');
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

// GET /tracks Controller
const getTracks = async (req, res) => {
    const { limit = 5, offset = 0, album_id, artist_id, hidden } = req.query;

    try {
        // Validate pagination parameters
        if (isNaN(limit) || isNaN(offset)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request, Reason: Invalid pagination parameters.",
                error: null,
            });
        }

        if (hidden && !['true', 'false'].includes(hidden.toLowerCase())) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request.",
                error: null,
            });
        }

        // Build filters
        const filters = {};
        if (album_id) filters.album_id = album_id;
        if (artist_id) filters.artist_id = artist_id;
        if (hidden) filters.hidden = hidden.toLowerCase() === 'true';

        // Check user role for visibility
        const userRole = req.user?.role; // Assume `req.user` is populated by auth middleware
        if (userRole === 'Viewer') {
            filters.hidden = false; // Viewers can only see visible tracks
        }

        // Fetch tracks with filters and pagination
        const tracks = await Track.findAll({
            where: filters,
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        return res.status(200).json({
            status: 200,
            data: tracks,
            message: "Tracks retrieved successfully.",
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

// GET /tracks/:id - Get Track by ID
const getTrackById = async (req, res) => {
    const { id } = req.params;

    try {
        const track = await Track.findByPk(id);

        if (!track) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Track not found.Resource Doesn't Exist.",
                error: null
            });
        }

        if (track.hidden) {
            const userRole = req.user?.role;
            if (!['Admin', 'Editor'].includes(userRole)) {
                return res.status(403).json({
                    status: 403,
                    data: null,
                    message: "Forbidden Access. Viewers cannot access hidden tracks.",
                    error: null,
                });
            }
        }

        return res.status(200).json({
            status: 200,
            data: track,
            message: "Track retrieved successfully.",
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

// PUT /tracks/:id Controller
const updateTrack = async (req, res) => {
    const { id } = req.params;
    const { name, duration, album_id, artist_id, hidden } = req.body;
  
    try {
      // Ensure only Admins and Editors can access this endpoint
      const userRole = req.user?.role; // Assume req.user is populated by auth middleware
      if (!['Admin', 'Editor'].includes(userRole)) {
        return res.status(403).json({
          status: 403,
          data: null,
          message: "Forbidden Access. Only Admins and Editors can update tracks.",
          error: null,
        });
      }
  
      // Fetch the track
      const track = await Track.findByPk(id);
      if (!track) {
        return res.status(404).json({
          status: 404,
          data: null,
          message: "Track not found.",
          error: null,
        });
      }
  
      // Validate and update fields only if they are provided
      if (album_id) {
        const album = await Album.findByPk(album_id);
        if (!album) {
          return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request, Reason: Invalid album ID.",
            error: null,
          });
        }
        track.album_id = album_id;
      }
  
      if (artist_id) {
        const artist = await Artist.findByPk(artist_id);
        if (!artist) {
          return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request, Reason: Invalid artist ID.",
            error: null,
          });
        }
        track.artist_id = artist_id;
      }
  
      if (name !== undefined) track.name = name;
      if (duration !== undefined) track.duration = duration;
      if (hidden !== undefined) track.hidden = hidden;
  
      // Save updates
      await track.save();
  
      return res.status(204).send(); // No content
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

// DELETE /tracks/:id - Delete Track
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

module.exports = { addTrack, getTracks, getTrackById, updateTrack, deleteTrack };