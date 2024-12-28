const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate'); // Authentication middleware
const getUsers = require('../controllers/getUsers');
const addUser = require('../controllers/addUser');
const deleteUser = require('../controllers/deleteUser');
const updateUserPassword = require('../controllers/updateUserPassword');

// GET /users - Retrieve all users
router.get('/', authenticate, getUsers);
router.post('/add-user', authenticate, addUser);
router.delete('/:id',  authenticate, deleteUser);
router.put('/update-password', authenticate, updateUserPassword);
module.exports = router;
