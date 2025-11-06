const User = require("../models/User");
const PerfilEgresado = require("../models/PerfilEgresado");

// Obtener todos los egresados para moderación
const getEgresadosParaModerar = async (req, res) => {
  try {
    const { estado, carrera, search, page = 1, limit = 10 } = req.query;

    // Construir filtros
    const filtros = { rol: "egresado" };

    if (estado) {
      if (estado === "activo") {
        filtros.activo = true;
      } else if (estado === "inactivo") {
        filtros.activo = false;
      }
    }

    if (carrera && carrera !== "todas") {
      filtros.carrera = carrera;
    }

    if (search) {
      filtros.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const egresados = await User.find(filtros)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Obtener perfiles adicionales si existen
    const egresadosConPerfil = await Promise.all(
      egresados.map(async (egresado) => {
        const perfil = await PerfilEgresado.findOne({ userId: egresado._id }).lean();
        return {
          ...egresado,
          perfil: perfil || null
        };
      })
    );

    const total = await User.countDocuments(filtros);

    res.json({
      success: true,
      data: egresadosConPerfil,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error al obtener egresados:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener egresados para moderación",
      error: error.message
    });
  }
};

// Activar/Desactivar egresado
const toggleEstadoEgresado = async (req, res) => {
  try {
    const { userId } = req.params;
    const { activo, motivo } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    if (user.rol !== "egresado") {
      return res.status(400).json({
        success: false,
        message: "Solo se pueden moderar usuarios con rol de egresado"
      });
    }

    user.activo = activo;
    await user.save();

    res.json({
      success: true,
      message: activo ? "Egresado activado exitosamente" : "Egresado desactivado exitosamente",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        activo: user.activo
      }
    });

  } catch (error) {
    console.error('Error al cambiar estado del egresado:', error);
    res.status(500).json({
      success: false,
      message: "Error al cambiar estado del egresado",
      error: error.message
    });
  }
};

// Obtener estadísticas de moderación
const getEstadisticasModeracion = async (req, res) => {
  try {
    const totalEgresados = await User.countDocuments({ rol: "egresado" });
    const egresadosActivos = await User.countDocuments({ rol: "egresado", activo: true });
    const egresadosInactivos = await User.countDocuments({ rol: "egresado", activo: false });

    // Egresados por carrera
    const egresadosPorCarrera = await User.aggregate([
      { $match: { rol: "egresado" } },
      { $group: { _id: "$carrera", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Egresados registrados en los últimos 30 días
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    const nuevosEgresados = await User.countDocuments({
      rol: "egresado",
      createdAt: { $gte: hace30Dias }
    });

    res.json({
      success: true,
      data: {
        totalEgresados,
        egresadosActivos,
        egresadosInactivos,
        nuevosEgresados,
        egresadosPorCarrera: egresadosPorCarrera.map(item => ({
          carrera: item._id || "Sin carrera",
          cantidad: item.count
        }))
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas de moderación",
      error: error.message
    });
  }
};

// Obtener detalles de un egresado específico
const getDetalleEgresado = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password').lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    if (user.rol !== "egresado") {
      return res.status(400).json({
        success: false,
        message: "El usuario no es un egresado"
      });
    }

    const perfil = await PerfilEgresado.findOne({ userId: user._id }).lean();

    res.json({
      success: true,
      data: {
        ...user,
        perfil: perfil || null
      }
    });

  } catch (error) {
    console.error('Error al obtener detalle del egresado:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener detalle del egresado",
      error: error.message
    });
  }
};

module.exports = {
  getEgresadosParaModerar,
  toggleEstadoEgresado,
  getEstadisticasModeracion,
  getDetalleEgresado
};
