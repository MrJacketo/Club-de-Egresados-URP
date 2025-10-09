"use client";
import { Edit, Trash2, Star, Eye, Calendar, Tag, FileText } from "lucide-react";

const TablaNoticias = ({ noticias, onEditar, onEliminar, loading }) => {
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const obtenerEstiloEstado = (estado) => {
    switch (estado) {
      case "Destacado":
        return "bg-green-100 text-green-700";
      case "Normal":
        return "bg-gray-100 text-gray-700";
      case "Borrador":
        return "bg-blue-100 text-blue-700";
      case "Archivado":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-4" style={{ borderColor: '#00C853' }}></div>
          <span className="ml-3 text-gray-700 font-medium text-lg">Cargando noticias...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#01a83c]">
                <th className="px-6 py-4 text-left text-white font-bold text-sm">
                  Noticia
                </th>
                <th className="px-6 py-4 text-left text-white font-bold text-sm">
                  Categoría
                </th>
                <th className="px-6 py-4 text-left text-white font-bold text-sm">
                  Tipo de Contenido
                </th>
                <th className="px-6 py-4 text-left text-white font-bold text-sm">
                  Fecha de Publicación
                </th>
                <th className="px-6 py-4 text-center text-white font-bold text-sm">
                  Estado
                </th>
                <th className="px-6 py-4 text-center text-white font-bold text-sm">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {noticias.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Eye className="w-16 h-16 text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium text-lg mb-1">
                        No se encontraron noticias
                      </p>
                      <p className="text-gray-400 text-sm">
                        Intenta ajustar tus filtros o crea una nueva noticia
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                noticias.map((noticia, index) => (
                  <tr
                    key={noticia._id}
                    className={`border-b border-gray-100 hover:bg-green-50 transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    {/* Columna de Noticia con imagen y título */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {noticia.imagenUrl ? (
                          <img
                            src={noticia.imagenUrl}
                            alt={noticia.titulo}
                            className="w-16 h-16 rounded-lg object-cover shadow-md"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-[#01a83c] flex items-center justify-center">
                            <FileText className="w-8 h-8 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">
                            {noticia.titulo}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {noticia.descripcion || noticia.contenido}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Columna de Categoría */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Tag size={16} style={{ color: '#01a83c' }} />
                        <span className="text-sm font-medium text-gray-700">
                          {noticia.categoria}
                        </span>
                      </div>
                    </td>

                    {/* Columna de Tipo de Contenido */}
                    <td className="px-6 py-4">
                      <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {noticia.tipoContenido}
                      </span>
                    </td>

                    {/* Columna de Fecha */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} style={{ color: '#00C853' }} />
                        <span className="text-sm font-medium text-gray-700">
                          {formatearFecha(noticia.fechaPublicacion)}
                        </span>
                      </div>
                    </td>

                    {/* Columna de Estado */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold ${obtenerEstiloEstado(
                          noticia.estado
                        )}`}
                      >
                        {noticia.estado === "Destacado" && (
                          <Star size={14} style={{ fill: 'currentColor' }} />
                        )}
                        {noticia.estado}
                      </span>
                    </td>

                    {/* Columna de Acciones */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => onEditar(noticia)}
                          className="inline-flex items-center bg-[#01a83c]! gap-2 px-4 py-2 rounded-lg! transition-all! duration-300! hover:shadow-md! hover:scale-105!"
                          
                          title="Editar noticia"
                        >
                          <Edit className="w-4 h-4" style={{ color: '#fff' }} />
                          <span className="text-white text-xs font-bold">Editar</span>
                        </button>
                        <button
                          onClick={() => onEliminar(noticia)}
                          className="inline-flex items-center gap-2 bg-red-500! px-4 py-2 rounded-lg! transition-all! duration-300! hover:bg-red-600! hover:shadow-md! hover:scale-105!"
                          style={{ border: 'none' }}
                          title="Eliminar noticia"
                        >
                          <Trash2 className="w-4 h-4" style={{ color: '#fff' }} />
                          <span className="text-white text-xs font-bold">Eliminar</span>
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

      
    </div>
  );
};

export default TablaNoticias;