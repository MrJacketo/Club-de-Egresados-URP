const express = require('express');
const router = express.Router();
const publicacionesController = require('../controllers/publicacionesController');

router.get('/', publicacionesController.obtenerPublicaciones);
router.post('/', publicacionesController.crearPublicacion);
router.post('/:id/comentarios', publicacionesController.comentarPublicacion);
router.put('/:id/ocultar', publicacionesController.ocultarPublicacion);

module.exports = router;
