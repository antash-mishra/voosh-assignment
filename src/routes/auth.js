const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/signup');
const { login } = require('../controllers/login');
const authenticate = require('../middlewares/authenticate');
const validateAuthorization = require('../middlewares/validateAuthorization');
const logoutUser = require('../controllers/logoutUser');

// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

// Logout Route
router.get('/logout', authenticate, validateAuthorization, logoutUser);

module.exports = router;