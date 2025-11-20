const express = require("express");
const router = express.Router();
const verifyJWTToken = require("../middleware/verifyJWTToken");
const gestionarConferenciasController = require("../controllers/gestionarConferenciasController");
const inscripcionConferenciaController = require("../controllers/inscripcionConferenciaController");

// ========== RUTAS PÚBLICAS (sin autenticación) ==========
// Obtener conferencias disponibles para inscripción
router.get("/disponibles", gestionarConferenciasController.getConferenciasDisponibles);

// ========== RUTAS PARA USUARIOS AUTENTICADOS ==========
// Catálogo de conferencias para egresados
router.get("/catalogo", verifyJWTToken, gestionarConferenciasController.getConferencias);

// Obtener una conferencia específica por ID
router.get("/:id", verifyJWTToken, gestionarConferenciasController.getConferenciaById);

// Inscripciones del usuario
router.get("/mis-inscripciones/listado", verifyJWTToken, inscripcionConferenciaController.getMisInscripciones);
router.post("/inscribirse", verifyJWTToken, inscripcionConferenciaController.inscribirseConferencia);
router.put("/cancelar-inscripcion/:id", verifyJWTToken, inscripcionConferenciaController.cancelarInscripcion);
router.get("/verificar-inscripcion/:conferencia_id", verifyJWTToken, inscripcionConferenciaController.verificarInscripcion);
router.put("/calificar/:id", verifyJWTToken, inscripcionConferenciaController.calificarConferencia);

// ========== RUTAS ADMINISTRATIVAS (requieren verificación de admin) ==========
// Middleware para verificar que el usuario es administrador
const verificarAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Acceso denegado. Se requieren permisos de administrador."
    });
  }
};

// CRUD completo para administradores
router.get("/admin/todas", verifyJWTToken, verificarAdmin, gestionarConferenciasController.getConferencias);
router.get("/admin/estadisticas", verifyJWTToken, verificarAdmin, gestionarConferenciasController.getEstadisticasConferencias);
router.get("/admin/inscritos/:id", verifyJWTToken, verificarAdmin, gestionarConferenciasController.getInscritosConferencia);
router.post("/admin/crear", verifyJWTToken, verificarAdmin, gestionarConferenciasController.createConferencia);
router.put("/admin/actualizar/:id", verifyJWTToken, verificarAdmin, gestionarConferenciasController.updateConferencia);
router.delete("/admin/eliminar/:id", verifyJWTToken, verificarAdmin, gestionarConferenciasController.deleteConferencia);

module.exports = router;