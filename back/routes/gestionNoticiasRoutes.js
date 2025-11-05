const express = require("express");
const router = express.Router();
const {
  obtenerNoticias,
  obtenerNoticiaPorId,
  crearNoticia,
  actualizarNoticia,
  eliminarNoticia,
  cambiarEstadoNoticia,
  obtenerEstadisticas,
} = require("../controllers/gestionNoticiasController");

const verifyJWTToken = require("../middleware/verifyJWTToken");

// Middleware para verificar que el usuario es administrador
const verificarAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Usuario no autenticado",
    });
  }
  // Add admin role check here if needed
  next();
};

// Aplicar middleware de autenticación
router.use(verifyJWTToken);
// router.use(verificarAdmin); // Uncomment if admin verification needed

// Obtener todas las noticias con filtros
router.get("/", obtenerNoticias);

// Obtener noticia por ID
router.get("/:id", obtenerNoticiaPorId);

// Crear nueva noticia (con imagen)
router.post("/", crearNoticia);

// Actualizar noticia
router.put("/:id", actualizarNoticia);

// Eliminar noticia (soft delete)
router.delete("/:id", eliminarNoticia);

module.exports = router;