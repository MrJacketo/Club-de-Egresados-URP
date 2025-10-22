const express = require("express");
const router = express.Router();
const verifyJWTToken = require("../middleware/verifyJWTToken");
const gestionarBeneficiosController = require("../controllers/gestionarBeneficiosController");
const beneficioRedimidoController = require("../controllers/beneficioRedimidoController");

// ========== RUTAS PÚBLICAS (sin autenticación) ==========
// Obtener beneficios activos para mostrar en la página principal
router.get("/activos", gestionarBeneficiosController.getBeneficiosActivos);

// ========== RUTAS PARA USUARIOS AUTENTICADOS ==========
// Beneficios generales (catálogo) - para egresados
router.get("/ver-beneficios", verifyJWTToken, gestionarBeneficiosController.getBeneficios);

// Obtener un beneficio específico por ID
router.get("/:id", verifyJWTToken, gestionarBeneficiosController.getBeneficioById);

// Redención de beneficios por usuario
router.get("/mis-beneficios", verifyJWTToken, beneficioRedimidoController.getBeneficiosRedimidosPorUsuario);
router.post("/redimir", verifyJWTToken, beneficioRedimidoController.redimirBeneficio);

// ========== RUTAS ADMINISTRATIVAS (requieren verificación de admin) ==========
// Middleware para verificar que el usuario es administrador
const verificarAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Acceso denegado. Se requieren permisos de administrador."
    });
  }
};

// CRUD completo para administradores
router.get("/admin/todos", verifyJWTToken, verificarAdmin, gestionarBeneficiosController.getBeneficios);
router.get("/admin/estadisticas", verifyJWTToken, verificarAdmin, gestionarBeneficiosController.getEstadisticasBeneficios);
router.post("/admin/crear", verifyJWTToken, verificarAdmin, gestionarBeneficiosController.createBeneficio);
router.put("/admin/:id", verifyJWTToken, verificarAdmin, gestionarBeneficiosController.updateBeneficio);
router.delete("/admin/:id", verifyJWTToken, verificarAdmin, gestionarBeneficiosController.deleteBeneficio);

module.exports = router;