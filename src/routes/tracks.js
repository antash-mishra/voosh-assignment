const express = require('express');
const authenticate = require('../middlewares/authenticate');
const validateObjectId = require('../middlewares/validate');
const { getTracks, getTrackById, addTrack, updateTrack, deleteTrack } = require('../controllers/track');
const validateAuthorization = require('../middlewares/validateAuthorization');
const router = express.Router();

router.use(authenticate);

// Track Routes
router.get('/', validateAuthorization, getTracks);
router.get('/:id', validateAuthorization, validateObjectId ,getTrackById);
router.post('/add-track', validateAuthorization, addTrack);
router.put('/:id', validateAuthorization, validateObjectId, updateTrack);
router.delete('/:id', validateAuthorization, validateObjectId, deleteTrack);

module.exports = router;