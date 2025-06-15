const express = require('express');
const router = express.Router();
const {
    crearNoticia,
    obtenerNoticias,
    obtenerNoticiasDestacadas,
    obtenerNoticiaPorId,
    actualizarNoticia,
    eliminarNoticia,
} = require('../controllers/noticiaController');

// Rutas CRUD
router.post('/', crearNoticia);                    // CREATE
router.get('/', obtenerNoticias);                  // READ (todas)
router.get('/destacadas', obtenerNoticiasDestacadas); // READ (destacadas)
router.get('/:id', obtenerNoticiaPorId);           // READ (por ID)
router.put('/:id', actualizarNoticia);             // UPDATE
router.delete('/:id', eliminarNoticia);            // DELETE

module.exports = router;