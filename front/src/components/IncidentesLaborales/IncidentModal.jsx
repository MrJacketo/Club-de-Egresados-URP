import React, { useState } from 'react';
import { X, FileText, Download, Calendar, User, AlertTriangle,CheckCircle,Flag,Eye,Save,Hash,Building} from 'lucide-react';

const IncidentModal = ({ isOpen, onClose, incident, onIncidentUpdate }) => {
  // Estado inicial basado en el incidente recibido
  const [status, setStatus] = useState(incident?.estado || 'En revisión');
  const [selectedStatus, setSelectedStatus] = useState(incident?.estado || 'En revisión');
  const [notes, setNotes] = useState('');

  if (!isOpen || !incident) return null;

  const handleStatusSelection = (newStatus) => {
    setSelectedStatus(newStatus);
  };

  const handleSave = () => {
    // Actualizar estado local
    setStatus(selectedStatus);
    
    // Crear objeto con los cambios
    const updatedIncident = {
      ...incident,
      estado: selectedStatus,
      notes: notes
    };
    
    // Llamar a la función de actualización del padre
    if (onIncidentUpdate) {
      onIncidentUpdate(updatedIncident);
    }
    
    console.log('Guardando cambios:', { 
      estado: selectedStatus, 
      notes,
      incidentId: incident.id 
    });
    
    // Mostrar mensaje de éxito
    alert(`✅ Estado actualizado a: ${selectedStatus}\nNotas guardadas correctamente`);
    
    onClose();
  };

  
  const getDynamicData = (field) => {
    const fieldMap = {
      tipo: ['type', 'tipo', 'category', 'categoria'],
      reportado_por: ['reporter', 'reportado_por', 'reportedBy', 'usuario'],
      numero_reporte: ['reportNumber', 'numero_reporte', 'id'],
      empresa: ['company', 'empresa', 'department', 'departamento'],
      fecha: ['date', 'fecha', 'createdAt'],
      severidad: ['severity', 'gravedad', 'priority'],
      email: ['email', 'correo'],
      descripcion: ['description', 'descripcion', 'contenido']
    };

    const fieldOptions = fieldMap[field] || [field];
    
    for (const option of fieldOptions) {
      if (incident[option] !== undefined && incident[option] !== null) {
        return incident[option];
      }
    }

    const defaults = {
      tipo: 'Tipo no especificado',
      reportado_por: 'Usuario anónimo',
      numero_reporte: `REP-${Math.floor(100000 + Math.random() * 900000)}`,
      empresa: generarEmpresa(incident.id), 
      fecha: 'Fecha no disponible',
      severidad: 'Media',
      email: 'No especificado',
      descripcion: 'Sin descripción disponible'
    };

    return defaults[field] || 'No especificado';
  };

  const generarEmpresa = (incidentId) => {
    const empresas = [
      "Tech Solutions SAC",
      "DataCorp Perú", 
      "Innova Marketing Group",
      "Soluciones IT SAC",
      "Global Logistics Corp",
      "SafeWork Industries",
      "Quality Assurance Partners",
      "Operaciones Seguras S.A.",
      "Manufactura Avanzada Ltda",
      "Servicios Integrales Corp",
      "Protección Laboral Group",
      "Gestión de Riesgos S.A.",
      "Industrial Safety Systems",
      "Workplace Solutions Inc",
      "Prevención Total SAC"
    ];
    
    const index = (incidentId - 1) % empresas.length;
    return empresas[index];
  };

  // Función para obtener el color del badge según el estado
  const getStatusColor = (currentStatus) => {
    switch (currentStatus?.toLowerCase()) {
      case 'en revisión': 
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'revisado': 
        return 'bg-green-100 text-green-700 border-green-200';
      default: 
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Función para obtener el color de la severidad
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'alta': 
      case 'high': 
        return 'bg-red-100 text-red-700 border-red-200';
      case 'media': 
      case 'medium': 
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'baja': 
      case 'low': 
        return 'bg-green-100 text-green-700 border-green-200';
      default: 
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Notas del Inspector: {getDynamicData('numero_reporte')}
              </h2>
              <p className="text-green-100 mt-1">
                {getDynamicData('tipo')} - {getDynamicData('empresa')}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-green-200 text-sm">Estado actual:</span>
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(status)}`}>
                  {status}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-green-200 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Notas del Inspector */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText size={20} />
            Notas del Inspector
          </h3>
          <p className="text-gray-600 mb-4">Notas de investigación, verificaciones de cumplimiento y plan de acción</p>
          <div className="border-t border-gray-300 pt-4">
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white bg-gray-50"
              placeholder="Registre aquí los hallazgos de la investigación, las verificaciones de cumplimiento y las acciones a seguir"
           
           />
          </div>
        </div>

          {/* Pruebas de la investigación */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Download size={20} />
              Pruebas de la investigación
            </h3>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Arrastra y suelta archivos o examina</p>
              <p className="text-gray-500 text-sm">PNG, JPG, PDF, DOC</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Evidencia_{getDynamicData('numero_reporte')}.jpg</p>
                  <p className="text-gray-500 text-sm">Subido el {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen del incidente */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Flag size={20} />
              Resumen del incidente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Tipo de Incidente:</span>
                  <span className="text-gray-900 font-semibold">{getDynamicData('tipo')}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Número de reporte:</span>
                  <span className="text-gray-900 font-semibold flex items-center gap-1">
                    <Hash className="w-4 h-4 text-gray-400" />
                    {getDynamicData('numero_reporte')}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Empresa:</span>
                  <span className="text-gray-900 font-semibold flex items-center gap-1">
                    <Building className="w-4 h-4 text-gray-400" />
                    {getDynamicData('empresa')}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Reportado por:</span>
                  <span className="text-gray-900 font-semibold flex items-center gap-1">
                    <User className="w-4 h-4 text-gray-400" />
                    {getDynamicData('reportado_por')}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Fecha:</span>
                  <span className="text-gray-900 font-semibold flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {getDynamicData('fecha')}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Estado:</span>
                  <span className={`px-3 py-1 rounded-lg text-sm font-bold border ${getStatusColor(status)}`}>
                    {status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle size={20} />
              Información adicional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Gravedad:</span>
                  <span className={`px-3 py-1 rounded-lg text-sm font-bold border ${getSeverityColor(getDynamicData('severidad'))}`}>
                    {getDynamicData('severidad')}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="text-gray-900 font-semibold text-sm">
                    {getDynamicData('email')}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Descripción:</span>
                  <span className="text-gray-900 font-semibold text-sm max-w-xs truncate" 
                        title={getDynamicData('descripcion')}>
                    {getDynamicData('descripcion')}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">ID del Incidente:</span>
                  <span className="text-gray-900 font-semibold text-sm">
                    {incident.id || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actualización del estado de la investigación */}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle size={20} />
              Actualización del estado de la investigación
            </h3>
            <p className="text-gray-600 mb-4">
              Selecciona el nuevo estado del incidente. El estado solo se actualizará cuando hagas clic en "Guardar Cambios".
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              {['En revisión', 'Revisado'].map((investStatus) => (
                <button
                  key={investStatus}
                  onClick={() => handleStatusSelection(investStatus)}
                  className={`bg-green-100! hover:bg-green-200! text-gray-700! px-4! py-2! rounded-lg! font-bold! transition-all! duration-300! flex! items-center! gap-2! ${
                    selectedStatus === investStatus
                      ? 'bg-green-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                  }`}
                >
                  {investStatus === 'En revisión' && <Eye size={16} />}
                  {investStatus === 'Revisado' && <CheckCircle size={16} />}
                  {investStatus}
                </button>
              ))}
            </div>
            
            {/* Indicador visual del estado seleccionado */}
            <div className={`border rounded-xl p-4 ${
              selectedStatus !== status 
                ? 'bg-yellow-50 border-yellow-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedStatus !== status 
                    ? 'bg-yellow-100 text-yellow-600' 
                    : 'bg-green-100 text-green-600'
                }`}>
                  {selectedStatus !== status ? (
                    <AlertTriangle className="h-5 w-5" />
                  ) : (
                    <CheckCircle className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className={`font-semibold ${
                    selectedStatus !== status ? 'text-yellow-800' : 'text-green-800'
                  }`}>
                    {selectedStatus !== status ? 'Estado pendiente de guardar:' : 'Estado actual:'} {selectedStatus}
                  </p>
                  <p className={`text-sm ${
                    selectedStatus !== status ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {selectedStatus !== status 
                      ? `⚠️ El estado cambiará a "${selectedStatus}" cuando guardes los cambios`
                      : '✅ El estado está actualizado'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2"
            >
              <X size={18} />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Save size={18} />
              Guardar Cambios {selectedStatus !== status && `(${selectedStatus})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentModal;