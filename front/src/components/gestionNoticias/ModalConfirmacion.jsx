"use client"
import { AlertTriangle, X } from "lucide-react"

const ModalConfirmacion = ({ isOpen, onClose, onConfirm, noticia, loading }) => {
  if (!isOpen || !noticia) return null

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Confirmar Eliminación</h2>
          </div>
          <button onClick={onClose} className="text-gray-400! hover:text-gray-600! bg-transparent! transition-colors!">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">¿Está seguro que desea eliminar la siguiente noticia?</p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">{noticia.titulo}</h3>
            <p className="text-sm text-gray-600">
              Categoría: {noticia.categoria} | Estado: {noticia.estado}
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">
              <strong>Advertencia:</strong> Esta acción no se puede deshacer. La noticia será eliminada permanentemente
              del sistema.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border! bg-transparent! border-gray-300! rounded-lg! text-gray-700! hover:bg-gray-50! transition-colors!"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(noticia._id)}
            disabled={loading}
            className="px-4 py-2 bg-transparent! text-red-600! border! border-red-500! rounded-lg! hover:bg-red-50! transition-colors! disabled:opacity-50! disabled:cursor-not-allowed! flex items-center!"
          >
            {loading && <div className="animate-spin! rounded-full! h-4 w-4 border-b-2! border-red-600! mr-2"></div>}
            Eliminar Noticia
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalConfirmacion