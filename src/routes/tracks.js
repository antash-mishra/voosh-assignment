const express = require('express');
const authenticate = require('../middlewares/authenticate');
const validateObjectId = require('../middlewares/validate');
const { getTracks, getTrackById, addTrack, updateTrack, deleteTrack } = require('../controllers/track');
const validateAuthorization = require('../middlewares/validateAuthorization');
const router = express.Router();

// Track Routes
router.get('/', authenticate, validateAuthorization, getTracks);
router.get('/:id', authenticate, validateAuthorization, validateObjectId ,getTrackById);
router.post('/add-track', authenticate, validateAuthorization, addTrack);
router.put('/:id', authenticate, validateAuthorization, validateObjectId, updateTrack);
router.delete('/:id', authenticate, validateAuthorization, validateObjectId, deleteTrack);

module.exports = router;