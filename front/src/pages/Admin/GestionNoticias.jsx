import { useState } from "react"
import { Plus, AlertCircle, CheckCircle } from "lucide-react"
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
    <div className="flex">
      <AdminSidebar />
      <div className={`transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'} w-0 flex-1 h-screen overflow-auto`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header de la página */}
          <div className="flex flex-wrap items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Noticias</h1>
            <button
              onClick={handleNuevaNoticia}
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nueva Noticia
            </button>
          </div>

          {/* Mensajes de estado */}
          {mensaje.texto && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center ${
                mensaje.tipo === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {mensaje.tipo === "success" ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              {mensaje.texto}
            </div>
          )}

          {/* Error general */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg flex items-center border border-red-300">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
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
    </div>
  );
};

export default GestionNoticias;