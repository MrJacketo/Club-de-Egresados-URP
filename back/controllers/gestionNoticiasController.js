const Noticia = require("../models/Noticia");
const fs = require("fs");
const path = require("path");

// Crear noticia
const crearNoticia = async (req, res) => {
  try {
    console.log('=== 🎯 DIAGNÓSTICO COMPLETO ===');
    console.log('📦 Body recibido:', req.body);
    console.log('📁 File recibido:', req.file);
    console.log('📊 Files recibidos:', req.files);
    console.log('🔍 Headers:', req.headers['content-type']);
    console.log('=== FIN DIAGNÓSTICO ===');
    
    // VERIFICAR POR QUÉ NO LLEGA EL ARCHIVO
    if (!req.file) {
      console.log('❌ CRÍTICO: req.file es NULL/UNDEFINED');
      console.log('💡 Causas posibles:');
      console.log('   1. Frontend no envía FormData correctamente');
      console.log('   2. Multer no está aplicado en la ruta');
      console.log('   3. El campo no se llama "imagen"');
      console.log('   4. El archivo es muy grande o tipo incorrecto');
    }
    
    let nombreArchivo = 'default-news.jpg';
    
    if (req.file && req.file.mimetype.startsWith('image/')) {
      nombreArchivo = req.file.filename;
      console.log('✅ IMAGEN REAL USADA:', nombreArchivo);
    } else {
      console.log('⚠️ USANDO IMAGEN POR DEFECTO');
    }
    
    const nuevaNoticia = await Noticia.create({
      titulo: req.body.titulo,
      contenido: req.body.contenido,
      imagen: nombreArchivo,
      categoria: req.body.categoria,
      tipoContenido: req.body.tipoContenido
    });

    console.log('🎉 NOTICIA CREADA - Imagen en BD:', nuevaNoticia.imagen);
    res.status(201).json({ 
      success: true, 
      message: 'Noticia creada exitosamente', 
      noticia: nuevaNoticia 
    });
    
  } catch (error) {
    console.error('❌ Error al crear noticia:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear la noticia',
      error: error.message 
    });
  }
};
// Obtener noticias para el frontend (sin autenticación)
const obtenerNoticiasPublicas = async (req, res) => {
  try {
    const { categoria } = req.query;

    const filtros = { 
      activa: true, 
      estado: { $ne: "Borrador" },
      fechaPublicacion: { $lte: new Date() }
    };

    if (categoria && categoria !== "Todos") {
      filtros.categoria = categoria;
    }

    console.log("🔍 Buscando noticias con filtros:", filtros);

    const noticias = await Noticia.find(filtros)
      .sort({ fechaPublicacion: -1 })
      .select("titulo autor resumen categoria imagen fechaPublicacion vistas estado destacada contenido");

    console.log("📊 Noticias encontradas en BD:", noticias.length);
    
    // DEBUG: Verificar imágenes
    noticias.forEach((noticia, index) => {
      console.log(`📰 Noticia ${index + 1} - Imagen:`, noticia.imagen);
    });

    // Formatear noticias
    const noticiasFormateadas = noticias.map(noticia => {
      return {
        id: noticia._id.toString(),
        titulo: noticia.titulo,
        autor: noticia.autor || "URP",
        resumen: noticia.resumen || (noticia.contenido ? noticia.contenido.substring(0, 150) + '...' : ''),
        categoria: noticia.categoria,
        imagen: noticia.imagen || "default-news.jpg",
        fecha: noticia.fechaPublicacion ? noticia.fechaPublicacion.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }) : "Fecha no disponible",
        vistas: noticia.vistas || 0,
        estado: noticia.estado,
        destacada: noticia.destacada
      };
    });

    res.json({
      success: true,
      noticias: noticiasFormateadas,
    });
  } catch (error) {
    console.error("Error al obtener noticias públicas:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener noticias",
      details: error.message,
    });
  }
};

