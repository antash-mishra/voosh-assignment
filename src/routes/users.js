const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate'); // Authentication middleware
// const getUsers = require('../controllers/getUsers');
// const addUser = require('../controllers/addUser');
// const deleteUser = require('../controllers/deleteUser');
const { addUser, deleteUser, getUsers, updateUserPassowrd } = require('../controllers/user');
// const updateUserPassword = require('../controllers/updateUserPassword');
const validateAuthorization = require('../middlewares/validateAuthorization');

// GET /users - Retrieve all users
router.get('/', authenticate, validateAuthorization, getUsers);
router.post('/add-user', authenticate, validateAuthorization, addUser);
router.delete('/:id',  authenticate, validateAuthorization, deleteUser);
router.put('/update-password', authenticate, validateAuthorization, updateUserPassowrd);
module.exports = router;
