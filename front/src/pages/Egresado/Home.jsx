import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Navbar superior como en la imagen de referencia */}
      <nav className="absolute top-0 left-0 right-0 z-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo URPex */}
            <div className="flex items-center">
              <div className="text-white font-bold text-2xl">URPex</div>
            </div>
            
            {/* Menu items */}
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-white hover:text-green-300 font-medium transition-colors">INICIO</a>
              <a href="#" className="text-white hover:text-green-300 font-medium transition-colors">CARRERAS</a>
              <a href="#" className="text-white hover:text-green-300 font-medium transition-colors">COMUNIDAD</a>
              <a href="#" className="text-white hover:text-green-300 font-medium transition-colors">EVENTOS</a>
            </div>
            
            {/* Login button */}
            <Link
              to="/login"
              className="flex items-center space-x-2 text-white hover:text-green-300 font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>LOGIN</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Screen */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/FONDOHOMEPAGE.png')"
          }}
        ></div>
        
        {/* Overlay oscuro para mejor legibilidad */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content */}
        <div className="relative z-10 text-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto h-full flex flex-col justify-center">
          <div className="flex-1 flex flex-col justify-center">
            {/* Logo URP centrado arriba del texto */}
            <div className="flex justify-center mb-8">
              <img
                src="/LOGO_URPPP.png"
                alt="Logo URP"
                className="w-24 h-24 md:w-32 md:h-32"
              />
            </div>
            
            <div className="text-right">
              <h1 
                className="text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] mb-8"
                style={{
                  fontFamily: 'League Spartan, sans-serif',
                  fontWeight: 800,
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#FFFFFF'
                }}
              >
                ESTA ES MI{' '}
                <br className="hidden sm:block" />
                <span style={{ color: '#FFFFFF' }}>UNIVERSIDAD</span>
              </h1>
            </div>
          </div>
          
          {/* Logo SOMOS URP - cuadro blanco con 75% transparencia */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20">
            <div 
              className="px-12 py-4"
              style={{
                backgroundColor: '#FFFFFFBF'
              }}
            >
              <div style={{
                fontFamily: 'League Spartan, sans-serif',
                fontWeight: 800,
                fontStyle: 'normal',
                fontSize: '32px',
                lineHeight: '100%',
                letterSpacing: '0%',
                textAlign: 'center'
              }}>
                <span style={{ color: '#194F14' }}>SOMOS</span>{' '}
                <span style={{ color: '#0E7E04' }}>URP</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inspiración Section - Título arriba, imagen izquierda y contenido derecha */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}>
        
        {/* Header con texto inspiracional - Sin padding, pegado a la izquierda */}
        <div className="py-8">
          <div className="flex items-start justify-between">
            {/* Título Inspiración pegado a la izquierda */}
            <div className="w-2/5 pl-4">
              <h2 
                className="text-4xl md:text-5xl"
                style={{
                  fontFamily: 'League Spartan, sans-serif',
                  fontWeight: 700,
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#5DC554'
                }}
              >
                Inspiración, Innovación y
                <br />
                Descubrimiento.
              </h2>
            </div>
            
            {/* Texto descriptivo de URPex a la derecha */}
            <div className="w-3/5 pl-8 pr-8">
                <p 
                  className="text-lg leading-relaxed" 
                  style={{ 
                    color: '#FFFFFF',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 800
                  }}
                >
                  La plataforma <span style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>URPex</span> te permitirá conocer, 
                  desarrollar y reforzar no solo tus conocimientos como egresado URP, sino también conectarte de manera más 
                  eficiente a beneficios exclusivos, oportunidades laborales y servicios especializados para tu crecimiento profesional
                </p>
            </div>
          </div>
        </div>

        {/* Contenedor principal con imagen izquierda y contenido derecha */}
        <div className="flex w-full h-96">
            
          {/* Imagen completa - Sin inclinación */}
          <div className="relative w-2/3">
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: "url('/IMAGENPARTE2.png')"
              }}
            >
            </div>
          </div>

          {/* Contenido derecho - ÉXITO ACADÉMICO sin inclinación */}
          <div className="relative w-1/2">
            <div className="w-full h-full bg-white flex flex-col justify-center p-8">
              <div className="text-left">
                {/* ÉXITO ACADÉMICO */}
                <h3 
                  className="text-3xl md:text-4xl mb-6"
                  style={{
                    fontFamily: 'League Spartan, sans-serif',
                    fontWeight: 800,
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#0E7E04'
                  }}
                >
                  ÉXITO ACADÉMICO
                </h3>
                <p 
                  className="text-base leading-relaxed mb-8 text-gray-800"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700
                  }}
                >
                  En esta plataforma, dispondrás de excelentes herramientas educativas que garantizan un desarrollo 
                  académico de calidad, permitiéndote afrontar tus cursos con confianza. Con recursos interactivos, 
                  un equipo de profesores comprometidos y actividades complementarias de primer nivel, buscamos que tu estadía en la 
                  universidad no solo sea exitosa, sino también una experiencia personal y social memorable.
                </p>
                <div className="flex justify-center">
                  <Link
                    to="/beneficios"
                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white hover:bg-green-700 font-semibold rounded-full transition-all duration-300"
                  >
                    conoce más
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16" style={{ backgroundColor: '#1E1E1E' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative">
            <div className="group">
              <div className="text-8xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300" 
                style={{ 
                  fontFamily: 'League Spartan, sans-serif',
                  fontWeight: 800,
                  color: '#659B6038'
                }}>
                5000
              </div>
              <div className="flex justify-center mb-4">
                <img src="/LOGO_SOMBRERO.png" alt="Egresados" className="w-16 h-16 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="text-white font-medium text-base mb-2">
                Nuestra casa de estudio cuenta con
              </div>
              <div className="text-white font-medium text-base group-hover:scale-110 transition-transform duration-300">
                <span style={{ color: '#5DC554' }}>+50000</span> egresados
              </div>
            </div>
            
            {/* Línea separadora 1 */}
            <div className="hidden md:block absolute left-1/4 top-8 bottom-8 w-px bg-green-500" style={{ backgroundColor: '#5DC554' }}></div>
            
            <div className="group">
              <div className="text-8xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300" 
                style={{ 
                  fontFamily: 'League Spartan, sans-serif',
                  fontWeight: 800,
                  color: '#659B6038'
                }}>
                15
              </div>
              <div className="flex justify-center mb-4">
                <img src="/LOGO_FACULTADES.png" alt="Facultades" className="w-16 h-16 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="text-white font-medium text-base mb-2">
                Contamos con
              </div>
              <div className="text-white font-medium text-base group-hover:scale-110 transition-transform duration-300">
                <span style={{ color: '#5DC554' }}>15</span> facultades
              </div>
            </div>
            
            {/* Línea separadora 2 */}
            <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-px bg-green-500" style={{ backgroundColor: '#5DC554' }}></div>
            
            <div className="group">
              <div className="text-8xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300" 
                style={{ 
                  fontFamily: 'League Spartan, sans-serif',
                  fontWeight: 800,
                  color: '#659B6038'
                }}>
                23
              </div>
              <div className="flex justify-center mb-4">
                <img src="/LOGO_CARRERAS.png" alt="Carreras" className="w-16 h-16 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="text-white font-medium text-base mb-2">
                Contamos con
              </div>
              <div className="text-white font-medium text-base group-hover:scale-110 transition-transform duration-300">
                <span style={{ color: '#5DC554' }}>23</span> carreras
              </div>
            </div>
            
            {/* Línea separadora 3 */}
            <div className="hidden md:block absolute left-3/4 top-8 bottom-8 w-px bg-green-500" style={{ backgroundColor: '#5DC554' }}></div>
            
            <div className="group">
              <div className="text-8xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300" 
                style={{ 
                  fontFamily: 'League Spartan, sans-serif',
                  fontWeight: 800,
                  color: '#659B6038'
                }}>
                100
              </div>
              <div className="flex justify-center mb-4">
                <img src="/LOGO_BENEFICIOS.png" alt="Beneficios" className="w-16 h-16 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="text-white font-medium text-base mb-2">
                Contamos con
              </div>
              <div className="text-white font-medium text-base group-hover:scale-110 transition-transform duration-300">
                <span style={{ color: '#5DC554' }}>+100</span> beneficios
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              ¿Por qué elegir la{' '}
              <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                membresía URPex?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre todas las ventajas que tenemos preparadas para impulsar tu carrera profesional
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              {/* TODO: Agregar imagen de beneficios URPex */}
              {/* Ruta sugerida: '/beneficios-urpex.jpg' */}
              <div className="w-full h-96 bg-gray-300 rounded-3xl shadow-2xl flex items-center justify-center">
                <span className="text-gray-600 text-lg">Imagen de beneficios URPex</span>
              </div>
              {/* 
              <img
                src="/beneficios-urpex.jpg"
                alt="Beneficios URPex"
                className="w-full rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
              */}
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div className="flex items-start space-x-6 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Contenido Educativo Exclusivo</h3>
                  <p className="text-gray-600 text-lg">
                    Acceso a cursos, workshops y recursos educativos diseñados específicamente para egresados URP.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Descuentos Especiales</h3>
                  <p className="text-gray-600 text-lg">
                    Obtén descuentos exclusivos en eventos, conferencias, talleres y servicios de empresas aliadas.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Red de Contactos</h3>
                  <p className="text-gray-600 text-lg">
                    Conecta con otros egresados URP, expande tu red profesional y descubre nuevas oportunidades.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V9a2 2 0 00-2-2H10a2 2 0 00-2 2v3.1M16 19h6-6zM8 19H2h6z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Oportunidades Laborales</h3>
                  <p className="text-gray-600 text-lg">
                    Acceso preferencial a ofertas de empleo y oportunidades laborales exclusivas para egresados URP.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para dar el siguiente paso?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Únete a miles de egresados que ya están aprovechando todos los beneficios de URPex
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/membresia"
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 hover:text-green-700 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>Comenzar Ahora</span>
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/feedback"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-green-600 font-semibold rounded-full transition-all duration-300"
            >
              <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Danos tu Feedback
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
