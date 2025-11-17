// Middleware to verify moderador role
const verifyModeradorRole = (req, res, next) => {
  // req.user should be set by verifyJWTToken middleware
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: No user found' });
  }

  if (req.user.rol !== 'moderador') {
    return res.status(403).json({ error: 'Forbidden: Only moderators can access this resource' });
  }

  next();
};

module.exports = verifyModeradorRole;
