const mongoose = require("mongoose");

const noticiaSchema = new mongoose.Schema({
  titulo: { 
    type: String, 
    required: true 
  },
  contenido: { 
    type: String, 
    required: true 
  },
  resumen: { 
    type: String, 
    default: "" 
  },
  autor: { 
    type: String, 
    default: "Administrador" 
  },
  categoria: { 
    type: String, 
    enum: ['general', 'economia', 'tecnologia', 'deportes', 'salud'],
    default: 'general' 
  },
  imagen: { 
    type: String, 
    default: "" 
  },
  activo: { 
    type: Boolean, 
    default: true 
  },
  destacado: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("Noticia", noticiaSchema);