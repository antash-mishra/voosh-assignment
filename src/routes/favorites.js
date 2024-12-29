const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate'); // Authentication middleware
const { getFavorites, addFavorite, deleteFavorite } = require('../controllers/favorite');

router.use(authenticate);

// Favorites Routes
router.get('/:category', getFavorites);
router.post('/add-favorite', addFavorite);
router.delete('/remove-favorite/:id', deleteFavorite);


module.exports = router;