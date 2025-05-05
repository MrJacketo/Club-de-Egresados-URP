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
        beneficios: [],
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
        beneficios: [
          "Acceso a la bolsa exclusiva de URPex",
          "Conferencias gratuitas",
          "Descuento en diferentes paquetes de cursos",
          "Beneficios extra"
        ],
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

module.exports = {
  getMembresia,
  activateMembresia,
};