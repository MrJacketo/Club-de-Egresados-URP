// src/components/ModeracionForo/ListaReportes.jsx
import React from 'react';
import { Edit3, EyeOff, Filter } from 'lucide-react';

const ListaReportes = ({ 
  reportes, 
  filtroEstado, 
  onAbrirModal, 
  onOcultarReporte,
  onLimpiarFiltros 
}) => {
  const getTituloSeccion = () => {
    if (filtroEstado === 'pendiente') return 'Reportes Activos';
    if (filtroEstado === 'oculto') return 'Reportes Ocultos';
    return 'Todos los Reportes';
  };

  const getEstiloReporte = (reporte, index) => {
    if (reporte.oculto) {
      return 'bg-gray-100 border-gray-400';
    }
    
    const estilos = [
      'bg-red-50 border-red-500',
      'bg-yellow-50 border-yellow-500', 
      'bg-orange-50 border-orange-500'
    ];
    return estilos[index % estilos.length];
  };

  const getColorTexto = (reporte, index) => {
    if (reporte.oculto) return '#6b7280';
    
    const colores = ['#dc2626', '#d97706', '#ea580c'];
    return colores[index % colores.length];
  };

  const getColorFondoEtiqueta = (index) => {
    const colores = ['#dc2626', '#d97706', '#ea580c'];
    return colores[index % colores.length];
  };

  const getTextoEtiqueta = (index) => {
    const textos = ['SPAM', 'INAPROPIADO', 'FALSO'];
    return textos[index % textos.length];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <span className="text-red-500 mr-3">🚨</span>
        {getTituloSeccion()} ({reportes.length})
      </h2>
      
      <div className="space-y-4">
        {reportes.map((reporte, index) => (
          <div 
            key={reporte.id}
            className={`p-4 rounded-lg border-l-4 ${getEstiloReporte(reporte, index)} transition-colors`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-800 mb-1">{reporte.titulo}</h3>
                <p className="text-sm text-gray-600">Post #{reporte.id} • {reporte.reportes} reporte{reporte.reportes !== 1 ? 's' : ''}</p>
                <p className="text-xs font-medium" style={{ color: getColorTexto(reporte, index) }}>
                  {reporte.fecha}
                </p>
                {reporte.oculto && (
                  <span className="text-xs font-medium px-2 py-1 rounded text-gray-500 bg-gray-200">
                    👁️ Oculto
                  </span>
                )}
              </div>
              {!reporte.oculto && (
                <span 
                  className="text-white px-2 py-1 rounded text-xs font-medium"
                  style={{ background: getColorFondoEtiqueta(index) }}
                >
                  {getTextoEtiqueta(index)}
                </span>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <button 
                onClick={() => onAbrirModal(reporte)}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105"
                style={{ background: '#00C853', border: 'none' }}
              >
                <Edit3 className="w-3 h-3" style={{ color: '#fff' }} />
                <span className="text-white text-xs font-bold">Revisar</span>
              </button>
              {!reporte.oculto && (
                <button 
                  onClick={() => onOcultarReporte(reporte.id)}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105"
                  style={{ background: '#6b7280', border: 'none' }}
                >
                  <EyeOff className="w-3 h-3" style={{ color: '#fff' }} />
                  <span className="text-white text-xs font-bold">Ocultar</span>
                </button>
              )}
            </div>
          </div>
        ))}
        {reportes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Filter className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>
              {filtroEstado === 'pendiente' ? 'No hay reportes activos' : 
                filtroEstado === 'oculto' ? 'No hay reportes ocultos' : 
                'No se encontraron reportes'}
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

export default ListaReportes;