"use client"
import { Star } from "lucide-react"

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
      style={{ maxWidth: 340, margin: "auto" }}
    >
      {/* Imagen de la noticia */}
      <div className="h-56 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
        {noticia.imagenUrl ? (
          <img
            src={noticia.imagenUrl}
            alt={noticia.titulo}
            onError={handleImageError}
            loading="lazy"
            className="w-full h-full object-cover"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div
            className="w-full h-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-3xl font-bold"
            style={{ display: "flex" }}
          >
            <span>URP</span>
          </div>
        )}
      </div>

      {/* Contenido de la noticia */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Categoría y Estado */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-800">
            {noticia.categoria}
          </span>
          {noticia.estado === "Destacado" ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
              <Star className="w-3 h-3 mr-1" />
              Destacado
            </span>
          ) : (
            <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-200 text-gray-700">
              {noticia.estado}
            </span>
          )}
        </div>

        {/* Título */}
        <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight">
          {truncateText(noticia.titulo, 60)}
        </h3>

        {/* Resumen */}
        <p className="text-gray-700 text-sm mb-4 leading-relaxed flex-1">
          {truncateText(noticia.resumen || noticia.contenido, 100)}
        </p>

        {/* Fecha centrada */}
        <div className="w-full flex justify-center items-center mt-auto pt-2">
          <span className="text-xs text-gray-500 text-center">
            {formatDate(noticia.fechaPublicacion || noticia.createdAt)}
          </span>
        </div>
      </div>
    </article>
  );
}

export default NoticiaCard