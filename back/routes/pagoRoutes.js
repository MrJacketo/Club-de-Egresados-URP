const express = require("express");
const router = express.Router();
const pagoController = require("../controllers/pagoController");
const verifyJWTToken = require("../middleware/verifyJWTToken");

router.post("/create-order", verifyJWTToken, pagoController.handleSubscription);
router.post("/webhook", pagoController.handleWebhook);
router.post("/simular-pago", verifyJWTToken, pagoController.simulatePagoAprobado);

module.exports = router;