const express = require("express");
const router = express.Router();
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const beneficioController = require("../controllers/beneficioController");
const beneficioRedimidoController = require("../controllers/beneficioRedimidoController");

// Beneficios generales (catálogo)
router.get("/ver-beneficios", verifyFirebaseToken, beneficioController.getBeneficios);

// Redención de beneficios por usuario
router.get("/mis-beneficios", verifyFirebaseToken, beneficioRedimidoController.getBeneficiosRedimidosPorUsuario);
router.post("/redimir", verifyFirebaseToken, beneficioRedimidoController.redimirBeneficio);

module.exports = router;