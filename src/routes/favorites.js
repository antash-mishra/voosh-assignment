const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate'); // Authentication middleware
const getFavorites = require('../controllers/getFavorites');
const addFavorite = require('../controllers/addFavorite');
const deleteFavorite = require('../controllers/deleteFavorite');

// Favorites Routes
router.get('/:category', authenticate, getFavorites);
router.post('/add-favorite', authenticate, addFavorite);
router.delete('/remove-favorite/:id', authenticate, deleteFavorite);