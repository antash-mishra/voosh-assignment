const { Favorite, Artist, Album, Track } = require('../models');

// GET /favorites/:category Controller
const getFavorites = async (req, res) => {
  const { category } = req.params;

  // Validate category
  const validCategories = ['artist', 'album', 'track'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request, Reason: Invalid category parameter. Allowed values are 'artists', 'albums', 'tracks'.",
      error: null,
    });
  }

  try {
    // Retrieve favorites for the user and category
    const userId = req.user?.user_id; // Assume req.user is populated by auth middleware
    const favorites = await Favorite.findAll({
      where: {
        user_id: userId,
        category,
      },
    });

    // Handle no favorites found
    if (favorites.length === 0) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: `No favorites found for the category: ${category}.`,
        error: null,
      });
    }

    // Populate favorite details based on category
    let populatedFavorites = [];
    if (category === 'artists') {
      populatedFavorites = await Promise.all(
        favorites.map(async (fav) => {
          return Artist.findByPk(fav.item_id);
        })
      );
    } else if (category === 'albums') {
      populatedFavorites = await Promise.all(
        favorites.map(async (fav) => {
          return Album.findByPk(fav.item_id);
        })
      );
    } else if (category === 'tracks') {
      populatedFavorites = await Promise.all(
        favorites.map(async (fav) => {
          return Track.findByPk(fav.item_id);
        })
      );
    }

    // Remove nulls (if any item_id is invalid)
    populatedFavorites = populatedFavorites.filter((item) => item !== null);

    return res.status(200).json({
      status: 200,
      data: populatedFavorites,
      message: `Favorites retrieved successfully for category: ${category}.`,
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

module.exports = getFavorites;
