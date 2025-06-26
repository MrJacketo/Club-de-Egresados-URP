const Noticia = require("../models/Noticia")

// Crear noticia
const crearNoticia = async (req, res) => {
  try {
    const { titulo, contenido, categoria, tipoContenido, fechaPublicacion, destacada, imagenUrl } = req.body;// <-- imagenUrl aquí

    // Validaciones básicas
    if (!titulo || !contenido || !categoria || !tipoContenido) {
      return res.status(400).json({
        success: false,
        error: "Título, contenido, categoría y tipo de contenido son obligatorios",
      })
    }

    // Crear nueva noticia
    const nuevaNoticia = new Noticia({
      titulo: titulo.trim(),
      contenido: contenido.trim(),
      categoria,
      tipoContenido,
      estado: destacada ? "Destacado" : "Normal",
      fechaPublicacion: fechaPublicacion ? new Date(fechaPublicacion) : new Date(),
      imagenUrl: imagenUrl || null, // Ya no da error porque está definida
      activa: true,
    });

    const noticiaGuardada = await nuevaNoticia.save();

    res.status(201).json({
      success: true,
      message: "Noticia creada exitosamente",
      noticia: noticiaGuardada,
    })
  } catch (error) {
    console.error("Error al crear noticia:", error)
    res.status(500).json({
      success: false,
      error: "Error interno del servidor al crear la noticia",
      details: error.message,
    })
  }
}

// Obtener todas las noticias con filtros
const obtenerNoticias = async (req, res) => {
  try {
    const { titulo, categoria, tipoContenido, estado, page = 1, limit = 10 } = req.query

    // Construir filtros
    const filtros = { activa: true }

    if (titulo) {
      filtros.titulo = { $regex: titulo, $options: "i" }
    }
    if (categoria && categoria !== "todas") {
      filtros.categoria = categoria
    }
    if (tipoContenido && tipoContenido !== "todos") {
      filtros.tipoContenido = tipoContenido
    }
    if (estado && estado !== "todos") {
      filtros.estado = estado
    }

    console.log("Filtros aplicados:", filtros)

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const noticias = await Noticia.find(filtros).sort({ fechaCreacion: -1 }).skip(skip).limit(Number.parseInt(limit))

    const total = await Noticia.countDocuments(filtros)

    res.json({
      success: true,
      noticias,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages: Math.ceil(total / Number.parseInt(limit)),
        totalItems: total,
        itemsPerPage: Number.parseInt(limit),
      },
    })
  } catch (error) {
    console.error("Error al obtener noticias:", error)
    res.status(500).json({
      success: false,
      error: "Error al obtener noticias",
      details: error.message,
    })
  }
}

// Obtener noticia por ID
const obtenerNoticiaPorId = async (req, res) => {
  try {
    const { id } = req.params

    const noticia = await Noticia.findById(id)

    if (!noticia || !noticia.activa) {
      return res.status(404).json({
        success: false,
        error: "Noticia no encontrada",
      })
    }

    res.json({
      success: true,
      noticia,
    })
  } catch (error) {
    console.error("Error al obtener noticia:", error)
    res.status(500).json({
      success: false,
      error: "Error al obtener noticia",
      details: error.message,
    })
  }
}

// Actualizar noticia
const actualizarNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizacion = { ...req.body };

    // Si hay imagenUrl en el body, actualízalo
    if (typeof datosActualizacion.imagenUrl !== "undefined") {
      // Si el usuario subió una nueva imagen, será base64
      // Si no, será el valor anterior o null
    }

    datosActualizacion.fechaActualizacion = new Date();

    if (datosActualizacion.destacada !== undefined) {
      datosActualizacion.estado = datosActualizacion.destacada ? "Destacado" : "Normal";
      delete datosActualizacion.destacada;
    }

    const noticiaActualizada = await Noticia.findByIdAndUpdate(id, datosActualizacion, {
      new: true,
      runValidators: true,
    });

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
    const { id } = req.params

    const noticiaEliminada = await Noticia.findByIdAndUpdate(
      id,
      {
        activa: false,
        fechaActualizacion: new Date(),
      },
      { new: true },
    )

    if (!noticiaEliminada) {
      return res.status(404).json({
        success: false,
        error: "Noticia no encontrada",
      })
    }

    res.json({
      success: true,
      message: "Noticia eliminada exitosamente",
    })
  } catch (error) {
    console.error("Error al eliminar noticia:", error)
    res.status(500).json({
      success: false,
      error: "Error al eliminar noticia",
      details: error.message,
    })
  }
}

module.exports = {
  crearNoticia,
  obtenerNoticias,
  obtenerNoticiaPorId,
  actualizarNoticia,
  eliminarNoticia,
}