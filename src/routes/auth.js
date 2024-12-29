const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/signup');
const { login } = require('../controllers/login');
const authenticate = require('../middlewares/authenticate');
const validateAuthorization = require('../middlewares/validateAuthorization');

// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

// Logout Route
route.get('/logout', authenticate, validateAuthorization, logout);

module.exports = router;