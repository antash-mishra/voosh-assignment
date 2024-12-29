const express = require('express');
const authenticate = require('../middlewares/authenticate');
const validateObjectId = require('../middlewares/validate');
const { getAlbums, getAlbumById, addAlbum, updateAlbum, deleteAlbum } = require('../controllers/album');
const validateAuthorization = require('../middlewares/validateAuthorization');
const router = express.Router();

// Album Routes
router.get('/', authenticate, validateAuthorization,  getAlbums);
router.get('/:id', authenticate, validateObjectId, validateAuthorization, getAlbumById);
router.post('/add-album', authenticate, validateAuthorization, addAlbum);
router.put('/:id', authenticate, validateAuthorization, validateObjectId, updateAlbum);
router.delete('/:id', authenticate,validateAuthorization, validateObjectId, deleteAlbum);

module.exports = router;