const {User} = require('../models');
const bcrypt = require('bcrypt');
const {v4: uuidv4} = require('uuid');

// GET /users - Retrieve all users
const getUsers = async (req, res) => {
    const  {limit=5, offset=0, role} = req.query;
    
    // Validate query parameters
    if (isNaN(limit) || isNaN(offset) || (role && !['Editor', 'Viewer'].includes(role))) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid query parameters',
            error: null
        });
    }

    try {
        // Ensure only Admin can access this endpoint
        console.log("User:",req.user);
        if (req.user?.role !== 'Admin') {
            return res.status(401).json({
                status: 401,
                data: null,
                message: 'Unauthorized Access',
                error: null
            });
        }

        // Build query filters
        const filters = {};
        if (role) filters.role = role;

        // Fetch users with pagination and filters
        const users = await User.findAll({
            where: filters,
            limit: parseInt(limit),
            offset: parseInt(offset),
            attributes: ['user_id', 'email', 'role']  // Select only specific fields
        });

        res.status(200).json({
            status: 200,
            data: users,
            message: 'Users retrieved successfully',
            error: null
        });

    } catch (error) {
        console.error('Error during getUsers:', error);
        res.status(500).json({
            status: 500,
            data: null,
            message: 'Internal Server Error',
            error: error.message
        }); 
    }

};

// POST /users/add-user Controller
const addUser = async (req, res) => {
    const {email, password, role} = req.body;
    console.log("Request Body:", req.body);
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
            role
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

// Delete /users/:id Comtroller
const deleteUser = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Ensuring only Admin Users can access the endpoint
        const userRole = req.user?.role;
        if (userRole !== 'Admin') {
            return res.status(401).json({
                status: 401,
                data: null,
                message: "Unauthorized Access. Only admin can delete users.",
                error: null
            });
        }

        // Check if user exists
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "User not Found",
                error: null,
            });
        }

        // Check if the User to delete is not Admin
        if(user.role == 'Admin') {
            return res.status(403).json({
                status: 403,
                data: null,
                message: "Forbidden Access. Admins cannot delete other Admins.",
                error: null
            });
        }

        // Delete the user
        await User.destroy({where: {user_id: id}});

        return res.status(200).json({
            status: 200,
            data: null,
            message: `User with ID: ${id} deleted successfully.`,
            error: null
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: "Internal server error.",
            error: error.message
        });
    }
};

// PUT /users/update-password Controller
const updateUserPassowrd = async (req, res) => {
    const { old_password, new_password} = req.body;

    // Validate Input
    if (!old_password || !new_password) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request, Reason: Missing required fields.",
            error: null
        });
    }

    try{
        const user = await User.findByPk(req.user.user_id);
        if (!user) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "User not found.",
                error: null
            })
        }

        // Verify old password
        const isPasswordValid = await bcrypt.compare(old_password, user.password);
        if(!isPasswordValid) {
            return res.status(403).json({
                status: 403,
                data:null,
                message: "Forbidden Access, Reason: Incorrect old password.",
                error: null
            })
        }

        // Hash and update the new password
        const hashedPassword = await bcrypt.hash(new_password, 10);
        await user.update({password: hashedPassword});
        
        return res.status(204).send()
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: 500,
            data: null,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

module.exports = {addUser, deleteUser, updateUserPassowrd, getUsers};