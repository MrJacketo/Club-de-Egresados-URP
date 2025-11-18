const mongoose = require('mongoose');

const incidenciaLaboralSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: [true, 'El tipo de incidencia es requerido'],
    enum: {
      values: [
        'Información engañosa',
        'Descripción poco clara',
        'Empresa no verificada',
        'Discriminación',
        'Enlaces rotos',
        'Estafa laboral',
        'Falta de respuesta',
        'Oferta duplicada',
        'Contenido inapropiado',
        'Datos de contacto inválidos',
        'Otras Incidencias'
      ],
      message: 'Tipo de incidencia no válido'
    }
  },
  
  reportado_por: {
    type: String,
    required: [true, 'El nombre del reportante es requerido'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [100, 'El nombre no puede exceder los 100 caracteres']
  },
  
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Formato de email inválido'
    ]
  },
  
  descripcion: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true,
    minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
    maxlength: [1000, 'La descripción no puede exceder los 1000 caracteres']
  },
  
  complejidad: {
    type: String,
    enum: {
      values: ['Baja', 'Media', 'Alta'],
      message: 'La complejidad debe ser Baja, Media o Alta'
    },
    default: 'Media'
  },
  
  estado: {
    type: String,
    enum: {
      values: ['En revisión', 'Revisado'],
      message: 'El estado debe ser "En revisión" o "Revisado"'
    },
    default: 'En revisión'
  },
  
  oculto: {
    type: Boolean,
    default: false
  },
  
  eliminado: {
    type: Boolean,
    default: false
  },
  
  fecha: {
    type: Date,
    default: Date.now
  },
  
  notas_inspector: {
    type: String,
    trim: true,
    maxlength: [2000, 'Las notas no pueden exceder los 2000 caracteres'],
    default: ''
  },
  
  // Referencia a la oferta laboral relacionada (opcional)
  oferta_relacionada: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OfertaLaboral',
    default: null
  },
  
  // Inspector que tiene asignada la incidencia
  inspector_asignado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  // Usuario que creó la incidencia (si está autenticado)
  creado_por: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  fechaActualizacion: {
    type: Date,
    default: Date.now
  },
  
  // Metadatos adicionales
  metadatos: {
    ip_origen: {
      type: String,
      default: null
    },
    user_agent: {
      type: String,
      default: null
    },
    origen_reporte: {
      type: String,
      enum: ['web', 'api', 'admin'],
      default: 'web'
    }
  }
}, {
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Índices para mejorar el rendimiento de las consultas
incidenciaLaboralSchema.index({ tipo: 1 });
incidenciaLaboralSchema.index({ estado: 1 });
incidenciaLaboralSchema.index({ complejidad: 1 });
incidenciaLaboralSchema.index({ fecha: -1 });
incidenciaLaboralSchema.index({ eliminado: 1 });
incidenciaLaboralSchema.index({ oculto: 1 });
incidenciaLaboralSchema.index({ email: 1 });
incidenciaLaboralSchema.index({ createdAt: -1 });

// Índice compuesto para filtros frecuentes
incidenciaLaboralSchema.index({ 
  eliminado: 1, 
  oculto: 1, 
  estado: 1, 
  createdAt: -1 
});

// Índice de texto para búsquedas
incidenciaLaboralSchema.index({
  reportado_por: 'text',
  descripcion: 'text',
  email: 'text',
  tipo: 'text'
});

// Virtual para generar número de reporte
incidenciaLaboralSchema.virtual('numero_reporte').get(function() {
  return `REP-${this._id.toString().slice(-6).toUpperCase()}`;
});

// Virtual para empresa generada (para compatibilidad con frontend)
incidenciaLaboralSchema.virtual('empresa').get(function() {
  const empresas = [
    "Tech Solutions SAC", "DataCorp Perú", "Innova Marketing Group", "Soluciones IT SAC",
    "Global Logistics Corp", "SafeWork Industries", "Quality Assurance Partners", 
    "Operaciones Seguras S.A.", "Manufactura Avanzada Ltda", "Servicios Integrales Corp",
    "Protección Laboral Group", "Gestión de Riesgos S.A.", "Industrial Safety Systems",
    "Workplace Solutions Inc", "Prevención Total SAC"
  ];
  
  // Usar el ID como semilla para consistencia
  const id = parseInt(this._id.toString().slice(-2), 16);
  return empresas[id % empresas.length];
});

// Middleware pre-save para actualizar fechaActualizacion
incidenciaLaboralSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.fechaActualizacion = new Date();
  }
  next();
});

// Middleware pre-update para actualizar fechaActualizacion
incidenciaLaboralSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  this.set({ fechaActualizacion: new Date() });
  next();
});

// Métodos de instancia
incidenciaLaboralSchema.methods.marcarComoRevisado = function(inspectorId, notas) {
  this.estado = 'Revisado';
  this.inspector_asignado = inspectorId;
  if (notas) {
    this.notas_inspector = notas;
  }
  return this.save();
};

incidenciaLaboralSchema.methods.ocultar = function() {
  this.oculto = true;
  return this.save();
};

incidenciaLaboralSchema.methods.mostrar = function() {
  this.oculto = false;
  return this.save();
};

incidenciaLaboralSchema.methods.eliminar = function() {
  this.eliminado = true;
  return this.save();
};

// Métodos estáticos
incidenciaLaboralSchema.statics.findActivas = function() {
  return this.find({ eliminado: false, oculto: false });
};

incidenciaLaboralSchema.statics.findPorEstado = function(estado) {
  return this.find({ estado, eliminado: false });
};

incidenciaLaboralSchema.statics.buscarTexto = function(termino) {
  return this.find(
    { 
      $text: { $search: termino },
      eliminado: false 
    },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
};

const IncidenciaLaboral = mongoose.model('IncidenciaLaboral', incidenciaLaboralSchema);

module.exports = IncidenciaLaboral;