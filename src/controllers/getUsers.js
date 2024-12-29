const { User } = require('../models');

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

module.exports = getUsers;