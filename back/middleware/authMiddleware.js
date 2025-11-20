// middlewares/authMiddleware.js
const authMiddleware = (req, res, next) => {
  // Verificar si el usuario está autenticado
  // Esto depende de tu sistema de autenticación
  const token = req.headers.authorization || req.headers['x-access-token'];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Acceso no autorizado. Token requerido.'
    });
  }
  
  try {
    // Verificar token (depende de tu implementación JWT)
    // const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    // req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token inválido o expirado'
    });
  }
};

module.exports = authMiddleware;