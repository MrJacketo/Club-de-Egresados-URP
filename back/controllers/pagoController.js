const Membresia = require("../models/Membresia.js");
const User = require("../models/User.js");
const mercadopago = require("mercadopago");

// Configurar Mercado Pago con ACCESS_TOKEN del .env
const client = new mercadopago.MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// Crear preferencia de pago con Checkout Pro (SIN NGROK)
const handleSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    const usuario = await User.findById(userId);

    if (!usuario || !usuario.email) {
      return res.status(404).json({ error: "Usuario no encontrado o sin email" });
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    console.log("Frontend URL configurada:", frontendUrl);

    // Crear preferencia de pago con Checkout Pro
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
        back_urls: {
          success: `${frontendUrl}/pago/success`,
          failure: `${frontendUrl}/pago/failure`,
          pending: `${frontendUrl}/pago/pending`,
        },
        external_reference: userId.toString(),
        statement_descriptor: "CLUB EGRESADOS URP",
      },
    });

    console.log("Back URLs configuradas:", {
      success: `${frontendUrl}/pago/success`,
      failure: `${frontendUrl}/pago/failure`,
      pending: `${frontendUrl}/pago/pending`,
    });

    console.log("✅ Preferencia creada exitosamente");
    console.log("- Preference ID:", preferenceData.id);
    console.log("- External Reference:", userId.toString());

    console.log("Preferencia creada:", preferenceData.id);
    
    res.status(200).json({
      id: preferenceData.id,
      init_point: preferenceData.init_point, // URL para abrir Checkout Pro
      sandbox_init_point: preferenceData.sandbox_init_point, // URL para testing
    });
  } catch (error) {
    console.error("Error al crear preferencia de pago:", error);
    res.status(500).json({ 
      error: "Error al crear preferencia de pago",
      details: error.message 
    });
  }
};

// Verificar estado del pago después de redirección (sin necesidad de webhook)
const verifyPayment = async (req, res) => {
  try {
    const { payment_id, external_reference } = req.query;

    console.log("=== VERIFICACIÓN DE PAGO ===");
    console.log("payment_id recibido:", payment_id);
    console.log("external_reference recibido:", external_reference);

    if (!payment_id) {
      return res.status(400).json({ error: "payment_id es requerido" });
    }

    // Consultar el estado del pago en Mercado Pago
    const payment = new mercadopago.Payment(client);
    const paymentData = await payment.get({ id: payment_id });

    console.log("Estado del pago:", paymentData.status);
    console.log("Referencia externa del pago:", paymentData.external_reference);
    console.log("Datos completos del pago:", JSON.stringify(paymentData, null, 2));

    // Si el pago está aprobado, activar membresía
    if (paymentData.status === "approved") {
      // Usar external_reference del pago, no del query
      const userId = paymentData.external_reference;
      
      if (!userId) {
        console.error("ERROR: No se encontró userId en external_reference");
        return res.status(400).json({ 
          error: "No se pudo identificar al usuario del pago",
          success: false 
        });
      }

      console.log("Intentando activar membresía para userId:", userId);
      
      const membresia = await Membresia.findOneAndUpdate(
        { userId },
        {
          estado: "activa",
          fechaActivacion: new Date(),
          fechaVencimiento: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ),
          mercadoPagoPaymentId: payment_id,
        },
        { new: true, upsert: true }
      );

      console.log("✅ Membresía activada exitosamente:", membresia);

      return res.status(200).json({
        success: true,
        status: paymentData.status,
        membresia,
      });
    } else {
      console.log("⚠️ Pago no aprobado, estado:", paymentData.status);
      return res.status(200).json({
        success: false,
        status: paymentData.status,
        message: "Pago no aprobado",
      });
    }
  } catch (error) {
    console.error("❌ Error al verificar pago:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ 
      error: "Error al verificar pago",
      details: error.message 
    });
  }
};

