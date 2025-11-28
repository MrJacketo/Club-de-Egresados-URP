// back/routes/reporteForoRoutes.js
const express = require('express');
const router = express.Router();
const verifyJWTToken = require('../middleware/verifyJWTToken');
const verifyModeradorRole = require('../middleware/verifyModeradorRole');
const {
    crearReporteForo,
    obtenerReportesForo,
    obtenerReportePorId,
    resolverReporte,
    ocultarReporteForo,
    obtenerEstadisticasReportes
} = require('../controllers/reporteForoController');

// Middleware para verificar autenticación
router.use(verifyJWTToken);

// Rutas para usuarios (crear reporte)
router.post('/', crearReporteForo);

// Rutas para moderadores
router.get('/', verifyModeradorRole, obtenerReportesForo);
router.get('/estadisticas', verifyModeradorRole, obtenerEstadisticasReportes);
router.get('/:id', verifyModeradorRole, obtenerReportePorId);
router.put('/:id/resolver', verifyModeradorRole, resolverReporte);
router.put('/:id/ocultar', verifyModeradorRole, ocultarReporteForo);

module.exports = router;