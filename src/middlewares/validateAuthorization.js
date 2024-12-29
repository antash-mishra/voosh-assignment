const validateAuthorization = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Validate Authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request, Reason: Missing or invalid Authorization header. Expected format: 'Bearer <token>'.",
      error: null,
    });
  }

  next();
};

module.exports = validateAuthorization;