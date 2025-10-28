const Noticia = require("../models/Noticia");

// Crear noticia
const crearNoticia = async (req, res) => {
  try {
    const { 
      titulo, 
      autor, 
      contenido, 
      resumen, 
      categoria, 
      imagen, 
      fechaPublicacion, 
      destacada 
    } = req.body;

    // Validaciones básicas
    if (!titulo || !autor || !contenido || !resumen || !categoria || !imagen) {
      return res.status(400).json({
        success: false,
        error: "Todos los campos son obligatorios: título, autor, contenido, resumen, categoría e imagen",
      });
    }

    // Crear nueva noticia
    const nuevaNoticia = new Noticia({
      titulo: titulo.trim(),
      autor: autor.trim(),
      contenido: contenido.trim(),
      resumen: resumen.trim(),
      categoria,
      imagen,
      estado: destacada ? "Destacado" : "Normal",
      fechaPublicacion: fechaPublicacion ? new Date(fechaPublicacion) : new Date(),
      activa: true,
    });

    const noticiaGuardada = await nuevaNoticia.save();

    res.status(201).json({
      success: true,
      message: "Noticia creada exitosamente",
      noticia: noticiaGuardada,
    });
  } catch (error) {
    console.error("Error al crear noticia:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor al crear la noticia",
      details: error.message,
    });
  }
};

// Obtener todas las noticias con filtros (para el frontend)
const obtenerNoticias = async (req, res) => {
  try {
    const { categoria, page = 1, limit = 10 } = req.query;

    // Construir filtros para frontend
    const filtros = { activa: true, estado: { $ne: "Borrador" } };

    // Filtrar por categoría (como en el frontend)
    if (categoria && categoria !== "Todos") {
      filtros.categoria = categoria;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const noticias = await Noticia.find(filtros)
      .sort({ fechaPublicacion: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select("-contenido"); // No enviar el contenido completo para listas

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

// Obtener noticias para el frontend (sin autenticación)
const obtenerNoticiasPublicas = async (req, res) => {
  try {
    const { categoria } = req.query;

    // Construir filtros para frontend público
    const filtros = { 
      activa: true, 
      estado: { $ne: "Borrador" },
      fechaPublicacion: { $lte: new Date() }
    };

    // Filtrar por categoría (como en el frontend)
    if (categoria && categoria !== "Todos") {
      filtros.categoria = categoria;
    }

    const noticias = await Noticia.find(filtros)
      .sort({ fechaPublicacion: -1 })
      .select("titulo autor resumen categoria imagen fechaPublicacion vistas");

    // Formatear fecha para el frontend
    const noticiasFormateadas = noticias.map(noticia => ({
      id: noticia._id,
      titulo: noticia.titulo,
      autor: noticia.autor,
      resumen: noticia.resumen,
      categoria: noticia.categoria,
      imagen: noticia.imagen,
      fecha: noticia.fechaPublicacion.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      vistas: noticia.vistas
    }));

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

    // Incrementar vistas
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

// Obtener noticia pública por ID (sin autenticación)
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

    // Incrementar vistas
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

// Actualizar noticia
const actualizarNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizacion = { ...req.body };

    // Convertir destacada a estado
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

// Eliminar noticia (soft delete)
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
};