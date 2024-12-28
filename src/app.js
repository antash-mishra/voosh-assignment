const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors);  
app.use(express.json());

// Routes
app.use('/api/v1', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/artists', require('./routes/artists'));
// app.use('/api/v1/albums', require('./routes/albums'));
// app.use('/api/v1/tracks', require('./routes/tracks'));
// app.use('/api/v1/favorites', require('./routes/favorites'));


module.exports = app;
