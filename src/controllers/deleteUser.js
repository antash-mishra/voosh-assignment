const { User } = require('../models');

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

module.exports = deleteUser
