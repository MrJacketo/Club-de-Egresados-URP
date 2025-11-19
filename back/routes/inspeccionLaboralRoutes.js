const express = require("express");
const router = express.Router();
const verifyJWTToken = require("../middleware/verifyJWTToken");
const inspeccionLaboralController = require("../controllers/inspeccionLaboralController");

// Middleware para verificar que el usuario es inspector laboral o admin
const verificarInspectorLaboral = (req, res, next) => {
  if (req.user && (req.user.rol === 'inspector_laboral' || req.user.rol === 'admin')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Acceso denegado. Se requieren permisos de inspector laboral."
    });
  }
};

// Rutas de inspección laboral
router.get("/ofertas", verifyJWTToken, verificarInspectorLaboral, inspeccionLaboralController.getOfertasParaInspeccion);
router.get("/estadisticas", verifyJWTToken, verificarInspectorLaboral, inspeccionLaboralController.getEstadisticasInspeccion);
router.get("/empresas", verifyJWTToken, verificarInspectorLaboral, inspeccionLaboralController.getEmpresas);
router.get("/ofertas/:ofertaId", verifyJWTToken, verificarInspectorLaboral, inspeccionLaboralController.getDetalleOferta);
router.put("/ofertas/:ofertaId/bloqueo", verifyJWTToken, verificarInspectorLaboral, inspeccionLaboralController.toggleBloqueoOferta);
router.put("/empresas/:nombreEmpresa/suspension", verifyJWTToken, verificarInspectorLaboral, inspeccionLaboralController.toggleSuspensionEmpresa);

module.exports = router;
