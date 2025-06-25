"use client"

import { useState, useEffect, useCallback } from "react"
// Componentes
import NoticiasHeader from "../components/noticias/NoticiasHeader"
import NoticiasSearch from "../components/noticias/NoticiasSearch"
import NoticiasList from "../components/noticias/NoticiasList"
import { obtenerNoticias } from "../api/noticiasApi"

const NoticiasPage = () => {
  // ===== ESTADOS =====
  const [noticias, setNoticias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredNoticias, setFilteredNoticias] = useState([])

  // Usuario simulado para demostración
  const [user] = useState({ email: "egresado@urp.edu.pe" })

  // ===== EFECTOS =====

  // Cargar noticias reales del backend
  useEffect(() => {
    const fetchNoticias = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await obtenerNoticias()
        // Si tu backend responde { noticias: [...] }
        setNoticias(response.data.noticias || [])
      } catch (err) {
        setError("No se pudieron cargar las noticias.")
        setNoticias([])
      } finally {
        setLoading(false)
      }
    }
    fetchNoticias()
  }, [])

  // Filtrar noticias por búsqueda
  useEffect(() => {
    const filtered = noticias.filter(
      (noticia) =>
        (noticia.titulo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (noticia.contenido || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (noticia.categoria || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredNoticias(filtered)
  }, [noticias, searchTerm])

  // ===== HANDLERS =====

  const handleNoticiaClick = useCallback((id) => {
    // Aquí puedes navegar al detalle de la noticia si lo deseas
    alert(`Abriendo noticia: ${id}`)
  }, [])

  const handleRetry = useCallback(() => {
    setError(null)
    // Puedes volver a llamar a fetchNoticias aquí si lo deseas
    window.location.reload()
  }, [])

  const handleSearchChange = useCallback((newSearchTerm) => {
    setSearchTerm(newSearchTerm)
  }, [])

  // ===== RENDER PRINCIPAL =====
  return (
    <main className="min-h-screen p-8">
      {/* Efectos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative z-10 p-8">
        {/* Header con información de estado */}
        <NoticiasHeader user={user} error={error} onRetry={handleRetry} />

        {/* Barra de búsqueda */}
        <NoticiasSearch
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          totalNoticias={noticias.length}
          filteredCount={filteredNoticias.length}
        />

        {/* Lista de noticias */}
        <NoticiasList noticias={filteredNoticias} onNoticiaClick={handleNoticiaClick} loading={loading} />

        {/* Footer con información */}
        <footer className="text-center mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-2xl mx-auto">
            <p className="text-white/80 text-sm">
              {searchTerm
                ? `Mostrando ${filteredNoticias.length} de ${noticias.length} noticias`
                : `Total: ${noticias.length} noticias disponibles`}
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}

export default NoticiasPage