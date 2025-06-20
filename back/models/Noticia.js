const mongoose = require('mongoose');

const noticiaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    contenido: {
        type: String,
        required: true
    },
    resumen: {
        type: String,
        trim: true,
        maxlength: 500
    },
    autor: {
        type: String,
        trim: true
    },
    categoria: {
        type: String,
        required: true,
        trim: true,
        enum: ['Deportes', 'Tecnología', 'Política', 'Entretenimiento', 'Salud', 'Educación', 'Economía', 'Ciencia', 'Cultura', 'Otros']
    },
    imagen: {
        type: String,
        trim: true
    },
    destacado: {
        type: Boolean,
        default: false
    },
    activo: {
        type: Boolean,
        default: true
    },
    fechaPublicacion: {
        type: Date,
        default: Date.now
    },
    vistas: {
        type: Number,
        default: 0
    },
    // Campos de auditoría
    creadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    modificadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true // Esto agrega createdAt y updatedAt automáticamente
});

// Índices para optimizar consultas
noticiaSchema.index({ activo: 1, destacado: 1 });
noticiaSchema.index({ categoria: 1, activo: 1 });
noticiaSchema.index({ fechaPublicacion: -1 });
noticiaSchema.index({ createdAt: -1 });
noticiaSchema.index({ vistas: -1 });

// Middleware para incrementar vistas automáticamente
noticiaSchema.methods.incrementarVistas = function() {
    this.vistas += 1;
    return this.save();
};

// Virtual para calcular caracteres del contenido
noticiaSchema.virtual('caracteresContenido').get(function() {
    return this.contenido ? this.contenido.length : 0;
});

// Asegurar que los virtuals se incluyan en JSON
noticiaSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Noticia', noticiaSchema);