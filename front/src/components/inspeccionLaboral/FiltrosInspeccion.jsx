import { Search, Filter, X } from "lucide-react";

const FiltrosInspeccion = ({ filtros, onFiltrosChange, onLimpiarFiltros }) => {
  const handleChange = (campo, valor) => {
    onFiltrosChange({ [campo]: valor });
  };

  const hayFiltrosActivos = filtros.estado || filtros.empresa || filtros.search;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-green-600" />
        <h3 className="text-lg font-semibold text-gray-800">Filtros de Búsqueda</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Búsqueda general */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={filtros.search}
              onChange={(e) => handleChange("search", e.target.value)}
              placeholder="Cargo, empresa, descripción..."
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900"
            />
          </div>
        </div>

        {/* Filtro por estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            value={filtros.estado}
            onChange={(e) => handleChange("estado", e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900"
          >
            <option value="">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Bloqueado">Bloqueado</option>
            <option value="Suspendido">Suspendido</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Pendiente">Pendiente</option>
          </select>
        </div>

        {/* Filtro por empresa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Empresa
          </label>
          <input
            type="text"
            value={filtros.empresa}
            onChange={(e) => handleChange("empresa", e.target.value)}
            placeholder="Nombre de la empresa..."
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900"
          />
        </div>
      </div>

      {/* Botón limpiar filtros */}
      {hayFiltrosActivos && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onLimpiarFiltros}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <X size={16} />
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default FiltrosInspeccion;
