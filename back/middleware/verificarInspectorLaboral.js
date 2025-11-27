// Middleware para verificar que el usuario tiene permisos de inspector laboral
const verificarInspectorLaboral = (req, res, next) => {
  try {
    // Verificar que el usuario esté autenticado
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Acceso denegado. Se requiere autenticación."
      });
    }

    // Verificar que el usuario tenga el rol apropiado
    const rolesPermitidos = ['inspector_laboral', 'moderador', 'admin'];
    
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: "Acceso denegado. Se requieren permisos de inspector laboral, moderador o administrador.",
        requiredRoles: rolesPermitidos,
        userRole: req.user.rol
      });
    }

    // Verificar que la cuenta esté activa
    if (!req.user.activo) {
      return res.status(403).json({
        success: false,
        message: "Acceso denegado. La cuenta está desactivada."
      });
    }

    // Si todo está correcto, continuar
    next();

  } catch (error) {
    console.error('Error en middleware verificarInspectorLaboral:', error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor en la verificación de permisos",
      error: error.message
    });
  }
};

// Middleware más permisivo para permitir creación anónima de incidencias
const verificarPermisoLectura = (req, res, next) => {
  try {
    // Si el usuario no está autenticado, solo permitir operaciones de lectura básicas
    if (!req.user) {
      // Solo permitir GET en rutas específicas para usuarios no autenticados
      if (req.method === 'GET' && (req.path === '/estadisticas' || req.path.startsWith('/buscar'))) {
        return next();
      }
      
      return res.status(401).json({
        success: false,
        message: "Acceso denegado. Se requiere autenticación para esta operación."
      });
    }

    // Si está autenticado, verificar permisos normales
    const rolesPermitidos = ['inspector_laboral', 'moderador', 'admin', 'egresado'];
    
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: "Acceso denegado. Permisos insuficientes.",
        requiredRoles: rolesPermitidos,
        userRole: req.user.rol
      });
    }

    // Verificar que la cuenta esté activa
    if (!req.user.activo) {
      return res.status(403).json({
        success: false,
        message: "Acceso denegado. La cuenta está desactivada."
      });
    }

    next();

  } catch (error) {
    console.error('Error en middleware verificarPermisoLectura:', error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor en la verificación de permisos",
      error: error.message
    });
  }
};

// Middleware para operaciones de escritura (crear, actualizar, eliminar)
const verificarPermisoEscritura = (req, res, next) => {
  try {
    // Las operaciones de escritura requieren autenticación
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Acceso denegado. Se requiere autenticación para crear o modificar incidencias."
      });
    }

    // Para crear incidencias, permitir a cualquier usuario autenticado
    if (req.method === 'POST' && req.path === '/') {
      const rolesPermitidos = ['inspector_laboral', 'moderador', 'admin', 'egresado'];
      
      if (!rolesPermitidos.includes(req.user.rol)) {
        return res.status(403).json({
          success: false,
          message: "Acceso denegado. No tiene permisos para crear incidencias.",
          requiredRoles: rolesPermitidos,
          userRole: req.user.rol
        });
      }
    } else {
      // Para otras operaciones (actualizar, eliminar), solo inspectores, moderadores y admins
      const rolesPermitidos = ['inspector_laboral', 'moderador', 'admin'];
      
      if (!rolesPermitidos.includes(req.user.rol)) {
        return res.status(403).json({
          success: false,
          message: "Acceso denegado. Se requieren permisos de inspector laboral, moderador o administrador.",
          requiredRoles: rolesPermitidos,
          userRole: req.user.rol
        });
      }
    }

    // Verificar que la cuenta esté activa
    if (!req.user.activo) {
      return res.status(403).json({
        success: false,
        message: "Acceso denegado. La cuenta está desactivada."
      });
    }

    next();

  } catch (error) {
    console.error('Error en middleware verificarPermisoEscritura:', error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor en la verificación de permisos",
      error: error.message
    });
  }
};

module.exports = {
  verificarInspectorLaboral,
  verificarPermisoLectura,
  verificarPermisoEscritura
};