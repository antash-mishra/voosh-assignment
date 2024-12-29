const {Favorite, Artist, Album, Track} = require('../models');

// POST /favorites/add-favorite Controller - Add new Favorite
const addFavorite = async (req, res) => {
    const {category, item_id} = req.body;

    // Validate Input
    if (!category || !item_id) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request, Reason: Missing required fields.",
            error: null
        });
    }

    const validCategories = ['artist', 'album', 'track'];
    if (!validCategories.includes(category)) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request, Reason: Invalid category parameter. Allowed values are 'artist', 'album', 'track'.",
            error: null
        });
    }

    try {
        // Ensure the item exists in the specified category
        let itemExists = false;
        if (category === 'artist') {
            itemExists = await Artist.findByPk(item_id);
        } else if (category === 'album') {
            itemExists = await Album.findByPk(item_id);
        } else if (category === 'track') {
            itemExists = await Track.findByPk(item_id);
        }

        if (!itemExists) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: `Resource Doesn't Exist - ${category} not found, not valid ${category} ID.`,
                error: null
            });
        }

        //Check if the item is already a favorite
        const userId = req.user?.user_id;
        const existingFavorite = await Favorite.findOne({
            where: {
                user_id: userId,
                category,
                item_id
            }
        });

        if (existingFavorite) {
            return res.status(409).json({
                status: 409,
                data: null,
                message: `Item with ID ${item_id} is already a favorite in the category: ${category}.`,
                error: null
            });
        }

        // Add the item to favorites
        await Favorite.create({
            user_id: userId,
            category,
            item_id
        });

        return res.status(201).json({
            status: 201,
            data: null,
            message: `Item with ID ${item_id} added to favorites in the category: ${category}.`,
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
};

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

// DELETE /favorites/:id Controller - Delete Favorite by Item ID
const deleteFavorite = async (req, res) => {
    const item_id = req.params.id;

    // Validate Input
    if (!item_id) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request, Reason: Missing required fields.",
            error: null
        });
    }

    try {
        // Ensuring item exists in the favorite list
        const userId = req.user?.user_id;
        const existingFavorite = await Favorite.findOne({
            where: {
                user_id: userId,
                item_id
            }
        });

        if (!existingFavorite) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: `Item with ID ${item_id} is not a favorite.`,
                error: null
            });
        }

        // Delete Item from Favorite
        await Favorite.destroy({
            where: {
                user_id: userId,
                item_id
            }
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

module.exports = { addFavorite, getFavorites, deleteFavorite };