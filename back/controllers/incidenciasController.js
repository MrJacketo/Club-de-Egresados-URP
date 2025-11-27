const IncidenciaLaboral = require('../models/IncidenciaLaboral');
const OfertaLaboral = require('../models/OfertaLaboral');
const User = require('../models/User');
const mongoose = require('mongoose');

// Obtener todas las incidencias con filtros y paginación
const getIncidencias = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      estado,
      tipo,
      fecha,
      search,
      orden = 'mas_recientes',
      incluir_ocultos = 'false',
      incluir_eliminados = 'false'
    } = req.query;

    // Construir filtros
    const filtros = {};

    // Filtro base: no incluir eliminados por defecto
    if (incluir_eliminados === 'false') {
      filtros.eliminado = false;
    }

    // Filtro de ocultos
    if (incluir_ocultos === 'false') {
      filtros.oculto = false;
    }

    // Filtro por estado
    if (estado && estado !== 'Todos') {
      filtros.estado = estado;
    }

    // Filtro por tipo
    if (tipo && tipo !== 'Todos los tipos') {
      filtros.tipo = tipo;
    }

    // Filtro por fecha
    if (fecha && fecha !== 'Todas las fechas') {
      const ahora = new Date();
      let fechaLimite = new Date();

      switch (fecha) {
        case 'ultima_semana':
          fechaLimite.setDate(ahora.getDate() - 7);
          break;
        case 'ultimo_mes':
          fechaLimite.setMonth(ahora.getMonth() - 1);
          break;
        case 'ultimos_3_meses':
          fechaLimite.setMonth(ahora.getMonth() - 3);
          break;
      }

      if (fechaLimite < ahora) {
        filtros.createdAt = { $gte: fechaLimite };
      }
    }

    // Filtro de búsqueda por texto
    if (search && search.trim()) {
      filtros.$or = [
        { reportado_por: { $regex: search, $options: 'i' } },
        { descripcion: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { tipo: { $regex: search, $options: 'i' } }
      ];
    }

    // Configurar ordenamiento
    let sortOptions = {};
    switch (orden) {
      case 'mas_antiguos':
        sortOptions = { createdAt: 1 };
        break;
      case 'a_z':
        sortOptions = { tipo: 1, reportado_por: 1 };
        break;
      case 'z_a':
        sortOptions = { tipo: -1, reportado_por: -1 };
        break;
      case 'mas_recientes':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    // Calcular paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Ejecutar consulta
    const incidencias = await IncidenciaLaboral.find(filtros)
      .populate('oferta_relacionada', 'cargo empresa')
      .populate('inspector_asignado', 'name email')
      .populate('creado_por', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await IncidenciaLaboral.countDocuments(filtros);

    // Calcular estadísticas
    const stats = await calcularEstadisticas(incluir_eliminados === 'true');

    res.json({
      success: true,
      data: incidencias,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      },
      stats
    });

  } catch (error) {
    console.error('Error al obtener incidencias:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las incidencias',
      error: error.message
    });
  }
};

// Crear nueva incidencia
const crearIncidencia = async (req, res) => {
  try {
    const {
      tipo,
      reportado_por,
      email,
      descripcion,
      complejidad = 'Media',
      oferta_relacionada
    } = req.body;

    // Validaciones adicionales
    if (!tipo || !reportado_por || !email || !descripcion) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: tipo, reportado_por, email, descripcion'
      });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    // Validar longitud de descripción
    if (descripcion.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'La descripción debe tener al menos 10 caracteres'
      });
    }

    // Verificar oferta relacionada si se proporciona
    if (oferta_relacionada) {
      const ofertaExiste = await OfertaLaboral.findById(oferta_relacionada);
      if (!ofertaExiste) {
        return res.status(404).json({
          success: false,
          message: 'La oferta laboral relacionada no existe'
        });
      }
    }

    // Crear metadatos
    const metadatos = {
      ip_origen: req.ip || req.connection.remoteAddress,
      user_agent: req.headers['user-agent'],
      origen_reporte: 'web'
    };

    // Crear la incidencia
    const nuevaIncidencia = new IncidenciaLaboral({
      tipo,
      reportado_por: reportado_por.trim(),
      email: email.trim().toLowerCase(),
      descripcion: descripcion.trim(),
      complejidad,
      oferta_relacionada: oferta_relacionada || null,
      creado_por: req.user ? req.user.id : null,
      metadatos
    });

    const incidenciaGuardada = await nuevaIncidencia.save();

    // Poblar las referencias para la respuesta
    await incidenciaGuardada.populate([
      { path: 'oferta_relacionada', select: 'cargo empresa' },
      { path: 'creado_por', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Incidencia creada exitosamente',
      data: incidenciaGuardada
    });

  } catch (error) {
    console.error('Error al crear incidencia:', error);
    
    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errores
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al crear la incidencia',
      error: error.message
    });
  }
};

// Obtener una incidencia específica
const getIncidenciaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de incidencia inválido'
      });
    }

    const incidencia = await IncidenciaLaboral.findById(id)
      .populate('oferta_relacionada', 'cargo empresa descripcion')
      .populate('inspector_asignado', 'name email')
      .populate('creado_por', 'name email');

    if (!incidencia) {
      return res.status(404).json({
        success: false,
        message: 'Incidencia no encontrada'
      });
    }

    res.json({
      success: true,
      data: incidencia
    });

  } catch (error) {
    console.error('Error al obtener incidencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la incidencia',
      error: error.message
    });
  }
};

// Actualizar incidencia
const actualizarIncidencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, notas_inspector, complejidad, inspector_asignado } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de incidencia inválido'
      });
    }

    const incidencia = await IncidenciaLaboral.findById(id);

    if (!incidencia) {
      return res.status(404).json({
        success: false,
        message: 'Incidencia no encontrada'
      });
    }

    if (incidencia.eliminado) {
      return res.status(400).json({
        success: false,
        message: 'No se puede actualizar una incidencia eliminada'
      });
    }

    // Actualizar campos permitidos
    const actualizaciones = {};

    if (estado && ['En revisión', 'Revisado'].includes(estado)) {
      actualizaciones.estado = estado;
    }

    if (notas_inspector !== undefined) {
      actualizaciones.notas_inspector = notas_inspector.trim();
    }

    if (complejidad && ['Baja', 'Media', 'Alta'].includes(complejidad)) {
      actualizaciones.complejidad = complejidad;
    }

    if (inspector_asignado) {
      if (mongoose.isValidObjectId(inspector_asignado)) {
        const inspector = await User.findById(inspector_asignado);
        if (inspector && ['inspector_laboral', 'moderador', 'admin'].includes(inspector.rol)) {
          actualizaciones.inspector_asignado = inspector_asignado;
        }
      }
    }

    actualizaciones.fechaActualizacion = new Date();

    const incidenciaActualizada = await IncidenciaLaboral.findByIdAndUpdate(
      id,
      actualizaciones,
      { new: true, runValidators: true }
    ).populate([
      { path: 'oferta_relacionada', select: 'cargo empresa' },
      { path: 'inspector_asignado', select: 'name email' },
      { path: 'creado_por', select: 'name email' }
    ]);

    res.json({
      success: true,
      message: 'Incidencia actualizada exitosamente',
      data: incidenciaActualizada
    });

  } catch (error) {
    console.error('Error al actualizar incidencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la incidencia',
      error: error.message
    });
  }
};

