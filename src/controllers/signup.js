const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../models');

const signup = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request, Reason: Missing required fields',
                error: null
            });
        };

        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } }).first();
        if (existingUser) {
            return res.status(409).json({
                status: 409,
                data: null,
                message: "Email already exists",
                error: null
            });
        };

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if this is the first user (it will be admin)
        const isFirstUser = await User.count() === 0;
        const role = isFirstUser ? 'admin' : 'user';

        const user = await User.create({ 
            user_id: uuidv4(),
            email: email,
            password: hashedPassword,
            role: role
         });
        res.status(201).json({ 
            status: 201,
            data: null,
            message: 'User created successfully',
            error: null
         });
    
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({
            status: 500,
            data: null,
            message: 'Internal Server Error',
            error: error.message
        });
    }

};

module.exports = { signup };