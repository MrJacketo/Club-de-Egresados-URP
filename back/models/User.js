const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: "Anonymous" },
  profilePicture: { type: String, default: "" },
  activo: { type: Boolean, default: true },
  rol: { type: String, enum: ["egresado", "admin", "empresa","moderador","inspector_laboral"], default: "egresado" },
  createdAt: { type: Date, default: Date.now },
  
  // Datos académicos del egresado
  anioEgreso: { 
    type: Number, 
    min: 1950, 
    max: new Date().getFullYear() + 5 // Allow future graduation dates
  },
  carrera: {
    type: String,
    enum: [
      "Administración y Gerencia",
      "Administración de Negocios Globales",
      "Arquitectura",
      "Biología",
      "Contabilidad y Finanzas",
      "Derecho y Ciencia Política",
      "Economía",
      "Ingeniería Civil",
      "Ingeniería Electrónica",
      "Ingeniería Industrial",
      "Ingeniería Informática",
      "Ingeniería Mecatrónica",
      "Marketing Global y Administración Comercial",
      "Medicina Humana",
      "Medicina Veterinaria",
      "Psicología",
      "Traducción e Interpretación",
      "Turismo, Hotelería y Gastronomía",
    ],
  },
  gradoAcademico: {
    type: String,
    enum: ["Egresado", "Bachiller", "Titulado", "Magíster", "Doctorado"],
    default: "Egresado"
  },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with salt rounds of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);