const express = require("express");
const router = express.Router();
const verifyJWTToken = require("../middleware/verifyJWTToken");
const moderacionController = require("../controllers/moderacionController");

// Middleware para verificar que el usuario es moderador o admin
const verificarModerador = (req, res, next) => {
  if (req.user && (req.user.rol === 'moderador' || req.user.rol === 'admin')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Acceso denegado. Se requieren permisos de moderador."
    });
  }
};

// Rutas de moderación
router.get("/egresados", verifyJWTToken, verificarModerador, moderacionController.getEgresadosParaModerar);
router.get("/estadisticas", verifyJWTToken, verificarModerador, moderacionController.getEstadisticasModeracion);
router.get("/egresados/:userId", verifyJWTToken, verificarModerador, moderacionController.getDetalleEgresado);
router.put("/egresados/:userId/estado", verifyJWTToken, verificarModerador, moderacionController.toggleEstadoEgresado);

module.exports = router;
