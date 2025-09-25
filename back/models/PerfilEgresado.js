const mongoose = require("mongoose");

const perfilEgresadoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, // Reference to User
  // nombreCompleto, anioEgreso, carrera, gradoAcademico moved to User model
  // experienciaLaboral removed - not needed for profile
  interesesProfesionales: {
    areasInteres: [
      {
        type: String,
        enum: [
          "Innovación y tecnología",
          "Gestión empresarial",
          "Comercio exterior",
          "Educación y formación",
          "Emprendimiento",
          "Proyectos sociales",
        ],
      },
    ],
    modalidad: {
      type: String,
      enum: ["Presencial", "Remoto", "Híbrido"],
    },
    tipoJornada: {
      type: String,
      enum: ["Tiempo completo", "Medio tiempo", "Freelance"],
    },
  },
  habilidades: {
    idiomas: [
      {
        idioma: {
          type: String,
          enum: [
            "Español",
            "Inglés",
            "Portugués",
            "Frances",
            "Italiano",
            "Alemán",
            "Chino",
            "Japonés",
            "Ruso",
          ],
        },
        nivel: {
          type: String,
          enum: ["Básico", "Intermedio", "Avanzado", "Nativo"],
        },
      },
    ],
  },
  ubicacion: {
    distritoResidencia: {
      type: String,
      required: true,
      enum: [
        "Ancón",
        "Ate",
        "Barranco",
        "Breña",
        "Carabayllo",
        "Cercado de Lima",
        "Chaclacayo",
        "Chorrillos",
        "Cieneguilla",
        "Comas",
        "El Agustino",
        "Independencia",
        "Jesús María",
        "La Molina",
        "La Victoria",
        "Lince",
        "Los Olivos",
        "Lurigancho",
        "Lurín",
        "Magdalena del Mar",
        "Miraflores",
        "Pachacámac",
        "Pucusana",
        "Pueblo Libre",
        "Puente Piedra",
        "Punta Hermosa",
        "Punta Negra",
        "Rímac",
        "San Bartolo",
        "San Borja",
        "San Isidro",
        "San Juan de Lurigancho",
        "San Juan de Miraflores",
        "San Luis",
        "San Martín de Porres",
        "San Miguel",
        "Santa Anita",
        "Santa María del Mar",
        "Santa Rosa",
        "Santiago de Surco",
        "Surquillo",
        "Villa El Salvador",
        "Villa María del Triunfo",
      ],
    },
    disponibilidadReubicacion: { type: Boolean },
    disponibilidadViajar: { type: Boolean },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PerfilEgresado", perfilEgresadoSchema);
