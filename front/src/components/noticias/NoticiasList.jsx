"use client"
import NoticiaCard from "./NoticiaCard"

const NoticiasList = ({ noticias, onNoticiaClick, loading }) => {
  // Ordenar: Destacado primero, luego Normal y otros
  const noticiasOrdenadas = [...noticias].sort((a, b) => {
    if (a.estado === "Destacado" && b.estado !== "Destacado") return -1
    if (a.estado !== "Destacado" && b.estado === "Destacado") return 1
    return 0 // Mantiene el orden original entre iguales
  })

  //Componentes de estado
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center min-h-96 text-white" role="status" aria-live="polite">
      <div
        className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"
        aria-hidden="true"
      ></div>
      <p className="text-lg">Cargando noticias...</p>
    </div>
  )

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-96 text-white text-center p-8" role="status">
      <div className="text-6xl mb-4 opacity-70" aria-hidden="true">
        📰
      </div>
      <h3 className="text-2xl font-semibold mb-2">No hay noticias disponibles</h3>
      <p className="text-white/80 max-w-md">No se encontraron noticias que coincidan con tu búsqueda.</p>
    </div>
  )

  const NoticiasGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
      {noticiasOrdenadas.map((noticia) => (
        <NoticiaCard key={noticia._id} noticia={noticia} onClick={onNoticiaClick} />
      ))}
    </div>
  )

  //Render condicional 
  if (loading) {
    return <LoadingState />
  }

  if (noticias.length === 0) {
    return <EmptyState />
  }

  //Render principal 
  return (
    <section className="max-w-7xl mx-auto" aria-label="Lista de noticias">
      <NoticiasGrid />
    </section>
  )
}

export default NoticiasList