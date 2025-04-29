const mongoose = require("mongoose");

const membresiaSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true }, 
  estado: {
    type: String,
    enum: ["activa", "inactiva", "vencida", "pendiente"],
    default: "pendiente",
    required: true,
  },
  fechaActivacion: {
    type: Date,
    default: null, 
  },
  fechaVencimiento: {
    type: Date,
    default: function () {
      if (this.fechaActivacion) {
        const fechaVencimiento = new Date(this.fechaActivacion);
        fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 1); // Membresía anual
        return fechaVencimiento;
      }
      return null;
    },
  },
  beneficios: {
    type: [String],
    default: [
      "Acceso a la bolsa exclusiva de URPex",
      "Conferencias gratuitas",
      "Descuento en diferentes paquetes de cursos",
    ],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Membresia", membresiaSchema);
