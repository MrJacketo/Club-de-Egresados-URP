const Conferencia = require("../models/Conferencia");
const ConferenciaEgresado = require("../models/ConferenciaEgresado");

// Crear conferencia
const createConferencia = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      ponente,
      fecha_evento,
      hora_inicio,
      duracion_horas,
      modalidad,
      plataforma,
      enlace_acceso,
      fecha_inscripcion_fin,
      cupos_disponibles,
      estado,
      imagen_conferencia,
      categoria,
      requisitos,
      materiales_adicionales
    } = req.body;

    // Validaciones básicas
    if (!titulo || !descripcion || !ponente || !fecha_evento || !hora_inicio || !fecha_inscripcion_fin) {
      return res.status(400).json({
        success: false,
        message: "Título, descripción, ponente, fecha del evento, hora de inicio y fecha fin de inscripción son obligatorios"
      });
    }

    // Validar que la fecha de inscripción no sea posterior a la fecha del evento
    if (new Date(fecha_inscripcion_fin) > new Date(fecha_evento)) {
      return res.status(400).json({
        success: false,
        message: "La fecha de cierre de inscripción no puede ser posterior a la fecha del evento"
      });
    }

    // Crear nueva conferencia
    const nuevaConferencia = new Conferencia({
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      ponente: ponente.trim(),
      fecha_evento: new Date(fecha_evento),
      hora_inicio: hora_inicio.trim(),
      duracion_horas: duracion_horas || 2,
      modalidad: modalidad || 'virtual',
      plataforma: plataforma?.trim() || 'Zoom',
      enlace_acceso: enlace_acceso?.trim() || '',
      fecha_inscripcion_fin: new Date(fecha_inscripcion_fin),
      cupos_disponibles: cupos_disponibles || null,
      estado: estado || 'programada',
      imagen_conferencia: imagen_conferencia?.trim() || '',
      categoria: categoria || 'academico',
      requisitos: requisitos?.trim() || '',
      materiales_adicionales: materiales_adicionales?.trim() || ''
    });

    const conferenciaGuardada = await nuevaConferencia.save();

    res.status(201).json({
      success: true,
      message: "Conferencia creada exitosamente",
      data: conferenciaGuardada
    });

  } catch (error) {
    console.error('Error al crear conferencia:', error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al crear la conferencia",
      error: error.message
    });
  }
};

