const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate'); // Authentication middleware
const { getFavorites, addFavorite, deleteFavorite } = require('../controllers/favorite');

// Favorites Routes
router.get('/:category', authenticate, getFavorites);
router.post('/add-favorite', authenticate, addFavorite);
router.delete('/remove-favorite/:id', authenticate, deleteFavorite);


module.exports = router;