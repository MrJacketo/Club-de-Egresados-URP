// back/models/ReporteForo.js
const mongoose = require('mongoose');

const reporteForoSchema = new mongoose.Schema({
    // Información del reporte
    publicacionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Publicacion', 
        required: true 
    },
    autorPublicacion: { type: String, required: true },
    titulo: { type: String, required: true },
    contenido: { type: String, required: true },
    
    // Usuario que reporta
    reportadoPor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    nombreReportador: { type: String, required: true },
    
    // Detalles del reporte
    tipoViolacion: { 
        type: String, 
        enum: ['Spam', 'Contenido Inapropiado', 'Información Falsa', 'Acoso', 'Otros'],
        required: true 
    },
    razon: { type: String, required: true },
    
    // Estado del reporte
    estado: { 
        type: String, 
        enum: ['pendiente', 'revisado', 'resuelto', 'ignorado'],
        default: 'pendiente' 
    },
    oculto: { type: Boolean, default: false },
    
    // Información temporal
    fechaReporte: { type: Date, default: Date.now },
    fechaRevision: { type: Date },
    
    // Acción tomada por moderador
    accionModerador: {
        tipo: { 
            type: String, 
            enum: ['ninguna', 'advertencia', 'eliminacion', 'ban_temporal', 'ban_permanente']
        },
        motivo: { type: String },
        moderadorId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        },
        nombreModerador: { type: String }
    }
}, {
    timestamps: true
});

// Índices para optimizar consultas
reporteForoSchema.index({ publicacionId: 1 });
reporteForoSchema.index({ reportadoPor: 1 });
reporteForoSchema.index({ estado: 1 });
reporteForoSchema.index({ fechaReporte: -1 });

module.exports = mongoose.model('ReporteForo', reporteForoSchema);