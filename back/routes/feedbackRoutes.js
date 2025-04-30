const express = require('express');
const router = express.Router();
const beneficiosController = require('../controllers/beneficiosController');

// Rutas públicas
router.post('/feedback-beneficios', beneficiosController.crearFeedback);
router.get('/feedback-beneficios-publico', beneficiosController.obtenerFeedbacksPublicos);

// Rutas para el ADMIN
router.get('/feedback-beneficios', beneficiosController.obtenerFeedbacks);
router.put('/feedback-beneficios/:id', beneficiosController.actualizarFeedback);
router.put('/feedback-beneficios/:id/ocultar', beneficiosController.ocultarFeedback);

module.exports = router;