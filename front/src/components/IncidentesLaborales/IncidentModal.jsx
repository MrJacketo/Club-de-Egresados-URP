import React, { useState } from 'react';
import { X, FileText, Download, Calendar, User, AlertTriangle,CheckCircle,Flag,Eye,Save,Hash, Upload, Trash2, Image } from 'lucide-react';

const IncidentModal = ({ isOpen, onClose, incident, onIncidentUpdate }) => {
  // Estado inicial basado en el incidente recibido
  const [status, setStatus] = useState(incident?.estado || 'En revisión');
  const [selectedStatus, setSelectedStatus] = useState(incident?.estado || 'En revisión');
  const [notes, setNotes] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  if (!isOpen || !incident) return null;

  const handleStatusSelection = (newStatus) => {
    setSelectedStatus(newStatus);
  };

  // Funciones para manejar archivos
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        const newFile = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
          uploadDate: new Date().toLocaleDateString('es-PE')
        };
        setUploadedFiles(prev => [...prev, newFile]);
      }
    });
    // Limpiar el input
    event.target.value = '';
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-6 w-6 text-blue-600" />;
    } else if (fileType === 'application/pdf') {
      return <FileText className="h-6 w-6 text-red-600" />;
    }
    return <FileText className="h-6 w-6 text-gray-600" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSave = () => {
    // Actualizar estado local
    setStatus(selectedStatus);
    
    // Crear objeto con los cambios
    const updatedIncident = {
      ...incident,
      estado: selectedStatus,
      notes: notes,
      attachments: uploadedFiles
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

  
  // Mapeo de campos dinámicos con valores por defecto
  const fieldMap = {
    tipo: { alternatives: ['type', 'tipo', 'category', 'categoria'], default: 'Tipo no especificado' },
    reportado_por: { alternatives: ['reporter', 'reportado_por', 'reportedBy', 'usuario'], default: 'Usuario anónimo' },
    numero_reporte: { alternatives: ['reportNumber', 'numero_reporte', 'id'], default: `REP-${Math.floor(100000 + Math.random() * 900000)}` },
    // empresa: { alternatives: ['company', 'empresa', 'department', 'departamento'], default: generarEmpresa(incident?.id) }, // Eliminado campo empresa ficticio
    fecha: { alternatives: ['date', 'fecha', 'createdAt'], default: 'Fecha no disponible' },
    severidad: { alternatives: ['severity', 'gravedad', 'priority', 'complejidad'], default: 'Media' },
    email: { alternatives: ['email', 'correo'], default: 'No especificado' },
    descripcion: { alternatives: ['description', 'descripcion', 'contenido'], default: 'Sin descripción disponible' }
  };

  const getDynamicData = (field) => {
    const fieldConfig = fieldMap[field];
    if (!fieldConfig) return 'No especificado';

    // Buscar en las alternativas
    for (const option of fieldConfig.alternatives) {
      if (incident && incident[option] !== undefined && incident[option] !== null && incident[option] !== '') {
        return incident[option];
      }
    }

    return fieldConfig.default;
  };

  // Configuración de colores para diferentes categorías
  const colorSchemes = {
    status: {
      'en revisión': 'bg-blue-100 text-blue-700 border-blue-200',
      'revisado': 'bg-green-100 text-green-700 border-green-200',
      'oculto': 'bg-gray-100 text-gray-700 border-gray-200',
      default: 'bg-gray-100 text-gray-700 border-gray-200'
    },
    severity: {
      'alta': 'bg-red-100 text-red-700 border-red-200',
      'high': 'bg-red-100 text-red-700 border-red-200',
      'media': 'bg-orange-100 text-orange-700 border-orange-200',
      'medium': 'bg-orange-100 text-orange-700 border-orange-200',
      'baja': 'bg-green-100 text-green-700 border-green-200',
      'low': 'bg-green-100 text-green-700 border-green-200',
      default: 'bg-gray-100 text-gray-700 border-gray-200'
    }
  };

  // Función unificada para obtener colores
  const getColorScheme = (category, value) => {
    const scheme = colorSchemes[category];
    if (!scheme) return colorSchemes.status.default;
    
    const key = value?.toLowerCase();
    return scheme[key] || scheme.default;
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
                {getDynamicData('tipo')}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-green-200 text-sm">Estado actual:</span>
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${getColorScheme('status', status)}`}>
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
        <div className="p-8 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-green-600" />
            Notas del Inspector
          </h3>
          <p className="text-gray-700 mb-4">Notas de investigación, verificaciones de cumplimiento y plan de acción</p>
          <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-32 p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 bg-white text-gray-800 placeholder:text-gray-500"
              placeholder="Registre aquí los hallazgos de la investigación, las verificaciones de cumplimiento y las acciones a seguir"
            />
          </div>
        </div>

          {/* Pruebas de la investigación */}
          <div className="p-8 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Upload size={20} className="text-blue-600" />
              Pruebas de la investigación
            </h3>
            
            {/* Zona de subida de archivos */}
            <div className="mb-6">
              <label 
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-blue-500" />
                  <p className="mb-2 text-sm text-blue-600 font-semibold">
                    <span className="font-semibold">Clic para subir</span> o arrastra y suelta
                  </p>
                  <p className="text-xs text-blue-500">PNG, JPG, JPEG, PDF (Max. 10MB)</p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/png,image/jpg,image/jpeg,application/pdf"
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            {/* Lista de archivos subidos */}
            <div className="space-y-3">
              {uploadedFiles.length > 0 && (
                <h4 className="text-lg font-semibold text-gray-700 mb-3">
                  Archivos adjuntos ({uploadedFiles.length})
                </h4>
              )}
              
              {uploadedFiles.map((file) => (
                <div key={file.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-xl">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">{file.name}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{formatFileSize(file.size)}</span>
                          <span>•</span>
                          <span>Subido el {file.uploadDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.type.startsWith('image/') && (
                        <button
                          onClick={() => window.open(file.url, '_blank')}
                          className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                        >
                          <Eye className="w-4 h-4 inline mr-1" />
                          Ver
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveFile(file.id)}
                        className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 inline mr-1" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {uploadedFiles.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No hay archivos adjuntos aún</p>
                  <p className="text-gray-400 text-xs mt-1">Sube imágenes o documentos como evidencia</p>
                </div>
              )}
            </div>
          </div>

          {/* Resumen del incidente */}
          <div className="p-8 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Flag size={20} className="text-blue-600" />
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
                  <span className={`px-3 py-1 rounded-lg text-sm font-bold border ${getColorScheme('status', status)}`}>
                    {status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="p-8 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <AlertTriangle size={20} className="text-orange-600" />
              Información adicional
            </h3>
            
            {/* Información compacta en una sola fila */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col">
                <span className="font-medium text-gray-700 text-sm mb-1">Gravedad:</span>
                <span className={`px-3 py-2 rounded-lg text-sm font-bold border ${getColorScheme('severity', getDynamicData('severidad'))} w-fit`}>
                  {getDynamicData('severidad')}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="font-medium text-gray-700 text-sm mb-1">Email:</span>
                <span className="text-gray-900 font-semibold text-sm bg-white px-3 py-2 rounded-lg border border-blue-200 shadow-sm">
                  {getDynamicData('email')}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="font-medium text-gray-700 text-sm mb-1">ID del Incidente:</span>
                <span className="text-gray-900 font-semibold text-sm bg-white px-3 py-2 rounded-lg border border-purple-200 font-mono shadow-sm">
                  #{incident.id || 'N/A'}
                </span>
              </div>
            </div>
            
            {/* Descripción completa en su propia sección */}
            <div>
              <span className="font-medium text-gray-700 text-sm mb-2 block">Descripción completa:</span>
              <div className="bg-white border border-orange-200 rounded-lg p-4 shadow-sm">
                <p className="text-gray-900 leading-relaxed text-sm whitespace-pre-wrap">
                  {getDynamicData('descripcion')}
                </p>
              </div>
            </div>
          </div>

          {/* Actualización del estado de la investigación */}
          <div className="p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle size={20} />
              Actualización del estado de la investigación
            </h3>
            <p className="text-gray-600 mb-6">
              Selecciona el nuevo estado del incidente. El estado solo se actualizará cuando hagas clic en "Guardar Cambios".
            </p>
            <div className="flex justify-center gap-4 mb-8">
              {['En revisión', 'Revisado'].map((investStatus) => (
                <button
                  key={investStatus}
                  onClick={() => handleStatusSelection(investStatus)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 min-w-[140px] justify-center ${
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
            <div className={`border rounded-xl p-6 mx-2 ${
              selectedStatus !== status 
                ? 'bg-yellow-50 border-yellow-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
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
                <div className="flex-1">
                  <p className={`font-bold text-base ${
                    selectedStatus !== status ? 'text-yellow-800' : 'text-green-800'
                  }`}>
                    {selectedStatus !== status ? 'Estado pendiente de guardar:' : 'Estado actual:'} {selectedStatus}
                  </p>
                  <p className={`text-sm mt-1 ${
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

          {/* Footer Actions */}
          <div className="p-8 border-t border-gray-200">
            <div className="flex justify-center gap-4 max-w-md mx-auto">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 min-w-[120px]"
              >
                <X size={18} />
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl min-w-[140px]"
              >
                <Save size={18} />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentModal;