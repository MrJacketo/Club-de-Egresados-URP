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
  servirImagenNoticia  // ← AÑADE ESTA IMPORTACIÓN
} = require("../controllers/gestionNoticiasController");

const verifyJWTToken = require("../middleware/verifyJWTToken");
const upload = require("../utils/multerConfig");

// Rutas públicas (sin autenticación)
router.get("/public", obtenerNoticiasPublicas);           
router.get("/public/:id", obtenerNoticiaPublicaPorId);
router.get("/imagen/:nombreImagen", servirImagenNoticia); // ← AÑADE ESTA LÍNEA CRÍTICA

// Rutas protegidas (con autenticación)
router.use(verifyJWTToken);

router.get("/", obtenerNoticias);
router.get("/:id", obtenerNoticiaPorId);

// SOLO UNA LÍNEA PARA POST - CON MULTER
router.post("/", upload.single('imagen'), crearNoticia);

router.put("/:id", actualizarNoticia);
router.delete("/:id", eliminarNoticia);

module.exports = router;