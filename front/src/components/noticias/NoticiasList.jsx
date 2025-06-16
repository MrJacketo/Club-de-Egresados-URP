"use client"
import NoticiaCard from "./NoticiaCard"

const NoticiasList = ({ noticias, onNoticiaClick, loading }) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
      {noticias.map((noticia) => (
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

  //Render pricipal 
  return (
    <section className="max-w-7xl mx-auto" aria-label="Lista de noticias">
      <NoticiasGrid />
    </section>
  )
}

export default NoticiasList