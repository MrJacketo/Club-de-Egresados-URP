const Beneficio = require("../models/Beneficio");

const getBeneficios = async (req, res) => {
  try {
    const beneficios = await Beneficio.find();
    res.status(200).json(beneficios);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener los beneficios",
      details: error.message
    });
  }
};

/*/ CREAR UN NUEVO BENEFICIO PARA CUANDO EL ADMIN LO NECESITE)
const createBeneficio = async (req, res) => {
  try {
    const newBeneficio = new Beneficio(req.body);
    await newBeneficio.save();
    res.status(201).json({ success: true, beneficio: newBeneficio });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al crear el beneficio",
      details: error.message
    });
  }
};
/*/

module.exports = {
  getBeneficios,
};
