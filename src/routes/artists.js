const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate'); // Authentication middleware
const validateObjectId = require('../middlewares/validate'); // Validate ObjectID middleware
const { getArtists, getArtistById, addArtist, updateArtist, deleteArtist } = require('../controllers/artist');
const validateAuthorization = require('../middlewares/validateAuthorization');

router.use(authenticate);

// Artist Routes
router.get('/', validateAuthorization, getArtists);
router.get('/:id', validateAuthorization, validateObjectId, getArtistById);
router.post('/add-artist',validateAuthorization, authenticate, addArtist);
router.put('/:id', validateAuthorization, validateObjectId, updateArtist);
router.delete('/:id', validateAuthorization, validateObjectId, deleteArtist);

module.exports = router;
