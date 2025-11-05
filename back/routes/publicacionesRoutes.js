const express = require('express');
const router = express.Router();
const publicacionesController = require('../controllers/publicacionesController');

router.get('/publicaciones', publicacionesController.obtenerPublicaciones);
router.post('/publicaciones', publicacionesController.crearPublicacion);
router.post('/publicaciones/:id/comentarios', publicacionesController.comentarPublicacion);
router.put('/publicaciones/:id/ocultar', publicacionesController.ocultarPublicacion);

module.exports = router;
