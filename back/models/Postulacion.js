const mongoose = require('mongoose');

const PostulacionSchema = new mongoose.Schema({
    ofertaLaboral: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OfertaLaboral',
        required: true,
    },
    perfil: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    correo: {
        type: String,
        required: true,
    },
    numero: {
        type: String,
        required: true,
    },
    cv: {
        type: String,
        required: false,
    },
    fechaPostulacion: {
        type: Date,
        default: Date.now,
    },
    apto: {
        type: Boolean,
        default: true
    }

});

const Postulacion = mongoose.model('Postulacion', PostulacionSchema);
module.exports = Postulacion;
