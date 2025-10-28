const mongoose = require("mongoose");

const noticiaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      maxlength: [200, "El título no puede exceder 200 caracteres"],
    },
    autor: {
      type: String,
      required: [true, "El autor es obligatorio"],
      trim: true,
      maxlength: [100, "El autor no puede exceder 100 caracteres"],
    },
    contenido: {
      type: String,
      required: [true, "El contenido es obligatorio"],
      trim: true,
    },
    resumen: {
      type: String,
      required: [true, "El resumen es obligatorio"],
      trim: true,
      maxlength: [300, "El resumen no puede exceder 300 caracteres"],
    },
    categoria: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      enum: {
        values: [
          "Institucional", 
          "Académico", 
          "Investigación", 
          "Extensión Universitaria",
          "Logros", 
          "Estudiantil", 
          "Internacional", 
          "Innovación", 
          "Cultura", 
          "Deportes",
          "General"
        ],
        message: "Categoría no válida",
      },
    },
    imagen: {
      type: String,
      required: [true, "La imagen es obligatoria"],
    },
    fechaPublicacion: {
      type: Date,
      required: true,
      default: Date.now,
    },
    estado: {
      type: String,
      required: true,
      enum: {
        values: ["Destacado", "Normal", "Borrador", "Archivado"],
        message: "Estado no válido",
      },
      default: "Normal",
    },
    activa: {
      type: Boolean,
      default: true,
    },
    vistas: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para mejorar rendimiento
noticiaSchema.index({ titulo: "text", contenido: "text", resumen: "text" });
noticiaSchema.index({ categoria: 1 });
noticiaSchema.index({ estado: 1 });
noticiaSchema.index({ fechaPublicacion: -1 });
noticiaSchema.index({ activa: 1 });

const Noticia = mongoose.model("Noticia", noticiaSchema);
module.exports = Noticia;