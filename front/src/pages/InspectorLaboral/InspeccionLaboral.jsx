import { useState } from "react";
import { 
  Briefcase, 
  CheckCircle, 
  Ban, 
  AlertTriangle, 
  TrendingUp, 
  Eye,
  Building2,
  ShieldAlert
} from "lucide-react";
import { useInspeccionLaboral } from "../../Hooks/useInspeccionLaboral";
import FiltrosInspeccion from "../../components/inspeccionLaboral/FiltrosInspeccion";
import FiltrosEmpresas from "../../components/inspeccionLaboral/FiltrosEmpresas";
import ModalDetalleOferta from "../../components/inspeccionLaboral/ModalDetalleOferta";
import ModalBloqueoOferta from "../../components/inspeccionLaboral/ModalBloqueoOferta";
import ModalSuspensionEmpresa from "../../components/inspeccionLaboral/ModalSuspensionEmpresa";

const InspeccionLaboral = () => {
  const {
    ofertas,
    empresas,
    estadisticas,
    loading,
    error,
    filtros,
    pagination,
    empresasPagination,
    empresasFiltros,
    bloquearOferta,
    suspenderEmpresa,
    obtenerDetalleOferta,
    aplicarFiltros,
    limpiarFiltros,
    cambiarPagina,
    cambiarPaginaEmpresas,
    aplicarFiltrosEmpresas,
    limpiarFiltrosEmpresas
  } = useInspeccionLaboral();

  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [modalBloqueoAbierto, setModalBloqueoAbierto] = useState(false);
  const [modalSuspensionAbierto, setModalSuspensionAbierto] = useState(false);
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState(null);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [vistaActual, setVistaActual] = useState("ofertas"); // "ofertas" o "empresas"

  // Manejar ver detalles
  const handleVerDetalle = async (oferta) => {
    try {
      const detalleCompleto = await obtenerDetalleOferta(oferta._id);
      setOfertaSeleccionada(detalleCompleto);
      setModalDetalleAbierto(true);
    } catch (err) {
      setMensaje({ tipo: "error", texto: "Error al cargar detalles de la oferta" });
      setTimeout(() => setMensaje({ tipo: "", texto: "" }), 5000);
    }
  };

  // Manejar bloqueo de oferta
  const handleBloquearOferta = (oferta) => {
    setOfertaSeleccionada(oferta);
    setModalBloqueoAbierto(true);
  };

  // Confirmar bloqueo de oferta
  const handleConfirmarBloqueo = async (motivo) => {
    try {
      const resultado = await bloquearOferta(ofertaSeleccionada._id, motivo);
      
      if (resultado.success) {
        setMensaje({ tipo: "success", texto: resultado.message });
        setModalBloqueoAbierto(false);
        setOfertaSeleccionada(null);
        setTimeout(() => setMensaje({ tipo: "", texto: "" }), 5000);
      } else {
        setMensaje({ tipo: "error", texto: resultado.message });
      }
    } catch (err) {
      setMensaje({ tipo: "error", texto: "Error al cambiar estado de la oferta" });
    }
  };

  // Manejar suspensión de empresa
  const handleSuspenderEmpresa = (empresa) => {
    setEmpresaSeleccionada(empresa);
    setModalSuspensionAbierto(true);
  };

  // Confirmar suspensión de empresa
  const handleConfirmarSuspension = async (suspender, motivo) => {
    try {
      const resultado = await suspenderEmpresa(empresaSeleccionada.nombre, suspender, motivo);
      
      if (resultado.success) {
        setMensaje({ tipo: "success", texto: resultado.message });
        setModalSuspensionAbierto(false);
        setEmpresaSeleccionada(null);
        setTimeout(() => setMensaje({ tipo: "", texto: "" }), 5000);
      } else {
        setMensaje({ tipo: "error", texto: resultado.message });
      }
    } catch (err) {
      setMensaje({ tipo: "error", texto: "Error al cambiar estado de la empresa" });
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Activo': return 'bg-green-100 text-green-800';
      case 'Bloqueado': return 'bg-red-100 text-red-800';
      case 'Suspendido': return 'bg-orange-100 text-orange-800';
      case 'Inactivo': return 'bg-gray-100 text-gray-800';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen pt-24 px-8 py-8" style={{ background: 'linear-gradient(to bottom right, #f9fafb, #ffffff)' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl! font-bold! mb-2!">
          <span className="bg-gradient-to-r! from-green-500! to-teal-500! bg-clip-text! text-transparent!">
            Inspección Laboral
          </span>
        </h1>
        <p className="text-gray-600 text-lg">Sistema de control y supervisión de ofertas laborales y empresas</p>
      </div>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-xl">
                <Briefcase style={{ fontSize: 32, color: '#fff' }} />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp style={{ fontSize: 20 }} />
                <span className="text-sm font-bold">100%</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Ofertas</p>
            <p className="text-4xl font-bold text-gray-800">{estadisticas.totalOfertas}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-4 rounded-xl">
                <CheckCircle style={{ fontSize: 32, color: '#16a34a' }} />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp style={{ fontSize: 20 }} />
                <span className="text-sm font-bold">
                  {estadisticas.totalOfertas > 0 
                    ? ((estadisticas.ofertasActivas / estadisticas.totalOfertas) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Ofertas Activas</p>
            <p className="text-4xl font-bold text-gray-800">{estadisticas.ofertasActivas}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 p-4 rounded-xl">
                <Ban style={{ fontSize: 32, color: '#dc2626' }} />
              </div>
              <div className="flex items-center gap-1 text-red-600">
                <TrendingUp style={{ fontSize: 20 }} />
                <span className="text-sm font-bold">
                  {estadisticas.totalOfertas > 0 
                    ? ((estadisticas.ofertasBloqueadas / estadisticas.totalOfertas) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Ofertas Bloqueadas</p>
            <p className="text-4xl font-bold text-gray-800">{estadisticas.ofertasBloqueadas}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-4 rounded-xl">
                <ShieldAlert style={{ fontSize: 32, color: '#ea580c' }} />
              </div>
              <div className="flex items-center gap-1 text-orange-600">
                <TrendingUp style={{ fontSize: 20 }} />
                <span className="text-sm font-bold">
                  {estadisticas.totalOfertas > 0 
                    ? ((estadisticas.empresasSuspendidas / estadisticas.totalOfertas) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Empresas Suspendidas</p>
            <p className="text-4xl font-bold text-gray-800">{estadisticas.empresasSuspendidas || 0}</p>
          </div>
        </div>
      )}

      {/* Tabs de navegación */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setVistaActual("ofertas")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            vistaActual === "ofertas"
              ? "bg-green-500 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Briefcase className="inline mr-2" size={20} />
          Ofertas Laborales
        </button>
        <button
          onClick={() => setVistaActual("empresas")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            vistaActual === "empresas"
              ? "bg-green-500 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Building2 className="inline mr-2" size={20} />
          Empresas
        </button>
      </div>

      {vistaActual === "ofertas" && (
        <>
          {/* Filtros */}
          <FiltrosInspeccion
            filtros={filtros}
            onFiltrosChange={aplicarFiltros}
            onLimpiarFiltros={limpiarFiltros}
          />

          {/* Mensajes */}
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
                <AlertTriangle className="w-5 h-5 mr-2" style={{ color: '#dc2626' }} />
              )}
              <span className="font-medium!">{mensaje.texto}</span>
            </div>
          )}

          {/* Error general */}
          {error && (
            <div className="mb-6! p-4! bg-red-100! text-red-800! rounded-xl! flex! items-center! border! border-red-300! shadow-lg!">
              <AlertTriangle className="w-5 h-5 mr-2" style={{ color: '#dc2626' }} />
              <span className="font-medium!">{error}</span>
            </div>
          )}

          {/* Contador de resultados */}
          <div className="mb-4">
            <p className="text-gray-600 font-semibold text-lg">
              Mostrando {ofertas.length} de {pagination.totalItems} ofertas (Página {pagination.currentPage} de {pagination.totalPages})
            </p>
          </div>

          {/* Tabla de ofertas */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold">Cargo</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Empresa</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Ubicación</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">Estado</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Fecha</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Cargando ofertas...</p>
                      </td>
                    </tr>
                  ) : ofertas.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        No se encontraron ofertas con los filtros aplicados
                      </td>
                    </tr>
                  ) : (
                    ofertas.map((oferta) => (
                      <tr key={oferta._id} className="hover:bg-green-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{oferta.cargo}</p>
                          <p className="text-sm text-gray-500">{oferta.area || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-700">{oferta.empresa}</p>
                          <p className="text-sm text-gray-500">{oferta.modalidad}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-700">{oferta.ubicacion}</p>
                          <p className="text-sm text-gray-500">{oferta.tipoContrato}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            oferta.estado === 'Activo' 
                              ? 'bg-green-100 text-green-700' 
                              : oferta.estado === 'Bloqueado'
                              ? 'bg-red-100 text-red-700'
                              : oferta.estado === 'Suspendido'
                              ? 'bg-orange-100 text-orange-700'
                              : oferta.estado === 'Pendiente'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {oferta.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(oferta.fechaPublicacion).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {/* Ver detalles */}
                            <button
                              onClick={() => handleVerDetalle(oferta)}
                              className="p-2! bg-blue-100! hover:bg-blue-200! text-blue-600! rounded-lg! transition-colors!"
                              title="Ver detalles"
                            >
                              <Eye size={18} />
                            </button>
                            
                            {/* Bloquear/Desbloquear */}
                            {oferta.estado === 'Bloqueado' ? (
                              <button
                                onClick={() => handleBloquearOferta(oferta)}
                                className="flex items-center justify-center gap-1.5 w-28! h-10! bg-emerald-100! hover:bg-emerald-200! text-emerald-600! rounded-lg! transition-colors! font-bold! text-xs!"
                                title="Desbloquear oferta"
                              >
                                <span>Desbloquear</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBloquearOferta(oferta)}
                                className="flex items-center justify-center gap-1.5 w-28! h-10! bg-red-100! hover:bg-red-200! text-red-600! rounded-lg! transition-colors! font-bold! text-xs!"
                                title="Bloquear oferta"
                              >
                                <span>Bloquear</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Controles de paginación */}
            {pagination.totalPages > 1 && (
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Mostrando <span className="font-semibold">{ofertas.length}</span> de <span className="font-semibold">{pagination.totalItems}</span> resultados
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => cambiarPagina(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-300"
                    >
                      Anterior
                    </button>
                    
                    {/* Números de página */}
                    <div className="flex gap-1">
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => {
                        // Mostrar solo páginas cercanas a la actual
                        if (
                          pageNum === 1 ||
                          pageNum === pagination.totalPages ||
                          (pageNum >= pagination.currentPage - 1 && pageNum <= pagination.currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => cambiarPagina(pageNum)}
                              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                pageNum === pagination.currentPage
                                  ? "bg-green-500 text-white"
                                  : "bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-300"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          pageNum === pagination.currentPage - 2 ||
                          pageNum === pagination.currentPage + 2
                        ) {
                          return <span key={pageNum} className="px-2 py-2 text-gray-500">...</span>;
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => cambiarPagina(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-300"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {vistaActual === "empresas" && (
        <>
          {/* Filtros */}
          <FiltrosEmpresas
            filtros={empresasFiltros}
            onFiltrosChange={aplicarFiltrosEmpresas}
            onLimpiarFiltros={limpiarFiltrosEmpresas}
          />

          {/* Contador de resultados */}
          <div className="mb-4">
            <p className="text-gray-600 font-semibold text-lg">
              Mostrando {empresas.length} de {empresasPagination.totalItems} empresas (Página {empresasPagination.currentPage} de {empresasPagination.totalPages})
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold">Empresa</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">Estado</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">Total Ofertas</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">Activas</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">Bloqueadas</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">Suspendidas</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {empresas.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        No se encontraron empresas
                      </td>
                    </tr>
                  ) : (
                    empresas.map((empresa, index) => (
                      <tr key={index} className="hover:bg-green-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{empresa.nombre}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            empresa.estadoGeneral === 'Suspendida' 
                              ? 'bg-orange-100 text-orange-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {empresa.estadoGeneral}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <p className="font-semibold text-gray-800">{empresa.totalOfertas}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <p className="font-semibold text-green-600">{empresa.ofertasActivas}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <p className="font-semibold text-red-600">{empresa.ofertasBloqueadas}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <p className="font-semibold text-orange-600">{empresa.ofertasSuspendidas}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleSuspenderEmpresa(empresa)}
                              className="flex items-center justify-center gap-1.5 w-28! h-10! rounded-lg! transition-colors! font-bold! text-xs!"
                              style={{ 
                                background: empresa.estadoGeneral === 'Suspendida' ? '#16a34a' : '#ea580c',
                                color: '#fff',
                                border: 'none'
                              }}
                              title={empresa.estadoGeneral === 'Suspendida' ? "Reactivar empresa" : "Suspender empresa"}
                            >
                              {empresa.estadoGeneral === 'Suspendida' ? (
                                <>
                                  <CheckCircle className="w-4! h-4!" />
                                  <span>Reactivar</span>
                                </>
                              ) : (
                                <>
                                  <ShieldAlert className="w-4! h-4!" />
                                  <span>Suspender</span>
                                </>
                              )}
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
            {empresasPagination.totalPages > 1 && (
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Mostrando <span className="font-semibold">{empresas.length}</span> de <span className="font-semibold">{empresasPagination.totalItems}</span> resultados
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => cambiarPaginaEmpresas(empresasPagination.currentPage - 1)}
                      disabled={empresasPagination.currentPage === 1}
                      className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-300"
                    >
                      Anterior
                    </button>
                    
                    {/* Números de página */}
                    <div className="flex gap-1">
                      {Array.from({ length: empresasPagination.totalPages }, (_, i) => i + 1).map((pageNum) => {
                        // Mostrar solo páginas cercanas a la actual
                        if (
                          pageNum === 1 ||
                          pageNum === empresasPagination.totalPages ||
                          (pageNum >= empresasPagination.currentPage - 1 && pageNum <= empresasPagination.currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => cambiarPaginaEmpresas(pageNum)}
                              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                pageNum === empresasPagination.currentPage
                                  ? "bg-green-500 text-white"
                                  : "bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-300"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          pageNum === empresasPagination.currentPage - 2 ||
                          pageNum === empresasPagination.currentPage + 2
                        ) {
                          return <span key={pageNum} className="px-2 py-2 text-gray-500">...</span>;
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => cambiarPaginaEmpresas(empresasPagination.currentPage + 1)}
                      disabled={empresasPagination.currentPage === empresasPagination.totalPages}
                      className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-300"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modales */}
      <ModalDetalleOferta
        isOpen={modalDetalleAbierto}
        onClose={() => {
          setModalDetalleAbierto(false);
          setOfertaSeleccionada(null);
        }}
        oferta={ofertaSeleccionada}
      />

      <ModalBloqueoOferta
        isOpen={modalBloqueoAbierto}
        onClose={() => {
          setModalBloqueoAbierto(false);
          setOfertaSeleccionada(null);
        }}
        onConfirm={handleConfirmarBloqueo}
        oferta={ofertaSeleccionada}
      />

      <ModalSuspensionEmpresa
        isOpen={modalSuspensionAbierto}
        onClose={() => {
          setModalSuspensionAbierto(false);
          setEmpresaSeleccionada(null);
        }}
        onConfirm={handleConfirmarSuspension}
        empresa={empresaSeleccionada}
      />
    </div>
  );
};

export default InspeccionLaboral;
