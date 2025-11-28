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

const publicacionSchema = new mongoose.Schema({
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  titulo: {
    type: String,
    trim: true,
    default: ''
  },
  contenido: {
    type: String,
    required: true,
    trim: true
  },
  categoria: {
    type: String,
    default: 'General'
  },
  etiquetas: [{
    type: String,
    trim: true
  }],
  imagen: {
    type: String,
    default: null
  },
  video: {
    type: String,
    default: null
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comentarios: [comentarioSchema],
  vistas: {
    type: Number,
    default: 0
  },
  oculto: {
    type: Boolean,
    default: false
  },
  estado: {
    type: String,
    enum: ['activo', 'aprobado', 'eliminado'],
    default: 'activo'
  },
  moderadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  fechaModeracion: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Métodos del modelo
publicacionSchema.methods.agregarComentario = function(usuarioId, contenido) {
  this.comentarios.push({
    autor: usuarioId,
    contenido: contenido
  });
  return this.save();
};

publicacionSchema.methods.agregarLike = function(usuarioId) {
  if (!this.likes.includes(usuarioId)) {
    this.likes.push(usuarioId);
  }
  return this.save();
};

publicacionSchema.methods.quitarLike = function(usuarioId) {
  this.likes = this.likes.filter(like => like.toString() !== usuarioId.toString());
  return this.save();
};

publicacionSchema.methods.incrementarVistas = function() {
  this.vistas += 1;
  return this.save();
};

module.exports = mongoose.model('Publicacion', publicacionSchema);