const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');


const publicacionesController = require('../controllers/publicacionesController');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // carpeta donde se guardarán las imágenes o videos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // nombre único
  }
});

const upload = multer({ storage });


router.get('/', publicacionesController.obtenerPublicaciones);
router.post('/', upload.single('archivo'), publicacionesController.crearPublicacion);
router.post('/:id/comentarios', publicacionesController.comentarPublicacion);
router.put('/:id/like', publicacionesController.toggleLike);
router.put('/:id/ocultar', publicacionesController.ocultarPublicacion);

module.exports = router;
