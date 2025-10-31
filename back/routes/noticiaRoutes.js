const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const noticiasController = require('../controllers/noticiasController');
const authMiddleware = require('../middlewares/authMiddleware');

// Configuración de multer para uploads de imágenes
const multer = require('multer');

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/noticias/';
    // Crear directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'noticia-' + uniqueSuffix + extension);
  }
});

// Filtro de archivos para solo permitir imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Solo se permiten archivos de imagen (JPEG, JPG, PNG, GIF, WebP)'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5MB
  }
});

// Middleware para manejar errores de multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'El archivo es demasiado grande. Tamaño máximo: 5MB'
      });
    }
  } else if (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
  next();
};

// ==================== RUTAS PÚBLICAS (sin autenticación) ====================

// Obtener noticias públicas (para el frontend)
router.get('/public', noticiasController.obtenerNoticiasPublicas);

// Obtener noticia pública por ID (para el frontend)
router.get('/public/:id', noticiasController.obtenerNoticiaPublicaPorId);

// Servir imagen de noticia (ruta pública)
router.get('/imagen/:nombreImagen', (req, res) => {
  try {
    const { nombreImagen } = req.params;
    
    // Construir la ruta completa a la imagen
    const rutaImagen = path.join(__dirname, '../uploads/noticias', nombreImagen);
    
    // Verificar si la imagen existe
    if (!fs.existsSync(rutaImagen)) {
      return res.status(404).json({
        success: false,
        error: "Imagen no encontrada"
      });
    }
    
    // Determinar el tipo de contenido
    const extension = path.extname(nombreImagen).toLowerCase();
    let contentType = 'image/jpeg'; // por defecto
    
    switch (extension) {
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
    }
    
    // Servir la imagen
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache de 1 día
    
    fs.createReadStream(rutaImagen).pipe(res);
    
  } catch (error) {
    console.error("Error al servir imagen:", error);
    res.status(500).json({
      success: false,
      error: "Error al cargar la imagen"
    });
  }
});

// ==================== RUTAS PROTEGIDAS (con autenticación) ====================

// Aplicar middleware de autenticación a todas las rutas siguientes
router.use(authMiddleware);

// Obtener todas las noticias (para administración)
router.get('/', noticiasController.obtenerNoticias);

// Obtener noticia por ID (para administración)
router.get('/:id', noticiasController.obtenerNoticiaPorId);

// Crear nueva noticia con upload de imagen
router.post('/', upload.single('imagen'), handleMulterError, noticiasController.crearNoticia);

// Actualizar noticia
router.put('/:id', noticiasController.actualizarNoticia);

// Actualizar noticia con imagen
router.put('/:id/imagen', upload.single('imagen'), handleMulterError, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No se proporcionó ninguna imagen"
      });
    }

    // Actualizar solo la imagen de la noticia
    const noticiaActualizada = await Noticia.findByIdAndUpdate(
      id, 
      { 
        imagen: req.file.filename,
        fechaActualizacion: new Date()
      }, 
      {
        new: true,
        runValidators: true,
      }
    );

    if (!noticiaActualizada) {
      // Eliminar la imagen subida si la noticia no existe
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        error: "Noticia no encontrada"
      });
    }

    res.json({
      success: true,
      message: "Imagen de noticia actualizada exitosamente",
      noticia: noticiaActualizada,
    });
  } catch (error) {
    console.error("Error al actualizar imagen de noticia:", error);
    // Eliminar la imagen subida en caso de error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      error: "Error al actualizar imagen de noticia",
      details: error.message,
    });
  }
});

// Eliminar noticia (soft delete)
router.delete('/:id', noticiasController.eliminarNoticia);

// Ruta alternativa para servir imagen por ID de noticia
router.get('/:id/imagen', async (req, res) => {
  try {
    const { id } = req.params;
    const Noticia = require('../models/Noticia');
    
    const noticia = await Noticia.findById(id);
    
    if (!noticia || !noticia.imagen) {
      return res.status(404).json({
        success: false,
        error: "Imagen no encontrada"
      });
    }
    
    const rutaImagen = path.join(__dirname, '../uploads/noticias', noticia.imagen);
    
    if (!fs.existsSync(rutaImagen)) {
      return res.status(404).json({
        success: false,
        error: "Archivo de imagen no encontrado"
      });
    }
    
    const extension = path.extname(noticia.imagen).toLowerCase();
    let contentType = 'image/jpeg';
    
    switch (extension) {
      case '.png': contentType = 'image/png'; break;
      case '.gif': contentType = 'image/gif'; break;
      case '.webp': contentType = 'image/webp'; break;
      case '.svg': contentType = 'image/svg+xml'; break;
    }
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache de 1 día
    
    fs.createReadStream(rutaImagen).pipe(res);
    
  } catch (error) {
    console.error("Error al servir imagen:", error);
    res.status(500).json({
      success: false,
      error: "Error al cargar la imagen"
    });
  }
});

// Ruta para cambiar estado de noticia (Destacado/Normal)
router.patch('/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { destacada } = req.body;

    const noticiaActualizada = await Noticia.findByIdAndUpdate(
      id, 
      { 
        estado: destacada ? "Destacado" : "Normal",
        fechaActualizacion: new Date()
      }, 
      {
        new: true,
        runValidators: true,
      }
    );

    if (!noticiaActualizada) {
      return res.status(404).json({
        success: false,
        error: "Noticia no encontrada"
      });
    }

    res.json({
      success: true,
      message: `Noticia ${destacada ? 'destacada' : 'normal'} exitosamente`,
      noticia: noticiaActualizada,
    });
  } catch (error) {
    console.error("Error al cambiar estado de noticia:", error);
    res.status(500).json({
      success: false,
      error: "Error al cambiar estado de noticia",
      details: error.message,
    });
  }
});

module.exports = router;