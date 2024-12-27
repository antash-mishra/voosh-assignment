const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/signup');
const { login } = require('../controllers/login');

// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

module.exports = router;