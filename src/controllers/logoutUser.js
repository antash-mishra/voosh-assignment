const { InvalidToken } = require('../models'); // Example table to store invalidated tokens (if required)

// GET /logout Controller
const logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer token
    if (!token) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: "Unauthorized Access. Token is required for logout.",
        error: null,
      });
    }

    // Invalidate the token (if implementing token invalidation)
    await InvalidToken.create({ token }); // Assuming an InvalidToken table exists to store blacklisted tokens

    return res.status(200).json({
      status: 200,
      data: null,
      message: "User logged out successfully.",
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
};

module.exports = logoutUser;