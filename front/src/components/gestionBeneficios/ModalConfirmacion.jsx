"use client"
import { AlertTriangle, X } from "lucide-react"

const ModalConfirmacion = ({ isOpen, onClose, onConfirm, beneficio, loading }) => {
  if (!isOpen || !beneficio) return null

  return (
    <div className="fixed! inset-0! backdrop-blur-sm! bg-black/20! flex! items-center! justify-center! z-50! p-4!">
      <div className="bg-white! rounded-2xl! max-w-md! w-full! shadow-2xl!">
        {/* Header */}
        <div className="flex! items-center! justify-between! p-6! border-b! border-gray-200! bg-white! rounded-t-2xl!" style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)' }}>
          <div className="flex! items-center!">
            <AlertTriangle className="w-6! h-6! text-white! mr-2!" />
            <h2 className="text-xl! font-semibold! text-white!">Confirmar Eliminación</h2>
          </div>
          <button onClick={onClose} className="text-white! hover:bg-white/20! transition-all! duration-300! rounded-full! p-2!">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6!">
          <p className="text-gray-700! mb-4! font-medium!">¿Está seguro que desea eliminar el siguiente beneficio?</p>

          <div className="bg-gray-50! rounded-xl! p-4! mb-6! border-2! border-gray-200!">
            <h3 className="font-bold! text-gray-900! mb-2! text-lg!">{beneficio.titulo}</h3>
            <div className="space-y-1! text-sm! text-gray-600!">
              <p><span className="font-medium!">Tipo:</span> {beneficio.tipo_beneficio?.charAt(0).toUpperCase() + beneficio.tipo_beneficio?.slice(1)}</p>
              <p><span className="font-medium!">Estado:</span> {beneficio.estado?.charAt(0).toUpperCase() + beneficio.estado?.slice(1)}</p>
              {beneficio.empresa_asociada && (
                <p><span className="font-medium!">Empresa:</span> {beneficio.empresa_asociada}</p>
              )}
            </div>
          </div>

          <div className="bg-red-50! border-2! border-red-200! rounded-xl! p-4!">
            <p className="text-red-800! text-sm! font-medium!">
              <strong>⚠️ Advertencia:</strong> Esta acción no se puede deshacer. El beneficio será eliminado permanentemente
              del sistema y ya no estará disponible para los egresados.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex! justify-end! space-x-4! p-6! border-t-2! border-gray-200!">
          <button
            onClick={onClose}
            className="px-6! py-3! border-2! bg-gray-100! border-gray-300! rounded-xl! text-gray-700! font-bold! hover:bg-gray-50! transition-all! duration-300! hover:shadow-md!"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm()}
            disabled={loading}
            className="px-6! py-3! bg-red-600! text-white! rounded-xl! hover:bg-red-700! transition-all! duration-300! disabled:opacity-50! disabled:cursor-not-allowed! flex! items-center! font-bold! hover:shadow-xl!"
          >
            {loading && <div className="animate-spin! rounded-full! h-4! w-4! border-b-2! border-white! mr-2!"></div>}
            Eliminar Beneficio
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalConfirmacion