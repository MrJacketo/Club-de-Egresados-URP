// src/components/ModeracionForo/MetricasModeracion.jsx
import React from 'react';

const MetricasModeracion = ({ postsPendientes, reportesActivos, filtroEstado }) => {
  const calcularMetricas = () => {
    const postsPendientesCount = postsPendientes.filter(p => !p.oculto).length;
    const postsOcultosCount = postsPendientes.filter(p => p.oculto).length;
    const reportesActivosCount = reportesActivos.filter(r => !r.oculto).length;
    const reportesOcultosCount = reportesActivos.filter(r => r.oculto).length;

    return {
      posts: filtroEstado === 'pendiente' ? postsPendientesCount : 
             filtroEstado === 'oculto' ? postsOcultosCount : 
             postsPendientes.length,
      reportes: filtroEstado === 'pendiente' ? reportesActivosCount : 
                filtroEstado === 'oculto' ? reportesOcultosCount : 
                reportesActivos.length
    };
  };

  const metricas = calcularMetricas();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {/* Posts Pendientes */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Posts {filtroEstado === 'oculto' ? 'Ocultos' : 'Pendientes'}</h3>
            <p className="text-3xl font-bold text-blue-600">{metricas.posts}</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-lg">📝</span>
          </div>
        </div>
        <p className="text-sm text-red-500 font-medium">
          {filtroEstado === 'oculto' ? 'Elementos ocultados' : 'Requieren revisión'}
        </p>
      </div>

      {/* Reportes Activos */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Reportes {filtroEstado === 'oculto' ? 'Ocultos' : 'Activos'}</h3>
            <p className="text-3xl font-bold text-red-600">{metricas.reportes}</p>
          </div>
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-600 text-lg">⚠️</span>
          </div>
        </div>
        <p className="text-sm text-red-500 font-medium">
          {filtroEstado === 'oculto' ? 'Elementos ocultados' : 'Urgentes por atender'}
        </p>
      </div>

      {/* Usuarios Nuevos */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Usuarios Nuevos</h3>
            <p className="text-3xl font-bold text-green-600">5</p>
          </div>
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-lg">👥</span>
          </div>
        </div>
        <p className="text-sm text-gray-500">Por verificar</p>
      </div>

      {/* Baneos Activos */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Baneos Activos</h3>
            <p className="text-3xl font-bold text-orange-600">2</p>
          </div>
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-orange-600 text-lg">🚫</span>
          </div>
        </div>
        <p className="text-sm text-gray-500">Este mes</p>
      </div>
    </div>
  );
};

export default MetricasModeracion;