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
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}

export default NoticiasPage