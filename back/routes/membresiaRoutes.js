const express = require("express");
const router = express.Router();
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const membresiaController = require("../controllers/membresiaController")

// Rutas
router.get("/", verifyFirebaseToken, membresiaController.getMembresia);
router.put("/activate", verifyFirebaseToken, membresiaController.activateMembresia);
router.get("/getAll", /*/verifyFirebaseToken,/*/ membresiaController.getAllMembresias)
router.put("/updateEstado/:userId", membresiaController.updateMembresiaEstado);
router.delete("/deleteMembresia/:userId", membresiaController.deleteMembresia); 

module.exports = router;