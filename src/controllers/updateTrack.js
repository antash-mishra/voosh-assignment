const { Track, Album, Artist } = require('../models');

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

module.exports = updateTrack;
