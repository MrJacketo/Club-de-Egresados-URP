const express = require("express");
const router = express.Router();
const verifyJWTToken = require("../middleware/verifyJWTToken");
const beneficioController = require("../controllers/beneficioController");
const beneficioRedimidoController = require("../controllers/beneficioRedimidoController");

// Beneficios generales (catálogo)
router.get("/ver-beneficios", verifyJWTToken, beneficioController.getBeneficios);

// Redención de beneficios por usuario
router.get("/mis-beneficios", verifyJWTToken, beneficioRedimidoController.getBeneficiosRedimidosPorUsuario);
router.post("/redimir", verifyJWTToken, beneficioRedimidoController.redimirBeneficio);

module.exports = router;