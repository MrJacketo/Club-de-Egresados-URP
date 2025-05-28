const Membresia = require("../models/Membresia");

// GET MEMBRESIAS
const getMembresia = async (req, res) => {
  const firebaseUid = req.user.firebaseUid;
  try {
    const membresia = await Membresia.findOne({ firebaseUid });

    if (!membresia) {
      console.log("No se encontró membresía, devolviendo defaults");
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

/*/VER BENEFICIOS
const agregarBeneficioAMembresia = async (req, res) => {
  const firebaseUid = req.user.firebaseUid;
  const beneficio = req.body.beneficio;

  console.log("Beneficio recibido:", req.body);

  if (!beneficio) {
    return res.status(400).json({ error: "Beneficio inválido" });
  }

  try {
    beneficio.fechaReclamo = new Date(); // agregar fecha de reclamo si no está

    const membresia = await Membresia.findOneAndUpdate(
      { firebaseUid },
      { $push: { beneficios: beneficio } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      membresia
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al agregar beneficio a la membresía",
      details: error.message
    });
  }
};
/*/

module.exports = {
  getMembresia,
  activateMembresia,
  //agregarBeneficioAMembresia
}