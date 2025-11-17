const express = require("express");
const router = express.Router();
const {
  getOfertasParaModeracion,
  aprobarOferta,
  desaprobarOferta,
  cambiarEstadoOferta,
  getEstadisticasOfertas
} = require("../controllers/ofertaModeradorController");
const verifyJWTToken = require("../middleware/verifyJWTToken");
const verifyModeradorRole = require("../middleware/verifyModeradorRole");

// Todas las rutas requieren autenticación y rol de moderador
router.use(verifyJWTToken);
router.use(verifyModeradorRole);

// Obtener todas las ofertas para moderación
router.get("/ofertas", getOfertasParaModeracion);

// Obtener estadísticas de ofertas
router.get("/estadisticas", getEstadisticasOfertas);

// Aprobar una oferta
router.patch("/oferta/:id/aprobar", aprobarOferta);

// Desaprobar una oferta
router.patch("/oferta/:id/desaprobar", desaprobarOferta);

// Cambiar estado de una oferta (Activo/Inactivo)
router.patch("/oferta/:id/estado", cambiarEstadoOferta);

module.exports = router;
