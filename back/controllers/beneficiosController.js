const Feedback = require('../models/Feedback');

// ========== CREAR NUEVO FEEDBACK (PÚBLICO) ==========
exports.crearFeedback = async (req, res) => {
  try {
    const { 
      userId, 
      nombreUsuario, 
      emailUsuario, 
      beneficioDeseado,
      tipoBeneficio,
      facultad,
      carrera,
      fechaPreferida,
      modalidadPreferida,
      comentariosAdicionales 
    } = req.body;

    // Validaciones básicas
    if (!userId || !beneficioDeseado) {
      return res.status(400).json({ 
        success: false,
        message: 'userId y beneficioDeseado son campos obligatorios' 
      });
    }

    const nuevoFeedback = new Feedback({
      userId,
      nombreUsuario,
      emailUsuario,
      beneficioDeseado,
      tipoBeneficio,
      facultad,
      carrera,
      fechaPreferida,
      modalidadPreferida,
      comentariosAdicionales,
      estado: 'solicitado'
    });

    await nuevoFeedback.save();

    res.status(201).json({
      success: true,
      message: 'Solicitud de beneficio creada exitosamente',
      data: nuevoFeedback
    });
  } catch (error) {
    console.error('Error al crear feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la solicitud',
      error: error.message
    });
  }
};

// ========== OBTENER TODOS LOS FEEDBACKS (ADMIN) ==========
exports.obtenerFeedbacks = async (req, res) => {
  try {
    const { estado, prioridad, userId } = req.query;
    
    let filtro = {};
    
    if (estado) filtro.estado = estado;
    if (prioridad) filtro.prioridad = prioridad;
    if (userId) filtro.userId = userId;

    const feedbacks = await Feedback.find(filtro).sort({ fechaCreacion: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    console.error('Error al obtener feedbacks:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los feedbacks',
      error: error.message
    });
  }
};

// ========== OBTENER MIS FEEDBACKS (USUARIO AUTENTICADO) ==========
exports.obtenerMisFeedbacks = async (req, res) => {
  try {
    // Obtener userId del token JWT o query
    const userId = req.user?.uid || req.user?.id || req.query.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Usuario no identificado'
      });
    }

    const feedbacks = await Feedback.find({ 
      userId,
      oculto: false 
    }).sort({ fechaCreacion: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    console.error('Error al obtener mis feedbacks:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tus solicitudes',
      error: error.message
    });
  }
};

// ========== OBTENER FEEDBACKS PÚBLICOS ==========
exports.obtenerFeedbacksPublicos = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ 
      oculto: false,
      estado: { $in: ['solicitado', 'aprobado'] }
    })
    .select('-userId -emailUsuario') // Ocultar datos sensibles
    .sort({ fechaCreacion: -1 })
    .limit(50);

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    console.error('Error al obtener feedbacks públicos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener feedbacks públicos',
      error: error.message
    });
  }
};

// ========== OBTENER UN FEEDBACK POR ID (ADMIN) ==========
exports.obtenerFeedbackPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Error al obtener feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el feedback',
      error: error.message
    });
  }
};

// ========== ACTUALIZAR FEEDBACK (ADMIN) ==========
exports.actualizarFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, prioridad, respuestaAdministrador } = req.body;

    // Validar estado
    const estadosValidos = ['solicitado', 'aprobado', 'rechazado'];
    if (estado && !estadosValidos.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado no válido. Debe ser: solicitado, aprobado o rechazado'
      });
    }

    const feedbackActualizado = await Feedback.findByIdAndUpdate(
      id,
      { 
        ...(estado && { estado }),
        ...(prioridad && { prioridad }),
        ...(respuestaAdministrador !== undefined && { respuestaAdministrador }),
        ultimaActualizacion: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!feedbackActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Feedback no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback actualizado exitosamente',
      data: feedbackActualizado
    });
  } catch (error) {
    console.error('Error al actualizar feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el feedback',
      error: error.message
    });
  }
};

// ========== OCULTAR/MOSTRAR FEEDBACK (ADMIN) ==========
exports.ocultarFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { oculto } = req.body;

    const feedbackActualizado = await Feedback.findByIdAndUpdate(
      id,
      { oculto: oculto !== undefined ? oculto : true },
      { new: true }
    );

    if (!feedbackActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Feedback no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: `Feedback ${feedbackActualizado.oculto ? 'ocultado' : 'visible'} exitosamente`,
      data: feedbackActualizado
    });
  } catch (error) {
    console.error('Error al ocultar feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error al modificar visibilidad del feedback',
      error: error.message
    });
  }
};

// ========== ELIMINAR FEEDBACK (ADMIN) ==========
exports.eliminarFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedbackEliminado = await Feedback.findByIdAndDelete(id);

    if (!feedbackEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Feedback no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback eliminado exitosamente',
      data: feedbackEliminado
    });
  } catch (error) {
    console.error('Error al eliminar feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el feedback',
      error: error.message
    });
  }
};

// ========== OBTENER ESTADÍSTICAS DE FEEDBACKS (ADMIN) ==========
exports.obtenerEstadisticasFeedbacks = async (req, res) => {
  try {
    const total = await Feedback.countDocuments({ oculto: false });
    const solicitados = await Feedback.countDocuments({ estado: 'solicitado', oculto: false });
    const aprobados = await Feedback.countDocuments({ estado: 'aprobado', oculto: false });
    const rechazados = await Feedback.countDocuments({ estado: 'rechazado', oculto: false });

    const porPrioridad = await Feedback.aggregate([
      { $match: { oculto: false } },
      { $group: { _id: '$prioridad', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        porEstado: {
          solicitados,
          aprobados,
          rechazados
        },
        porPrioridad: porPrioridad.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};