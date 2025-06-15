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
// Actualizar el estado del feedback
const actualizarFeedback = async (req, res) => {
    const { id } = req.params;
    try {
        const actualizado = await Feedback.findByIdAndUpdate(
            id,
            { ...req.body, ultimaActualizacion: Date.now() },
            { new: true }
        );
        if (!actualizado) return res.status(404).json({ mensaje: "Feedback no encontrado." });
        res.json({ mensaje: "Feedback actualizado.", feedback: actualizado });
    } catch (error) {
        console.error("Error al actualizar:", error);
        res.status(500).json({ mensaje: "Error interno." });
    }
};
// Obtener Feedbacks Públicos los (No ocultos)
const obtenerFeedbacksPublicos = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({
            estado: { $in: ['pendiente', 'revisado'] },
            oculto: false
        });
        res.json(feedbacks);
    } catch (error) {
        console.error("Error al obtener feedbacks públicos:", error);
        res.status(500).json({ mensaje: "Error interno al obtener los feedbacks." });
    }
};
// Ocultar el feedback  solo por el admin
const ocultarFeedback = async (req, res) => {
    const { id } = req.params;
    try {
        const feedback = await Feedback.findByIdAndUpdate(id, { oculto: true, ultimaActualizacion: Date.now() }, { new: true });
        if (!feedback) return res.status(404).json({ mensaje: "Feedback no encontrado." });
        res.json({ mensaje: "Feedback ocultado.", feedback });
    } catch (error) {
        console.error("Error al ocultar:", error);
        res.status(500).json({ mensaje: "Error interno." });
    }
};
module.exports = {
    crearFeedback,
    obtenerFeedbacks,
    actualizarFeedback,
    obtenerFeedbacksPublicos,
    ocultarFeedback
};