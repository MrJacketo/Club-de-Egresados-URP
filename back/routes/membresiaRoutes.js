const express = require("express");
const router = express.Router();
const verifyJWTToken = require("../middleware/verifyJWTToken");
const membresiaController = require("../controllers/membresiaController")

// Rutas
router.get("/", verifyJWTToken, membresiaController.getMembresia);
router.put("/activate", verifyJWTToken, membresiaController.activateMembresia);
router.get("/getAll", verifyJWTToken, membresiaController.getAllMembresias);
router.put("/updateEstado/:userId", verifyJWTToken, membresiaController.updateMembresiaEstado);
router.delete("/deleteMembresia/:userId", verifyJWTToken, membresiaController.deleteMembresia); 

module.exports = router;