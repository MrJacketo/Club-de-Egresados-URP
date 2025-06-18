"use client"

const NoticiaCard = ({ noticia, onClick }) => {
  // ===== FUNCIONES AUXILIARES =====
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getCategoryColor = (categoria) => {
    const colors = {
      general: "#6B7280",
      economia: "#3B82F6",
      tecnologia: "#8B5CF6",
      deportes: "#F97316",
      salud: "#10B981",
    }
    return colors[categoria] || colors.general
  }

  const truncateText = (text, maxLength) => {
    if (!text) return ""
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // handlers
  const handleImageError = (e) => {
    e.target.style.display = "none"
    e.target.nextSibling.style.display = "flex"
  }

  const handleCardClick = () => {
    onClick(noticia._id)
  }

  //Render
  return (
    <article
      className="bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl border border-gray-100 h-full flex flex-col"
      onClick={handleCardClick}
    >
      {/* Imagen de la noticia */}
      <div className="h-48 overflow-hidden relative">
        {noticia.imagen ? (
          <img
            src={noticia.imagen || "/placeholder.svg?height=200&width=400"}
            alt={noticia.titulo}
            onError={handleImageError}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : null}
        <div
          className="w-full h-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-3xl font-bold"
          style={{ display: noticia.imagen ? "none" : "flex" }}
        >
          <span>URP</span>
        </div>
      </div>

      {/* Contenido de la noticia */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Badges */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <span
            className="px-3 py-1 rounded-full text-white text-xs font-medium capitalize"
            style={{ backgroundColor: getCategoryColor(noticia.categoria) }}
          >
            {noticia.categoria.charAt(0).toUpperCase() + noticia.categoria.slice(1)}
          </span>
          {noticia.destacado && (
            <span className="px-3 py-1 bg-gradient-to-r from-yellow-200 to-yellow-300 text-yellow-800 rounded-full text-xs font-medium border border-yellow-400">
              ⭐ Destacado
            </span>
          )}
        </div>

        {/* Título */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight min-h-[3.5rem]">
          {truncateText(noticia.titulo, 60)}
        </h3>

        {/* Resumen */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-1 min-h-[4.5rem]">
          {truncateText(noticia.resumen || noticia.contenido, 120)}
        </p>

        {/* Metadata */}
        <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100 mt-auto">
          <span className="flex items-center gap-1">
            <span aria-hidden="true">👤</span>
            <span>{noticia.autor}</span>
          </span>
          <span className="flex items-center gap-1">
            <span aria-hidden="true">📅</span>
            <span>{formatDate(noticia.createdAt)}</span>
          </span>
        </div>
      </div>
    </article>
  )
}

export default NoticiaCard
