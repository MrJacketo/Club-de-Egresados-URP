// src/components/ModalRevisarPost.jsx
import React, { useState, useEffect } from 'react';
import { X, Eye, Flag, User, Calendar, MessageCircle, CheckCircle, Ban, AlertTriangle } from 'lucide-react';
import ReactDOM from 'react-dom';

const ModalRevisarPost = ({ 
  isOpen, 
  onClose, 
  post,
  onAprobar,
  onOcultar,
  onEliminar 
}) => {
  const [accion, setAccion] = useState(null);
  const [comentario, setComentario] = useState('');

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
    };
  }, [isOpen]);

  // Resetear estado cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setAccion(null);
      setComentario('');
    }
  }, [isOpen]);

  if (!isOpen || !post) return null;

  const handleAprobar = () => {
    onAprobar(post.id, comentario);
    setComentario('');
    setAccion(null);
    onClose();
  };

  const handleOcultar = () => {
    onOcultar(post.id, comentario);
    setComentario('');
    setAccion(null);
    onClose();
  };

  const handleEliminar = () => {
    onEliminar(post.id, comentario);
    setComentario('');
    setAccion(null);
    onClose();
  };

  const handleCancelarAccion = () => {
    setAccion(null);
  };

  
  return ReactDOM.createPortal(
    <div className="fixed! inset-0! backdrop-blur-sm! bg-black/20! flex! items-center! justify-center! z-50! p-4!">
      {/* Fondo semitransparente */}
      <div 
        className="absolute inset-0  transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Contenido del modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300">
        
        {/* Header del Modal */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">Revisar Publicación</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Información del Post */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{post.autor}</h3>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                    {post.tipo}
                  </span>
                  {post.reportes > 0 && (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Flag className="w-3 h-3" />
                      {post.reportes} reporte{post.reportes !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.fecha}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {post.comentarios} comentario{post.comentarios !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido del Post */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{post.contenido}</p>
            </div>
          </div>

          {/* Comentario del Moderador */}
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Comentario del moderador (opcional)
            </label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Agrega un comentario sobre tu decisión..."
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-colors duration-200"
              rows="4"
            />
          </div>
        </div>

        {/* Acciones del Modal */}
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          {!accion ? (
            <div className="flex flex-wrap gap-3 justify-end">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105 font-medium"
                style={{ background: '#6b7280', border: 'none' }}
              >
                <X className="w-4 h-4" style={{ color: '#fff' }} />
                <span className="text-white text-sm font-bold">Cancelar</span>
              </button>

              <button
                onClick={() => setAccion('eliminar')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105 font-medium"
                style={{ background: '#dc2626', border: 'none' }}
              >
                <Ban className="w-4 h-4" style={{ color: '#fff' }} />
                <span className="text-white text-sm font-bold">Eliminar</span>
              </button>

              <button
                onClick={() => setAccion('ocultar')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105 font-medium"
                style={{ background: '#d97706', border: 'none' }}
              >
                <Eye className="w-4 h-4" style={{ color: '#fff' }} />
                <span className="text-white text-sm font-bold">Ocultar</span>
              </button>

              <button
                onClick={() => setAccion('aprobar')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105 font-medium"
                style={{ background: '#16a34a', border: 'none' }}
              >
                <CheckCircle className="w-4 h-4" style={{ color: '#fff' }} />
                <span className="text-white text-sm font-bold">Aprobar</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Confirmación de acción */}
              <div className="p-4 rounded-lg border-2" style={{ 
                background: accion === 'aprobar' ? '#f0fdf4' : 
                           accion === 'ocultar' ? '#fffbeb' : '#fef2f2',
                borderColor: accion === 'aprobar' ? '#bbf7d0' : 
                            accion === 'ocultar' ? '#fed7aa' : '#fecaca'
              }}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 mt-0.5" style={{ 
                    color: accion === 'aprobar' ? '#16a34a' : 
                          accion === 'ocultar' ? '#d97706' : '#dc2626'
                  }} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {accion === 'aprobar' && 'Confirmar Aprobación'}
                      {accion === 'ocultar' && 'Confirmar Ocultamiento'}
                      {accion === 'eliminar' && 'Confirmar Eliminación'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {accion === 'aprobar' && '¿Estás seguro de que quieres aprobar esta publicación? Esta acción hará que el post sea visible para todos los usuarios.'}
                      {accion === 'ocultar' && '¿Estás seguro de que quieres ocultar esta publicación? Esta acción hará que el post no sea visible para los usuarios.'}
                      {accion === 'eliminar' && '¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer y el post será eliminado permanentemente.'}
                    </p>
                    
                    {/* Comentario adicional para acciones importantes */}
                    {(accion === 'eliminar' || accion === 'ocultar') && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                        <p className="text-sm text-yellow-800 font-medium">
                          <strong>Nota:</strong> {accion === 'eliminar' 
                            ? 'La eliminación es permanente y no se puede revertir.' 
                            : 'Los usuarios no podrán ver este contenido hasta que sea aprobado nuevamente.'}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={handleCancelarAccion}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-md font-medium"
                        style={{ background: '#6b7280', border: 'none' }}
                      >
                        <X className="w-4 h-4" style={{ color: '#fff' }} />
                        <span className="text-white text-sm font-bold">Cancelar</span>
                      </button>
                      
                      <button
                        onClick={
                          accion === 'aprobar' ? handleAprobar :
                          accion === 'ocultar' ? handleOcultar :
                          handleEliminar
                        }
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105 font-medium"
                        style={{ 
                          background: accion === 'aprobar' ? '#16a34a' : 
                                    accion === 'ocultar' ? '#d97706' : '#dc2626', 
                          border: 'none' 
                        }}
                      >
                        {accion === 'aprobar' && <CheckCircle className="w-4 h-4" style={{ color: '#fff' }} />}
                        {accion === 'ocultar' && <Eye className="w-4 h-4" style={{ color: '#fff' }} />}
                        {accion === 'eliminar' && <Ban className="w-4 h-4" style={{ color: '#fff' }} />}
                        <span className="text-white text-sm font-bold">
                          {accion === 'aprobar' ? 'Sí, aprobar' :
                          accion === 'ocultar' ? 'Sí, ocultar' : 'Sí, eliminar'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Botón para volver atrás */}
              <div className="text-center">
                <button
                  onClick={handleCancelarAccion}
                  className="text-sm text-white-500 hover:text-gray-700 underline transition-colors duration-200"
                >
                  ← Volver a las opciones
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body 
  );
};

export default ModalRevisarPost;