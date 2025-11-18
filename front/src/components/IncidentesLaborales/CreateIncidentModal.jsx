import React, { useState } from 'react';
import { X, Plus, AlertTriangle, Save, User, Mail, FileText, Calendar } from 'lucide-react';
import { INCIDENT_TYPES, SEVERITY_LEVELS, validateEmail, formatDate } from './incidentUtils';

const CreateIncidentModal = ({ isOpen, onClose, onCreateIncident }) => {
  const [formData, setFormData] = useState({
    tipo: '',
    reportado_por: '',
    email: '',
    descripcion: '',
    complejidad: 'Media',
    fecha: formatDate()
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;



  const validateForm = () => {
    const newErrors = {};

    if (!formData.tipo.trim()) {
      newErrors.tipo = 'El tipo de incidencia es requerido';
    }

    if (!formData.reportado_por.trim()) {
      newErrors.reportado_por = 'El nombre del reportante es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    } else if (formData.descripcion.trim().length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Crear nueva incidencia
    const nuevaIncidencia = {
      ...formData,
      id: Date.now(), // ID temporal
      estado: 'En revisión',
      oculto: false,
      eliminado: false
    };

    onCreateIncident(nuevaIncidencia);
    
    // Resetear formulario
    setFormData({
      tipo: '',
      reportado_por: '',
      email: '',
      descripcion: '',
      complejidad: 'Media',
      fecha: new Date().toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    });
    setErrors({});
    
    alert('✅ Incidencia creada exitosamente');
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      tipo: '',
      reportado_por: '',
      email: '',
      descripcion: '',
      complejidad: 'Media',
      fecha: new Date().toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl shadow-md">
                <Plus size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Crear Nueva Incidencia</h2>
                <p className="text-green-100 mt-1">Registro de nueva incidencia laboral</p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="text-white hover:text-green-200 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] bg-gradient-to-br from-green-50 via-white to-teal-50">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Tipo de Incidencia */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <AlertTriangle size={16} />
                Tipo de Incidencia *
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => handleInputChange('tipo', e.target.value)}
                className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:border-green-500 text-gray-800 ${
                  errors.tipo ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
                }`}
                required
              >
                <option value="">Seleccionar tipo de incidencia</option>
                {INCIDENT_TYPES.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
              {errors.tipo && <p className="text-red-600 text-sm mt-1">{errors.tipo}</p>}
            </div>

            {/* Información del Reportante */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <User size={16} />
                  Reportado por *
                </label>
                <input
                  type="text"
                  value={formData.reportado_por}
                  onChange={(e) => handleInputChange('reportado_por', e.target.value)}
                  placeholder="Nombre completo del reportante"
                  className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:border-green-500 text-gray-800 placeholder:text-gray-500 ${
                    errors.reportado_por ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
                  }`}
                  required
                />
                {errors.reportado_por && <p className="text-red-600 text-sm mt-1">{errors.reportado_por}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Mail size={16} />
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:border-green-500 text-gray-800 placeholder:text-gray-500 ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
                  }`}
                  required
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Complejidad y Fecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Nivel de Complejidad
                </label>
                <select
                  value={formData.complejidad}
                  onChange={(e) => handleInputChange('complejidad', e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:border-green-500 text-gray-800"
                >
                  {SEVERITY_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Fecha
                </label>
                <input
                  type="text"
                  value={formData.fecha}
                  readOnly
                  className="w-full p-4 border-2 border-gray-200 bg-gray-100 rounded-xl text-gray-600"
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FileText size={16} />
                Descripción detallada *
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                placeholder="Describe detalladamente la incidencia laboral..."
                rows={4}
                className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:border-green-500 resize-none text-gray-800 placeholder:text-gray-500 ${
                  errors.descripcion ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
                }`}
                required
              />
              <div className="flex justify-between items-center mt-1">
                {errors.descripcion && <p className="text-red-600 text-sm">{errors.descripcion}</p>}
                <p className="text-gray-500 text-sm ml-auto">
                  {formData.descripcion.length}/500 caracteres
                </p>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mx-2">
              <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                <span className="text-lg">ℹ️</span>
                Información importante
              </h4>
              <ul className="text-blue-700 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>La incidencia será creada con estado "En revisión"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Asegúrate de proporcionar información detallada y precisa</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Podrás actualizar el estado posteriormente desde el panel</span>
                </li>
              </ul>
            </div>
          </form>

          {/* Footer Actions */}
          <div className="p-8 border-t border-gray-200">
            <div className="flex justify-center gap-4 max-w-md mx-auto">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 min-w-[120px]"
              >
                <X size={18} />
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl min-w-[140px]"
              >
                <Save size={18} />
                Crear Incidencia
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateIncidentModal;