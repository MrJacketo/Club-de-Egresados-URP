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
    return res.status(400).json({ error: "beneficioId es obligatorio" });
  }

  try {
    // Verificar que el beneficio exista
    const beneficio = await Beneficio.findById(beneficioId);
    if (!beneficio) {
      return res.status(404).json({ error: "Beneficio no encontrado" });
    }

    // Registrar redención
    const beneficioRedimido = new BeneficioRedimido({
      userId,
      beneficioId,
      fecha_redencion: new Date(),
      codigo_unico: beneficio.codigo || null,
    });

    await beneficioRedimido.save();

    res.status(200).json({
      success: true,
      beneficioRedimido,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al redimir beneficio",
      details: error.message,
    });
  }
};

module.exports = {
  getBeneficiosRedimidosPorUsuario,
  redimirBeneficio,
};