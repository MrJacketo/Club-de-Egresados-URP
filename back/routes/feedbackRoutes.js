const express = require('express');
const router = express.Router();

const beneficiosController = require('../controllers/beneficiosController'); 

router.post('/feedback-beneficios', beneficiosController.crearFeedback);
router.get('/feedback-beneficios', beneficiosController.obtenerFeedbacks);

module.exports = router;