// Servir imagen de noticia - VERSIÓN SIMPLIFICADA Y FUNCIONAL
const servirImagenNoticia = async (req, res) => {
  try {
    const { nombreImagen } = req.params;
    
    console.log("🖼️  Solicitando imagen:", nombreImagen);
    
    // Primero buscar en uploads/noticias
    const rutaUploads = path.join(__dirname, '../uploads/noticias', nombreImagen);
    
    if (fs.existsSync(rutaUploads)) {
      console.log("✅ Imagen encontrada en uploads:", rutaUploads);
      return res.sendFile(rutaUploads);
    }
    
    // Si no existe, usar imagen por defecto
    console.log("📝 Imagen no encontrada, usando por defecto");
    const imagenDefaultSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#00BC4F"/>
        <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="white" font-weight="bold">
          NOTICIAS URP
        </text>
        <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="white">
          Imagen no disponible
        </text>
      </svg>
    `;
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(imagenDefaultSVG);
    
  } catch (error) {
    console.error("❌ Error al servir imagen:", error);
    res.status(500).json({
      success: false,
      error: "Error al cargar la imagen"
    });
  }
};

// Obtener noticia pública por ID
const obtenerNoticiaPublicaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const noticia = await Noticia.findOne({
      _id: id,
      activa: true,
      estado: { $ne: "Borrador" },
      fechaPublicacion: { $lte: new Date() }
    });

    if (!noticia) {
      return res.status(404).json({
        success: false,
        error: "Noticia no encontrada",
      });
    }

    noticia.vistas += 1;
    await noticia.save();

    res.json({
      success: true,
      noticia,
    });
  } catch (error) {
    console.error("Error al obtener noticia pública:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener noticia",
      details: error.message,
    });
  }
};

// Obtener todas las noticias con filtros
const obtenerNoticias = async (req, res) => {
  try {
    const { categoria, page = 1, limit = 10 } = req.query;

    const filtros = { activa: true, estado: { $ne: "Borrador" } };

    if (categoria && categoria !== "Todos") {
      filtros.categoria = categoria;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const noticias = await Noticia.find(filtros)
      .sort({ fechaPublicacion: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select("-contenido");

    const total = await Noticia.countDocuments(filtros);

    res.json({
      success: true,
      noticias,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error al obtener noticias:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener noticias",
      details: error.message,
    });
  }
};

// Obtener noticia por ID
const obtenerNoticiaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const noticia = await Noticia.findById(id);

    if (!noticia || !noticia.activa) {
      return res.status(404).json({
        success: false,
        error: "Noticia no encontrada",
      });
    }

    noticia.vistas += 1;
    await noticia.save();

    res.json({
      success: true,
      noticia,
    });
  } catch (error) {
    console.error("Error al obtener noticia:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener noticia",
      details: error.message,
    });
  }
};

// Actualizar noticia
const actualizarNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizacion = { ...req.body };

    if (datosActualizacion.destacada !== undefined) {
      datosActualizacion.estado = datosActualizacion.destacada ? "Destacado" : "Normal";
      delete datosActualizacion.destacada;
    }

    datosActualizacion.fechaActualizacion = new Date();

    const noticiaActualizada = await Noticia.findByIdAndUpdate(
      id, 
      datosActualizacion, 
      {
        new: true,
        runValidators: true,
      }
    );

    if (!noticiaActualizada) {
      return res.status(404).json({
        success: false,
        error: "Noticia no encontrada",
      });
    }

    res.json({
      success: true,
      message: "Noticia actualizada exitosamente",
      noticia: noticiaActualizada,
    });
  } catch (error) {
    console.error("Error al actualizar noticia:", error);
    res.status(500).json({
      success: false,
      error: "Error al actualizar noticia",
      details: error.message,
    });
  }
};

// Eliminar noticia
const eliminarNoticia = async (req, res) => {
  try {
    const { id } = req.params;

    const noticiaEliminada = await Noticia.findByIdAndUpdate(
      id,
      {
        activa: false,
        fechaActualizacion: new Date(),
      },
      { new: true }
    );

    if (!noticiaEliminada) {
      return res.status(404).json({
        success: false,
        error: "Noticia no encontrada",
      });
    }

    res.json({
      success: true,
      message: "Noticia eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar noticia:", error);
    res.status(500).json({
      success: false,
      error: "Error al eliminar noticia",
      details: error.message,
    });
  }
};

module.exports = {
  crearNoticia,
  obtenerNoticias,
  obtenerNoticiasPublicas,
  obtenerNoticiaPorId,
  obtenerNoticiaPublicaPorId,
  actualizarNoticia,
  eliminarNoticia,
  servirImagenNoticia
};