import React, { useState, useEffect } from "react";
import { obtenerNoticiasPublicas } from "../../api/gestionNoticiasApi";

function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categorias = ["Todos", "General", "Economia", "Tecnologia", "Deportes", "Salud", "Academico"];

  useEffect(() => {
    const cargarNoticias = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("🔄 Iniciando carga de noticias...");
        const response = await obtenerNoticiasPublicas(categoriaSeleccionada);
        
        console.log("📦 Respuesta completa:", response);
        
        if (response.success) {
          console.log("✅ Éxito - Noticias recibidas:", response.noticias.length);

          // Procesar las noticias - VERSIÓN CORREGIDA
          // Procesar las noticias - VERSIÓN CORREGIDA
const noticiasProcesadas = response.noticias.map(noticia => {
  // URL CORREGIDA - puerto 8000 y ruta /imagen/
  const imagenUrl = `http://localhost:8000/api/noticias/imagen/${noticia.imagen}`;

  
  console.log(`🖼️  Imagen URL CORREGIDA para "${noticia.titulo}": ${imagenUrl}`);
  console.log(`📁 Nombre de imagen en BD: ${noticia.imagen}`);

  return {
    ...noticia,
    imagenUrl: imagenUrl,
    tieneImagen: true
  };
});

          setNoticias(noticiasProcesadas);
          console.log("✅ Noticias procesadas:", noticiasProcesadas.length);
        } else {
          setError("Error al cargar las noticias: " + (response.error || 'Error desconocido'));
        }
      } catch (err) {
        setError(err.message || "Error de conexión con el servidor");
        console.error("❌ Error:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarNoticias();
  }, [categoriaSeleccionada]);

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen text-gray-900 flex flex-col pt-20" style={{ background: "linear-gradient(to bottom right, #f9fafb, #ffffff)" }}>
        <header className="py-6 shadow-md w-full relative" style={{ backgroundColor: "rgba(255,255,255,0.9)" }}>
          <div className="flex items-center justify-center">
            <div className="absolute left-8">
              <img src="LogoURP.png" alt="Logo URP" className="h-16" />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold" style={{ color: "#00BC4F" }}>Noticias URP</h1>
              <p className="text-gray-600 mt-2">Mantente informado con las últimas novedades</p>
            </div>
          </div>
        </header>

        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando noticias...</p>
          </div>
        </div>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen text-gray-900 flex flex-col pt-20" style={{ background: "linear-gradient(to bottom right, #f9fafb, #ffffff)" }}>
        <header className="py-6 shadow-md w-full relative" style={{ backgroundColor: "rgba(255,255,255,0.9)" }}>
          <div className="flex items-center justify-center">
            <div className="absolute left-8">
              <img src="LogoURP.png" alt="Logo URP" className="h-16" />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold" style={{ color: "#00BC4F" }}>Noticias URP</h1>
              <p className="text-gray-600 mt-2">Mantente informado con las últimas novedades</p>
            </div>
          </div>
        </header>

        <div className="flex-grow flex items-center justify-center">
          <div className="text-center text-red-600">
            <p className="text-lg mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CONTENIDO PRINCIPAL
  return (
    <div className="min-h-screen text-gray-900 flex flex-col pt-20" style={{ background: "linear-gradient(to bottom right, #f9fafb, #ffffff)" }}>
      
      {/* HEADER */}
      <header className="py-6 shadow-md w-full relative" style={{ backgroundColor: "rgba(255,255,255,0.9)" }}>
        <div className="flex items-center justify-center">
          <div className="absolute left-8">
            <img src="LogoURP.png" alt="Logo URP" className="h-16" />
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold" style={{ color: "#00BC4F" }}>Noticias URP</h1>
            <p className="text-gray-600 mt-2">Mantente informado con las últimas novedades</p>
          </div>
        </div>
      </header>

      {/* GRID DE NOTICIAS */}
      <main className="flex-grow w-full px-6 py-8 overflow-y-auto">

        {noticias.length > 0 ? (
          
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full">
            {noticias.map((noticia) => (
              <div
                key={noticia.id}
                className="bg-white text-black rounded-2xl shadow-lg overflow-hidden hover:shadow-green-500/40 transition-shadow flex flex-col w-full"
              >
                <img
                  src={noticia.imagenUrl}
                  alt={noticia.titulo}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    console.log(`❌ Error cargando imagen: ${noticia.imagenUrl}`);
                    // Fallback directo a SVG
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%2300BC4F'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='24' fill='white' font-weight='bold'%3ENOTICIAS URP%3C/text%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='16' fill='white'%3EImagen no disponible%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold mb-2" style={{ color: "#00BC4F" }}>{noticia.titulo}</h2>

                  <p className="text-sm text-gray-500 mb-2">
                    {noticia.autor} • {noticia.fecha}
                  </p>

                  <p className="text-gray-700 flex-grow">{noticia.resumen}</p>

                  <button
                    className="mt-4 px-5 py-2 rounded-full font-semibold border-2 transition-colors self-end hover:bg-green-500 hover:text-white"
                    style={{
                      borderColor: "#00BC4F",
                      backgroundColor: "#FFFFFF",
                      color: "#00BC4F",
                    }}
                    onClick={() => {
                      window.location.href = `/noticia/${noticia.id}`;
                    }}
                  >
                    Leer más
                  </button>
                </div>

              </div>
            ))}
          </div>

        ) : (
          <div className="text-center py-20">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay noticias disponibles</h3>
            <p className="text-gray-600">Pronto habrá nuevas noticias disponibles.</p>
          </div>
        )}

      </main>

    </div>
  );
}

export default Noticias;
