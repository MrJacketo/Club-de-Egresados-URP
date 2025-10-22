const Beneficio = require("../models/Beneficio");

// Obtener todos los beneficios
const getBeneficios = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      tipo_beneficio, 
      estado, 
      empresa_asociada,
      search 
    } = req.query;

    // Construir filtros
    const filters = {};
    
    if (tipo_beneficio) {
      filters.tipo_beneficio = tipo_beneficio;
    }
    
    if (estado) {
      filters.estado = estado;
    }
    
    if (empresa_asociada) {
      filters.empresa_asociada = { $regex: empresa_asociada, $options: 'i' };
    }

    // Búsqueda por texto en múltiples campos
    if (search) {
      filters.$or = [
        { titulo: { $regex: search, $options: 'i' } },
        { descripcion: { $regex: search, $options: 'i' } },
        { empresa_asociada: { $regex: search, $options: 'i' } }
      ];
    }

    // Paginación
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 } // Más recientes primero
    };

    const beneficios = await Beneficio.find(filters)
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit)
      .exec();

    const total = await Beneficio.countDocuments(filters);
    const totalPages = Math.ceil(total / options.limit);

    res.status(200).json({
      success: true,
      data: beneficios,
      pagination: {
        currentPage: options.page,
        totalPages,
        totalBeneficios: total,
        hasNextPage: options.page < totalPages,
        hasPrevPage: options.page > 1
      }
    });

  } catch (error) {
    console.error('Error al obtener beneficios:', error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// Obtener un beneficio por ID
const getBeneficioById = async (req, res) => {
  try {
    const { id } = req.params;

    const beneficio = await Beneficio.findById(id);

    if (!beneficio) {
      return res.status(404).json({
        success: false,
        message: "Beneficio no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      data: beneficio
    });

  } catch (error) {
    console.error('Error al obtener beneficio:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "ID de beneficio inválido"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// Crear un nuevo beneficio
const createBeneficio = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      tipo_beneficio,
      empresa_asociada,
      fecha_inicio,
      fecha_fin,
      estado,
      url_detalle,
      imagen_beneficio,
      categoria,
      exclusivo_miembros
    } = req.body;

    // Validaciones adicionales
    if (!titulo || !descripcion || !fecha_inicio) {
      return res.status(400).json({
        success: false,
        message: "Los campos título, descripción y fecha de inicio son obligatorios"
      });
    }

    // Validar fechas
    const fechaInicio = new Date(fecha_inicio);
    const fechaFin = fecha_fin ? new Date(fecha_fin) : null;

    if (fechaFin && fechaFin <= fechaInicio) {
      return res.status(400).json({
        success: false,
        message: "La fecha fin debe ser posterior a la fecha inicio"
      });
    }

    const nuevoBeneficio = new Beneficio({
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      tipo_beneficio: tipo_beneficio || 'academico',
      empresa_asociada: empresa_asociada?.trim() || '',
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      estado: estado || 'activo',
      url_detalle: url_detalle?.trim() || '',
      imagen_beneficio: imagen_beneficio?.trim() || '',
      categoria: categoria?.trim() || '',
      exclusivo_miembros: exclusivo_miembros || false
    });

    const beneficioGuardado = await nuevoBeneficio.save();

    res.status(201).json({
      success: true,
      message: "Beneficio creado exitosamente",
      data: beneficioGuardado
    });

  } catch (error) {
    console.error('Error al crear beneficio:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Errores de validación",
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// Actualizar un beneficio
const updateBeneficio = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      descripcion,
      tipo_beneficio,
      empresa_asociada,
      fecha_inicio,
      fecha_fin,
      estado,
      url_detalle,
      imagen_beneficio,
      categoria,
      exclusivo_miembros
    } = req.body;

    // Verificar que el beneficio existe
    const beneficioExistente = await Beneficio.findById(id);
    if (!beneficioExistente) {
      return res.status(404).json({
        success: false,
        message: "Beneficio no encontrado"
      });
    }

    // Validar fechas si se proporcionan
    if (fecha_inicio && fecha_fin) {
      const fechaInicio = new Date(fecha_inicio);
      const fechaFin = new Date(fecha_fin);

      if (fechaFin <= fechaInicio) {
        return res.status(400).json({
          success: false,
          message: "La fecha fin debe ser posterior a la fecha inicio"
        });
      }
    }

    // Construir objeto de actualización
    const actualizacion = {};
    if (titulo) actualizacion.titulo = titulo.trim();
    if (descripcion) actualizacion.descripcion = descripcion.trim();
    if (tipo_beneficio) actualizacion.tipo_beneficio = tipo_beneficio;
    if (empresa_asociada !== undefined) actualizacion.empresa_asociada = empresa_asociada.trim();
    if (fecha_inicio) actualizacion.fecha_inicio = new Date(fecha_inicio);
    if (fecha_fin !== undefined) actualizacion.fecha_fin = fecha_fin ? new Date(fecha_fin) : null;
    if (estado) actualizacion.estado = estado;
    if (url_detalle !== undefined) actualizacion.url_detalle = url_detalle.trim();
    if (imagen_beneficio !== undefined) actualizacion.imagen_beneficio = imagen_beneficio.trim();
    if (categoria !== undefined) actualizacion.categoria = categoria.trim();
    if (exclusivo_miembros !== undefined) actualizacion.exclusivo_miembros = exclusivo_miembros;

    actualizacion.updatedAt = new Date();

    const beneficioActualizado = await Beneficio.findByIdAndUpdate(
      id,
      actualizacion,
      { 
        new: true, // Retornar el documento actualizado
        runValidators: true // Ejecutar validadores del schema
      }
    );

    res.status(200).json({
      success: true,
      message: "Beneficio actualizado exitosamente",
      data: beneficioActualizado
    });

  } catch (error) {
    console.error('Error al actualizar beneficio:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "ID de beneficio inválido"
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Errores de validación",
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// Eliminar un beneficio
const deleteBeneficio = async (req, res) => {
  try {
    const { id } = req.params;

    const beneficioEliminado = await Beneficio.findByIdAndDelete(id);

    if (!beneficioEliminado) {
      return res.status(404).json({
        success: false,
        message: "Beneficio no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      message: "Beneficio eliminado exitosamente",
      data: beneficioEliminado
    });

  } catch (error) {
    console.error('Error al eliminar beneficio:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "ID de beneficio inválido"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// Obtener beneficios activos
const getBeneficiosActivos = async (req, res) => {
  try {
    const hoy = new Date();
    
    const beneficiosActivos = await Beneficio.find({
      estado: 'activo',
      fecha_inicio: { $lte: hoy },
      $or: [
        { fecha_fin: { $gte: hoy } },
        { fecha_fin: null },
        { fecha_fin: { $exists: false } }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: beneficiosActivos,
      total: beneficiosActivos.length
    });

  } catch (error) {
    console.error('Error al obtener beneficios activos:', error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// Obtener estadísticas de beneficios
const getEstadisticasBeneficios = async (req, res) => {
  try {
    const total = await Beneficio.countDocuments();
    const activos = await Beneficio.countDocuments({ estado: 'activo' });
    const inactivos = await Beneficio.countDocuments({ estado: 'inactivo' });
    
    const porTipo = await Beneficio.aggregate([
      {
        $group: {
          _id: '$tipo_beneficio',
          count: { $sum: 1 }
        }
      }
    ]);

    const hoy = new Date();
    const vigentes = await Beneficio.countDocuments({
      estado: 'activo',
      fecha_inicio: { $lte: hoy },
      $or: [
        { fecha_fin: { $gte: hoy } },
        { fecha_fin: null },
        { fecha_fin: { $exists: false } }
      ]
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        activos,
        inactivos,
        vigentes,
        porTipo: porTipo.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

module.exports = {
  getBeneficios,
  getBeneficioById,
  createBeneficio,
  updateBeneficio,
  deleteBeneficio,
  getBeneficiosActivos,
  getEstadisticasBeneficios
};
