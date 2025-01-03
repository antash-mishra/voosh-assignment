const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer token
  console.log("TOKEN: ", token);
  if (!token) {
    return res.status(401).json({
      status: 401,
      data: null,
      message: "Unauthorized Access, Reason: Missing token.",
      error: null,
    });
  }

  try {
    // Verify token
    console.log("JWT TOKEN: ", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED: ", decoded);
    // Fetch user from database
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: "Unauthorized Access, Reason: User not found.",
        error: null,
      });
    }

    req.user = user; // Attach user to the request object
    next();
  } catch (error) {
    return res.status(401).json({
      status: 401,
      data: null,
      message: "Unauthorized Access, Reason: Invalid token.",
      error: error.message,
    });
  }
};

module.exports = authenticate;
