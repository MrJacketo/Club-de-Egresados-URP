import { Search, Filter, X } from "lucide-react"
import {
  TIPOS_BENEFICIO,
  ESTADOS_BENEFICIO,
  TIPOS_BENEFICIO_LABELS,
  ESTADOS_BENEFICIO_LABELS
} from "../../constants/Beneficios/GestionBeneficios.enum"

const FiltrosGestionBeneficios = ({ filtros, onFiltrosChange, onLimpiarFiltros }) => {
  const handleInputChange = (campo, valor) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor,
    })
  }

  const hayFiltrosActivos = filtros.titulo || filtros.tipo_beneficio || filtros.estado || filtros.empresa_asociada

  return (
    <div className="bg-white! rounded-2xl! p-6! mb-8! shadow-md! border-2! border-gray-100!">
      <div className="grid! grid-cols-1! md:grid-cols-2! lg:grid-cols-4! gap-4!">
        {/* Búsqueda por título */}
        <div className="relative! group!">
          <input
            type="text"
            placeholder="Buscar por título..."
            value={filtros.titulo || ''}
            onChange={(e) => handleInputChange("titulo", e.target.value)}
            className="w-full! bg-gray-50! text-gray-800! px-5! py-3! pl-12! rounded-xl! transition-all! duration-300! border-2! border-gray-200! hover:border-green-300! focus:border-green-500! focus:bg-white! focus:shadow-lg! placeholder-gray-400!"
            style={{ outline: 'none' }}
            onFocus={(e) => {
              e.target.style.borderColor = '#00C853';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 200, 83, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
          <Search
            className="absolute! left-4! top-1/2! -translate-y-1/2! transition-transform! duration-300! group-hover:scale-110!"
            size={18}
            style={{ color: '#00C853' }}
          />
        </div>

        {/* Filtro por tipo de beneficio */}
        <div>
          <select
            value={filtros.tipo_beneficio || ''}
            onChange={(e) => handleInputChange("tipo_beneficio", e.target.value)}
            className="w-full! px-5! py-3! border-2! border-gray-200! rounded-xl! focus:ring-2! focus:ring-green-500! focus:border-green-500! bg-gray-50! text-gray-800! transition-all! duration-300! hover:border-green-300! focus:bg-white! cursor-pointer! font-medium!"
            style={{ outline: 'none' }}
            onFocus={(e) => {
              e.target.style.borderColor = '#00C853';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 200, 83, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="" className="text-gray-500!">Todos los tipos</option>
            {Object.values(TIPOS_BENEFICIO).map((tipo) => (
              <option key={tipo} value={tipo} className="text-gray-800!">
                {TIPOS_BENEFICIO_LABELS[tipo]}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por estado */}
        <div>
          <select
            value={filtros.estado || ''}
            onChange={(e) => handleInputChange("estado", e.target.value)}
            className="w-full! px-5! py-3! border-2! border-gray-200! rounded-xl! focus:ring-2! focus:ring-green-500! focus:border-green-500! bg-gray-50! text-gray-800! transition-all! duration-300! hover:border-green-300! focus:bg-white! cursor-pointer! font-medium!"
            style={{ outline: 'none' }}
            onFocus={(e) => {
              e.target.style.borderColor = '#00C853';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 200, 83, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="" className="text-gray-500!">Todos los estados</option>
            {Object.values(ESTADOS_BENEFICIO).map((estado) => (
              <option key={estado} value={estado} className="text-gray-800!">
                {ESTADOS_BENEFICIO_LABELS[estado]}
              </option>
            ))}
          </select>
        </div>

        {/* Búsqueda por empresa */}
        <div className="relative! group!">
          <input
            type="text"
            placeholder="Buscar por empresa..."
            value={filtros.empresa_asociada || ''}
            onChange={(e) => handleInputChange("empresa_asociada", e.target.value)}
            className="w-full! bg-gray-50! text-gray-800! px-5! py-3! pl-12! rounded-xl! transition-all! duration-300! border-2! border-gray-200! hover:border-green-300! focus:border-green-500! focus:bg-white! focus:shadow-lg! placeholder-gray-400!"
            style={{ outline: 'none' }}
            onFocus={(e) => {
              e.target.style.borderColor = '#00C853';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 200, 83, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
          <Filter
            className="absolute! left-4! top-1/2! -translate-y-1/2! transition-transform! duration-300! group-hover:scale-110!"
            size={18}
            style={{ color: '#00C853' }}
          />
        </div>
      </div>

      {/* Botón limpiar filtros - Solo visible si hay filtros activos */}
      {hayFiltrosActivos && (
        <div className="mt-6! pt-6! border-t-2! border-gray-100! flex! justify-between! items-center!">
          <p className="text-sm! text-gray-600! font-medium!">
            Filtros activos aplicados
          </p>
          <button
            onClick={onLimpiarFiltros}
            className="inline-flex! items-center! gap-2! px-6! py-3! bg-gray-100! text-gray-700! rounded-xl! hover:bg-gray-200! transition-all! duration-300! font-bold! hover:shadow-md!"
            style={{ border: 'none' }}
          >
            <X size={18} />
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  )
}

export default FiltrosGestionBeneficios