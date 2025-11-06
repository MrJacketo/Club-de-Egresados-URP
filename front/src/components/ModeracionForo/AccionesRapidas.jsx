// src/components/ModeracionForo/AccionesRapidas.jsx
import React from 'react';
import { Edit3, Users, AlertTriangle, Settings } from 'lucide-react';

const AccionesRapidas = () => {
  const acciones = [
    { icono: Edit3, texto: 'Revisar Todos los Posts' },
    { icono: Users, texto: 'Ver Usuarios Nuevos' },
    { icono: AlertTriangle, texto: 'Centro de Reportes' },
    { icono: Settings, texto: 'Configuración' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Acciones Rápidas</h2>
      <div className="flex flex-wrap gap-4">
        {acciones.map((accion, index) => (
          <button 
            key={index}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105"
            style={{ background: '#00C853', border: 'none' }}
          >
            <accion.icono className="w-5 h-5" style={{ color: '#fff' }} />
            <span className="text-white text-sm font-bold">{accion.texto}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AccionesRapidas;