const express = require("express");
const router = express.Router();
const verifyJWTToken = require("../middleware/verifyJWTToken");
const beneficioController = require("../controllers/beneficioController");
const beneficioRedimidoController = require("../controllers/beneficioRedimidoController");

// ========== RUTAS PÚBLICAS (sin autenticación) ==========
// Obtener beneficios activos para mostrar en la página principal
router.get("/activos", beneficioController.getBeneficiosActivos);

// ========== RUTAS PARA USUARIOS AUTENTICADOS ==========
// Beneficios generales (catálogo) - para egresados
router.get("/ver-beneficios", verifyJWTToken, beneficioController.getBeneficios);

// Obtener un beneficio específico por ID
router.get("/:id", verifyJWTToken, beneficioController.getBeneficioById);

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
router.get("/admin/todos", verifyJWTToken, verificarAdmin, beneficioController.getBeneficios);
router.get("/admin/estadisticas", verifyJWTToken, verificarAdmin, beneficioController.getEstadisticasBeneficios);
router.post("/admin/crear", verifyJWTToken, verificarAdmin, beneficioController.createBeneficio);
router.put("/admin/:id", verifyJWTToken, verificarAdmin, beneficioController.updateBeneficio);
router.delete("/admin/:id", verifyJWTToken, verificarAdmin, beneficioController.deleteBeneficio);

module.exports = router;