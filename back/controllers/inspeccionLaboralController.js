const OfertaLaboral = require("../models/OfertaLaboral");
const User = require("../models/User");

// Obtener todas las ofertas para inspección
const getOfertasParaInspeccion = async (req, res) => {
  try {
    const { estado, empresa, search, page = 1, limit = 10 } = req.query;

    // Construir filtros
    const filtros = {};

    if (estado && estado !== "todos") {
      filtros.estado = estado;
    }

    if (empresa) {
      filtros.empresa = { $regex: empresa, $options: 'i' };
    }

    if (search) {
      filtros.$or = [
        { cargo: { $regex: search, $options: 'i' } },
        { empresa: { $regex: search, $options: 'i' } },
        { descripcion: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const ofertas = await OfertaLaboral.find(filtros)
      .sort({ fechaPublicacion: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await OfertaLaboral.countDocuments(filtros);

    res.json({
      success: true,
      data: ofertas,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error al obtener ofertas para inspección:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener ofertas para inspección",
      error: error.message
    });
  }
};

// Bloquear/Desbloquear oferta laboral
const toggleBloqueoOferta = async (req, res) => {
  try {
    const { ofertaId } = req.params;
    const { motivo } = req.body;

    const oferta = await OfertaLaboral.findById(ofertaId);

    if (!oferta) {
      return res.status(404).json({
        success: false,
        message: "Oferta laboral no encontrada"
      });
    }

    // Cambiar estado: si está Activo -> Bloqueado, si está Bloqueado o Inactivo -> Activo
    const nuevoEstado = oferta.estado === 'Activo' ? 'Bloqueado' : 'Activo';
    
    oferta.estado = nuevoEstado;
    oferta.motivoBloqueo = nuevoEstado === 'Bloqueado' ? motivo : null;
    oferta.fechaBloqueo = nuevoEstado === 'Bloqueado' ? new Date() : null;
    oferta.inspectorBloqueo = nuevoEstado === 'Bloqueado' ? req.user._id : null;

    await oferta.save();

    res.json({
      success: true,
      message: nuevoEstado === 'Bloqueado' 
        ? "Oferta laboral bloqueada exitosamente" 
        : "Oferta laboral desbloqueada exitosamente",
      data: {
        _id: oferta._id,
        cargo: oferta.cargo,
        empresa: oferta.empresa,
        estado: oferta.estado
      }
    });

  } catch (error) {
    console.error('Error al cambiar estado de oferta:', error);
    res.status(500).json({
      success: false,
      message: "Error al cambiar estado de la oferta",
      error: error.message
    });
  }
};

// Suspender/Reactivar todas las ofertas de una empresa
const toggleSuspensionEmpresa = async (req, res) => {
  try {
    const { nombreEmpresa } = req.params;
    const { motivo, suspender } = req.body;

    if (!nombreEmpresa) {
      return res.status(400).json({
        success: false,
        message: "El nombre de la empresa es requerido"
      });
    }

    // Buscar todas las ofertas de la empresa
    const ofertas = await OfertaLaboral.find({ 
      empresa: { $regex: new RegExp(`^${nombreEmpresa}$`, 'i') }
    });

    if (ofertas.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron ofertas de esta empresa"
      });
    }

    const nuevoEstado = suspender ? 'Suspendido' : 'Activo';

    // Actualizar todas las ofertas de la empresa
    const resultado = await OfertaLaboral.updateMany(
      { empresa: { $regex: new RegExp(`^${nombreEmpresa}$`, 'i') } },
      {
        $set: {
          estado: nuevoEstado,
          motivoSuspension: suspender ? motivo : null,
          fechaSuspension: suspender ? new Date() : null,
          inspectorSuspension: suspender ? req.user._id : null
        }
      }
    );

    res.json({
      success: true,
      message: suspender 
        ? `Empresa "${nombreEmpresa}" suspendida exitosamente. ${resultado.modifiedCount} ofertas afectadas.`
        : `Empresa "${nombreEmpresa}" reactivada exitosamente. ${resultado.modifiedCount} ofertas afectadas.`,
      data: {
        empresa: nombreEmpresa,
        ofertasAfectadas: resultado.modifiedCount,
        estado: nuevoEstado
      }
    });

  } catch (error) {
    console.error('Error al suspender/reactivar empresa:', error);
    res.status(500).json({
      success: false,
      message: "Error al cambiar estado de la empresa",
      error: error.message
    });
  }
};

// Obtener detalle de una oferta
const getDetalleOferta = async (req, res) => {
  try {
    const { ofertaId } = req.params;

    const oferta = await OfertaLaboral.findById(ofertaId)
      .populate('moderadorAprobador', 'name email')
      .populate('inspectorBloqueo', 'name email')
      .populate('inspectorSuspension', 'name email')
      .lean();

    if (!oferta) {
      return res.status(404).json({
        success: false,
        message: "Oferta no encontrada"
      });
    }

    res.json({
      success: true,
      data: oferta
    });

  } catch (error) {
    console.error('Error al obtener detalle de oferta:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener detalle de la oferta",
      error: error.message
    });
  }
};

// Obtener estadísticas de inspección
const getEstadisticasInspeccion = async (req, res) => {
  try {
    const totalOfertas = await OfertaLaboral.countDocuments();
    const ofertasActivas = await OfertaLaboral.countDocuments({ estado: 'Activo' });
    const ofertasBloqueadas = await OfertaLaboral.countDocuments({ estado: 'Bloqueado' });
    const ofertasSuspendidas = await OfertaLaboral.countDocuments({ estado: 'Suspendido' });

    // Empresas con más ofertas
    const empresasTop = await OfertaLaboral.aggregate([
      { $group: { _id: "$empresa", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Contar empresas suspendidas
    const empresasSuspendidas = await OfertaLaboral.aggregate([
      { $match: { estado: 'Suspendido' } },
      { $group: { _id: "$empresa" } },
      { $count: "total" }
    ]);
    const totalEmpresasSuspendidas = empresasSuspendidas.length > 0 ? empresasSuspendidas[0].total : 0;

    res.json({
      success: true,
      data: {
        totalOfertas,
        ofertasActivas,
        ofertasBloqueadas,
        ofertasSuspendidas,
        empresasSuspendidas: totalEmpresasSuspendidas,
        empresasTop: empresasTop.map(item => ({
          empresa: item._id,
          cantidadOfertas: item.count
        }))
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas de inspección",
      error: error.message
    });
  }
};

// Obtener lista de empresas con sus ofertas
const getEmpresas = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, estado } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Construir pipeline de agregación
    const pipeline = [];

    // Filtros iniciales a nivel de oferta
    const matchStage = {};
    if (search) {
      matchStage.empresa = { $regex: search, $options: 'i' };
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Agrupar por empresa
    pipeline.push({
      $group: {
        _id: "$empresa",
        totalOfertas: { $sum: 1 },
        ofertasActivas: {
          $sum: { $cond: [{ $eq: ["$estado", "Activo"] }, 1, 0] }
        },
        ofertasBloqueadas: {
          $sum: { $cond: [{ $eq: ["$estado", "Bloqueado"] }, 1, 0] }
        },
        ofertasSuspendidas: {
          $sum: { $cond: [{ $eq: ["$estado", "Suspendido"] }, 1, 0] }
        },
        ultimaPublicacion: { $max: "$fechaPublicacion" }
      }
    });

    // Agregar campo de estado general
    pipeline.push({
      $addFields: {
        estadoGeneral: {
          $cond: [
            { $gt: ["$ofertasSuspendidas", 0] },
            "Suspendida",
            "Activa"
          ]
        }
      }
    });

    // Filtrar por estado general si se especifica
    if (estado) {
      pipeline.push({
        $match: { estadoGeneral: estado }
      });
    }

    // Ordenar
    pipeline.push({ $sort: { totalOfertas: -1 } });

    // Facet para paginación
    pipeline.push({
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: parseInt(limit) }]
      }
    });

    const empresas = await OfertaLaboral.aggregate(pipeline);

    const total = empresas[0].metadata.length > 0 ? empresas[0].metadata[0].total : 0;
    const empresasData = empresas[0].data;

    res.json({
      success: true,
      data: empresasData.map(emp => ({
        nombre: emp._id,
        totalOfertas: emp.totalOfertas,
        ofertasActivas: emp.ofertasActivas,
        ofertasBloqueadas: emp.ofertasBloqueadas,
        ofertasSuspendidas: emp.ofertasSuspendidas,
        ultimaPublicacion: emp.ultimaPublicacion,
        estadoGeneral: emp.ofertasSuspendidas > 0 ? 'Suspendida' : 'Activa'
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error al obtener empresas:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener lista de empresas",
      error: error.message
    });
  }
};

module.exports = {
  getOfertasParaInspeccion,
  toggleBloqueoOferta,
  toggleSuspensionEmpresa,
  getDetalleOferta,
  getEstadisticasInspeccion,
  getEmpresas
};
