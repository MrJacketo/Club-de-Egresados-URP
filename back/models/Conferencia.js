const mongoose = require("mongoose");

const conferenciaSchema = new mongoose.Schema({
  titulo: { 
    type: String, 
    required: true,
    trim: true
  },
  descripcion: { 
    type: String, 
    required: true,
    trim: true
  },
  ponente: {
    type: String,
    required: true,
    trim: true
  },
  fecha_evento: { 
    type: Date, 
    required: true
  },
  hora_inicio: { 
    type: String, // Formato "HH:mm" ej: "18:30"
    required: true,
    trim: true
  },
  duracion_horas: {
    type: Number,
    required: true,
    default: 2
  },
  modalidad: {
    type: String,
    enum: ["virtual", "presencial", "hibrida"],
    required: true,
    default: "virtual"
  },
  plataforma: {
    type: String,
    trim: true,
    default: "Zoom"
  },
  enlace_acceso: {
    type: String,
    trim: true,
    default: ""
  },
  fecha_inscripcion_fin: {
    type: Date,
    required: true
  },
  cupos_disponibles: {
    type: Number,
    default: null // null = ilimitado
  },
  estado: {
    type: String,
    enum: ["programada", "en_curso", "finalizada", "cancelada"],
    required: true,
    default: "programada"
  },
  destacado: {
    type: Boolean,
    default: false
  },
  imagen_conferencia: {
    type: String,
    trim: true,
    default: ""
  },
  categoria: {
    type: String,
    enum: ["academico", "profesional", "tecnologia", "emprendimiento", "otro"],
    default: "academico"
  },
  requisitos: {
    type: String,
    trim: true,
    default: ""
  },
  materiales_adicionales: {
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

// Middleware para actualizar updatedAt
conferenciaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual para obtener el número de inscritos
conferenciaSchema.virtual('inscritos', {
  ref: 'ConferenciaEgresado',
  localField: '_id',
  foreignField: 'conferencia_id',
  count: true
});

module.exports = mongoose.model("Conferencia", conferenciaSchema);