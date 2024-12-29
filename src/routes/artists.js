const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate'); // Authentication middleware
const validateObjectId = require('../middlewares/validate'); // Validate ObjectID middleware
const { getArtists, getArtistById, addArtist, updateArtist, deleteArtist } = require('../controllers/artist');
const validateAuthorization = require('../middlewares/validateAuthorization');

// Artist Routes
router.get('/', authenticate, validateAuthorization, getArtists);
router.get('/:id', authenticate, validateAuthorization, validateObjectId, getArtistById);
router.post('/add-artist',validateAuthorization, authenticate, addArtist);
router.put('/:id', authenticate,validateAuthorization, validateObjectId, updateArtist);
router.delete('/:id', authenticate,validateAuthorization, validateObjectId, deleteArtist);

module.exports = router;
