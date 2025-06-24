"use client"

import { useState } from "react"
import { Plus, AlertCircle, CheckCircle } from "lucide-react"
import { useGestionNoticias } from "../hooks/useGestionNoticias"
import FiltrosGestionNoticias from "../components/gestionNoticias/FiltrosGestionNoticias"
import TablaNoticias from "../components/gestionNoticias/TablaNoticias"
import ModalNoticia from "../components/gestionNoticias/ModalNoticia"
import ModalConfirmacion from "../components/gestionNoticias/ModalConfirmacion"

const GestionNoticias = () => {
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
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error inesperado al procesar la noticia" })
    }
  }

  // Confirmar eliminación
  const handleConfirmarEliminacion = async (id) => {
    try {
      const resultado = await eliminarNoticia(id)

      if (resultado.success) {
        setMensaje({ tipo: "success", texto: resultado.message })
        setModalConfirmacionAbierto(false)
        setNoticiaSeleccionada(null)

        // Limpiar mensaje después de 5 segundos
        setTimeout(() => setMensaje({ tipo: "", texto: "" }), 5000)
      } else {
        setMensaje({ tipo: "error", texto: resultado.message })
      }
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error inesperado al eliminar la noticia" })
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br flex">
      <div className="flex-1 p-8">
        {/* Header de la página */}
        <div className="flex flex-col items-center mb-8 mt-2">
          <h1
            className="text-5xl font-extrabold text-black mb-6 text-center"
            style={{
              letterSpacing: "0.02em",
              lineHeight: "1.1",
            }}
          >
            Gestionar Noticias
          </h1>
          <button
            onClick={handleNuevaNoticia}
            className="bg-black text-white px-8 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center font-semibold text-lg mt-2"
            style={{
              alignSelf: "flex-end",
              marginRight: 0,
            }}
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
          onConfirm={(id) => handleConfirmarEliminacion(noticiaSeleccionada._id)}
          noticia={noticiaSeleccionada}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default GestionNoticias