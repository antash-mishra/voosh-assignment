const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate'); // Authentication middleware
const { addUser, deleteUser, getUsers, updateUserPassowrd } = require('../controllers/user');
const validateAuthorization = require('../middlewares/validateAuthorization');

router.use(authenticate);

// GET /users - Retrieve all users
router.get('/', validateAuthorization, getUsers);
router.post('/add-user', validateAuthorization, addUser);
router.delete('/:id', validateAuthorization, deleteUser);
router.put('/update-password', validateAuthorization, updateUserPassowrd);

module.exports = router;
