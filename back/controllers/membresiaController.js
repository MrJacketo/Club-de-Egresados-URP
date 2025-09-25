const User = require("../models/User");
const Membresia = require("../models/Membresia");
const BeneficioRedimido = require("../models/BeneficioRedimido");

// GET MEMBRESIAS
const getMembresia = async (req, res) => {
  const userId = req.user._id;
  try {
    const membresia = await Membresia.findOne({ userId });

    if (!membresia) {
      return res.status(200).json({
        estado: "inactiva",
        fechaActivacion: null,
        fechaVencimiento: null
      });
    }
    res.status(200).json(membresia);

  } catch (error) {
    res.status(500).json({ 
      error: "Error interno del servidor",
      details: error.message 
    });
  }
};

// PUT MEMBRESIAS / UPDATE MEMBRESIAS
const activateMembresia = async (req, res) => {
  const userId = req.user._id;

  try {
    const membresia = await Membresia.findOneAndUpdate(
      { userId },
      {
        estado: "activa",
        fechaActivacion: new Date(),
        fechaVencimiento: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) // 1 año de membresía
      },
      { new: true, upsert: true } // Crea la membresía si no existe
    );

    res.json({
      success: true,
      membresia
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Error interno al activar membresía" 
    });
  }
};

// GET ALL MEMBRESIAS (ADMIN)
const getAllMembresias = async (req, res) => {
  try {
    const membresias = await Membresia.find().populate('userId', 'name email').lean();

    const userIds = membresias.map(m => m.userId);
    const beneficiosRedimidos = await BeneficioRedimido.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: "$userId", cantidad: { $sum: 1 } } }
    ]);
    const beneficiosPorUid = Object.fromEntries(beneficiosRedimidos.map(b => [b._id.toString(), b.cantidad]));
    const datosFinales = membresias.map(m => {
      const usuario = m.userId;
      const beneficiosUsados = beneficiosPorUid[m.userId.toString()] || 0;

      return {
        id: m._id.toString(),
        usuario: {
          nombre: usuario?.name || "Desconocido",
          email: usuario?.email || "",
          codigo: usuario?._id.toString() || "Sin código",
        },
        estado: m.estado,
        fechaActivacion: m.fechaActivacion,
        fechaVencimiento: m.fechaVencimiento,
        precio: 150,
        beneficiosUsados,
        ultimaActividad: m.updatedAt || m.fechaActivacion,
      };
    });

    res.status(200).json(datosFinales);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error del servidor",
      details: error.message,
    });
  }
};

// PUT UPDATE MEMBRESIA ESTADO (Admin)
const updateMembresiaEstado = async (req, res) => {
  const { userId } = req.params;
  const { estado } = req.body;

  try {
    // Validar estado recibido
    const estadosPermitidos = ['activa', 'inactiva', 'vencida'];
    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({ error: "Estado de membresía no válido" });
    }

    // Buscar usuario para validar que existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Actualizar o crear membresía
    const membresia = await Membresia.findOneAndUpdate(
      { userId },
      { estado },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      membresia
    });

  } catch (error) {
    console.error("Error actualizando estado de membresía:", error);
    res.status(500).json({ 
      success: false,
      error: "Error interno al actualizar membresía",
      details: error.message 
    });
  }
};

const deleteMembresia = async (req, res) => {
  const userId = req.params.userId;
  try {
    const membresia = await Membresia.findOneAndDelete({ userId });
    if (!membresia) {
      return res.status(404).json({ error: "Membresía no encontrada" });
    }
    res.status(200).json({
      success: true,
      mensaje: "Membresía eliminada correctamente"
    });
  } catch (error) {
    console.error("Error al eliminar membresía:", error);
    res.status(500).json({
      error: "Error del servidor",
      details: error.message,
    });
  }
};

module.exports = {
  getMembresia,
  activateMembresia,
  getAllMembresias,
  updateMembresiaEstado,
  deleteMembresia
}