// Webhook opcional (por si quieres recibir notificaciones automáticas)
const handleWebhook = async (req, res) => {
  const event = req.body;

  try {
    console.log("Webhook recibido:", event.type);

    if (event.type === "payment") {
      const paymentId = event.data.id;
      const payment = new mercadopago.Payment(client);
      const paymentData = await payment.get({ id: paymentId });

      if (paymentData.status === "approved") {
        const userId = paymentData.external_reference;
        
        await Membresia.findOneAndUpdate(
          { userId },
          {
            estado: "activa",
            fechaActivacion: new Date(),
            fechaVencimiento: new Date(
              new Date().setFullYear(new Date().getFullYear() + 1)
            ),
            mercadoPagoPaymentId: paymentId,
          },
          { new: true, upsert: true }
        );

        console.log("Membresía activada vía webhook para usuario:", userId);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error en webhook:", error);
    res.sendStatus(500);
  }
};

// Función para simular pagos localmente (para desarrollo)
const simulatePagoAprobado = async (req, res) => {
  try {
    const userId = req.user._id; // Changed from firebaseUid

    if (!userId) {
      return res.status(400).json({ error: "Se requiere userId" });
    }

    console.log("=== SIMULACIÓN DE PAGO ===");
    console.log("userId:", userId);

    // Actualizar o crear la membresía
    const membresia = await Membresia.findOneAndUpdate(
      { userId }, // Changed from firebaseUid
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
      console.log("✅ Membresía activada (simulación) para el usuario con ID:", userId);
      console.log("Membresía:", membresia);
      return res.status(200).json({
        success: true,
        message: "Pago simulado correctamente",
        membresia,
      });
    } else {
      return res
        .status(500)
        .json({ error: "Error al actualizar la membresía" });
    }
  } catch (error) {
    console.error("❌ Error al simular pago:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ error: "Error al simular pago" });
  }
};

// Verificar y activar membresía del usuario autenticado basado en sus pagos recientes
const checkAndActivateMembership = async (req, res) => {
  try {
    const userId = req.user._id;
    
    console.log("=== VERIFICACIÓN DE MEMBRESÍA ===");
    console.log("Buscando pagos aprobados para userId:", userId);

    // Buscar todos los pagos del usuario usando la API de búsqueda de Mercado Pago
    const payment = new mercadopago.Payment(client);
    
    // Buscar pagos con external_reference = userId
    const searchParams = {
      external_reference: userId.toString(),
      status: "approved",
      sort: "date_created",
      criteria: "desc",
      range: "date_created",
      begin_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Últimos 30 días
      end_date: new Date().toISOString(),
    };

    // Usar la API de search
    const searchResults = await payment.search({ options: searchParams });

    console.log("Pagos encontrados:", searchResults.results?.length || 0);

    if (searchResults.results && searchResults.results.length > 0) {
      // Tomar el pago más reciente aprobado
      const latestPayment = searchResults.results[0];
      
      console.log("Pago aprobado encontrado:", latestPayment.id);
      console.log("Estado:", latestPayment.status);

      // Activar membresía
      const membresia = await Membresia.findOneAndUpdate(
        { userId },
        {
          estado: "activa",
          fechaActivacion: new Date(),
          fechaVencimiento: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ),
          mercadoPagoPaymentId: latestPayment.id.toString(),
        },
        { new: true, upsert: true }
      );

      console.log("✅ Membresía activada exitosamente");

      return res.status(200).json({
        success: true,
        message: "Membresía activada correctamente",
        membresia,
        payment: {
          id: latestPayment.id,
          status: latestPayment.status,
          date_created: latestPayment.date_created,
        },
      });
    } else {
      console.log("⚠️ No se encontraron pagos aprobados");
      return res.status(404).json({
        success: false,
        message: "No se encontraron pagos aprobados para este usuario",
      });
    }
  } catch (error) {
    console.error("❌ Error al verificar membresía:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({
      error: "Error al verificar membresía",
      details: error.message,
    });
  }
};

module.exports = {
  handleSubscription,
  verifyPayment,
  handleWebhook,
  simulatePagoAprobado,
  checkAndActivateMembership,
};
