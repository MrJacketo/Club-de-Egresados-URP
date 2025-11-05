// src/components/ModeracionForo/ListaPosts.jsx
import React from 'react';
import { Edit3, EyeOff, Filter } from 'lucide-react';

const ListaPosts = ({ 
  posts, 
  filtroEstado, 
  onAbrirModal, 
  onOcultarPost,
  onLimpiarFiltros 
}) => {
  const getTituloSeccion = () => {
    if (filtroEstado === 'pendiente') return 'Posts Pendientes';
    if (filtroEstado === 'oculto') return 'Posts Ocultos';
    return 'Todos los Posts';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <span className="text-blue-500 mr-3">📝</span>
        {getTituloSeccion()} ({posts.length})
      </h2>
      
      <div className="space-y-4">
        {posts.map((post) => (
          <div 
            key={post.id}
            className={`p-4 bg-white rounded-lg border ${
              post.oculto ? 'border-gray-300 bg-gray-50' :
              post.reportes > 3 ? 'border-red-200 hover:border-red-300' : 
              post.reportes > 0 ? 'border-yellow-200 hover:border-yellow-300' : 
              'border-gray-200 hover:border-blue-300'
            } transition-colors`}
          >
            <div className="mb-3">
              <p className="font-medium text-gray-800">"{post.titulo}"</p>
              <p className="text-sm text-gray-600">{post.autor} • {post.fecha}</p>
              {post.oculto && (
                <span className="text-xs font-medium px-2 py-1 rounded text-gray-500 bg-gray-200">
                  👁️ Oculto
                </span>
              )}
              {!post.oculto && post.reportes > 0 && (
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  post.reportes > 3 ? 'text-red-500 bg-red-50' : 'text-yellow-600 bg-yellow-50'
                }`}>
                  {post.reportes} reporte{post.reportes !== 1 ? 's' : ''}
                  {post.reportes <= 1 && ' • Posible spam'}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => onAbrirModal(post)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105"
                style={{ background: '#00C853', border: 'none' }}
              >
                <Edit3 className="w-4 h-4" style={{ color: '#fff' }} />
                <span className="text-white text-xs font-bold">Revisar</span>
              </button>
              {!post.oculto && (
                <button 
                  onClick={() => onOcultarPost(post.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105"
                  style={{ background: '#6b7280', border: 'none' }}
                >
                  <EyeOff className="w-4 h-4" style={{ color: '#fff' }} />
                  <span className="text-white text-xs font-bold">Ocultar</span>
                </button>
              )}
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Filter className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>
              {filtroEstado === 'pendiente' ? 'No hay posts pendientes' : 
                filtroEstado === 'oculto' ? 'No hay posts ocultos' : 
                'No se encontraron posts'}
            </p>
            <button 
              onClick={onLimpiarFiltros}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105"
              style={{ background: '#00C853', border: 'none' }}
            >
              <span className="text-white text-xs font-bold">Limpiar Filtros</span>
              
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaPosts;