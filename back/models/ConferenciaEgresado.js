const mongoose = require("mongoose");

const conferenciaEgresadoSchema = new mongoose.Schema({
  conferencia_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conferencia',
    required: true
  },
  egresado_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fecha_inscripcion: {
    type: Date,
    default: Date.now,
    required: true
  },
  estado_inscripcion: {
    type: String,
    enum: ["inscrito", "confirmado", "asistio", "no_asistio", "cancelado"],
    default: "inscrito",
    required: true
  },
  codigo_acceso: {
    type: String,
    trim: true,
    default: ""
  },
  notas: {
    type: String,
    trim: true,
    default: ""
  },
  asistencia_confirmada: {
    type: Boolean,
    default: false
  },
  certificado_generado: {
    type: Boolean,
    default: false
  },
  calificacion: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  comentario: {
    type: String,
    trim: true,
    default: ""
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Índice compuesto para evitar inscripciones duplicadas
conferenciaEgresadoSchema.index({ conferencia_id: 1, egresado_id: 1 }, { unique: true });

// Middleware para actualizar updatedAt
conferenciaEgresadoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("ConferenciaEgresado", conferenciaEgresadoSchema);