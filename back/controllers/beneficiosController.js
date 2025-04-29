const Feedback = require('../models/Feedback'); 


const crearFeedback = async (req, res) => {
    const { userId, beneficioDeseado, comentariosAdicionales, prioridad, estado, nombreUsuario, emailUsuario } = req.body;

    
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
        return res.status(400).json({ mensaje: "El userId es requerido y debe ser válido." });
    }

    if (!beneficioDeseado || typeof beneficioDeseado !== 'string' || beneficioDeseado.trim().length < 5) {
        return res.status(400).json({ mensaje: "El beneficio deseado debe tener al menos 5 caracteres." });
    }

    if (comentariosAdicionales && comentariosAdicionales.length > 300) {
        return res.status(400).json({ mensaje: "Los comentarios no pueden superar los 300 caracteres." });
    }

    try {
        const nuevoFeedback = new Feedback({
            userId: userId.trim(),
            beneficioDeseado: beneficioDeseado.trim(),
            comentariosAdicionales: comentariosAdicionales ? comentariosAdicionales.trim() : '',
            prioridad: prioridad || 'media',
            estado: estado || 'pendiente',
            nombreUsuario: nombreUsuario ? nombreUsuario.trim() : '',
            emailUsuario: emailUsuario ? emailUsuario.trim() : ''
        });

        const feedbackGuardado = await nuevoFeedback.save();
        res.status(201).json({ mensaje: "Feedback guardado exitosamente.", feedback: feedbackGuardado });
    } catch (error) {
        console.error("Error al guardar feedback:", error);
        res.status(500).json({ mensaje: "Error interno al guardar el feedback." });
    }
};


const obtenerFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.json(feedbacks);
    } catch (error) {
        console.error("Error al obtener feedbacks:", error);
        res.status(500).json({ mensaje: "Error interno al obtener los feedbacks." });
    }
};

module.exports = {
    crearFeedback,
    obtenerFeedbacks
};