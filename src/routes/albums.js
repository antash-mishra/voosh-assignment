const express = require('express');
const authenticate = require('../middlewares/authenticate');
const validateObjectId = require('../middlewares/validate');
const { getAlbums, getAlbumById, addAlbum, updateAlbum, deleteAlbum } = require('../controllers/album');
const validateAuthorization = require('../middlewares/validateAuthorization');
const router = express.Router();

router.use(authenticate);

// Album Routes
router.get('/', validateAuthorization,  getAlbums);
router.get('/:id', validateObjectId, validateAuthorization, getAlbumById);
router.post('/add-album', validateAuthorization, addAlbum);
router.put('/:id', validateAuthorization, validateObjectId, updateAlbum);
router.delete('/:id',validateAuthorization, validateObjectId, deleteAlbum);

module.exports = router;