const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const beneficioRedimidoSchema = new Schema({
  firebaseUid: { type: String, required: true },
  beneficioId: {
    type: Schema.Types.ObjectId,
    ref: "Beneficio", // <- IMPORTANTE: esto debe coincidir con el nombre del modelo
    required: true,
  },
  fecha_redencion: { type: Date, default: Date.now },
  codigo_unico: { type: String },
});

module.exports = mongoose.model("BeneficioRedimido", beneficioRedimidoSchema);