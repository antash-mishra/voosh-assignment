const {Favorite, Artist, Album, Track} = require('../models');

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
}

module.exports = addFavorite;