const Membresia = require("../models/Membresia.js");
const User = require("../models/User.js");
const mercadopago = require("mercadopago");

// Configurar Mercado Pago con ACCESS_TOKEN del .env
const client = new mercadopago.MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// Crear preferencia de pago con Checkout Pro
const handleSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    const usuario = await User.findById(userId);

    if (!usuario || !usuario.email) {
      return res.status(404).json({ error: "Usuario no encontrado o sin email" });
    }

    const preference = new mercadopago.Preference(client);
    
    const preferenceData = await preference.create({
      body: {
        items: [
          {
            title: "Membresía Anual - Club de Egresados URP",
            description: "Acceso completo por 1 año a todos los beneficios",
            quantity: 1,
            unit_price: 150.0,
            currency_id: "PEN",
          },
        ],
        payer: {
          email: usuario.email,
          name: usuario.nombre || "",
        },
        external_reference: userId.toString(),
        statement_descriptor: "CLUB EGRESADOS URP",
      },
    });
    
    res.status(200).json({
      id: preferenceData.id,
      init_point: preferenceData.init_point,
      sandbox_init_point: preferenceData.sandbox_init_point,
    });
  } catch (error) {
    console.error("Error al crear preferencia de pago:", error);
    res.status(500).json({ 
      error: "Error al crear preferencia de pago",
      details: error.message 
    });
  }
};



// Simular pago para activar membresía manualmente
const simulatePagoAprobado = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({ error: "Se requiere userId" });
    }

    const membresia = await Membresia.findOneAndUpdate(
      { userId },
      {
        estado: "activa",
        fechaActivacion: new Date(),
        fechaVencimiento: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ),
        mercadoPagoPaymentId: `SIMULATED-${Date.now()}`,
      },
      { new: true, upsert: true }
    );

    if (membresia) {
      return res.status(200).json({
        success: true,
        message: "Membresía activada correctamente",
        membresia,
      });
    } else {
      return res.status(500).json({ error: "Error al activar la membresía" });
    }
  } catch (error) {
    console.error("Error al simular pago:", error);
    res.status(500).json({ error: "Error al simular pago" });
  }
};

module.exports = {
  handleSubscription,
  simulatePagoAprobado,
};
