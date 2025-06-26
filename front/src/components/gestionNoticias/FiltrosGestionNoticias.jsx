"use client"
import {
  CATEGORIAS_NOTICIAS,
  TIPOS_CONTENIDO,
  ESTADOS_NOTICIA,
} from "../../constants/GestionNoticias/GestionNoticias.enum"

const FiltrosGestionNoticias = ({ filtros, onFiltrosChange, onLimpiarFiltros }) => {
  const handleInputChange = (campo, valor) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor,
    })
  }

  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Búsqueda por título */}
        <div>
          <input
            type="text"
            placeholder="Buscar por título"
            value={filtros.titulo}
            onChange={(e) => handleInputChange("titulo", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black placeholder-gray-500"
            style={{ color: "#000" }}
          />
        </div>

        {/* Filtro por categoría */}
        <div>
          <select
            value={filtros.categoria}
            onChange={(e) => handleInputChange("categoria", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-black"
            style={{ color: "#000" }}
          >
            <option value="">Seleccione una Categoría</option>
            {Object.values(CATEGORIAS_NOTICIAS).map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por tipo */}
        <div>
          <select
            value={filtros.tipo}
            onChange={(e) => handleInputChange("tipo", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-black"
            style={{ color: "#000" }}
          >
            <option value="">Seleccione un Tipo</option>
            {Object.values(TIPOS_CONTENIDO).map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por estado */}
        <div>
          <select
            value={filtros.estado}
            onChange={(e) => handleInputChange("estado", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-black"
            style={{ color: "#000" }}
          >
            <option value="">Seleccione un Estado</option>
            {Object.values(ESTADOS_NOTICIA).map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botón limpiar filtros */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={onLimpiarFiltros}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          style={{ fontWeight: 600 }}
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  )
}

export default FiltrosGestionNoticias