// Obtener todas las conferencias con filtros
const getConferencias = async (req, res) => {
  try {
    const { modalidad, estado, categoria, search, page = 1, limit = 10 } = req.query;

    // Construir filtros
    const filtros = {};

    if (modalidad && modalidad !== "todos") {
      filtros.modalidad = modalidad;
    }
    if (estado && estado !== "todos") {
      filtros.estado = estado;
    }
    if (categoria && categoria !== "todos") {
      filtros.categoria = categoria;
    }
    if (search) {
      filtros.$or = [
        { titulo: { $regex: search, $options: 'i' } },
        { descripcion: { $regex: search, $options: 'i' } },
        { ponente: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const conferencias = await Conferencia.find(filtros)
      .sort({ fecha_evento: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Obtener número de inscritos para cada conferencia
    const conferenciasConInscritos = await Promise.all(
      conferencias.map(async (conf) => {
        const inscritos = await ConferenciaEgresado.countDocuments({ 
          conferencia_id: conf._id,
          estado_inscripcion: { $nin: ['cancelado'] }
        });
        return {
          ...conf.toObject(),
          total_inscritos: inscritos,
          cupos_restantes: conf.cupos_disponibles ? conf.cupos_disponibles - inscritos : null
        };
      })
    );

    const total = await Conferencia.countDocuments(filtros);

    res.json({
      success: true,
      data: conferenciasConInscritos,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error al obtener conferencias:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener conferencias",
      error: error.message
    });
  }
};

// Obtener conferencia por ID
const getConferenciaById = async (req, res) => {
  try {
    const { id } = req.params;

    const conferencia = await Conferencia.findById(id);

    if (!conferencia) {
      return res.status(404).json({
        success: false,
        message: "Conferencia no encontrada"
      });
    }

    // Obtener número de inscritos
    const inscritos = await ConferenciaEgresado.countDocuments({ 
      conferencia_id: id,
      estado_inscripcion: { $nin: ['cancelado'] }
    });

    const conferenciaConInfo = {
      ...conferencia.toObject(),
      total_inscritos: inscritos,
      cupos_restantes: conferencia.cupos_disponibles ? conferencia.cupos_disponibles - inscritos : null
    };

    res.json({
      success: true,
      data: conferenciaConInfo
    });

  } catch (error) {
    console.error('Error al obtener conferencia:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener conferencia",
      error: error.message
    });
  }
};

// Actualizar conferencia
const updateConferencia = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizacion = { ...req.body };

    // Validar fechas si se están actualizando
    if (datosActualizacion.fecha_inscripcion_fin && datosActualizacion.fecha_evento) {
      if (new Date(datosActualizacion.fecha_inscripcion_fin) > new Date(datosActualizacion.fecha_evento)) {
        return res.status(400).json({
          success: false,
          message: "La fecha de cierre de inscripción no puede ser posterior a la fecha del evento"
        });
      }
    }

    datosActualizacion.updatedAt = new Date();

    const conferenciaActualizada = await Conferencia.findByIdAndUpdate(
      id,
      datosActualizacion,
      {
        new: true,
        runValidators: true
      }
    );

    if (!conferenciaActualizada) {
      return res.status(404).json({
        success: false,
        message: "Conferencia no encontrada"
      });
    }

    res.json({
      success: true,
      message: "Conferencia actualizada exitosamente",
      data: conferenciaActualizada
    });

  } catch (error) {
    console.error('Error al actualizar conferencia:', error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar conferencia",
      error: error.message
    });
  }
};

// Eliminar conferencia
const deleteConferencia = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si hay inscripciones activas
    const inscripcionesActivas = await ConferenciaEgresado.countDocuments({
      conferencia_id: id,
      estado_inscripcion: { $nin: ['cancelado'] }
    });

    if (inscripcionesActivas > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar la conferencia porque tiene ${inscripcionesActivas} inscripciones activas. Primero cancele todas las inscripciones.`
      });
    }

    const conferenciaEliminada = await Conferencia.findByIdAndDelete(id);

    if (!conferenciaEliminada) {
      return res.status(404).json({
        success: false,
        message: "Conferencia no encontrada"
      });
    }

    // Eliminar todas las inscripciones asociadas (si las hay)
    await ConferenciaEgresado.deleteMany({ conferencia_id: id });

    res.json({
      success: true,
      message: "Conferencia eliminada exitosamente"
    });

  } catch (error) {
    console.error('Error al eliminar conferencia:', error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar conferencia",
      error: error.message
    });
  }
};

// Obtener conferencias disponibles para inscripción
const getConferenciasDisponibles = async (req, res) => {
  try {
    const hoy = new Date();

    const conferenciasDisponibles = await Conferencia.find({ 
      estado: 'programada',
      fecha_inscripcion_fin: { $gte: hoy }
    }).sort({ fecha_evento: 1 });

    // Agregar información de cupos
    const conferenciasConCupos = await Promise.all(
      conferenciasDisponibles.map(async (conf) => {
        const inscritos = await ConferenciaEgresado.countDocuments({ 
          conferencia_id: conf._id,
          estado_inscripcion: { $nin: ['cancelado'] }
        });
        
        const cuposRestantes = conf.cupos_disponibles ? conf.cupos_disponibles - inscritos : null;
        const cuposDisponibles = conf.cupos_disponibles === null || cuposRestantes > 0;

        return {
          ...conf.toObject(),
          total_inscritos: inscritos,
          cupos_restantes: cuposRestantes,
          puede_inscribirse: cuposDisponibles
        };
      })
    );

    res.json({
      success: true,
      data: conferenciasConCupos
    });

  } catch (error) {
    console.error('Error al obtener conferencias disponibles:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener conferencias disponibles",
      error: error.message
    });
  }
};

// Obtener estadísticas de conferencias
const getEstadisticasConferencias = async (req, res) => {
  try {
    const total = await Conferencia.countDocuments();
    const programadas = await Conferencia.countDocuments({ estado: 'programada' });
    const finalizadas = await Conferencia.countDocuments({ estado: 'finalizada' });
    const canceladas = await Conferencia.countDocuments({ estado: 'cancelada' });
    
    const totalInscripciones = await ConferenciaEgresado.countDocuments({
      estado_inscripcion: { $nin: ['cancelado'] }
    });

    // Conferencias por modalidad
    const porModalidad = await Conferencia.aggregate([
      {
        $group: {
          _id: '$modalidad',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        total,
        programadas,
        finalizadas,
        canceladas,
        total_inscripciones: totalInscripciones,
        por_modalidad: porModalidad
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error.message
    });
  }
};

// Obtener inscritos de una conferencia (para admin)
const getInscritosConferencia = async (req, res) => {
  try {
    const { id } = req.params;

    const inscritos = await ConferenciaEgresado.find({ 
      conferencia_id: id 
    })
    .populate('egresado_id', 'name email carrera anioEgreso')
    .sort({ fecha_inscripcion: -1 });

    res.json({
      success: true,
      data: inscritos
    });

  } catch (error) {
    console.error('Error al obtener inscritos:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener inscritos",
      error: error.message
    });
  }
};

module.exports = {
  createConferencia,
  getConferencias,
  getConferenciaById,
  updateConferencia,
  deleteConferencia,
  getConferenciasDisponibles,
  getEstadisticasConferencias,
  getInscritosConferencia
};