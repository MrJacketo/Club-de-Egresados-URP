const ConferenciaEgresado = require("../models/ConferenciaEgresado");
const Conferencia = require("../models/Conferencia");

// Inscribirse a una conferencia
const inscribirseConferencia = async (req, res) => {
  try {
    const { conferencia_id } = req.body;
    const egresado_id = req.user._id; // Del token JWT

    // Validar que la conferencia existe
    const conferencia = await Conferencia.findById(conferencia_id);
    if (!conferencia) {
      return res.status(404).json({
        success: false,
        message: "Conferencia no encontrada"
      });
    }

    // Validar que la conferencia está programada
    if (conferencia.estado !== 'programada') {
      return res.status(400).json({
        success: false,
        message: "No se puede inscribir a esta conferencia. Estado actual: " + conferencia.estado
      });
    }

    // Validar que la fecha de inscripción no ha expirado
    const hoy = new Date();
    if (new Date(conferencia.fecha_inscripcion_fin) < hoy) {
      return res.status(400).json({
        success: false,
        message: "El período de inscripción para esta conferencia ha finalizado"
      });
    }

    // Validar si hay cupos disponibles
    if (conferencia.cupos_disponibles !== null) {
      const inscritosActuales = await ConferenciaEgresado.countDocuments({
        conferencia_id,
        estado_inscripcion: { $nin: ['cancelado'] }
      });

      if (inscritosActuales >= conferencia.cupos_disponibles) {
        return res.status(400).json({
          success: false,
          message: "No hay cupos disponibles para esta conferencia"
        });
      }
    }

    // Verificar si ya está inscrito
    const inscripcionExistente = await ConferenciaEgresado.findOne({
      conferencia_id,
      egresado_id
    });

    if (inscripcionExistente) {
      if (inscripcionExistente.estado_inscripcion === 'cancelado') {
        // Reactivar inscripción
        inscripcionExistente.estado_inscripcion = 'inscrito';
        inscripcionExistente.fecha_inscripcion = new Date();
        await inscripcionExistente.save();

        return res.json({
          success: true,
          message: "Inscripción reactivada exitosamente",
          data: inscripcionExistente
        });
      }

      return res.status(400).json({
        success: false,
        message: "Ya estás inscrito en esta conferencia"
      });
    }

    // Crear nueva inscripción
    const nuevaInscripcion = new ConferenciaEgresado({
      conferencia_id,
      egresado_id,
      estado_inscripcion: 'inscrito'
    });

    const inscripcionGuardada = await nuevaInscripcion.save();

    // Poblar datos para la respuesta
    const inscripcionCompleta = await ConferenciaEgresado.findById(inscripcionGuardada._id)
      .populate('conferencia_id')
      .populate('egresado_id', 'name email');

    res.status(201).json({
      success: true,
      message: "Inscripción realizada exitosamente",
      data: inscripcionCompleta
    });

  } catch (error) {
    console.error('Error al inscribirse a conferencia:', error);
    
    // Manejar error de duplicado
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Ya estás inscrito en esta conferencia"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor al inscribirse",
      error: error.message
    });
  }
};

// Obtener inscripciones de un usuario
const getMisInscripciones = async (req, res) => {
  try {
    const egresado_id = req.user._id;
    const { estado, page = 1, limit = 10 } = req.query;

    const filtros = { egresado_id };

    if (estado && estado !== "todos") {
      filtros.estado_inscripcion = estado;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const inscripciones = await ConferenciaEgresado.find(filtros)
      .populate('conferencia_id')
      .sort({ fecha_inscripcion: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ConferenciaEgresado.countDocuments(filtros);

    res.json({
      success: true,
      data: inscripciones,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error al obtener inscripciones:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener inscripciones",
      error: error.message
    });
  }
};

// Cancelar inscripción
const cancelarInscripcion = async (req, res) => {
  try {
    const { id } = req.params; // ID de la inscripción
    const egresado_id = req.user.userId;

    const inscripcion = await ConferenciaEgresado.findOne({
      _id: id,
      egresado_id
    }).populate('conferencia_id');

    if (!inscripcion) {
      return res.status(404).json({
        success: false,
        message: "Inscripción no encontrada"
      });
    }

    // Validar que no se haya realizado ya el evento
    const conferencia = inscripcion.conferencia_id;
    if (new Date(conferencia.fecha_evento) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "No se puede cancelar una inscripción de un evento que ya se realizó"
      });
    }

    if (inscripcion.estado_inscripcion === 'cancelado') {
      return res.status(400).json({
        success: false,
        message: "Esta inscripción ya está cancelada"
      });
    }

    inscripcion.estado_inscripcion = 'cancelado';
    inscripcion.updatedAt = new Date();
    await inscripcion.save();

    res.json({
      success: true,
      message: "Inscripción cancelada exitosamente",
      data: inscripcion
    });

  } catch (error) {
    console.error('Error al cancelar inscripción:', error);
    res.status(500).json({
      success: false,
      message: "Error al cancelar inscripción",
      error: error.message
    });
  }
};

// Verificar si el usuario está inscrito en una conferencia específica
const verificarInscripcion = async (req, res) => {
  try {
    const { conferencia_id } = req.params;
    const egresado_id = req.user.userId;

    const inscripcion = await ConferenciaEgresado.findOne({
      conferencia_id,
      egresado_id,
      estado_inscripcion: { $nin: ['cancelado'] }
    });

    res.json({
      success: true,
      inscrito: !!inscripcion,
      data: inscripcion || null
    });

  } catch (error) {
    console.error('Error al verificar inscripción:', error);
    res.status(500).json({
      success: false,
      message: "Error al verificar inscripción",
      error: error.message
    });
  }
};

// Calificar conferencia (después de asistir)
const calificarConferencia = async (req, res) => {
  try {
    const { id } = req.params; // ID de la inscripción
    const { calificacion, comentario } = req.body;
    const egresado_id = req.user.userId;

    // Validar calificación
    if (!calificacion || calificacion < 1 || calificacion > 5) {
      return res.status(400).json({
        success: false,
        message: "La calificación debe estar entre 1 y 5"
      });
    }

    const inscripcion = await ConferenciaEgresado.findOne({
      _id: id,
      egresado_id
    }).populate('conferencia_id');

    if (!inscripcion) {
      return res.status(404).json({
        success: false,
        message: "Inscripción no encontrada"
      });
    }

    // Validar que el evento ya se realizó
    const conferencia = inscripcion.conferencia_id;
    if (new Date(conferencia.fecha_evento) > new Date()) {
      return res.status(400).json({
        success: false,
        message: "No puedes calificar una conferencia que aún no se ha realizado"
      });
    }

    inscripcion.calificacion = calificacion;
    inscripcion.comentario = comentario?.trim() || '';
    inscripcion.updatedAt = new Date();
    await inscripcion.save();

    res.json({
      success: true,
      message: "Calificación registrada exitosamente",
      data: inscripcion
    });

  } catch (error) {
    console.error('Error al calificar conferencia:', error);
    res.status(500).json({
      success: false,
      message: "Error al calificar conferencia",
      error: error.message
    });
  }
};

module.exports = {
  inscribirseConferencia,
  getMisInscripciones,
  cancelarInscripcion,
  verificarInscripcion,
  calificarConferencia
};