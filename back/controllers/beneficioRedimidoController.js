const BeneficioRedimido = require("../models/BeneficioRedimido");
const Beneficio = require("../models/Beneficio");

// Ver beneficios redimidos por el usuario actual
const getBeneficiosRedimidosPorUsuario = async (req, res) => {
  const userId = req.user._id;

  try {
    const beneficiosRedimidos = await BeneficioRedimido.find({ userId })
      .populate("beneficioId")
      .lean();

    res.status(200).json({
      success: true,
      beneficiosRedimidos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener beneficios redimidos",
      details: error.message,
    });
  }
};


// Redimir un beneficio
const redimirBeneficio = async (req, res) => {
  const userId = req.user._id;
  const { beneficioId } = req.body;

  if (!beneficioId) {
    return res.status(400).json({ 
      success: false,
      message: "beneficioId es obligatorio" 
    });
  }

  try {
    // Verificar que el beneficio exista
    const beneficio = await Beneficio.findById(beneficioId);
    if (!beneficio) {
      return res.status(404).json({ 
        success: false,
        message: "Beneficio no encontrado" 
      });
    }

    // Verificar si ya fue redimido por este usuario
    const yaRedimido = await BeneficioRedimido.findOne({ userId, beneficioId });
    if (yaRedimido) {
      return res.status(400).json({
        success: false,
        message: "Ya has redimido este beneficio"
      });
    }

    // Registrar redención
    const beneficioRedimido = new BeneficioRedimido({
      userId,
      beneficioId,
      fecha_redencion: new Date(),
    });

    await beneficioRedimido.save();

    // Poblar el beneficio para la respuesta
    await beneficioRedimido.populate('beneficioId');

    res.status(200).json({
      success: true,
      message: "Beneficio redimido exitosamente",
      data: beneficioRedimido,
    });
  } catch (error) {
    console.error('Error al redimir beneficio:', error);
    res.status(500).json({
      success: false,
      message: "Error al redimir beneficio",
      error: error.message,
    });
  }
};

module.exports = {
  getBeneficiosRedimidosPorUsuario,
  redimirBeneficio,
};