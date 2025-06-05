const mongoose = require('mongoose');

const PublicacionOfertasSchema = new mongoose.Schema({
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
    fechaPublicacion: {
        type: Date,
        default: Date.now,
    }
});

const PublicacionOfertas = mongoose.model('PublicacionOfertas', PublicacionOfertasSchema);

module.exports = PublicacionOfertas;
