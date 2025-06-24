"use client"
import { useState, useEffect, useCallback } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../firebase"

// Componentes
import NoticiasHeader from "./NoticiasHeader.jsx"
import NoticiasSearch from "./NoticiasSearch.jsx"
import NoticiasList from "./NoticiasList.jsx"

// API y datos
import {
  obtenerNoticiasConAuthRequest,
  verificarConectividadRequest,
  verificarAutenticacionRequest,
} from "../../api/noticiasApi.js"
import { noticiasDemo } from "../../demo/noticiasDemo.js"

// Estilos
import "./Noticias.css"

const Noticias = () => {
  // ===== ESTADOS =====
  const [noticias, setNoticias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredNoticias, setFilteredNoticias] = useState([])
  const [usingDemo, setUsingDemo] = useState(false)
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // ===== EFECTOS =====

  // Escuchar cambios en autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Estado de autenticación:", currentUser ? "Autenticado" : "No autenticado")
      setUser(currentUser)
      setAuthLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Cargar noticias cuando cambie el usuario
  useEffect(() => {
    if (!authLoading) {
      fetchNoticias()
    }
  }, [user, authLoading])

  // Filtrar noticias por búsqueda
  useEffect(() => {
  const filtered = noticias
    .filter(Boolean)
    .filter(
      (noticia) =>
        (noticia.titulo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (noticia.contenido || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (noticia.categoria || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (noticia.autor || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  setFilteredNoticias(filtered)
}, [noticias, searchTerm])

  // ===== FUNCIONES =====

  const fetchNoticias = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setUsingDemo(false)

      // Verificar autenticación
      if (!user) {
        console.warn("Usuario no autenticado, usando datos de demostración")
        setNoticias(noticiasDemo)
        setUsingDemo(true)
        setError("Necesitas iniciar sesión para ver las noticias actualizadas.")
        return
      }

      // Verificar conectividad
      const isConnected = await verificarConectividadRequest()
      if (!isConnected) {
        console.warn("Backend no disponible, usando datos de demostración")
        setNoticias(noticiasDemo)
        setUsingDemo(true)
        setError("Backend no disponible. Mostrando datos de demostración.")
        return
      }

      // Verificar token válido
      const isAuthenticated = await verificarAutenticacionRequest()
      if (!isAuthenticated) {
        console.warn("Token inválido, usando datos de demostración")
        setNoticias(noticiasDemo)
        setUsingDemo(true)
        setError("Sesión expirada. Por favor, inicia sesión nuevamente.")
        return
      }

      // Obtener datos reales
      const data = await obtenerNoticiasConAuthRequest()
      if (!data || data.length === 0) {
        console.warn("No hay noticias en el backend")
        setNoticias(noticiasDemo)
        setUsingDemo(true)
      } else {
        setNoticias(data)
        console.log("Noticias cargadas exitosamente:", data.length)
      }
    } catch (err) {
      console.error("Error al cargar noticias:", err)
      setError(err.message)
      setNoticias(noticiasDemo)
      setUsingDemo(true)
    } finally {
      setLoading(false)
    }
  }, [user])

  // ===== HANDLERS =====

  const handleNoticiaClick = useCallback((id) => {
    console.log("Noticia seleccionada:", id)
    // TODO: Implementar navegación al detalle
    alert(`Abriendo noticia: ${id}`)
  }, [])

  const handleRetry = useCallback(() => {
    if (user) {
      fetchNoticias()
    } else {
      setError("Necesitas iniciar sesión para cargar las noticias.")
    }
  }, [user, fetchNoticias])

  const handleSearchChange = useCallback((newSearchTerm) => {
    setSearchTerm(newSearchTerm)
  }, [])

  // ===== RENDER CONDICIONAL =====

  if (authLoading) {
    return (
      <div className="noticias-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // ===== RENDER PRINCIPAL =====
  return (
    <main className="noticias-container">
      <div className="noticias-content">
        <NoticiasHeader user={user} error={error} usingDemo={usingDemo} onRetry={handleRetry} />

        <NoticiasSearch
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          totalNoticias={noticias.length}
          filteredCount={filteredNoticias.length}
        />

        <NoticiasList noticias={filteredNoticias} onNoticiaClick={handleNoticiaClick} loading={loading} />

        {/* Footer con información */}
        <footer className="noticias-footer">
          <div className="footer-content">
            <p className="footer-stats">
              {searchTerm
                ? `Mostrando ${filteredNoticias.length} de ${noticias.length} noticias`
                : `Total: ${noticias.length} noticias disponibles`}
            </p>
            {usingDemo && (
              <p className="footer-demo-info">
                💡{" "}
                {!user
                  ? "Inicia sesión para ver noticias reales del sistema"
                  : "Verifica que tu backend esté ejecutándose en el puerto 8000"}
              </p>
            )}
          </div>
        </footer>
      </div>
    </main>
  )
}

export default Noticias