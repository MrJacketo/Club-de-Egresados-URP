import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xl w-full text-center mb-12 transform transition duration-500 hover:scale-105">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-8">
          Bienvenido a <br /> URPex
        </h1>
        <p className="text-gray-600 text-sm md:text-base mb-8">
          ¡Egresado URPito! Accede a tus beneficios, están al alcance de un clic.
        </p>
        <Link
          to="/membresia"
          className="inline-block bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
        >
          Membresía
        </Link>

      </div>

      {/* Contenedor flex para imagen y beneficios */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-x-6 sm:space-y-0 mt-12 w-full sm:w-4/5">
        {/* Imagen fuera del recuadro de beneficios */}
        <img
          src="/beneficio.png"
          alt="Beneficios URPex"
          className="w-full sm:w-1/2 max-w-xl object-cover rounded-3xl shadow-xl"
        />

        
        <div className="bg-white p-8 w-full sm:w-1/2 max-w-xl flex flex-col justify-between rounded-3xl shadow-xl transform transition duration-500 hover:scale-105 min-h-full">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 tracking-wide">
            ¿Por qué obtener la membresía URPex?
          </h2>
          <div className="space-y-6 flex-grow">
            <div className="flex items-start space-x-4">
              <span className="text-green-500 text-3xl">✔️</span>
              <p className="text-gray-700 text-lg">
                Acceso exclusivo a contenido educativo y recursos para egresados.
              </p>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-green-500 text-3xl">✔️</span>
              <p className="text-gray-700 text-lg">
                Descuentos en eventos, conferencias y talleres especializados.
              </p>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-green-500 text-3xl">✔️</span>
              <p className="text-gray-700 text-lg">
                Oportunidades para conectar con otros egresados y ampliar tu red de contactos.
              </p>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-green-500 text-3xl">✔️</span>
              <p className="text-gray-700 text-lg">
                Acceso preferencial a ofertas de empleo y oportunidades laborales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
