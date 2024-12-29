const express = require('express');
const cors = require('cors');
const authenticate = require('./middlewares/authenticate');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());  
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.status(200).send('Hello World');
});
  
app.use('/api/v1' ,require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/artists', require('./routes/artists'));
app.use('/api/v1/albums', require('./routes/albums'));
app.use('/api/v1/tracks', require('./routes/tracks'));
app.use('/api/v1/favorites', require('./routes/favorites'));


module.exports = app;
