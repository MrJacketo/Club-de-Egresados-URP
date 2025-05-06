const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
  autor: { type: String, required: true },
  contenido: { type: String, required: true },
  fechaCreacion: { type: Date, default: Date.now }
});

const publicacionSchema = new mongoose.Schema({
  autor: { type: String, required: true },
  contenido: { type: String, required: true },
  fechaCreacion: { type: Date, default: Date.now },
  oculto: { type: Boolean, default: false },
  comentarios: [comentarioSchema]
});

module.exports = mongoose.model('Publicacion', publicacionSchema);
