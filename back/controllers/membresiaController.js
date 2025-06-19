const User = require("../models/User");
const Membresia = require("../models/Membresia");
const BeneficioRedimido = require("../models/BeneficioRedimido");

// GET MEMBRESIAS
const getMembresia = async (req, res) => {
  const firebaseUid = req.user.firebaseUid;
  try {
    const membresia = await Membresia.findOne({ firebaseUid });

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
  const firebaseUid = req.user.firebaseUid;

  try {
    const membresia = await Membresia.findOneAndUpdate(
      { firebaseUid },
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
    const membresias = await Membresia.find().lean();

    const firebaseUids = membresias.map(m => m.firebaseUid);
    const usuarios = await User.find({ firebaseUid: { $in: firebaseUids } }).lean();
    const usuariosPorUid = Object.fromEntries(usuarios.map(u => [u.firebaseUid, u]));
    const beneficiosRedimidos = await BeneficioRedimido.aggregate([
      { $match: { firebaseUid: { $in: firebaseUids } } },
      { $group: { _id: "$firebaseUid", cantidad: { $sum: 1 } } }
    ]);
    const beneficiosPorUid = Object.fromEntries(beneficiosRedimidos.map(b => [b._id, b.cantidad]));
    const datosFinales = membresias.map(m => {
      const usuario = usuariosPorUid[m.firebaseUid];
      const beneficiosUsados = beneficiosPorUid[m.firebaseUid] || 0;

      return {
        id: m._id.toString(),
        usuario: {
          nombre: usuario?.name || "Desconocido",
          email: usuario?.email || "",
          codigo: usuario?.firebaseUid || "Sin código",
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
    const estadosPermitidos = ['activa', 'inactiva', 'vencida', 'pausada'];
    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({ error: "Estado de membresía no válido" });
    }

    // Buscar usuario para validar que existe
    const user = await User.findOne({ firebaseUid: userId });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Actualizar o crear membresía
    const membresia = await Membresia.findOneAndUpdate(
      { firebaseUid: userId },
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

module.exports = {
  getMembresia,
  activateMembresia,
  getAllMembresias,
  updateMembresiaEstado
}