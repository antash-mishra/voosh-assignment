const {Favorite, Artist, Album, Track} = require('../models');

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

module.exports = deleteFavorite