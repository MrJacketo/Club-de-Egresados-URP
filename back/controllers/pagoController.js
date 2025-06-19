//import { MercadoPagoConfig, Payment, PreApproval } from "mercadopago";
//import Usuario from "../models/User.js";
const Membresia = require("../models/Membresia.js");
const mercadopago = require("mercadopago");

const config = new mercadopago.MercadoPagoConfig({
    accessToken: "APP_USR-7882162770540444-050618-87ccb203c08fabd550b498e4ccb6ae72-2428020760", //test access token from Vendedor
    
});

const handleSubscription = async (req, res) => {

    try {
      /*/ PARA DATOS REALES DEL USER
      const { firebaseUid } = req.user;
      const usuario = await Usuario.findOne({ firebaseUid });

      if (!usuario || !usuario.email) {
        return res.status(404).json({ error: "Usuario no encontrado o sin email" });
      }
      /*/
        const preApproval = new mercadopago.PreApproval(config);
        const newSubscriber = await preApproval.create({
            body: {
                payer_email: "test_user_1757711752@testuser.com",//usuario.email, PARA DATOS REALES | CAMBIAR TEST PARA LOCAL
                auto_recurring: {
                    frequency: 12,
                    frequency_type: "months",
                    transaction_amount: 150,
                    currency_id: "PEN"
                },                reason: "Subscripcion anual",
                back_url: "https://1f8f-38-25-16-212.ngrok-free.app/MembresiaCompletada", // USADO ANTES CON LOCAL TUNNEL, VOLATIL
                notification_url: "https://3e24-38-25-16-212.ngrok-free.app/api/pago/webhook", //NGROK, VOLATIL VERIFICAR EN WEBHOOK DEL VENDEDOR
                external_reference: req.user.firebaseUid 
            }
        });

        console.log("Respuesta de MercadoPago:", newSubscriber);
        res.status(200).json({ init_point: newSubscriber.init_point });
    } catch (error) {
        console.error("Error al crear suscripción:", error);
        res.status(500).json({ error: "Error al crear suscripción" });
    }
};


const handleWebhook = async (req, res) => {
  const event = req.body;

  try {
    switch (event.action) {
      case "payment.created":
        console.log("Pago creado");
        const paymentId = event.data.id;

        const payment = new mercadopago.Payment(config);
        const paymentData = await payment.get({ id: paymentId });
        const externalReference = paymentData.external_reference; // el firebaseUid
        const status = paymentData.status;

        if (status === "approved" && externalReference) {
          const membresia = await Membresia.findOneAndUpdate(
            { firebaseUid: externalReference },
            {
              estado: "activa",
              fechaActivacion: new Date(),
              fechaVencimiento: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            },
            { new: true, upsert: true }
          );

          if (membresia) {
            console.log("Membresía activada para el usuario con UID:", externalReference);
          }
          else {
            console.log("Pago no aprobado o no se encontro la membresia");
          } 
        }
        break;
        /*/
        Ver casos Preapproval updated
        /*/
      default:
        break;
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
    const { firebaseUid } = req.user;
    
    if (!firebaseUid) {
      return res.status(400).json({ error: "Se requiere firebaseUid" });
    }

    // Actualizar o crear la membresía
    const membresia = await Membresia.findOneAndUpdate(
      { firebaseUid },
      {
        estado: "activa",
        fechaActivacion: new Date(),
        fechaVencimiento: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      },
      { new: true, upsert: true }
    );

    if (membresia) {
      console.log("Membresía activada para el usuario con UID:", firebaseUid);
      return res.status(200).json({ 
        success: true, 
        message: "Pago simulado correctamente",
        membresia 
      });
    } else {
      return res.status(500).json({ error: "Error al actualizar la membresía" });
    }
  } catch (error) {
    console.error("Error al simular pago:", error);
    res.status(500).json({ error: "Error al simular pago" });
  }
};

module.exports = {
  handleSubscription,
  handleWebhook,
  simulatePagoAprobado
};