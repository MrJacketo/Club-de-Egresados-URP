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

// Si tienes autenticación, descomenta estas líneas:
// const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

// Middleware para verificar que el usuario es administrador (puedes personalizarlo)
/*const verificarAdmin = (req, res, next) => {
  // Si tienes roles, verifica aquí. Por ahora, solo verifica autenticación.
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Usuario no autenticado",
    });
  }
  next();
};*/

// Si usas autenticación, descomenta estas líneas:
// router.use(verifyFirebaseToken);
// router.use(verificarAdmin);

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