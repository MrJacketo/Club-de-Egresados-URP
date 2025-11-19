const Beneficio = require("../models/Beneficio");

// Crear beneficio
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
      imagen_beneficio
    } = req.body;

    // Validaciones básicas
    if (!titulo || !descripcion) {
      return res.status(400).json({
        success: false,
        message: "Título y descripción son obligatorios"
      });
    }

    // Crear nuevo beneficio
    const nuevoBeneficio = new Beneficio({
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      tipo_beneficio: tipo_beneficio || 'academico',
      empresa_asociada: empresa_asociada?.trim() || '',
      fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : new Date(),
      fecha_fin: fecha_fin ? new Date(fecha_fin) : null,
      estado: estado || 'activo',
      url_detalle: url_detalle?.trim() || '',
      imagen_beneficio: imagen_beneficio?.trim() || ''
    });

    const beneficioGuardado = await nuevoBeneficio.save();

    res.status(201).json({
      success: true,
      message: "Beneficio creado exitosamente",
      data: beneficioGuardado
    });

  } catch (error) {
    console.error('Error al crear beneficio:', error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al crear el beneficio",
      error: error.message
    });
  }
};

// Obtener todos los beneficios con filtros
const getBeneficios = async (req, res) => {
  try {
    const { tipo_beneficio, estado, search, page = 1, limit = 10 } = req.query;

    // Construir filtros
    const filtros = {};

    if (tipo_beneficio && tipo_beneficio !== "todos") {
      filtros.tipo_beneficio = tipo_beneficio;
    }
    if (estado && estado !== "todos") {
      filtros.estado = estado;
    }
    if (search) {
      filtros.$or = [
        { titulo: { $regex: search, $options: 'i' } },
        { descripcion: { $regex: search, $options: 'i' } },
        { empresa_asociada: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const beneficios = await Beneficio.find(filtros)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Beneficio.countDocuments(filtros);

    res.json({
      success: true,
      data: beneficios,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error al obtener beneficios:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener beneficios",
      error: error.message
    });
  }
};

// Obtener beneficio por ID
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

    res.json({
      success: true,
      data: beneficio
    });

  } catch (error) {
    console.error('Error al obtener beneficio:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener beneficio",
      error: error.message
    });
  }
};

// Actualizar beneficio
const updateBeneficio = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizacion = { ...req.body };

    datosActualizacion.updatedAt = new Date();

    const beneficioActualizado = await Beneficio.findByIdAndUpdate(
      id,
      datosActualizacion,
      {
        new: true,
        runValidators: true
      }
    );

    if (!beneficioActualizado) {
      return res.status(404).json({
        success: false,
        message: "Beneficio no encontrado"
      });
    }

    res.json({
      success: true,
      message: "Beneficio actualizado exitosamente",
      data: beneficioActualizado
    });

  } catch (error) {
    console.error('Error al actualizar beneficio:', error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar beneficio",
      error: error.message
    });
  }
};

// Eliminar beneficio
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

    res.json({
      success: true,
      message: "Beneficio eliminado exitosamente"
    });

  } catch (error) {
    console.error('Error al eliminar beneficio:', error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar beneficio",
      error: error.message
    });
  }
};

// Obtener beneficios activos (función adicional útil)
const getBeneficiosActivos = async (req, res) => {
  try {
    const beneficiosActivos = await Beneficio.find({ estado: 'activo' })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: beneficiosActivos
    });

  } catch (error) {
    console.error('Error al obtener beneficios activos:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener beneficios activos",
      error: error.message
    });
  }
};

// Obtener estadísticas básicas
const getEstadisticasBeneficios = async (req, res) => {
  try {
    const total = await Beneficio.countDocuments();
    const activos = await Beneficio.countDocuments({ estado: 'activo' });
    const inactivos = await Beneficio.countDocuments({ estado: 'inactivo' });

    res.json({
      success: true,
      data: {
        total,
        activos,
        inactivos
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

module.exports = {
  createBeneficio,
  getBeneficios,
  getBeneficioById,
  updateBeneficio,
  deleteBeneficio,
  getBeneficiosActivos,
  getEstadisticasBeneficios
};
