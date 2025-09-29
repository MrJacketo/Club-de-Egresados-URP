import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-teal-50">
      {/* Hero Section with Enhanced Design */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full text-center mb-16 transform transition-all duration-700 hover:scale-105 hover:shadow-3xl border border-green-100">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-green-200 to-teal-200 rounded-full opacity-20 -translate-x-10 -translate-y-10"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-teal-200 to-green-200 rounded-full opacity-20 translate-x-8 translate-y-8"></div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-6 leading-tight">
          Bienvenido a <br /> 
          <span className="text-5xl md:text-7xl">URPex</span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl mb-10 leading-relaxed max-w-lg mx-auto">
          ¡Egresado URPito! Accede a tus beneficios exclusivos, están al alcance de un clic.
        </p>
        <Link
          to="/membresia"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-green-200"
        >
          <span>Obtener Membresía</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>

      {/* Enhanced Benefits Section */}
      <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-x-12 lg:space-y-0 w-full max-w-7xl px-6">
        {/* Enhanced Image with overlay */}
        <div className="relative w-full lg:w-1/2 max-w-2xl group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-teal-500 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>
          <img
            src="/beneficio.png"
            alt="Beneficios URPex"
            className="relative w-full object-cover rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105 border-4 border-white"
          />
        </div>

        {/* Enhanced Benefits Card */}
        <div className="relative bg-white/80 backdrop-blur-sm p-10 w-full lg:w-1/2 max-w-2xl flex flex-col justify-between rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105 border border-green-100">
          {/* Decorative corner elements */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-100 to-transparent rounded-bl-full"></div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-teal-700 bg-clip-text text-transparent text-center mb-8 tracking-wide">
            ¿Por qué obtener la membresía URPex?
          </h2>
          <div className="space-y-6 flex-grow">
            <div className="flex items-start space-x-4 group hover:bg-green-50 p-4 rounded-xl transition-all duration-300">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                ✓
              </div>
              <p className="text-gray-700 text-lg leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                Acceso exclusivo a contenido educativo y recursos para egresados.
              </p>
            </div>
            <div className="flex items-start space-x-4 group hover:bg-green-50 p-4 rounded-xl transition-all duration-300">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                ✓
              </div>
              <p className="text-gray-700 text-lg leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                Descuentos en eventos, conferencias y talleres especializados.
              </p>
            </div>
            <div className="flex items-start space-x-4 group hover:bg-green-50 p-4 rounded-xl transition-all duration-300">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                ✓
              </div>
              <p className="text-gray-700 text-lg leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                Oportunidades para conectar con otros egresados y ampliar tu red de contactos.
              </p>
            </div>
            <div className="flex items-start space-x-4 group hover:bg-green-50 p-4 rounded-xl transition-all duration-300">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                ✓
              </div>
              <p className="text-gray-700 text-lg leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                Acceso preferencial a ofertas de empleo y oportunidades laborales.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Feedback Section */}
      <div className="mt-20 mb-10">
        <Link
          to="/feedback"
          className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-teal-500 via-green-500 to-emerald-500 hover:from-teal-600 hover:via-green-600 hover:to-emerald-600 text-white font-bold py-4 px-10 rounded-full transition-all duration-500 transform hover:scale-105 hover:shadow-2xl shadow-teal-200"
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity duration-500"></div>
          
          {/* Icon */}
          <svg className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v10a2 2 0 002 2h8a2 2 0 002-2V8M9 12h6" />
          </svg>
          
          <span className="relative">¡Danos tu Feedback sobre los Beneficios!</span>
          
          {/* Animated arrow */}
          <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
