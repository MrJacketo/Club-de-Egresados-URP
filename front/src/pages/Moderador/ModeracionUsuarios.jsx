import { useState } from "react";
import { 
  Users, 
  UserCheck, 
  UserX, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Eye,
  Ban,
  CheckSquare
} from "lucide-react";
import { useModeracion } from "../../Hooks/useModeracion";
import AdminSidebar from "../../components/AdminSidebar";
import { AdminSidebarProvider, useAdminSidebar } from "../../context/adminSidebarContext";
import ModeradorSidebar from "../Egresado/components/moderadorSidebar";
import { ModeradorSidebarProvider, useModeradorSidebar } from "../../context/moderadorSidebarContext";
import FiltrosModeracion from "../../components/moderacion/FiltrosModeracion";
import ModalDetalleEgresado from "../../components/moderacion/ModalDetalleEgresado";
import ModalCambiarEstado from "../../components/moderacion/ModalCambiarEstado";

// Componente contenedor con el Provider
const ModeracionUsuarios = () => {
  return (
    <ModeradorSidebarProvider>
      <ModeracionUsuariosContent />
    </ModeradorSidebarProvider>
  );
};

// Componente principal con acceso al contexto
const ModeracionUsuariosContent = () => {
  const { collapsed } = useModeradorSidebar();
  
  const {
    egresados,
    estadisticas,
    loading,
    error,
    filtros,
    cambiarEstadoEgresado,
    obtenerDetalleEgresado,
    aplicarFiltros,
    limpiarFiltros
  } = useModeracion();

  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [modalEstadoAbierto, setModalEstadoAbierto] = useState(false);
  const [egresadoSeleccionado, setEgresadoSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  // Manejar ver detalles
  const handleVerDetalle = async (egresado) => {
    try {
      const detalleCompleto = await obtenerDetalleEgresado(egresado._id);
      setEgresadoSeleccionado(detalleCompleto);
      setModalDetalleAbierto(true);
    } catch (err) {
      setMensaje({ tipo: "error", texto: "Error al cargar detalles del egresado" });
      setTimeout(() => setMensaje({ tipo: "", texto: "" }), 5000);
    }
  };

  // Manejar cambio de estado
  const handleCambiarEstado = (egresado) => {
    setEgresadoSeleccionado(egresado);
    setModalEstadoAbierto(true);
  };

  // Confirmar cambio de estado
  const handleConfirmarCambioEstado = async (activo, motivo) => {
    try {
      const resultado = await cambiarEstadoEgresado(egresadoSeleccionado._id, activo, motivo);
      
      if (resultado.success) {
        setMensaje({ tipo: "success", texto: resultado.message });
        setModalEstadoAbierto(false);
        setEgresadoSeleccionado(null);
        setTimeout(() => setMensaje({ tipo: "", texto: "" }), 5000);
      } else {
        setMensaje({ tipo: "error", texto: resultado.message });
      }
    } catch (err) {
      setMensaje({ tipo: "error", texto: "Error al cambiar estado del egresado" });
    }
  };

  return (
    <div className="flex min-h-screen pt-12" style={{ background: 'linear-gradient(to bottom right, #f9fafb, #ffffff)' }}>
      <ModeradorSidebar />
      <div className={`flex-1 transition-all duration-300 py-8 px-8 ${
        collapsed ? "ml-20" : "ml-64"
      }`}>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl! font-bold! mb-2!">
            <span className="bg-gradient-to-r! from-green-500! to-teal-500! bg-clip-text! text-transparent!">
              Moderación de Usuarios
            </span>
          </h1>
          <p className="text-gray-600 text-lg">Gestiona y modera a los egresados registrados</p>
        </div>

        {/* Estadísticas */}
        {estadisticas && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-xl">
                  <Users style={{ fontSize: 32, color: '#fff' }} />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp style={{ fontSize: 20 }} />
                  <span className="text-sm font-bold">100%</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Egresados</p>
              <p className="text-4xl font-bold text-gray-800">{estadisticas.totalEgresados}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-4 rounded-xl">
                  <UserCheck style={{ fontSize: 32, color: '#16a34a' }} />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp style={{ fontSize: 20 }} />
                  <span className="text-sm font-bold">
                    {estadisticas.totalEgresados > 0 
                      ? ((estadisticas.egresadosActivos / estadisticas.totalEgresados) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Egresados Activos</p>
              <p className="text-4xl font-bold text-gray-800">{estadisticas.egresadosActivos}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-red-100 p-4 rounded-xl">
                  <UserX style={{ fontSize: 32, color: '#dc2626' }} />
                </div>
                <div className="flex items-center gap-1 text-red-600">
                  <TrendingUp style={{ fontSize: 20 }} />
                  <span className="text-sm font-bold">
                    {estadisticas.totalEgresados > 0 
                      ? ((estadisticas.egresadosInactivos / estadisticas.totalEgresados) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Egresados Inactivos</p>
              <p className="text-4xl font-bold text-gray-800">{estadisticas.egresadosInactivos}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-4 rounded-xl">
                  <Users style={{ fontSize: 32, color: '#2563eb' }} />
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <TrendingUp style={{ fontSize: 20 }} />
                  <span className="text-sm font-bold">30 días</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Nuevos Egresados</p>
              <p className="text-4xl font-bold text-gray-800">{estadisticas.nuevosEgresados}</p>
            </div>
          </div>
        )}

        {/* Filtros */}
        <FiltrosModeracion
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

        {/* Lista de egresados */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Lista de Egresados</h2>
            <p className="text-gray-600 mt-1">Gestiona el estado de los egresados registrados</p>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Cargando egresados...</p>
            </div>
          ) : egresados.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron egresados</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {egresados.map((egresado) => (
                <div key={egresado._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{egresado.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          egresado.activo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {egresado.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{egresado.email}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {egresado.carrera && (
                          <span>🎓 {egresado.carrera}</span>
                        )}
                        {egresado.anioEgreso && (
                          <span>📅 Egreso: {egresado.anioEgreso}</span>
                        )}
                        {egresado.gradoAcademico && (
                          <span>🏆 {egresado.gradoAcademico}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleVerDetalle(egresado)}
                        className="inline-flex! items-center! gap-2! px-4! py-2! rounded-lg! transition-all! duration-300! hover:shadow-md! hover:scale-105! bg-blue-500!"
                        style={{ border: 'none' }}
                        title="Ver detalles"
                      >
                        <Eye className="w-4! h-4!" style={{ color: '#fff' }} />
                        <span className="text-white! text-xs! font-bold!">Detalles</span>
                      </button>
                      <button
                        onClick={() => handleCambiarEstado(egresado)}
                        className={`inline-flex! items-center! gap-2! px-4! py-2! rounded-lg! transition-all! duration-300! hover:shadow-md! hover:scale-105! ${
                          egresado.activo ? 'bg-red-500!' : 'bg-green-500!'
                        }`}
                        style={{ border: 'none' }}
                        title={egresado.activo ? "Desactivar" : "Activar"}
                      >
                        {egresado.activo ? (
                          <>
                            <Ban className="w-4! h-4!" style={{ color: '#fff' }} />
                            <span className="text-white! text-xs! font-bold!">Desactivar</span>
                          </>
                        ) : (
                          <>
                            <CheckSquare className="w-4! h-4!" style={{ color: '#fff' }} />
                            <span className="text-white! text-xs! font-bold!">Activar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modales */}
        <ModalDetalleEgresado
          isOpen={modalDetalleAbierto}
          onClose={() => {
            setModalDetalleAbierto(false);
            setEgresadoSeleccionado(null);
          }}
          egresado={egresadoSeleccionado}
        />

        <ModalCambiarEstado
          isOpen={modalEstadoAbierto}
          onClose={() => {
            setModalEstadoAbierto(false);
            setEgresadoSeleccionado(null);
          }}
          onConfirm={handleConfirmarCambioEstado}
          egresado={egresadoSeleccionado}
        />
      </div>
    </div>
  );
};

export default ModeracionUsuarios;
