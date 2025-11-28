// back/controllers/reporteForoController.js
const ReporteForo = require('../models/ReporteForo');
const Publicacion = require('../models/Publicacion');

// Crear un nuevo reporte de foro
const crearReporteForo = async (req, res) => {
    try {
        const { 
            publicacionId, 
            tipoViolacion, 
            razon 
        } = req.body;

        // Validar que existe la publicación
        const publicacion = await Publicacion.findById(publicacionId).populate('autor', 'name');
        if (!publicacion) {
            return res.status(404).json({ 
                success: false,
                mensaje: "Publicación no encontrada" 
            });
        }

        // Verificar si ya existe un reporte de este usuario para esta publicación
        const reporteExistente = await ReporteForo.findOne({
            publicacionId,
            reportadoPor: req.user.id
        });

        if (reporteExistente) {
            return res.status(400).json({ 
                success: false,
                mensaje: "Ya has reportado esta publicación" 
            });
        }

        const nuevoReporte = new ReporteForo({
            publicacionId,
            autorPublicacion: publicacion.autor.name || 'Usuario desconocido',
            titulo: publicacion.titulo,
            contenido: publicacion.contenido.substring(0, 200) + '...', // Primeros 200 caracteres
            reportadoPor: req.user.id,
            nombreReportador: req.user.name,
            tipoViolacion,
            razon
        });

        const reporteGuardado = await nuevoReporte.save();
        
        res.status(201).json({ 
            success: true,
            mensaje: "Reporte creado exitosamente",
            data: reporteGuardado 
        });
        
    } catch (error) {
        console.error("Error al crear reporte de foro:", error);
        res.status(500).json({ 
            success: false,
            mensaje: "Error interno al crear el reporte",
            error: error.message 
        });
    }
};

// Obtener todos los reportes de foro (para moderadores)
const obtenerReportesForo = async (req, res) => {
    try {
        const { 
            estado = 'pendiente', 
            tipoViolacion,
            page = 1,
            limit = 10,
            ordenar = 'fechaReporte'
        } = req.query;

        const filtros = {};
        
        if (estado && estado !== 'todos') {
            filtros.estado = estado;
        }
        
        if (tipoViolacion && tipoViolacion !== 'todos') {
            filtros.tipoViolacion = tipoViolacion;
        }

        // Para vista de moderación, no mostrar ocultos por defecto
        if (!req.query.incluirOcultos) {
            filtros.oculto = false;
        }

        const skip = (page - 1) * limit;
        const ordenamiento = ordenar === 'fechaReporte' ? { fechaReporte: -1 } : { [ordenar]: -1 };

        const reportes = await ReporteForo.find(filtros)
            .populate('reportadoPor', 'name email')
            .populate('publicacionId', 'titulo fechaCreacion')
            .sort(ordenamiento)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await ReporteForo.countDocuments(filtros);

        res.json({
            success: true,
            data: reportes,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
        
    } catch (error) {
        console.error("Error al obtener reportes de foro:", error);
        res.status(500).json({ 
            success: false,
            mensaje: "Error interno al obtener los reportes",
            error: error.message 
        });
    }
};

// Obtener reporte específico por ID
const obtenerReportePorId = async (req, res) => {
    try {
        const { id } = req.params;

        const reporte = await ReporteForo.findById(id)
            .populate('reportadoPor', 'name email')
            .populate('publicacionId', 'titulo contenido fechaCreacion autor')
            .populate('accionModerador.moderadorId', 'name');

        if (!reporte) {
            return res.status(404).json({ 
                success: false,
                mensaje: "Reporte no encontrado" 
            });
        }

        res.json({
            success: true,
            data: reporte
        });
        
    } catch (error) {
        console.error("Error al obtener reporte:", error);
        res.status(500).json({ 
            success: false,
            mensaje: "Error interno al obtener el reporte",
            error: error.message 
        });
    }
};

// Resolver reporte (acción del moderador)
const resolverReporte = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            tipoAccion, 
            motivo, 
            nuevoEstado = 'resuelto' 
        } = req.body;

        const reporte = await ReporteForo.findById(id);
        if (!reporte) {
            return res.status(404).json({ 
                success: false,
                mensaje: "Reporte no encontrado" 
            });
        }

        // Actualizar el reporte con la acción del moderador
        reporte.estado = nuevoEstado;
        reporte.fechaRevision = new Date();
        reporte.accionModerador = {
            tipo: tipoAccion,
            motivo,
            moderadorId: req.user.id,
            nombreModerador: req.user.name
        };

        await reporte.save();

        // Aquí se podrían implementar las acciones sobre la publicación o usuario
        // según el tipo de acción (eliminar publicación, banear usuario, etc.)

        res.json({
            success: true,
            mensaje: "Reporte resuelto correctamente",
            data: reporte
        });
        
    } catch (error) {
        console.error("Error al resolver reporte:", error);
        res.status(500).json({ 
            success: false,
            mensaje: "Error interno al resolver el reporte",
            error: error.message 
        });
    }
};

// Ocultar reporte
const ocultarReporteForo = async (req, res) => {
    try {
        const { id } = req.params;
        
        const reporte = await ReporteForo.findByIdAndUpdate(
            id,
            { 
                oculto: true, 
                fechaRevision: new Date() 
            },
            { new: true }
        );
        
        if (!reporte) {
            return res.status(404).json({ 
                success: false,
                mensaje: "Reporte no encontrado" 
            });
        }
        
        res.json({ 
            success: true,
            mensaje: "Reporte ocultado correctamente", 
            data: reporte 
        });
        
    } catch (error) {
        console.error("Error al ocultar reporte:", error);
        res.status(500).json({ 
            success: false,
            mensaje: "Error interno al ocultar el reporte",
            error: error.message 
        });
    }
};

// Obtener estadísticas de reportes
const obtenerEstadisticasReportes = async (req, res) => {
    try {
        const totalReportes = await ReporteForo.countDocuments();
        const reportesPendientes = await ReporteForo.countDocuments({ estado: 'pendiente' });
        const reportesResueltos = await ReporteForo.countDocuments({ estado: 'resuelto' });
        const reportesOcultos = await ReporteForo.countDocuments({ oculto: true });

        // Reportes por tipo de violación
        const reportesPorTipo = await ReporteForo.aggregate([
            { $group: { _id: '$tipoViolacion', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Reportes por mes (últimos 6 meses)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const reportesPorMes = await ReporteForo.aggregate([
            { $match: { fechaReporte: { $gte: sixMonthsAgo } } },
            { 
                $group: { 
                    _id: { 
                        año: { $year: '$fechaReporte' },
                        mes: { $month: '$fechaReporte' }
                    }, 
                    count: { $sum: 1 } 
                } 
            },
            { $sort: { '_id.año': 1, '_id.mes': 1 } }
        ]);

        res.json({
            success: true,
            data: {
                totalReportes,
                reportesPendientes,
                reportesResueltos,
                reportesOcultos,
                reportesPorTipo,
                reportesPorMes
            }
        });
        
    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        res.status(500).json({ 
            success: false,
            mensaje: "Error interno al obtener estadísticas",
            error: error.message 
        });
    }
};

module.exports = {
    crearReporteForo,
    obtenerReportesForo,
    obtenerReportePorId,
    resolverReporte,
    ocultarReporteForo,
    obtenerEstadisticasReportes
};