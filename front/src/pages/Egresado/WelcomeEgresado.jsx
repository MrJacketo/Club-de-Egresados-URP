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
    <div className="w-full">
      {/* SECCIÓN 1: Hero + 3 Tarjetas */}
      <div className="w-full px-12 py-8">
        {/* Hero grande */}
        <div className="relative w-full h-[500px] mb-8 rounded-2xl overflow-hidden shadow-2xl group">
          <img
            src="/Arquitectonico.png"
            alt="Nuevos Proyectos arquitectónicos"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-8 left-8 text-white animate-fadeInUp">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-white text-sm font-bold">1</span>
              </div>
            </div>
            <p className="text-lg mb-3 opacity-90">Escrito por: Bachata | Nov 29, 2024</p>
            <h1 className="text-6xl font-black leading-tight">Nuevos Proyectos<br />arquitectónicos</h1>
          </div>
        </div>

        {/* 3 Tarjetas MÁS GRANDES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {tarjetas.map((item, index) => (
            <div key={index} className="relative h-80 rounded-2xl overflow-hidden shadow-xl group">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-xs font-bold">{index + 2}</span>
                  </div>
                </div>
                <p className="text-sm mb-2 opacity-80">Escrito por: {item.author} | {item.date}</p>
                <h3 className="text-xl font-bold whitespace-pre-line">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN 2: Artículos Populares + Destacados MÁS ANCHO */}
      <div className="w-full px-12">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_480px] gap-12">
          
          {/* Columna Izquierda - Artículos Populares */}
          <div className="w-full">
            {/* Header */}
            <div className="mb-8">
              <p className="text-slate-700 font-bold text-lg mb-3 uppercase tracking-wide font-inter">EXPLORA MÁS ARTÍCULOS</p>
              <div className="w-full h-1 bg-slate-300 mb-6 rounded"></div>
              <h2 className="text-6xl font-black text-slate-800 font-inter">Artículos Populares</h2>
            </div>

            {/* Artículo Principal */}
            <div className="mb-12">
              <img
                src="/Google.png"
                alt="Becas de prácticas"
                className="w-full h-96 object-cover rounded-xl mb-6 shadow-lg hover:shadow-2xl transition-shadow duration-300"
              />
              {/* CÍRCULO ALINEADO CON TEXTO */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">5</span>
                </div>
                <div className="w-1 h-1"></div>
              </div>
              <h3 className="text-5xl font-bold text-slate-800 mb-6 leading-tight font-inter">
                Becas de prácticas en una de las empresas más importantes del mundo
              </h3>
              <p className="text-blue-600 mb-3 text-lg font-bold font-inter">Escrito por: Bachata | Nov 29, 2024</p>
              <p className="text-gray-700 text-xl leading-relaxed mb-8 font-inter">
                La universidad Ricardo Palma está ofreciendo innumerables beca para la 
                realización de prácticas en el extranjero y estudios en una de las empresas 
                más importantes
              </p>
              <button className="bg-slate-700 text-white px-10 py-4 rounded-full font-semibold hover:bg-slate-800 transition-all duration-300 hover:scale-105 shadow-lg font-inter">
                Lee más
              </button>
            </div>

            {/* Segundo Artículo */}
            <div className="mb-16">
              <img
                src="/Parque Amistad.png"
                alt="Remodelan Parque"
                className="w-full h-96 object-cover rounded-xl mb-6 shadow-lg hover:shadow-2xl transition-shadow duration-300"
              />
              {/* CÍRCULO ALINEADO CON TEXTO */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">6</span>
                </div>
                <div className="w-1 h-1"></div>
              </div>
              <h3 className="text-5xl font-bold text-slate-800 mb-6 font-inter">
                Remodelan Parque de la amistad
              </h3>
              <p className="text-blue-600 mb-3 text-lg font-bold font-inter">Escrito por: Bachata | Nov 29, 2024</p>
              <p className="text-gray-700 text-xl leading-relaxed mb-8 font-inter">
                La universidad Ricardo Palma está ofreciendo innumerables beca para la 
                realización de prácticas en el extranjero y estudios en una de las empresas 
                más importantes
              </p>
              <button className="bg-slate-700 text-white px-10 py-4 rounded-full font-semibold hover:bg-slate-800 transition-all duration-300 hover:scale-105 shadow-lg font-inter">
                Lee más
              </button>
            </div>
          </div>

          {/* Columna Derecha - DESTACADOS MÁS ANCHO Y ALTO */}
          <div className="w-full">
            <div className="bg-green-600 text-white p-8 rounded-xl shadow-2xl sticky top-4">
              <h3 className="text-3xl font-black mb-10 text-center">DESTACADOS</h3>
              
              <div className="space-y-8">
                {destacados.map((item, index) => (
                  <div key={index} className="mb-8 group">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-56 object-cover rounded-xl mb-4 shadow-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    <h4 className="text-2xl font-bold mb-3">{item.title}</h4>
                    <p className="text-lg opacity-90">{item.author} | {item.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: Imagen + Cita - CON BORDES CIRCULARES */}
      <div className="w-full mt-20 px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-0 rounded-3xl overflow-hidden">
          
          {/* Imagen Izquierda */}
          <div className="w-full">
            <img
              src="/URP-BlancoyNegro.png"
              alt="Tradiciones"
              className="w-full h-full object-cover min-h-[600px]"
            />
          </div>

          {/* Cita Derecha - MISMO TAMAÑO QUE DESTACADOS */}
          <div className="bg-gray-900 text-green-500 p-8 flex flex-col justify-center relative min-h-[600px]">
            <div className="text-8xl font-black absolute top-6 left-6 opacity-30">"</div>
            <div className="text-8xl font-black absolute bottom-6 right-6 opacity-30">"</div>
            
            <div className="text-right z-10">
              <h3 className="text-4xl font-black leading-tight">
                Mis tradiciones<br />
                <span className="text-white">MÁS QUE</span><br />
                <span className="text-6xl">MÍAS</span><br />
                <span className="text-white">son de este<br />cronista<br />llamado</span><br />
                <span className="italic font-normal text-5xl">pueblo.</span>
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER CON BLUR Y ANCHO COMPLETO - CENTRADO */}
      <div className="w-full relative mt-0">
  {/* Fondo con blur y gradiente */}
  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-green-500/30 to-green-600/20 backdrop-blur-md"></div>
  
  {/* Contenido del footer */}
  <div className="relative z-10 py-8 flex justify-center items-center">
    <p className="text-2xl font-bold text-gray-800 font-inter text-center">
      Todos los derechos reservados URPex.
    </p>
        </div>
      </div>
    </div>
  );
}