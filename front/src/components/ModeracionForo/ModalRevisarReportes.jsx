// src/components/ModeracionForo/ModalRevisarReportes.jsx
import React, { useState } from 'react';
import { X, AlertTriangle, User, Calendar, ExternalLink, Ban, Trash2, EyeOff, MessageSquare } from 'lucide-react';

const ModalRevisarReportes = ({ 
  isOpen, 
  onClose, 
  reporte = null,
  onResolver,
  onIgnorar,
  onBanear,
  onEliminarContenido
}) => {
  const [acciones, setAcciones] = useState({
    eliminarContenido: false,
    banearUsuario: true,
    advertirUsuario: false,
    ignorarReporte: false,
    moverRevisionManual: false
  });
  const [notas, setNotas] = useState('');

  if (!isOpen || !reporte) return null;

  // Datos por defecto para evitar errores
  const reporteData = {
    id: reporte?.id || 0,
    tipoViolacion: reporte?.tipoViolacion || "Sin especificar",
    reportadoPor: reporte?.reportadoPor || "Usuario desconocido",
    fechaReporte: reporte?.fechaReporte || "Fecha no disponible",
    razon: reporte?.razon || "Razón no especificada",
    contenido: {
      autor: reporte?.autor || "Usuario anónimo",
      tiempo: reporte?.fecha || "Tiempo no disponible",
      mensaje: reporte?.contenido || "Contenido no disponible"
    }
  };

  const handleAccionChange = (accion) => {
    setAcciones(prev => ({
      ...prev,
      [accion]: !prev[accion]
    }));
  };

  const handleResolver = () => {
    const accionesSeleccionadas = Object.entries(acciones)
      .filter(([_, seleccionada]) => seleccionada)
      .map(([accion]) => accion);

    if (onResolver) {
      onResolver(reporteData.id, accionesSeleccionadas, notas);
    }
    onClose();
  };

  const handleIgnorar = () => {
    if (onIgnorar) {
      onIgnorar(reporteData.id, notas);
    }
    onClose();
  };

  // Función segura para obtener la inicial del autor
  const getInicialAutor = () => {
    if (!reporteData.contenido.autor) return '?';
    return reporteData.contenido.autor.charAt(0).toUpperCase();
  };

  return (
    <div className="fixed! inset-0! backdrop-blur-sm! bg-black/20! flex! items-center! justify-center! z-50! p-4!">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        
        {/* Header del Modal */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Revisar Reporte #{reporteData.id}</h2>
              <p className="text-green-100 mt-1">Moderación del Foro</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-green-100 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-20"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Información del Reporte */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-semibold text-red-700">Tipo de Violación</p>
                    <p className="text-lg font-bold text-red-800">{reporteData.tipoViolacion}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <User className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-semibold text-blue-700">Reportado por</p>
                    <p className="text-lg font-bold text-blue-800">{reporteData.reportadoPor}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-semibold text-gray-700">Fecha del Reporte</p>
                    <p className="text-lg font-bold text-gray-800">{reporteData.fechaReporte}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Razón del Reporte
                </h3>
                <p className="text-yellow-700 text-sm leading-relaxed">
                  {reporteData.razon}
                </p>
              </div>
            </div>
          </div>

          {/* Acciones de Moderación */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones de Moderación</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={acciones.eliminarContenido}
                    onChange={() => handleAccionChange('eliminarContenido')}
                    className="w-4 h-4 text-green-500 rounded focus:ring-green-500"
                  />
                  <Trash2 className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-700">Eliminar Contenido</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={acciones.banearUsuario}
                    onChange={() => handleAccionChange('banearUsuario')}
                    className="w-4 h-4 text-green-500 rounded focus:ring-green-500"
                  />
                  <Ban className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-gray-700">Banear Usuario</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={acciones.advertirUsuario}
                    onChange={() => handleAccionChange('advertirUsuario')}
                    className="w-4 h-4 text-green-500 rounded focus:ring-green-500"
                  />
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-gray-700">Advertir Usuario</span>
                </label>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={acciones.ignorarReporte}
                    onChange={() => handleAccionChange('ignorarReporte')}
                    className="w-4 h-4 text-green-500 rounded focus:ring-green-500"
                  />
                  <EyeOff className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-700">Ignorar Reporte</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={acciones.moverRevisionManual}
                    onChange={() => handleAccionChange('moverRevisionManual')}
                    className="w-4 h-4 text-green-500 rounded focus:ring-green-500"
                  />
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-700">Mover a Revisión Manual</span>
                </label>
              </div>
            </div>
          </div>

          {/* Notas del Moderador */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Notas del Moderador</h3>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Añade notas internas sobre esta acción..."
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white resize-none"
            />
          </div>

          {/* Contenido Reportado */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contenido Reportado</h3>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {getInicialAutor()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{reporteData.contenido.autor}</p>
                  <p className="text-sm text-gray-500">{reporteData.contenido.tiempo}</p>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">{reporteData.contenido.mensaje}</p>
                
                {/* Detectar y resaltar enlaces */}
                {reporteData.contenido.mensaje && reporteData.contenido.mensaje.includes('http') && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-700 font-medium">Enlace externo detectado</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-white-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Cancelar
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={handleIgnorar}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Ignorar Reporte
            </button>
            
            <button
              onClick={handleResolver}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:shadow-md transition-all duration-300 font-medium"
            >
              Resolver Reporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalRevisarReportes;