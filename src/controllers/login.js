const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models');


const login = async (req, res) => {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Missing required fields',
            error: null
        });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'User not found',
                error: null
            });
        }

        // Verify Password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 401,
                data: null,
                message: 'Unauthorized, Reason: Invalid password',
                error: null
            });
        }

        // Generate JWT
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET environment variable is not set');
        }
        const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            status: 200,
            data: { token },
            message: 'Login successful',
            error: null
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            status: 500,
            data: null,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

module.exports = { login };