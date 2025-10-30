<<<<<<< HEAD
import { useState, useEffect, useCallback } from "react"
import NoticiasHeader from "../../components/noticias/NoticiasHeader"
import NoticiasSearch from "../../components/noticias/NoticiasSearch"
import NoticiasList from "../../components/noticias/NoticiasList"
import { obtenerNoticias } from "../../api/gestionNoticiasApi"

const NoticiasPage = () => {
  const [noticias, setNoticias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredNoticias, setFilteredNoticias] = useState([])
  const [user] = useState({ email: "egresado@urp.edu.pe" })

  // ... (toda tu lógica de useEffect y handlers permanece igual)
  useEffect(() => {
    const fetchNoticias = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await obtenerNoticias()
        setNoticias(response.noticias || [])
      } catch (err) {
        console.error("Error al cargar noticias:", err)
        setError("No se pudieron cargar las noticias.")
        setNoticias([])
      } finally {
        setLoading(false)
      }
    }
    fetchNoticias()
  }, [])
  useEffect(() => {
    const filtered = noticias
      .filter(Boolean)
      .filter((noticia) =>
        [noticia.titulo, noticia.contenido, noticia.categoria]
          .map((campo) => (typeof campo === "string" ? campo : ""))
          .some((campo) =>
            campo.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    setFilteredNoticias(filtered);
  }, [noticias, searchTerm]);
  const handleNoticiaClick = useCallback((id) => {
    alert(`Abriendo noticia: ${id}`)
  }, [])
  const handleRetry = useCallback(() => {
    setError(null)
    window.location.reload()
  }, [])
  const handleSearchChange = useCallback((newSearchTerm) => {
    setSearchTerm(newSearchTerm)
  }, [])

  return (
    <main className="p-8">
      {/* ===== THE FIX IS HERE ===== */}
      {/* Change 'absolute' to 'fixed' and add a negative z-index */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* The rest of your content remains the same */}
      <div className="relative z-10">
        <NoticiasHeader user={user} error={error} onRetry={handleRetry} />
        <NoticiasSearch
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          totalNoticias={noticias.length}
          filteredCount={filteredNoticias.length}
        />
        <NoticiasList noticias={filteredNoticias} onNoticiaClick={handleNoticiaClick} loading={loading} />
        <footer className="text-center mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-2xl mx-auto">
            <p className="text-white/80 text-sm">
              {searchTerm
                ? `Mostrando ${filteredNoticias.length} de ${noticias.length} noticias`
                : `Total: ${noticias.length} noticias disponibles`}
=======
import React, { useState } from "react";

function Noticias() {
  const todasNoticias = [
    {
        id: 1,
        titulo: "URP fortalece lazos internacionales con nuevas universidades europeas",
        autor: "Oficina de Cooperación Externa",
        fecha: "05 Oct 2025",
        resumen: "La Universidad Ricardo Palma amplía sus convenios con instituciones de educación superior en Europa ....",
        categoria: "Internacional",
        imagen: "Noticia01.jpg"
    },
    {
      id: 2,
      titulo: "URP presenta primera Clínica Veterinaria en feria de Surco",
      autor: "Facultad de Medicina Veterinaria",
      fecha: "06 Oct 2025",
      resumen: "La Universidad Ricardo Palma inaugura su primera Clínica Veterinaria móvil en colaboración con la Municipalidad de Surco...",
      categoria: "Extensión Universitaria",
      imagen: "Noticia02.jpg"
    },
    {
      id: 3,
      titulo: "URP obtiene acreditaciones internacionales para 14 carreras profesionales",
      autor: "Oficina de Calidad Académica",
      fecha: "07 Oct 2025",
      resumen: "Catorce carreras de la Universidad Ricardo Palma recibieron acreditaciones internacionales que reconocen ...",
      categoria: "Logros",
      imagen: "Noticia03.jpg"
    },
    {
      id: 4,
      titulo: "URP establece nuevo convenio con municipalidad de San Bartolo",
      autor: "Oficina de Cooperación Externa",
      fecha: "08 Oct 2025",
      resumen: "La Universidad Ricardo Palma firma convenio de colaboración con la Municipalidad de San Bartolo para ...",
      categoria: "Extensión Universitaria",
      imagen: "Noticia04.jpg"
    },
    {
      id: 5,
      titulo: "URP organiza X Fiesta de la Poda con celebración de pisco",
      autor: "Facultad de Derecho y Ciencia Política",
      fecha: "09 Oct 2025",
      resumen: "La Universidad Ricardo Palma invita a la comunidad universitaria a la X Fiesta de la Poda, un evento que ...",
      categoria: "Cultura",
      imagen: "Noticia05.jpg"
    },
  ];

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");

  const categorias = ["Todos", "Institucional", "Académico", "Investigación", "Extensión Universitaria","Logros","Estudiantil","Internacional","Innovación","Cultura","Deportes"];

  const noticiasFiltradas =
    categoriaSeleccionada === "Todos"
      ? todasNoticias
      : todasNoticias.filter((n) => n.categoria === categoriaSeleccionada);

  return (
  <div
    className="min-h-screen text-gray-900 flex flex-col pt-20"
    style={{ background: 'linear-gradient(to bottom right, #f9fafb, #ffffff)' }}
  >
      {/* HEADER - Fondo blanco */}
      <header 
        className="py-6 shadow-md w-full relative"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
      >
        <div className="flex items-center justify-center">
          {/* Logo URP - Posicionado absolutamente a la izquierda */}
          <div className="absolute left-8">
            <img 
              src="LogoURP.png" 
              alt="Logo URP" 
              className="h-16"
            />
          </div>
          
          {/* Texto centrado */}
          <div className="text-center">
            <h1 className="text-4xl font-bold" style={{ color: "#00BC4F" }}>
              Noticias URP
            </h1>
            <p className="text-gray-600 mt-2">
              Mantente informado con las últimas novedades
>>>>>>> main
            </p>
          </div>
        </div>
      </header>

      {/* FILTROS - Fondo gris claro */}
      <div
        className="flex flex-wrap justify-center gap-3 p-4 w-full"
        style={{ backgroundColor: "#f8fafc" }}
      >
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaSeleccionada(cat)}
            className="px-4 py-2 rounded-full text-sm font-semibold border-2 transition-colors"
            style={{
              borderColor: "#00BC4F",
              backgroundColor:
                categoriaSeleccionada === cat ? "#00BC4F" : "#FFFFFF",
              color: categoriaSeleccionada === cat ? "#FFFFFF" : "#00BC4F",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID DE NOTICIAS */}
      <main className="flex-grow w-full px-6 py-8 overflow-y-auto">
        {noticiasFiltradas.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full">
            {noticiasFiltradas.map((noticia) => (
              <div
                key={noticia.id}
                className="bg-white text-black rounded-2xl shadow-lg overflow-hidden hover:shadow-green-500/40 transition-shadow flex flex-col w-full"
              >
                <img
                  src={noticia.imagen}
                  alt={noticia.titulo}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h2
                    className="text-xl font-semibold mb-2"
                    style={{ color: "#00BC4F" }}
                  >
                    {noticia.titulo}
                  </h2>
                  <p className="text-sm text-gray-500 mb-2">
                    {noticia.autor} • {noticia.fecha}
                  </p>
                  <p className="text-gray-700 flex-grow">{noticia.resumen}</p>
                  <button
                    className="mt-4 px-5 py-2 rounded-full font-semibold border-2 transition-colors self-end"
                    style={{
                      borderColor: "#00BC4F",
                      backgroundColor: "#FFFFFF",
                      color: "#00BC4F",
                    }}
                  >
                    Leer más
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg mt-10">
            No hay noticias en esta categoría.
          </p>
        )}
      </main>

    </div>
  );
}

export default Noticias;