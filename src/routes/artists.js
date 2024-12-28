const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate'); // Authentication middleware
const validateObjectId = require('../middlewares/validate');
const getArtists = require('../controllers/getArtists');
const getArtistById = require('../controllers/getArtistById');
const addArtist = require('../controllers/addArtist');
const updateArtist = require('../controllers/updateArtist');
const deleteArtist = require('../controllers/deleteArtist');

// Artist Routes
router.get('/', authenticate, getArtists);
router.get('/:id', authenticate,validateObjectId, getArtistById);
router.post('/add-artist', authenticate, addArtist);
router.put('/:id', authenticate, updateArtist);
router.delete('/:id', authenticate, deleteArtist);

module.exports = router;
