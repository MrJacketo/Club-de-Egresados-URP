import { useState, useEffect } from "react"
import { Plus, AlertCircle, CheckCircle, Star, Gift, TrendingUp, FileText, Archive, Edit, Trash2 } from "lucide-react"
import { getBeneficiosAdmin, createBeneficio, updateBeneficio, deleteBeneficio } from '../../api/gestionarBeneficiosApi'
import FiltrosGestionBeneficios from "../../components/gestionBeneficios/FiltrosGestionBeneficios"
import ModalBeneficio from "../../components/gestionBeneficios/ModalBeneficio"
import ModalConfirmacion from "../../components/gestionBeneficios/ModalConfirmacion"
import AdminSidebar from '../../components/AdminSidebar';
import { AdminSidebarProvider, useAdminSidebar } from '../../context/adminSidebarContext';

// Componente contenedor con el Provider
const GestionBeneficios = () => {
  return (
    <AdminSidebarProvider>
      <GestionBeneficiosContent />
    </AdminSidebarProvider>
  );
};

// Componente principal con acceso al contexto
const GestionBeneficiosContent = () => {
  const { collapsed } = useAdminSidebar();
  
  const [beneficios, setBeneficios] = useState([])
  const [beneficiosFiltrados, setBeneficiosFiltrados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)
  const [itemsPorPagina] = useState(10)
  const [filtros, setFiltros] = useState({
    titulo: '',
    tipo_beneficio: '',
    estado: '',
    empresa_asociada: ''
  })

  const [modalBeneficioAbierto, setModalBeneficioAbierto] = useState(false)
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false)
  const [beneficioSeleccionado, setBeneficioSeleccionado] = useState(null)
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" })

  // Cargar beneficios
  useEffect(() => {
    fetchBeneficios();
  }, []);

  // Aplicar filtros cuando cambien los beneficios o filtros
  useEffect(() => {
    aplicarFiltros();
  }, [beneficios, filtros]);

  const fetchBeneficios = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getBeneficiosAdmin();
      const normalized = (data || []).map((b) => ({
        _id: b._id || b.id,
        titulo: b.titulo || b.nombre || '',
        descripcion: b.descripcion || b.detalle || '',
        tipo_beneficio: b.tipo_beneficio || b.tipo || 'academico',
        empresa_asociada: b.empresa_asociada || '',
        fecha_inicio: b.fecha_inicio ? new Date(b.fecha_inicio).toISOString().slice(0,10) : '',
        fecha_fin: b.fecha_fin ? new Date(b.fecha_fin).toISOString().slice(0,10) : '',
        estado: b.estado || 'activo',
        url_detalle: b.url_detalle || '',
        imagen_beneficio: b.imagen_beneficio || '',
        fechaCreacion: b.fechaCreacion || b.createdAt || new Date(),
      }));
      setBeneficios(normalized);
    } catch (err) {
      console.error('error fetching beneficios', err);
      setError("Error al cargar los beneficios");
      setBeneficios([]);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let beneficiosFiltrados = [...beneficios];

    // Filtrar por título
    if (filtros.titulo) {
      beneficiosFiltrados = beneficiosFiltrados.filter(beneficio =>
        beneficio.titulo.toLowerCase().includes(filtros.titulo.toLowerCase())
      );
    }

    // Filtrar por tipo de beneficio
    if (filtros.tipo_beneficio) {
      beneficiosFiltrados = beneficiosFiltrados.filter(beneficio =>
        beneficio.tipo_beneficio === filtros.tipo_beneficio
      );
    }

    // Filtrar por estado
    if (filtros.estado) {
      beneficiosFiltrados = beneficiosFiltrados.filter(beneficio =>
        beneficio.estado === filtros.estado
      );
    }

    // Filtrar por empresa
    if (filtros.empresa_asociada) {
      beneficiosFiltrados = beneficiosFiltrados.filter(beneficio =>
        beneficio.empresa_asociada.toLowerCase().includes(filtros.empresa_asociada.toLowerCase())
      );
    }

    setBeneficiosFiltrados(beneficiosFiltrados);
    setPaginaActual(1); // Resetear a la primera página al filtrar
  };

  const limpiarFiltros = () => {
    setFiltros({
      titulo: '',
      tipo_beneficio: '',
      estado: '',
      empresa_asociada: ''
    });
  };

  // Calcular estadísticas (usar todos los beneficios, no los filtrados)
  const totalBeneficios = beneficios.length
  const beneficiosActivos = beneficios.filter(b => b.estado === "activo").length
  const beneficiosInactivos = beneficios.filter(b => b.estado === "inactivo").length
  const beneficiosAcademicos = beneficios.filter(b => b.tipo_beneficio === "academico").length
  const activosRate = totalBeneficios > 0 ? ((beneficiosActivos / totalBeneficios) * 100).toFixed(1) : 0

  // Calcular paginación
  const indexUltimo = paginaActual * itemsPorPagina;
  const indexPrimero = indexUltimo - itemsPorPagina;
  const beneficiosParaMostrar = beneficiosFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(beneficiosFiltrados.length / itemsPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manejar creación de nuevo beneficio
  const handleNuevoBeneficio = () => {
    setBeneficioSeleccionado(null)
    setModalBeneficioAbierto(true)
  }

  // Manejar edición de beneficio
  const handleEditarBeneficio = (beneficio) => {
    setBeneficioSeleccionado(beneficio)
    setModalBeneficioAbierto(true)
  }

  // Manejar eliminación de beneficio
  const handleEliminarBeneficio = (beneficio) => {
    setBeneficioSeleccionado(beneficio)
    setModalConfirmacionAbierto(true)
  }

  // Manejar envío del formulario
  const handleSubmitBeneficio = async (formData) => {
    try {
      let resultado
      if (beneficioSeleccionado) {
        resultado = await updateBeneficio(beneficioSeleccionado._id, formData)
      } else {
        resultado = await createBeneficio(formData)
      }

      if (resultado.success) {
        setMensaje({ tipo: "success", texto: beneficioSeleccionado ? "Beneficio actualizado exitosamente" : "Beneficio creado exitosamente" })
        setModalBeneficioAbierto(false)
        setBeneficioSeleccionado(null)
        await fetchBeneficios()

        // Limpiar mensaje después de 5 segundos
        setTimeout(() => setMensaje({ tipo: "", texto: "" }), 5000)
      } else {
        setMensaje({ tipo: "error", texto: resultado.message || "Error al procesar el beneficio" })
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje({ tipo: "error", texto: error.response?.data?.message || error.message || "Error inesperado al procesar el beneficio" })
    }
  }

  // Confirmar eliminación
  const handleConfirmarEliminacion = async () => {
    try {
      const resultado = await deleteBeneficio(beneficioSeleccionado._id)

      if (resultado.success) {
        setMensaje({ tipo: "success", texto: "Beneficio eliminado exitosamente" })
        setModalConfirmacionAbierto(false)
        setBeneficioSeleccionado(null)
        await fetchBeneficios()

        // Limpiar mensaje después de 5 segundos
        setTimeout(() => setMensaje({ tipo: "", texto: "" }), 5000)
      } else {
        setMensaje({ tipo: "error", texto: resultado.message || "Error al eliminar el beneficio" })
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje({ tipo: "error", texto: "Error inesperado al eliminar el beneficio" })
    }
  }
  
  return (
    <div className="flex min-h-screen pt-12" style={{ background: 'linear-gradient(to bottom right, #f9fafb, #ffffff)' }}>
      <AdminSidebar />
      <div className={`flex-1 transition-all duration-300 py-8 px-8 ${
          collapsed ? "ml-20" : "ml-64"
        }`}>
        
          {/* Header de la página */}
          <div className="flex flex-wrap items-center justify-between mb-8">
            <h1 className="text-5xl! font-bold! mb-2!">
              <span className="bg-gradient-to-r! from-green-500! to-teal-500! bg-clip-text! text-transparent!">
                Gestión de Beneficios
              </span>
            </h1>
            <button
              onClick={handleNuevoBeneficio}
              className="flex! items-center! px-6! py-3! text-white! rounded-full! font-bold! transition-all! duration-300! hover:scale-110! transform! hover:-translate-y-1!"
              style={{ 
                background: 'linear-gradient(135deg, #16a34a, #14b8a6)',
                border: 'none'
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Nuevo Beneficio
            </button>
          </div>

          {/* Métricas estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-xl">
                  <Gift style={{ fontSize: 32, color: '#fff' }} />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp style={{ fontSize: 20 }} />
                  <span className="text-sm font-bold">100%</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Beneficios</p>
              <p className="text-4xl font-bold text-gray-800">{totalBeneficios}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-4 rounded-xl">
                  <Star style={{ fontSize: 32, color: '#16a34a' }} />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp style={{ fontSize: 20 }} />
                  <span className="text-sm font-bold">{activosRate}%</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Beneficios Activos</p>
              <p className="text-4xl font-bold text-gray-800">{beneficiosActivos}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gray-100 p-4 rounded-xl">
                  <FileText style={{ fontSize: 32, color: '#6b7280' }} />
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <TrendingUp style={{ fontSize: 20 }} />
                  <span className="text-sm font-bold">{totalBeneficios > 0 ? ((beneficiosAcademicos / totalBeneficios) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Beneficios Académicos</p>
              <p className="text-4xl font-bold text-gray-800">{beneficiosAcademicos}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-red-100 p-4 rounded-xl">
                  <Archive style={{ fontSize: 32, color: '#dc2626' }} />
                </div>
                <div className="flex items-center gap-1 text-red-600">
                  <TrendingUp style={{ fontSize: 20 }} />
                  <span className="text-sm font-bold">{totalBeneficios > 0 ? ((beneficiosInactivos / totalBeneficios) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Beneficios Inactivos</p>
              <p className="text-4xl font-bold text-gray-800">{beneficiosInactivos}</p>
            </div>
          </div>

          {/* Filtros de búsqueda */}
          <FiltrosGestionBeneficios
            filtros={filtros}
            onFiltrosChange={setFiltros}
            onLimpiarFiltros={limpiarFiltros}
          />

          {/* Mensajes de estado */}
          {mensaje.texto && (
            <div
              className={`mb-6! p-4! rounded-xl! flex! items-center! shadow-lg! ${
                mensaje.tipo === "success"
                  ? "bg-green-100! text-green-800! border! border-green-300!"
                  : "bg-red-100! text-red-800! border! border-red-300!"
              }`}
            >
              {mensaje.tipo === "success" ? (
                <CheckCircle className="w-5 h-5 mr-2" style={{ color: '#16a34a' }} />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" style={{ color: '#dc2626' }} />
              )}
              <span className="font-medium!">{mensaje.texto}</span>
            </div>
          )}

          {/* Error general */}
          {error && (
            <div className="mb-6! p-4! bg-red-100! text-red-800! rounded-xl! flex! items-center! border! border-red-300! shadow-lg!">
              <AlertCircle className="w-5 h-5 mr-2" style={{ color: '#dc2626' }} />
              <span className="font-medium!">{error}</span>
            </div>
          )}

          {/* Contador de resultados */}
          <div className="mb-4">
            <p className="text-gray-600 font-semibold text-lg">
              Mostrando {beneficiosParaMostrar.length} de {beneficiosFiltrados.length} beneficios (Página {paginaActual} de {totalPaginas || 1})
            </p>
          </div>

          {/* Tabla de beneficios */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold">Título</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Tipo</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Empresa</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">Estado</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Vigencia</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Cargando beneficios...</p>
                      </td>
                    </tr>
                  ) : beneficiosParaMostrar.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        {beneficios.length === 0 ? (
                          <>
                            <p>No hay beneficios registrados</p>
                            <button
                              onClick={handleNuevoBeneficio}
                              className="mt-4 text-green-600 hover:text-green-700 font-medium"
                            >
                              Crear el primer beneficio
                            </button>
                          </>
                        ) : (
                          <p>No se encontraron beneficios con los filtros aplicados</p>
                        )}
                      </td>
                    </tr>
                  ) : (
                    beneficiosParaMostrar.map((beneficio) => (
                      <tr key={beneficio._id} className="hover:bg-green-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{beneficio.titulo}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{beneficio.descripcion}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                            {beneficio.tipo_beneficio}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-700">{beneficio.empresa_asociada || 'N/A'}</p>
                          {beneficio.url_detalle && (
                            <p className="text-xs text-blue-600">🔗 Enlace disponible</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            beneficio.estado === 'activo'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {beneficio.estado === 'activo' ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {beneficio.fecha_inicio ? (
                            <>
                              <p>📅 {beneficio.fecha_inicio}</p>
                              {beneficio.fecha_fin && <p>🔚 {beneficio.fecha_fin}</p>}
                            </>
                          ) : (
                            <p className="text-gray-400">Sin fechas</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditarBeneficio(beneficio)}
                              className="p-2! bg-blue-100! hover:bg-blue-200! text-blue-600! rounded-lg! transition-colors!"
                              title="Editar beneficio"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleEliminarBeneficio(beneficio)}
                              className="p-2! bg-red-100! hover:bg-red-200! text-red-600! rounded-lg! transition-colors!"
                              title="Eliminar beneficio"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Controles de paginación */}
            {totalPaginas > 1 && (
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Mostrando <span className="font-semibold">{indexPrimero + 1}</span> a <span className="font-semibold">{Math.min(indexUltimo, beneficiosFiltrados.length)}</span> de <span className="font-semibold">{beneficiosFiltrados.length}</span> resultados
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => cambiarPagina(paginaActual - 1)}
                      disabled={paginaActual === 1}
                      className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-300"
                    >
                      Anterior
                    </button>
                    
                    {/* Números de página */}
                    <div className="flex gap-1">
                      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pageNum) => {
                        if (
                          pageNum === 1 ||
                          pageNum === totalPaginas ||
                          (pageNum >= paginaActual - 1 && pageNum <= paginaActual + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => cambiarPagina(pageNum)}
                              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                pageNum === paginaActual
                                  ? "bg-green-500 text-white"
                                  : "bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-300"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          pageNum === paginaActual - 2 ||
                          pageNum === paginaActual + 2
                        ) {
                          return <span key={pageNum} className="px-2 py-2 text-gray-500">...</span>;
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => cambiarPagina(paginaActual + 1)}
                      disabled={paginaActual === totalPaginas}
                      className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-300"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal de beneficio */}
          <ModalBeneficio
            isOpen={modalBeneficioAbierto}
            onClose={() => {
              setModalBeneficioAbierto(false);
              setBeneficioSeleccionado(null);
            }}
            onSubmit={handleSubmitBeneficio}
            beneficio={beneficioSeleccionado}
            loading={loading}
          />

          {/* Modal de confirmación */}
          <ModalConfirmacion
            isOpen={modalConfirmacionAbierto}
            onClose={() => {
              setModalConfirmacionAbierto(false);
              setBeneficioSeleccionado(null);
            }}
            onConfirm={handleConfirmarEliminacion}
            beneficio={beneficioSeleccionado}
            loading={loading}
          />
        
      </div>
    </div>
  );
};

export default GestionBeneficios;
