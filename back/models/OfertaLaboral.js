const mongoose = require('mongoose');
const { AREAS_LABORALES, TIPOS_CONTRATO, MODALIDAD, REQUISITOS, ESTADO } = require('../enums/OfertaLaboral.enum');


const ofertaLaboralSchema = new mongoose.Schema({
    cargo: {
        type: String,
        required: true
    },
    empresa: {
        type: String,
        required: true
    },
    modalidad: {
        type: String,
        enum: MODALIDAD,
        required: true,
    },
    ubicacion: {
        type: String,
        required: true,
    },
    tipoContrato: {
        type: String,
        enum: TIPOS_CONTRATO,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    requisitos: {
        type: String,
        enum: REQUISITOS,
        default: "Sin experiencia"
    },
    area: {
        type: String,
        enum: AREAS_LABORALES,
    },
    linkEmpresa: {
        type: String,
        required: true,
    },
    salario: {
        type: Number,
        default: 0,
        min: [0, 'El salario no puede ser menor que 0']
    },
    fechaPublicacion: {
        type: Date,
        default: Date.now,
    },
    fechaCierre: {
        type: Date,
        validate: {
            validator: function (v) {
                return v >= this.fechaPublicacion;
            },
            message: 'La fecha de cierre no puede ser anterior a la fecha de publicación',
        },
    },
    estado: {
        type: String,
        enum: ESTADO,
        default: 'Pendiente',
    },
    aprobado: {
        type: Boolean,
        default: false,
        required: true
    },
    moderadorAprobador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    fechaAprobacion: {
        type: Date,
        default: null
    },
    // Campos para bloqueo de oferta individual
    motivoBloqueo: {
        type: String,
        default: null
    },
    fechaBloqueo: {
        type: Date,
        default: null
    },
    inspectorBloqueo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    // Campos para suspensión de empresa
    motivoSuspension: {
        type: String,
        default: null
    },
    fechaSuspension: {
        type: Date,
        default: null
    },
    inspectorSuspension: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
});

const OfertaLaboral = mongoose.model('OfertaLaboral', ofertaLaboralSchema);

module.exports = OfertaLaboral;