// Ocultar/Mostrar incidencia
const toggleOcultarIncidencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { oculto } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de incidencia inválido'
      });
    }

    if (typeof oculto !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'El campo "oculto" debe ser un valor booleano'
      });
    }

    const incidencia = await IncidenciaLaboral.findById(id);

    if (!incidencia) {
      return res.status(404).json({
        success: false,
        message: 'Incidencia no encontrada'
      });
    }

    if (incidencia.eliminado) {
      return res.status(400).json({
        success: false,
        message: 'No se puede modificar una incidencia eliminada'
      });
    }

    incidencia.oculto = oculto;
    await incidencia.save();

    res.json({
      success: true,
      message: `Incidencia ${oculto ? 'ocultada' : 'mostrada'} exitosamente`,
      data: { oculto: incidencia.oculto }
    });

  } catch (error) {
    console.error('Error al cambiar visibilidad de incidencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar la visibilidad de la incidencia',
      error: error.message
    });
  }
};

// Eliminar incidencia (soft delete)
const eliminarIncidencia = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de incidencia inválido'
      });
    }

    const incidencia = await IncidenciaLaboral.findById(id);

    if (!incidencia) {
      return res.status(404).json({
        success: false,
        message: 'Incidencia no encontrada'
      });
    }

    if (incidencia.eliminado) {
      return res.status(400).json({
        success: false,
        message: 'La incidencia ya está eliminada'
      });
    }

    incidencia.eliminado = true;
    await incidencia.save();

    res.json({
      success: true,
      message: 'Incidencia eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar incidencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la incidencia',
      error: error.message
    });
  }
};

// Obtener estadísticas del dashboard
const getEstadisticas = async (req, res) => {
  try {
    const stats = await calcularEstadisticas(false);
    
    res.json({
      success: true,
      data: stats
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

// Función auxiliar para calcular estadísticas
const calcularEstadisticas = async (incluirEliminados = false) => {
  try {
    const filtroBase = incluirEliminados ? {} : { eliminado: false };

    const [
      totalIncidencias,
      enRevision,
      revisados,
      altaComplejidad,
      ocultos,
      eliminados,
      porTipo,
      porComplejidad,
      tendenciaMensual
    ] = await Promise.all([
      IncidenciaLaboral.countDocuments(filtroBase),
      IncidenciaLaboral.countDocuments({ ...filtroBase, estado: 'En revisión' }),
      IncidenciaLaboral.countDocuments({ ...filtroBase, estado: 'Revisado' }),
      IncidenciaLaboral.countDocuments({ ...filtroBase, complejidad: 'Alta' }),
      IncidenciaLaboral.countDocuments({ ...filtroBase, oculto: true }),
      IncidenciaLaboral.countDocuments({ eliminado: true }),
      
      // Estadísticas por tipo
      IncidenciaLaboral.aggregate([
        { $match: filtroBase },
        { $group: { _id: '$tipo', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      
      // Estadísticas por complejidad
      IncidenciaLaboral.aggregate([
        { $match: filtroBase },
        { $group: { _id: '$complejidad', count: { $sum: 1 } } }
      ]),
      
      // Tendencia mensual (últimos 6 meses)
      IncidenciaLaboral.aggregate([
        {
          $match: {
            ...filtroBase,
            createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])
    ]);

    // Formatear tendencia mensual
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const tendenciaFormateada = tendenciaMensual.map(item => ({
      mes: `${meses[item._id.month - 1]} ${item._id.year}`,
      count: item.count
    }));

    return {
      totalIncidencias,
      enRevision,
      revisados,
      altaComplejidad,
      ocultos,
      eliminados,
      porTipo: porTipo.map(item => ({
        tipo: item._id,
        count: item.count
      })),
      porComplejidad: porComplejidad.map(item => ({
        complejidad: item._id,
        count: item.count
      })),
      tendenciaMensual: tendenciaFormateada
    };

  } catch (error) {
    console.error('Error al calcular estadísticas:', error);
    throw error;
  }
};

module.exports = {
  getIncidencias,
  crearIncidencia,
  getIncidenciaPorId,
  actualizarIncidencia,
  updateIncidencia: actualizarIncidencia, // Alias para el frontend
  toggleOcultarIncidencia,
  eliminarIncidencia,
  deleteIncidencia: eliminarIncidencia, // Alias para el frontend
  getEstadisticas
};