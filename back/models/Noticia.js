const mongoose = require("mongoose")

const noticiaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      maxlength: [200, "El título no puede exceder 200 caracteres"],
    },
    contenido: {
      type: String,
      required: [true, "El contenido es obligatorio"],
      trim: true,
    },
    categoria: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      enum: {
        values: ["General", "Economia", "Tecnologia", "Deportes", "Salud", "Academico"],
        message: "Categoría no válida",
      },
    },
    tipoContenido: {
      type: String,
      required: [true, "El tipo de contenido es obligatorio"],
      enum: {
        values: ["Imagen", "Documento", "Contenido Web", "PDF"],
        message: "Tipo de contenido no válido",
      },
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
    fechaPublicacion: {
      type: Date,
      required: true,
      default: Date.now,
    },
    fechaCreacion: {
      type: Date,
      default: Date.now,
    },
    fechaActualizacion: {
      type: Date,
      default: Date.now,
    },
    imagenUrl: {
      type: String,
      default: null,
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
  },
)

// Índices para mejorar rendimiento
noticiaSchema.index({ titulo: "text", contenido: "text" })
noticiaSchema.index({ categoria: 1 })
noticiaSchema.index({ estado: 1 })
noticiaSchema.index({ fechaPublicacion: -1 })
noticiaSchema.index({ activa: 1 })

const Noticia = mongoose.model("Noticia", noticiaSchema)
module.exports = Noticia
