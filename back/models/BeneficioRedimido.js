const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const beneficioRedimidoSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Changed from firebaseUid
  beneficioId: {
    type: Schema.Types.ObjectId,
    ref: "Beneficio", // <- IMPORTANTE: esto debe coincidir con el nombre del modelo
    required: true,
  },
  fecha_redencion: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BeneficioRedimido", beneficioRedimidoSchema);