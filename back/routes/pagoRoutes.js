const express = require("express");
const router = express.Router();
const pagoController = require("../controllers/pagoController");
const verifyJWTToken = require("../middleware/verifyJWTToken");

// Crear preferencia de pago (Checkout Pro)
router.post("/create-preference", verifyJWTToken, pagoController.handleSubscription);

// Verificar estado del pago después de redirección
router.get("/verify-payment", pagoController.verifyPayment);

// Verificar y activar membresía del usuario autenticado
router.post("/check-membership", verifyJWTToken, pagoController.checkAndActivateMembership);

// Webhook opcional para notificaciones automáticas
router.post("/webhook", pagoController.handleWebhook);

// Simular pago aprobado (solo para desarrollo/testing)
router.post("/simular-pago", verifyJWTToken, pagoController.simulatePagoAprobado);

module.exports = router;