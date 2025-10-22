import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import { Link } from "react-router-dom";
import apiClient from "../../api/apiClient";

export default function Dashboard() {
  const { user, userName } = useContext(UserContext);
  const [userDisplayName, setUserDisplayName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        try {
          if (userName) {
            setUserDisplayName(userName);
          } else {
            const response = await apiClient.get("/auth/user-name");
            setUserDisplayName(response.data.name);
          }
        } catch (error) {
          console.error("Error fetching user name:", error);
          setUserDisplayName(user?.name || "Usuario");
        }
      }
    };

    fetchUserName();
  }, [user, userName]);

  // Datos de las 3 tarjetas con imágenes diferentes
  const tarjetas = [
    { 
      title: "Nuevos métodos de\nestudios en PEB", 
      author: "Bachata", 
      date: "Nov 29, 2024",
      image: "/PEB.png"
    },
    { 
      title: "Museos importantes\npara el estudio", 
      author: "Bachata", 
      date: "Nov 29, 2024",
      image: "/Museo.png"
    },
    { 
      title: "Banda URP\ninternacional", 
      author: "Bachata", 
      date: "Nov 29, 2024",
      image: "/Banda.png"
    }
  ];

  // Datos de destacados con imágenes diferentes
  const destacados = [
    { 
      title: "El dilema de la APEC 2024", 
      author: "MARCO VIDAL", 
      date: "Nov 29, 2024",
      image: "/Destacado-Apec.png"
    },
    { 
      title: "Nueva biblioteca nacional", 
      author: "MARCO VIDAL", 
      date: "Nov 29, 2024",
      image: "/Destacado-Biblioteca.png"
    },
    { 
      title: "Mejores libros de hábito personal", 
      author: "MARCO VIDAL", 
      date: "Nov 29, 2024",
      image: "/Destacado-libro.png"
    },
    { 
      title: "Ferias de libros y mucho más", 
      author: "MARCO VIDAL", 
      date: "Nov 29, 2024",
      image: "/Destacado-Feria.png"
    }
  ];

  return (
    <div className="fixed inset-0 top-[64px] left-0 w-screen h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden bg-gray-50 z-30">
      {/* SECCIÓN 1: Hero Principal - CENTRADO Y MODERNO */}
      <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden group">
        <img
          src="/Arquitectonico.png"
          alt="Nuevos Proyectos arquitectónicos"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>
        
        {/* Contenido del Hero - CENTRADO */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="max-w-4xl text-center">
            <p className="text-sm md:text-base mb-4 text-white/70 font-medium tracking-wide uppercase">
              Escrito por: Bachata | Nov 29, 2024
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-black leading-tight text-white mb-6">
              Nuevos Proyectos<br />arquitectónicos
            </h1>
            <div className="w-24 h-1 bg-green-500 mx-auto"></div>
          </div>
        </div>

        {/* Flecha indicadora para bajar */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})}>
            <div className="text-white/70 text-sm font-medium uppercase tracking-wider group-hover:text-white transition-colors">
              Explorar más
            </div>
            <div className="relative">
              <div className="w-6 h-6 border-2 border-white/70 rounded-full flex items-center justify-center group-hover:border-white group-hover:bg-white/10 transition-all duration-300">
                <svg className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <div className="absolute -inset-2 border border-white/20 rounded-full animate-ping opacity-30"></div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: Grid de 3 Tarjetas - Diseño Moderno */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-gray-900">
        {tarjetas.map((item, index) => (
          <div 
            key={index} 
            className="relative h-[450px] overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-2xl"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
            
            {/* Contenido de la tarjeta - CENTRADO */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <p className="text-xs md:text-sm mb-4 text-white/60 font-medium tracking-wide uppercase">
                Escrito por: {item.author} | {item.date}
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight whitespace-pre-line mb-4">
                {item.title}
              </h3>
              <div className="w-16 h-0.5 bg-green-500"></div>
            </div>
          </div>
        ))}
      </div>

      {/* SECCIÓN 3: Artículos Populares + Destacados - MISMO TAMAÑO OCUPANDO TODA LA PANTALLA */}
      <div className="w-full bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[720px]">
          
          {/* Columna Izquierda - Artículos Populares MEJORADO */}
          <div className="w-full bg-white p-12 md:p-16 lg:p-20 flex flex-col justify-center relative overflow-hidden">
            {/* Decoración de fondo sutil */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-green-50 rounded-full blur-3xl opacity-30 -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-20 translate-x-20 translate-y-20"></div>
            
            {/* Header MODERNO Y CREATIVO */}
            <div className="mb-12 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                  <span className="w-2 h-2 bg-green-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                </div>
                <p className="text-green-600 font-bold text-sm uppercase tracking-[0.15em]">
                  EXPLORA MÁS ARTÍCULOS
                </p>
              </div>
              
              <div className="relative">
                <h2 className="text-4xl md:text-5xl font-black leading-tight relative">
                  <span className="bg-gradient-to-r from-slate-800 via-slate-900 to-green-600 bg-clip-text text-transparent">
                    Artículos
                  </span>
                  <span className="ml-3 relative">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                      Populares
                    </span>
                    <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  </span>
                </h2>
                
                {/* Decoración moderna */}
                <div className="absolute -top-2 -right-4 w-8 h-8 border-2 border-green-400 rounded-full opacity-20 animate-ping"></div>
                <div className="absolute top-8 -left-2 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-30 animate-pulse"></div>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-12">
              {/* Artículo Principal */}
              <div className="group">
                <div className="relative overflow-hidden rounded-2xl mb-5 shadow-lg">
                  <img
                    src="/Google.png"
                    alt="Becas de prácticas"
                    className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                <p className="text-xs text-green-600 font-semibold mb-3 uppercase tracking-wider">
                  Escrito por: Bachata | Nov 29, 2025
                </p>
                
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-green-700 transition-colors">
                  Becas de prácticas en una de las empresas más importantes del mundo
                </h3>
                
                <p className="text-slate-600 text-base leading-relaxed mb-5">
                  La universidad Ricardo Palma está ofreciendo innumerables becas para la 
                  realización de prácticas en el extranjero y estudios en una de las empresas 
                  más importantes.
                </p>
                
                <button className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  Lee más →
                </button>
              </div>

              {/* Segundo Artículo */}
              <div className="group">
                <div className="relative overflow-hidden rounded-2xl mb-5 shadow-lg">
                  <img
                    src="/Parque Amistad.png"
                    alt="Remodelan Parque"
                    className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                <p className="text-xs text-green-600 font-semibold mb-3 uppercase tracking-wider">
                  Escrito por: Bachata | Nov 29, 2025
                </p>
                
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-green-700 transition-colors">
                  Remodelan Parque de la amistad
                </h3>
                
                <p className="text-slate-600 text-base leading-relaxed mb-5">
                  La universidad Ricardo Palma está ofreciendo innumerables becas para la 
                  realización de prácticas en el extranjero y estudios en una de las empresas 
                  más importantes.
                </p>
                
                <button className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  Lee más →
                </button>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Destacados TAMAÑO ORIGINAL */}
          <div className="w-full bg-gray-50 p-8 flex flex-col justify-center">
            <div className="rounded-3xl p-12 md:p-16 lg:p-20 shadow-2xl relative overflow-hidden" style={{backgroundColor: '#00BC4F'}}>
              {/* Efectos de fondo modernos */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              
              {/* Título DESTACADOS CENTRADO SIMÉTRICAMENTE */}
              <div className="text-center mb-8 relative z-10">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <div className="w-12 h-0.5 bg-white rounded-full"></div>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
                  </div>
                  <div className="w-12 h-0.5 bg-white rounded-full"></div>
                </div>
                
                <h3 className="text-4xl font-black text-white relative">
                  <span className="drop-shadow-lg tracking-wider">DESTACADOS</span>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-white rounded-full"></div>
                </h3>
              </div>
              
              {/* Grid 2x2 de Destacados */}
              <div className="grid grid-cols-2 gap-5 flex-1">
                {destacados.map((item, index) => (
                  <div key={index} className="group cursor-pointer flex items-stretch">
                    <div className="relative overflow-hidden rounded-2xl shadow-xl w-full">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 min-h-[250px]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                      
                      {/* Contenido sobre la imagen MEJORADO */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
                        <div className="transform transition-all duration-300 group-hover:translate-y-[-2px]">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-400 font-bold uppercase tracking-wider">
                              {item.author}
                            </span>
                          </div>
                          
                          <h4 className="text-base font-bold text-white line-clamp-2 leading-tight group-hover:text-green-200 transition-colors mb-3 drop-shadow-lg">
                            {item.title}
                          </h4>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                              <div className="w-8 h-0.5 bg-green-400 rounded-full group-hover:w-12 transition-all duration-300"></div>
                              <div className="w-4 h-0.5 bg-green-300/60 rounded-full group-hover:bg-green-300 transition-all duration-300 delay-75"></div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 4: Imagen + Cita - MÁS ALTA */}
      <div className="w-full bg-gradient-to-b from-gray-50 to-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 shadow-2xl">
          
          {/* Imagen Izquierda */}
          <div className="relative h-[600px] lg:h-[750px] overflow-hidden">
            <img
              src="/URP-BlancoyNegro.png"
              alt="Tradiciones"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/20"></div>
          </div>

          {/* Cita Derecha - MENSAJE MOTIVACIONAL PARA EGRESADOS */}
          <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-green-500 p-12 md:p-16 lg:p-20 flex flex-col justify-center relative h-[600px] lg:h-[750px]">
            <div className="text-[120px] font-black absolute top-8 left-8 opacity-10 text-green-400">"</div>
            <div className="text-[120px] font-black absolute bottom-8 right-8 opacity-10 text-green-400">"</div>
            
            <div className="relative z-10 text-right flex flex-col justify-center h-full px-6 pr-10">
              <h3 className="font-black leading-tight max-w-full">
                <span className="text-green-500 text-4xl md:text-6xl lg:text-7xl block mb-3">Nuestro</span>
                <span className="text-green-400 text-6xl md:text-7xl lg:text-8xl block mb-4">LEGADO</span>
                <span className="text-white text-3xl md:text-5xl lg:text-6xl font-semibold block mb-4">TRASCIENDE</span>
                <span className="text-white text-3xl md:text-5xl lg:text-6xl font-light block mb-3 leading-relaxed">
                  en cada<br />profesional<br />que formamos
                </span>
                <span className="italic font-light text-5xl md:text-6xl lg:text-7xl text-green-300 block">para el mundo.</span>
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER - COLOR SÓLIDO BLANQUESINO CON TOQUE VERDE */}
      <div className="w-full bg-green-50 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-lg font-bold text-gray-800 tracking-wide">
            Todos los derechos reservados © 2025 URPex
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Club de Egresados - Universidad Ricardo Palma
          </p>
        </div>
      </div>
    </div>
  );
}