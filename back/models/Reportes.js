const mongoose = require('mongoose');

const reporteSchema = new mongoose.Schema({
    adminId: { type: String, required: true },
    tipo: { type: String, required: true },
    descripcion: { type: String },
    estado: { type: String, default: 'pendiente' },
    nombreAdmin: { type: String },
    emailAdmin: { type: String },
    oculto: { type: Boolean, default: false },
    fechaCreacion: { type: Date, default: Date.now },
    ultimaActualizacion: { type: Date }
});

module.exports = mongoose.model('Reporte', reporteSchema);