// src/components/ModeracionForo/FiltrosModeracion.jsx
import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';

const FiltrosModeracion = ({ 
  filtroBusqueda, 
  setFiltroBusqueda, 
  filtroEstado, 
  setFiltroEstado, 
  aplicarFiltros, 
  limpiarFiltros 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            value={filtroBusqueda}
            onChange={(e) => setFiltroBusqueda(e.target.value)}
            placeholder="Buscar posts, usuarios..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>

        <select 
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
        >
          <option value="pendiente">Pendientes</option>
          <option value="oculto">Ocultos</option>
          <option value="todos">Todos</option>
        </select>

        <div className="flex gap-2 justify-end">
          <button 
            onClick={limpiarFiltros}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105"
            style={{ background: '#6b7280', border: 'none' }}
          >
            <RefreshCw className="w-4 h-4" style={{ color: '#fff' }} />
            <span className="text-white text-xs font-bold">Limpiar</span>
          </button>
          <button 
            onClick={aplicarFiltros}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105"
            style={{ background: '#00C853', border: 'none' }}
          >
            <Filter className="w-4 h-4" style={{ color: '#fff' }} />
            <span className="text-white text-xs font-bold">Filtrar</span>
          </button>
        </div>
      </div>

      {/* Mostrar filtros activos */}
      {(filtroBusqueda || filtroEstado !== 'pendiente') && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 font-medium mb-2">Filtros activos:</p>
          <div className="flex flex-wrap gap-2">
            {filtroBusqueda && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                Búsqueda: "{filtroBusqueda}"
              </span>
            )}
            {filtroEstado !== 'pendiente' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                Estado: {filtroEstado === 'oculto' ? 'Ocultos' : 'Todos'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltrosModeracion;