const express = require('express');
const router = express.Router();
const publicacionesController = require('../controllers/publicacionesController');
const verifyJWTToken = require('../middleware/verifyJWTToken');

// Rutas públicas
router.get('/publicaciones', publicacionesController.obtenerPublicaciones);
router.get('/publicaciones/populares', publicacionesController.obtenerPublicacionesPopulares);
router.get('/publicaciones/:id', publicacionesController.obtenerPublicacionPorId);

// Rutas protegidas
router.post('/publicaciones', verifyJWTToken, publicacionesController.crearPublicacion);
router.post('/publicaciones/:id/comentarios', verifyJWTToken, publicacionesController.comentarPublicacion);
router.post('/publicaciones/:id/like', verifyJWTToken, publicacionesController.darLikePublicacion);
router.delete('/publicaciones/:id/like', verifyJWTToken, publicacionesController.quitarLikePublicacion);
router.put('/publicaciones/:id/ocultar', verifyJWTToken, publicacionesController.ocultarPublicacion);
router.put('/publicaciones/:id/aprobar', verifyJWTToken, publicacionesController.aprobarPublicacion);
router.delete('/publicaciones/:id', verifyJWTToken, publicacionesController.eliminarPublicacion);

module.exports = router;