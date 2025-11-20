// src/hooks/useAlerta.jsx
import { useCallback } from 'react';

export const useAlerta = () => {
  const mostrarAlerta = useCallback((mensaje, tipo = 'success') => {
    const alerta = document.createElement('div');
    alerta.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium transform transition-all duration-300 ${
      tipo === 'success' ? 'bg-green-500' : 
      tipo === 'warning' ? 'bg-yellow-500' : 
      'bg-red-500'
    }`;
    alerta.textContent = mensaje;
    
    document.body.appendChild(alerta);
    
    setTimeout(() => {
      alerta.style.transform = 'translateX(100%)';
      alerta.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(alerta)) {
          document.body.removeChild(alerta);
        }
      }, 300);
    }, 3000);
  }, []);

  return { mostrarAlerta };
};