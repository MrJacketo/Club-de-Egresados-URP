const express = require("express");
const router = express.Router();
const pagoController = require("../controllers/pagoController");
const verifyJWTToken = require("../middleware/verifyJWTToken");

// Crear preferencia de pago (Checkout Pro)
router.post("/create-preference", verifyJWTToken, pagoController.handleSubscription);

// Simular pago para activar membresía manualmente
router.post("/simular-pago", verifyJWTToken, pagoController.simulatePagoAprobado);

module.exports = router;