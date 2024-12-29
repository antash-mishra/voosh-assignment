const { User } = require('../models');
const bcrypt = require('bcrypt');

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

module.exports = updateUserPassowrd