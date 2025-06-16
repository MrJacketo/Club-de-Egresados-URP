import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const CompraCompletada = () => {
  const navigate = useNavigate();

  // Datos de ejemplo para la compra
  const compra = {
    membresia: 'Premium Anual',
    beneficios: [
      'Acceso ilimitado a todos los cursos',
      'Soporte prioritario',
      'Certificados descargables',
      'Acceso a eventos exclusivos',
    ],
  };

  const handleVerMembresia = () => {
    window.location.href = 'http://localhost:5173/verMembresia';
  };

  return (
<div className="h-screen overflow-y-auto flex justify-center items-start pt-50 px-4 md:px-8">
<div className="max-w-md w-full bg-white rounded-xl shadow-xl p-6">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="rounded-full bg-green-100 p-3 mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-gray-800">¡Compra Completada!</h1>
          <p className="text-gray-600 max-w-md">
            Gracias por tu compra. Tu membresía ha sido activada correctamente.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg mb-6 p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Beneficios de tu Membresía</h2>
          <ul className="space-y-2">
            {compra.beneficios.map((beneficio, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{beneficio}</span>
              </li>
            ))}
          </ul>
        </div>

        <button 
          onClick={handleVerMembresia}
          className="w-full py-3 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Ver mi Membresía
        </button>

        <div className="text-center mt-4">
          <p className="text-gray-500 text-sm">
            Si tienes alguna pregunta, contacta a nuestro equipo de soporte.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompraCompletada;