import { useState } from "react";
import { X, Building2, AlertTriangle, CheckCircle } from "lucide-react";

const ModalSuspensionEmpresa = ({ isOpen, onClose, onConfirm, empresa }) => {
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !empresa) return null;

  const esSuspension = empresa.estadoGeneral !== 'Suspendida';

  const handleConfirmar = async () => {
    if (esSuspension && !motivo.trim()) {
      alert("Por favor, ingresa un motivo para la suspensión");
      return;
    }

    setLoading(true);
    await onConfirm(esSuspension, motivo);
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
          esSuspension 
            ? 'bg-gradient-to-r from-orange-500 to-red-500' 
            : 'bg-gradient-to-r from-green-500 to-teal-500'
        } text-white`}>
          <div className="flex items-center gap-3">
            <Building2 size={24} />
            <h2 className="text-xl font-bold">
              {esSuspension ? 'Suspender Empresa' : 'Reactivar Empresa'}
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
              ¿Estás seguro de que deseas {esSuspension ? 'suspender' : 'reactivar'} todas las ofertas de esta empresa?
            </p>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="font-semibold text-gray-800 mb-2">{empresa.nombre}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-600">Total ofertas:</p>
                  <p className="font-semibold text-gray-800">{empresa.totalOfertas}</p>
                </div>
                <div>
                  <p className="text-gray-600">Ofertas activas:</p>
                  <p className="font-semibold text-green-600">{empresa.ofertasActivas}</p>
                </div>
              </div>
            </div>
          </div>

          {esSuspension && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de la suspensión <span className="text-red-500">*</span>
              </label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Describe el motivo de la suspensión de la empresa..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none transition-all text-gray-800 placeholder:text-gray-400"
                rows="4"
                style={{ outline: 'none' }}
              />
            </div>
          )}

          <div className={`p-4 rounded-xl ${
            esSuspension 
              ? 'bg-orange-50 border border-orange-200' 
              : 'bg-green-50 border border-green-200'
          }`}>
            <div className="flex items-start gap-2">
              <AlertTriangle size={18} className={esSuspension ? 'text-orange-600' : 'text-green-600'} />
              <div className="flex-1">
                <p className={`text-sm font-semibold ${esSuspension ? 'text-orange-800' : 'text-green-800'} mb-1`}>
                  {esSuspension ? 'Impacto de la suspensión:' : 'Impacto de la reactivación:'}
                </p>
                <p className={`text-sm ${esSuspension ? 'text-orange-800' : 'text-green-800'}`}>
                  {esSuspension 
                    ? `⚠ Se suspenderán TODAS las ${empresa.totalOfertas} ofertas de esta empresa. Las ofertas no serán visibles para los egresados hasta que la empresa sea reactivada.`
                    : `✓ Se reactivarán todas las ofertas previamente suspendidas de esta empresa. Las ofertas volverán a ser visibles para los egresados.`}
                </p>
              </div>
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
              esSuspension
                ? 'bg-orange-600 text-white hover:bg-orange-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {loading ? 'Procesando...' : (esSuspension ? 'Suspender Empresa' : 'Reactivar Empresa')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSuspensionEmpresa;
