const express = require("express");
const router = express.Router();
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const membresiaController = require("../controllers/membresiaController")

// Rutas
router.get("/", verifyFirebaseToken, membresiaController.getMembresia);
router.put("/activate", verifyFirebaseToken, membresiaController.activateMembresia);
//router.post("/agregar-beneficio", verifyFirebaseToken, membresiaController.agregarBeneficioAMembresia);

module.exports = router;