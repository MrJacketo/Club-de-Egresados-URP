const OfertaLaboral = require("../models/OfertaLaboral");
const PublicacionOfertas = require("../models/PublicacionOfertas");
const User = require("../models/User");

// Obtener todas las ofertas laborales para moderación (con información del creador)
const getOfertasParaModeracion = async (req, res) => {
  try {
    // Obtener todas las publicaciones con sus ofertas y perfiles
    const publicaciones = await PublicacionOfertas.find()
      .populate('ofertaLaboral')
      .populate('perfil', 'name email')
      .sort({ createdAt: -1 });

    // Formatear los datos para incluir información del creador
    // Filtrar publicaciones que tengan ofertaLaboral válida
    const ofertasConCreador = publicaciones
      .filter(pub => pub.ofertaLaboral && pub.perfil)
      .map(pub => ({
        _id: pub.ofertaLaboral._id,
        cargo: pub.ofertaLaboral.cargo,
        empresa: pub.ofertaLaboral.empresa,
        modalidad: pub.ofertaLaboral.modalidad,
        ubicacion: pub.ofertaLaboral.ubicacion,
        tipoContrato: pub.ofertaLaboral.tipoContrato,
        descripcion: pub.ofertaLaboral.descripcion,
        requisitos: pub.ofertaLaboral.requisitos,
        area: pub.ofertaLaboral.area,
        linkEmpresa: pub.ofertaLaboral.linkEmpresa,
        salario: pub.ofertaLaboral.salario,
        fechaPublicacion: pub.ofertaLaboral.fechaPublicacion,
        fechaCierre: pub.ofertaLaboral.fechaCierre,
        estado: pub.ofertaLaboral.estado,
        aprobado: pub.ofertaLaboral.aprobado,
        moderadorAprobador: pub.ofertaLaboral.moderadorAprobador,
        fechaAprobacion: pub.ofertaLaboral.fechaAprobacion,
        creador: {
          _id: pub.perfil._id,
          nombre: pub.perfil.name,
          email: pub.perfil.email
        }
      }));

    res.json(ofertasConCreador);
  } catch (error) {
    console.error('Error obteniendo ofertas para moderación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Aprobar una oferta laboral
const aprobarOferta = async (req, res) => {
  const { id } = req.params;
  const moderadorId = req.user._id; // ID del moderador desde el JWT

  try {
    const oferta = await OfertaLaboral.findById(id);

    if (!oferta) {
      return res.status(404).json({ error: 'Oferta laboral no encontrada' });
    }

    // Actualizar la oferta
    oferta.aprobado = true;
    oferta.moderadorAprobador = moderadorId;
    oferta.fechaAprobacion = new Date();
    oferta.estado = 'Activo'; // Cambiar automáticamente a Activo al aprobar

    await oferta.save();

    res.json({ 
      message: 'Oferta laboral aprobada exitosamente', 
      oferta: {
        _id: oferta._id,
        cargo: oferta.cargo,
        empresa: oferta.empresa,
        aprobado: oferta.aprobado,
        estado: oferta.estado,
        fechaAprobacion: oferta.fechaAprobacion
      }
    });
  } catch (error) {
    console.error('Error aprobando la oferta laboral:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Desaprobar una oferta laboral
const desaprobarOferta = async (req, res) => {
  const { id } = req.params;

  try {
    const oferta = await OfertaLaboral.findById(id);

    if (!oferta) {
      return res.status(404).json({ error: 'Oferta laboral no encontrada' });
    }

    // Actualizar la oferta
    oferta.aprobado = false;
    oferta.moderadorAprobador = null;
    oferta.fechaAprobacion = null;
    oferta.estado = 'Pendiente'; // Regresar a Pendiente al desaprobar

    await oferta.save();

    res.json({ 
      message: 'Oferta laboral desaprobada exitosamente', 
      oferta: {
        _id: oferta._id,
        cargo: oferta.cargo,
        empresa: oferta.empresa,
        aprobado: oferta.aprobado
      }
    });
  } catch (error) {
    console.error('Error desaprobando la oferta laboral:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Cambiar el estado de una oferta (Activo/Inactivo)
const cambiarEstadoOferta = async (req, res) => {
  const { id } = req.params;

  try {
    const oferta = await OfertaLaboral.findById(id);

    if (!oferta) {
      return res.status(404).json({ error: 'Oferta laboral no encontrada' });
    }

    // Cambiar el estado
    const nuevoEstado = oferta.estado === 'Activo' ? 'Inactivo' : 'Activo';
    oferta.estado = nuevoEstado;

    await oferta.save();

    res.json({ 
      message: `Oferta laboral ${nuevoEstado.toLowerCase()} exitosamente`, 
      oferta: {
        _id: oferta._id,
        cargo: oferta.cargo,
        empresa: oferta.empresa,
        estado: oferta.estado
      }
    });
  } catch (error) {
    console.error('Error cambiando el estado de la oferta laboral:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener estadísticas de ofertas para el dashboard del moderador
const getEstadisticasOfertas = async (req, res) => {
  try {
    const totalOfertas = await OfertaLaboral.countDocuments();
    const ofertasPendientes = await OfertaLaboral.countDocuments({ estado: 'Pendiente', aprobado: false });
    const ofertasAprobadas = await OfertaLaboral.countDocuments({ aprobado: true });
    const ofertasActivas = await OfertaLaboral.countDocuments({ estado: 'Activo', aprobado: true });
    const ofertasInactivas = await OfertaLaboral.countDocuments({ estado: 'Inactivo' });

    // Ofertas aprobadas por mes (año actual)
    const añoActual = new Date().getFullYear();
    const ofertasPorMes = await OfertaLaboral.aggregate([
      {
        $match: {
          aprobado: true,
          fechaAprobacion: {
            $gte: new Date(añoActual, 0, 1),
            $lt: new Date(añoActual + 1, 0, 1)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$fechaAprobacion' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Convertir a array de 12 meses
    const ofertasPorMesArray = Array(12).fill(0);
    ofertasPorMes.forEach(item => {
      ofertasPorMesArray[item._id - 1] = item.count;
    });

    // Ofertas por área laboral (top 5)
    const ofertasPorArea = await OfertaLaboral.aggregate([
      { $match: { aprobado: true } },
      { $group: { _id: '$area', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalOfertas,
      ofertasPendientes,
      ofertasAprobadas,
      ofertasActivas,
      ofertasInactivas,
      ofertasPorMes: ofertasPorMesArray,
      ofertasPorArea: ofertasPorArea.map(item => ({
        area: item._id,
        cantidad: item.count
      }))
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas de ofertas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getOfertasParaModeracion,
  aprobarOferta,
  desaprobarOferta,
  cambiarEstadoOferta,
  getEstadisticasOfertas
};
