const express = require("express");
const router = express.Router();
const pagoController = require("../controllers/pagoController");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

router.post("/create-order", verifyFirebaseToken, pagoController.handleSubscription);
router.post("/webhook", pagoController.handleWebhook);
router.post("/simular-pago", verifyFirebaseToken, pagoController.simulatePagoAprobado);

module.exports = router;