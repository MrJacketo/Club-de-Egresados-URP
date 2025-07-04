const mongoose = require('mongoose');
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  nombreUsuario: { type: String, trim: true },
  emailUsuario: { type: String, trim: true },
  beneficioDeseado: { type: String, required: true, trim: true },
  comentariosAdicionales: { type: String, default: '', trim: true },
  estado: { type: String, enum: ['pendiente', 'revisado', 'rechazado'], default: 'pendiente' },
  prioridad: { type: String, enum: ['alta', 'media', 'baja'], default: 'media' },
  respuestaAdministrador: { type: String, default: '' },
  /*
Campo oculto el administrador pueda ocultar un feedback que considere irrelevante
  */
  oculto: { type: Boolean, default: false },
  fechaCreacion: { type: Date, default: Date.now },
  ultimaActualizacion: { type: Date, default: Date.now }
});

//  para actualizar  la fecha
feedbackSchema.pre('save', function (next) {
  this.ultimaActualizacion = Date.now();
  next();
});

feedbackSchema.pre('findOneAndUpdate', function (next) {
  this.set({ ultimaActualizacion: Date.now() });
  next();
});

module.exports = mongoose.model('Feedback', feedbackSchema);

