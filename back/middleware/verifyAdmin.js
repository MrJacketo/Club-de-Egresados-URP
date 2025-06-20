const User = require("../models/User");

// Middleware para verificar que el usuario sea administrador
const verifyAdmin = async (req, res, next) => {
    try {
        // El usuario ya debería estar disponible desde verifyFirebaseToken
        if (!req.user) {
            return res.status(401).json({ error: "Usuario no autenticado" });
        }

        // Buscar el usuario completo en la base de datos para verificar el rol
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Verificar si el usuario tiene rol de administrador
        // Nota: Necesitarás agregar el campo 'role' al modelo User si no existe
        if (user.role !== 'admin') {
            return res.status(403).json({ 
                error: "Acceso denegado", 
                message: "Se requieren permisos de administrador" 
            });
        }

        // Si es admin, continuar
        next();
    } catch (error) {
        console.error("Error verificando permisos de administrador:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Middleware combinado: verificar token + admin
const verifyFirebaseToken = require("./verifyFirebaseToken");

const verifyAdminAccess = [verifyFirebaseToken, verifyAdmin];

module.exports = {
    verifyAdmin,
    verifyAdminAccess
};