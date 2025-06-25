"use client"
import { Edit, Trash2, Star } from "lucide-react"

const TablaNoticias = ({ noticias, onEditar, onEliminar, loading }) => {
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const obtenerEstiloEstado = (estado) => {
    switch (estado) {
      case "Destacado":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300"
      case "Normal":
        return "bg-gray-100 text-gray-800 border border-gray-300"
      case "Borrador":
        return "bg-blue-100 text-blue-800 border border-blue-300"
      case "Archivado":
        return "bg-red-100 text-red-800 border border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <span className="ml-2 text-gray-600">Cargando noticias...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Listado de Noticias</h3>
        <p className="text-sm text-gray-600 mt-1">Mostrando {noticias.length} noticias</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo de Contenido
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {noticias.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No se encontraron noticias
                </td>
              </tr>
            ) : (
              noticias.map((noticia) => (
                <tr key={noticia._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{noticia.titulo}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {noticia.descripcion || noticia.contenido}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{noticia.categoria}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{noticia.tipoContenido}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obtenerEstiloEstado(noticia.estado)}`}
                    >
                      {noticia.estado === "Destacado" && <Star className="w-3 h-3 mr-1" />}
                      {noticia.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatearFecha(noticia.fechaPublicacion)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEditar(noticia)}
                        className="text-gray-600 hover:text-green-600 transition-colors"
                        title="Editar noticia"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEliminar(noticia)}
                        className="text-gray-600 hover:text-red-600 transition-colors"
                        title="Eliminar noticia"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TablaNoticias