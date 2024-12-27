const express = require('express');
const router = express.Router();
const getUsers = require('../controllers/getUsers');
const authenticate = require('../middlewares/authenticate'); // Authentication middleware

// GET /users - Retrieve all users
router.get('/', authenticate, getUsers);

module.exports = router;
