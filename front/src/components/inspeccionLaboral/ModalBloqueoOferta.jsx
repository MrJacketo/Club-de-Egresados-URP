import { useState } from "react";
import { X, Ban, CheckCircle, AlertTriangle } from "lucide-react";

const ModalBloqueoOferta = ({ isOpen, onClose, onConfirm, oferta }) => {
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !oferta) return null;

  const esBloqueo = oferta.estado !== 'Bloqueado';

  const handleConfirmar = async () => {
    if (esBloqueo && !motivo.trim()) {
      alert("Por favor, ingresa un motivo para el bloqueo");
      return;
    }

    setLoading(true);
    await onConfirm(motivo);
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
          esBloqueo 
            ? 'bg-gradient-to-r from-red-500 to-orange-500' 
            : 'bg-gradient-to-r from-green-500 to-teal-500'
        } text-white`}>
          <div className="flex items-center gap-3">
            {esBloqueo ? (
              <Ban size={24} />
            ) : (
              <CheckCircle size={24} />
            )}
            <h2 className="text-xl font-bold">
              {esBloqueo ? 'Bloquear Oferta' : 'Desbloquear Oferta'}
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
              ¿Estás seguro de que deseas {esBloqueo ? 'bloquear' : 'desbloquear'} esta oferta?
            </p>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="font-semibold text-gray-800">{oferta.cargo}</p>
              <p className="text-sm text-gray-600">{oferta.empresa}</p>
            </div>
          </div>

          {esBloqueo && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo del bloqueo <span className="text-red-500">*</span>
              </label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Describe el motivo del bloqueo..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none transition-all text-gray-800 placeholder:text-gray-400"
                rows="4"
                style={{ outline: 'none' }}
              />
            </div>
          )}

          <div className={`p-4 rounded-xl ${
            esBloqueo 
              ? 'bg-red-50 border border-red-200' 
              : 'bg-green-50 border border-green-200'
          }`}>
            <div className="flex items-start gap-2">
              <AlertTriangle size={18} className={esBloqueo ? 'text-red-600' : 'text-green-600'} />
              <p className={`text-sm ${esBloqueo ? 'text-red-800' : 'text-green-800'}`}>
                {esBloqueo 
                  ? '⚠ La oferta dejará de estar visible para los egresados hasta que sea desbloqueada.'
                  : '✓ La oferta volverá a estar visible para los egresados.'}
              </p>
            </div>
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
              esBloqueo
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {loading ? 'Procesando...' : (esBloqueo ? 'Bloquear' : 'Desbloquear')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalBloqueoOferta;
