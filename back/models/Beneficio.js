const mongoose = require("mongoose");

const beneficioSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  tipo: {
    type: String,
    enum: ["descuento", "noticia", "evento"],
    required: true,
  },
  fecha_inicio: { type: Date, required: true },
  fecha_fin: { type: Date, required: true },
  categoria: { type: String, required: true },
  exclusivo_miembros: { type: Boolean, default: false},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Beneficio", beneficioSchema);