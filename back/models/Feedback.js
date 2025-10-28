const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
  autor: {
    type: String,
    required: true
  },
  contenido: {
    type: String,
    required: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

const publicacionSchema = new mongoose.Schema({
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contenido: {
    type: String,
    required: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  oculto: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  },
  comentarios: [comentarioSchema],
  imagen: {
    type: String,
    default: null
  },
  video: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('Publicacion', publicacionSchema);