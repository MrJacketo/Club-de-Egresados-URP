import { MercadoPagoConfig, PreApproval } from "mercadopago";
import Membresia from "../models/Membresia.js";

const config = new MercadoPagoConfig({
    accessToken: "APP_USR-7882162770540444-050618-87ccb203c08fabd550b498e4ccb6ae72-2428020760", //test access token from Vendedor
    
});

export const handleSubscription = async (req, res) => {

    try {
        const preApproval = new PreApproval(config);
        const newSubscriber = await preApproval.create({
            body: {
                payer_email: "test_user_1757711752@testuser.com", //test email from Comprador
                auto_recurring: {
                    frequency: 12,
                    frequency_type: "months",
                    transaction_amount: 5, //cambiar a 150
                    currency_id: "PEN"
                },
                reason: "Subscripcion anual",
                back_url: "https://www.youtube.com/watch?v=-kSAvHlXRUs", // USADO ANTES CON LOCAL TUNNEL, VOLATIL
                status: "pending",
                notification_url: "https://0f6e-2800-200-e6e0-611-5465-7ad6-4263-30f.ngrok-free.app/api/pago/webhook", //NGROK, VOLATIL
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


export const handleWebhook = async (req, res) => {
    const event = req.body;
    console.log("Evento recibido:", event);  // Muestra el evento para depuración
  
    try {
        if (event.type === "subscription_preapproval" && event.action === "updated") {
            const preapprovalId = event.data.id;
        
            const preApproval = new PreApproval(config);
            const subscriptionData = await preApproval.get({ id: preapprovalId });
        
            const firebaseUid = subscriptionData.external_reference;
        
            // Activar membresía como ya haces
            const membresia = await Membresia.findOneAndUpdate(
              { firebaseUid },
              {
                estado: "activa",
                beneficios: [
                  "Acceso a la bolsa exclusiva de URPex",
                  "Conferencias gratuitas",
                  "Descuento en diferentes paquetes de cursos",
                  "Beneficios extra",
                ],
                fechaActivacion: new Date(),
                fechaVencimiento: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
              },
              { new: true, upsert: true }
            );
        
            if (membresia) {
              console.log("Membresía activada para UID:", firebaseUid);
            } else {
              console.log("No se encontró la membresía o no se pudo activar.");
            }
        }
      res.sendStatus(200);
    } catch (error) {
      console.error("Error en webhook:", error);
      res.sendStatus(500);
    }
  };