import { useState } from "react"
import { Plus, AlertCircle, CheckCircle, Newspaper, Star, FileText, Archive, TrendingUp } from "lucide-react"
import { useGestionNoticias } from "../../Hooks/useGestionNoticias"
import FiltrosGestionNoticias from "../../components/gestionNoticias/FiltrosGestionNoticias"
import TablaNoticias from "../../components/gestionNoticias/TablaNoticias"
import ModalNoticia from "../../components/gestionNoticias/ModalNoticia"
import ModalConfirmacion from "../../components/gestionNoticias/ModalConfirmacion"
import AdminSidebar from '../../components/AdminSidebar';
import { AdminSidebarProvider, useAdminSidebar } from '../../context/adminSidebarContext';

// Componente contenedor con el Provider
const GestionNoticias = () => {
  return (
    <AdminSidebarProvider>
      <GestionNoticiasContent />
    </AdminSidebarProvider>
  );
};

// Componente principal con acceso al contexto
const GestionNoticiasContent = () => {
  const { collapsed } = useAdminSidebar();
  
  const {
    noticias,
    loading,
    error,
    filtros,
    crearNoticia,
    actualizarNoticia,
    eliminarNoticia,
    aplicarFiltros,
    limpiarFiltros,
  } = useGestionNoticias()

  const [modalNoticiaAbierto, setModalNoticiaAbierto] = useState(false)
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false)
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null)
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" })

  // Calcular estadísticas
  const totalNoticias = noticias.length
  const noticiasDestacadas = noticias.filter(n => n.estado === "Destacado").length
  const noticiasNormales = noticias.filter(n => n.estado === "Normal").length
  const noticiasBorradores = noticias.filter(n => n.estado === "Borrador").length
  const destacadasRate = totalNoticias > 0 ? ((noticiasDestacadas / totalNoticias) * 100).toFixed(1) : 0

  // Manejar creación de nueva noticia
  const handleNuevaNoticia = () => {
    setNoticiaSeleccionada(null)
    setModalNoticiaAbierto(true)
  }

  // Manejar edición de noticia
  const handleEditarNoticia = (noticia) => {
    setNoticiaSeleccionada(noticia)
    setModalNoticiaAbierto(true)
  }

  // Manejar eliminación de noticia
  const handleEliminarNoticia = (noticia) => {
    setNoticiaSeleccionada(noticia)
    setModalConfirmacionAbierto(true)
  }

  // Manejar envío del formulario
  const handleSubmitNoticia = async (formData) => {
    try {
      let resultado
      if (noticiaSeleccionada) {
        resultado = await actualizarNoticia(noticiaSeleccionada._id, formData)
      } else {
        resultado = await crearNoticia(formData)
      }

      if (resultado.success) {
        setMensaje({ tipo: "success", texto: resultado.message })
        setModalNoticiaAbierto(false)
        setNoticiaSeleccionada(null)

        // Limpiar mensaje después de 5 segundos
        setTimeout(() => setMensaje({ tipo: "", texto: "" }), 5000)
      } else {
        setMensaje({ tipo: "error", texto: resultado.message })
      }
    } catch {
      setMensaje({ tipo: "error", texto: "Error inesperado al procesar la noticia" })
    }
  }

  // Confirmar eliminación
  const handleConfirmarEliminacion = async () => {
    try {
      const resultado = await eliminarNoticia(noticiaSeleccionada._id)

      if (resultado.success) {
        setMensaje({ tipo: "success", texto: resultado.message })
        setModalConfirmacionAbierto(false)
        setNoticiaSeleccionada(null)

        // Limpiar mensaje después de 5 segundos
        setTimeout(() => setMensaje({ tipo: "", texto: "" }), 5000)
      } else {
        setMensaje({ tipo: "error", texto: resultado.message })
      }
    } catch {
      setMensaje({ tipo: "error", texto: "Error inesperado al eliminar la noticia" })
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
                Gestión de Noticias
              </span>
            </h1>
            <button
              onClick={handleNuevaNoticia}
              className="flex! items-center! px-6! py-3! text-white! rounded-full! font-bold! transition-all! duration-300! hover:scale-110! transform! hover:-translate-y-1!"
              style={{ 
                background: 'linear-gradient(135deg, #16a34a, #14b8a6)',
                border: 'none'
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Nueva Noticia
            </button>
          </div>

          {/* Métricas estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-xl">
                  <Newspaper style={{ fontSize: 32, color: '#fff' }} />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp style={{ fontSize: 20 }} />
                  <span className="text-sm font-bold">100%</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Noticias</p>
              <p className="text-4xl font-bold text-gray-800">{totalNoticias}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-4 rounded-xl">
                  <Star style={{ fontSize: 32, color: '#16a34a' }} />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp style={{ fontSize: 20 }} />
                  <span className="text-sm font-bold">{destacadasRate}%</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Noticias Destacadas</p>
              <p className="text-4xl font-bold text-gray-800">{noticiasDestacadas}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gray-100 p-4 rounded-xl">
                  <FileText style={{ fontSize: 32, color: '#6b7280' }} />
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <TrendingUp style={{ fontSize: 20 }} />
                  <span className="text-sm font-bold">{totalNoticias > 0 ? ((noticiasNormales / totalNoticias) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Noticias Normales</p>
              <p className="text-4xl font-bold text-gray-800">{noticiasNormales}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-4 rounded-xl">
                  <Archive style={{ fontSize: 32, color: '#3b82f6' }} />
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <TrendingUp style={{ fontSize: 20 }} />
                  <span className="text-sm font-bold">{totalNoticias > 0 ? ((noticiasBorradores / totalNoticias) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Borradores</p>
              <p className="text-4xl font-bold text-gray-800">{noticiasBorradores}</p>
            </div>
          </div>

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

          {/* Filtros */}
          <FiltrosGestionNoticias
            filtros={filtros}
            onFiltrosChange={aplicarFiltros}
            onLimpiarFiltros={limpiarFiltros}
          />

          {/* Tabla de noticias */}
          <TablaNoticias
            noticias={noticias}
            onEditar={handleEditarNoticia}
            onEliminar={handleEliminarNoticia}
            loading={loading}
          />

          {/* Modal de noticia */}
          <ModalNoticia
            isOpen={modalNoticiaAbierto}
            onClose={() => {
              setModalNoticiaAbierto(false);
              setNoticiaSeleccionada(null);
            }}
            onSubmit={handleSubmitNoticia}
            noticia={noticiaSeleccionada}
            loading={loading}
          />

          {/* Modal de confirmación */}
          <ModalConfirmacion
            isOpen={modalConfirmacionAbierto}
            onClose={() => {
              setModalConfirmacionAbierto(false);
              setNoticiaSeleccionada(null);
            }}
            onConfirm={handleConfirmarEliminacion}
            noticia={noticiaSeleccionada}
            loading={loading}
          />
        
      </div>
    </div>
  );
};

export default GestionNoticias;