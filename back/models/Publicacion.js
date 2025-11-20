// back/models/Publicacion.js
const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contenido: {
    type: String,
    required: true,
    trim: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});
// Media schema (opcional, guarda url + tipo)
const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  tipo: { type: String, enum: ['imagen', 'video'], required: true }
});


const publicacionSchema = new mongoose.Schema({
  autor: { type: String, required: true }, // puede ser userId o nombre según tu diseño
  contenido: { type: String, required: true },
  fechaCreacion: { type: Date, default: Date.now },
  oculto: { type: Boolean, default: false },
  comentarios: [comentarioSchema],


  // Medios (puedes tener 0..N archivos; cada item con url y tipo)
  medios: [mediaSchema],

  // contador redundante (opcional) para consultas rápidas
  likesCount: { type: Number, default: 0 }
});
publicacionSchema.index({ fechaCreacion: -1 });
module.exports = mongoose.model('Publicacion', publicacionSchema);
