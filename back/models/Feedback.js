const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true 
  },
  nombreUsuario: { 
    type: String, 
    trim: true 
  },
  emailUsuario: { 
    type: String, 
    trim: true 
  },
  beneficioDeseado: { 
    type: String, 
    required: true, 
    trim: true 
  },
  tipoBeneficio: { 
    type: String, 
    trim: true 
  },
  facultad: { 
    type: String, 
    trim: true 
  },
  carrera: { 
    type: String, 
    trim: true 
  },
  fechaPreferida: { 
    type: Date 
  },
  modalidadPreferida: { 
    type: String, 
    trim: true 
  },
  comentariosAdicionales: { 
    type: String, 
    default: '', 
    trim: true 
  },
  estado: { 
    type: String, 
    enum: ['solicitado', 'aprobado', 'rechazado'], 
    default: 'solicitado' 
  },
  prioridad: { 
    type: String, 
    enum: ['alta', 'media', 'baja'], 
    default: 'media' 
  },
  respuestaAdministrador: { 
    type: String, 
    default: '' 
  },
  oculto: { 
    type: Boolean, 
    default: false 
  },
  fechaCreacion: { 
    type: Date, 
    default: Date.now 
  },
  ultimaActualizacion: { 
    type: Date, 
    default: Date.now 
  }
});

// Middleware para actualizar la fecha automáticamente
feedbackSchema.pre('save', function (next) {
  this.ultimaActualizacion = Date.now();
  next();
});

feedbackSchema.pre('findOneAndUpdate', function (next) {
  this.set({ ultimaActualizacion: Date.now() });
  next();
});

module.exports = mongoose.model('Feedback', feedbackSchema);