import { useState } from "react";
import { X, AlertTriangle, CheckCircle } from "lucide-react";

const ModalCambiarEstado = ({ isOpen, onClose, onConfirm, egresado }) => {
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !egresado) return null;

  const nuevoEstado = !egresado.activo;

  const handleConfirmar = async () => {
    setLoading(true);
    await onConfirm(nuevoEstado, motivo);
    setLoading(false);
    setMotivo("");
  };

  const handleCancelar = () => {
    setMotivo("");
    onClose();
  };

  return (
    <div className="fixed! inset-0! backdrop-blur-sm! bg-black/20! flex! items-center! justify-center! z-50! p-4!">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className={`p-6 rounded-t-2xl flex items-center justify-between ${
          nuevoEstado 
            ? 'bg-gradient-to-r from-green-500 to-teal-500' 
            : 'bg-gradient-to-r from-red-500 to-orange-500'
        } text-white`}>
          <div className="flex items-center gap-3">
            {nuevoEstado ? (
              <CheckCircle size={24} />
            ) : (
              <AlertTriangle size={24} />
            )}
            <h2 className="text-xl font-bold">
              {nuevoEstado ? 'Activar Egresado' : 'Desactivar Egresado'}
            </h2>
          </div>
          <button
            onClick={handleCancelar}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-700 mb-2">
              ¿Estás seguro de que deseas {nuevoEstado ? 'activar' : 'desactivar'} a:
            </p>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="font-semibold text-gray-800">{egresado.name}</p>
              <p className="text-sm text-gray-600">{egresado.email}</p>
            </div>
          </div>

          {!nuevoEstado && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de desactivación (opcional)
              </label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Escribe el motivo de la desactivación..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none transition-all text-gray-800 placeholder:text-gray-400"
                rows="3"
                style={{ outline: 'none' }}
              />
            </div>
          )}

          <div className={`p-4 rounded-xl ${
            nuevoEstado 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm ${
              nuevoEstado ? 'text-green-800' : 'text-red-800'
            }`}>
              {nuevoEstado 
                ? '✓ El egresado podrá acceder nuevamente al sistema y usar todos los servicios.'
                : '⚠ El egresado no podrá acceder al sistema hasta que sea reactivado.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 rounded-b-2xl flex gap-3 justify-end">
          <button
            onClick={handleCancelar}
            disabled={loading}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={loading}
            className={`px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
              nuevoEstado
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {loading ? 'Procesando...' : (nuevoEstado ? 'Activar' : 'Desactivar')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCambiarEstado;
