const express = require('express');
const router = express.Router();
const {
    crearReporte,
    obtenerReportes,
    actualizarReporte,
    obtenerReportesPublicos,
    ocultarReporte
} = require('../controllers/reportesController');

router.post('/', crearReporte);
router.get('/', obtenerReportes);
router.get('/publicos', obtenerReportesPublicos);
router.put('/:id', actualizarReporte);
router.put('/ocultar/:id', ocultarReporte);

module.exports = router;