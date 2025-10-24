const mongoose = require("mongoose");

const beneficioSchema = new mongoose.Schema({
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
  tipo_beneficio: {
    type: String,
    enum: ["academico", "laboral", "salud", "cultural", "convenio"],
    required: true,
    default: "academico"
  },
  empresa_asociada: {
    type: String,
    trim: true,
    default: ""
  },
  fecha_inicio: { 
    type: Date, 
    required: true 
  },
  fecha_fin: { 
    type: Date
  },
  estado: {
    type: String,
    enum: ["activo", "inactivo"],
    required: true,
    default: "activo"
  },
  url_detalle: {
    type: String,
    trim: true,
    default: ""
  },
  imagen_beneficio: {
    type: String,
    trim: true,
    default: ""
  },
  // Campos heredados del modelo anterior
  categoria: { 
    type: String,
    default: ""
  },
  exclusivo_miembros: { 
    type: Boolean, 
    default: false
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
  timestamps: true // Esto automáticamente maneja createdAt y updatedAt
});

// Middleware para actualizar updatedAt en cada actualización
beneficioSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Beneficio", beneficioSchema);