const Reporte = require('../models/Reportes');

// Crear un nuevo reporte de administración
const crearReporte = async (req, res) => {
    const { adminId, tipo, descripcion, estado, nombreAdmin, emailAdmin } = req.body;

    if (!adminId || typeof adminId !== 'string' || adminId.trim().length === 0) {
        return res.status(400).json({ mensaje: "El adminId es requerido y debe ser válido." });
    }

    if (!tipo || typeof tipo !== 'string' || tipo.trim().length < 3) {
        return res.status(400).json({ mensaje: "El tipo de reporte debe tener al menos 3 caracteres." });
    }

    try {
        const nuevoReporte = new Reporte({
            adminId: adminId.trim(),
            tipo: tipo.trim(),
            descripcion: descripcion ? descripcion.trim() : '',
            estado: estado || 'pendiente',
            oculto: false,
            nombreAdmin: nombreAdmin ? nombreAdmin.trim() : '',
            emailAdmin: emailAdmin ? emailAdmin.trim() : ''
        });

        const reporteGuardado = await nuevoReporte.save();
        res.status(201).json({ mensaje: "Reporte guardado exitosamente.", reporte: reporteGuardado });
    } catch (error) {
        console.error("Error al guardar reporte:", error);
        res.status(500).json({ mensaje: "Error interno al guardar el reporte." });
    }
};

// Obtener todos los reportes (admin)
const obtenerReportes = async (req, res) => {
    try {
        const reportes = await Reporte.find();
        res.json(reportes);
    } catch (error) {
        console.error("Error al obtener reportes:", error);
        res.status(500).json({ mensaje: "Error interno al obtener los reportes." });
    }
};

// Actualizar reporte
const actualizarReporte = async (req, res) => {
    const { id } = req.params;
    try {
        const actualizado = await Reporte.findByIdAndUpdate(
            id,
            { ...req.body, ultimaActualizacion: Date.now() },
            { new: true }
        );
        if (!actualizado) return res.status(404).json({ mensaje: "Reporte no encontrado." });
        res.json({ mensaje: "Reporte actualizado.", reporte: actualizado });
    } catch (error) {
        console.error("Error al actualizar reporte:", error);
        res.status(500).json({ mensaje: "Error interno." });
    }
};

// Obtener reportes públicos (no ocultos)
const obtenerReportesPublicos = async (req, res) => {
    try {
        const reportes = await Reporte.find({
            estado: { $in: ['pendiente', 'revisado'] },
            oculto: false
        });
        res.json(reportes);
    } catch (error) {
        console.error("Error al obtener reportes públicos:", error);
        res.status(500).json({ mensaje: "Error interno." });
    }
};

// Ocultar reporte (solo admin)
const ocultarReporte = async (req, res) => {
    const { id } = req.params;
    try {
        const reporte = await Reporte.findByIdAndUpdate(
            id,
            { oculto: true, ultimaActualizacion: Date.now() },
            { new: true }
        );
        if (!reporte) return res.status(404).json({ mensaje: "Reporte no encontrado." });
        res.json({ mensaje: "Reporte ocultado.", reporte });
    } catch (error) {
        console.error("Error al ocultar reporte:", error);
        res.status(500).json({ mensaje: "Error interno." });
    }
};

module.exports = {
    crearReporte,
    obtenerReportes,
    actualizarReporte,
    obtenerReportesPublicos,
    ocultarReporte
};