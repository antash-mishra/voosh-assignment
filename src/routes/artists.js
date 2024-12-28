const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate'); // Authentication middleware
const validateObjectId = require('../middlewares/validate');
const getArtists = require('../controllers/getArtists');
const getArtistById = require('../controllers/getArtistById');

// GET /artists - Retrieve all artists
router.get('/', authenticate, getArtists);
router.get('/:id', authenticate,validateObjectId, getArtistById);
module.exports = router;
