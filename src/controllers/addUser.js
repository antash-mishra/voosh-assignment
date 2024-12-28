const User = require('../models');
const bcrypt = require('bcrypt');
const {v4: uuidv4} = require('uuid');

const addUser = async (req, res) => {
    const {email, paasword, role} = req.body;
    
    // Validation Input
    if(!email || !password || !role) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request, Reason: Missing required fields",
            error: null,
        })
    }

    // Validation Role
    if (!['Editor', 'Viewer'].includes(role)) {
        return res.status(403).json({
            status: 403,
            data: null,
            message: "Bad Request, Reason: Invalid Role. Allowed roles are 'Editor' and 'Viewer'. "
        })
    }

    try {
        // Ensure only Admin users can access this endpoint
        const userRole = req.user?.role;
        if (userRole !== 'Admin') {
            return res.status(401).json({
                status: 401,
                data: null,
                message: "Unauthorized Access. Only Admins can create users.",
                error: null,
            });
        }
    
        // Check if the email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                status: 409,
                data: null,
                message: "Email already exists.",
                error: null,
            });
        }
    
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create the new user
        await User.create({
            user_id: uuidv4(),
            email,
            password: hashedPassword,
            role,
        });
    
        return res.status(201).json({
            status: 201,
            data: null,
            message: "User created successfully.",
            error: null,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: "Internal Server Error.",
            error: error.message,
        });
    }    

}

module.exports = addUser