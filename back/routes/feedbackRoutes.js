const express = require('express');
const router = express.Router();
const beneficiosController = require('../controllers/beneficiosController');

const verifyJWTToken = require("../middleware/verifyJWTToken");
// Si tienes middleware de autenticación, descoméntalo:
// const { verifyToken, isAdmin } = require('../middleware/auth');

// ========================================
// RUTAS PÚBLICAS (Sin autenticación)
// ========================================

// Crear nuevo feedback/solicitud
router.post('/feedback-beneficios',verifyJWTToken, beneficiosController.crearFeedback);

// Obtener feedbacks públicos (para mostrar en página pública)
router.get('/feedback-beneficios-publico', beneficiosController.obtenerFeedbacksPublicos);

// ========================================
// RUTAS PARA USUARIOS AUTENTICADOS
// ========================================

// Obtener mis propias solicitudes
router.get('/mis-feedbacks',verifyJWTToken, beneficiosController.obtenerMisFeedbacks);
// Si usas middleware: router.get('/mis-feedbacks', verifyToken, beneficiosController.obtenerMisFeedbacks);

// ========================================
// RUTAS ADMINISTRATIVAS (Solo Admin)
// ========================================

// Obtener todos los feedbacks con filtros
router.get('/admin/feedback-beneficios', beneficiosController.obtenerFeedbacks);
// Si usas middleware: router.get('/admin/feedback-beneficios', verifyToken, isAdmin, beneficiosController.obtenerFeedbacks);

// Obtener un feedback por ID
router.get('/admin/feedback-beneficios/:id', beneficiosController.obtenerFeedbackPorId);
// Si usas middleware: router.get('/admin/feedback-beneficios/:id', verifyToken, isAdmin, beneficiosController.obtenerFeedbackPorId);

// Actualizar feedback (estado, prioridad, respuesta)
router.put('/admin/feedback-beneficios/:id', beneficiosController.actualizarFeedback);
// Si usas middleware: router.put('/admin/feedback-beneficios/:id', verifyToken, isAdmin, beneficiosController.actualizarFeedback);

// Ocultar/mostrar feedback
router.put('/admin/feedback-beneficios/:id/ocultar', beneficiosController.ocultarFeedback);
// Si usas middleware: router.put('/admin/feedback-beneficios/:id/ocultar', verifyToken, isAdmin, beneficiosController.ocultarFeedback);

// Eliminar feedback
router.delete('/admin/feedback-beneficios/:id', beneficiosController.eliminarFeedback);
// Si usas middleware: router.delete('/admin/feedback-beneficios/:id', verifyToken, isAdmin, beneficiosController.eliminarFeedback);

// Obtener estadísticas de feedbacks
router.get('/admin/feedback-beneficios/estadisticas/general', beneficiosController.obtenerEstadisticasFeedbacks);
// Si usas middleware: router.get('/admin/feedback-beneficios/estadisticas/general', verifyToken, isAdmin, beneficiosController.obtenerEstadisticasFeedbacks);

module.exports = router;