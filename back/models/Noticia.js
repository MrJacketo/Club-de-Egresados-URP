const mongoose = require("mongoose");

const noticiaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      maxlength: [200, "El título no puede exceder 200 caracteres"]
    },
    categoria: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      enum: ["General", "Economia", "Tecnologia", "Deportes", "Salud", "Logros", "Academico"],
      message: "Categoría no válida"
    },
    tipoContenido: {
      type: String,
      required: [true, "El tipo de contenido es obligatorio"],
      enum: ["Imagen", "Documento", "Contenido Web","PDF"],
      default: "Imagen"
    },
    fechaPublicacion: {
      type: Date,
      required: [true, "La fecha de publicación es obligatoria"],
      default: Date.now
    },
    destacada: {
      type: Boolean,
      default: false
    },
   
    contenido: {
      type: String,
      required: [true, "El contenido es obligatorio"],
      trim: true
    },
    
    resumen: {
      type: String,
      default: function() {
        return this.contenido ? this.contenido.substring(0, 150) + '...' : '';
      }
    },
    imagen: {
      type: String,
      default: "default-news.jpg" // CAMBIO IMPORTANTE: valor por defecto
    },
    estado: {
      type: String,
      default: "Normal",
      enum: ["Destacado", "Normal"]
    },
    activa: {
      type: Boolean,
      default: true
    },
    vistas: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Índices para mejorar rendimiento
noticiaSchema.index({ titulo: "text", contenido: "text", resumen: "text" });
noticiaSchema.index({ categoria: 1 });
noticiaSchema.index({ estado: 1 });
noticiaSchema.index({ fechaPublicacion: -1 });
noticiaSchema.index({ activa: 1 });
noticiaSchema.index({ destacada: 1 });

// Middleware para actualizar estado si es destacada
noticiaSchema.pre('save', function(next) {
  if (this.destacada) {
    this.estado = "Destacado";
  }
  next();
});

const Noticia = mongoose.model("Noticia", noticiaSchema);
module.exports = Noticia;