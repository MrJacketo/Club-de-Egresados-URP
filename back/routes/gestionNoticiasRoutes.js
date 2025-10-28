const express = require("express");
const router = express.Router();
const {
  obtenerNoticias,
  obtenerNoticiasPublicas,
  obtenerNoticiaPorId,
  obtenerNoticiaPublicaPorId,
  crearNoticia,
  actualizarNoticia,
  eliminarNoticia,
} = require("../controllers/gestionNoticiasController");

const verifyJWTToken = require("../middleware/verifyJWTToken");

// Rutas públicas (sin autenticación)
router.get("/public", obtenerNoticiasPublicas);
router.get("/public/:id", obtenerNoticiaPublicaPorId);

// Rutas protegidas (con autenticación)
router.use(verifyJWTToken);

router.get("/", obtenerNoticias);
router.get("/:id", obtenerNoticiaPorId);
router.post("/", crearNoticia);
router.put("/:id", actualizarNoticia);
router.delete("/:id", eliminarNoticia);

module.exports = router;