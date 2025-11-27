import { X, Briefcase, Building2, MapPin, Calendar, DollarSign, FileText, AlertTriangle } from "lucide-react";

const ModalDetalleOferta = ({ isOpen, onClose, oferta }) => {
  if (!isOpen || !oferta) return null;

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
    <div className="fixed! inset-0! backdrop-blur-sm! bg-black/20! flex! items-center! justify-center! z-50! p-4!">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Briefcase size={24} />
            <h2 className="text-xl font-bold">Detalle de Oferta Laboral</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Información principal */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{oferta.cargo}</h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 size={18} className="text-green-600" />
                  <span className="font-semibold">{oferta.empresa}</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(oferta.estado)}`}>
                {oferta.estado}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Ubicación</p>
                  <p className="font-semibold text-gray-800">{oferta.ubicacion}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Modalidad</p>
                  <p className="font-semibold text-gray-800">{oferta.modalidad}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Tipo de Contrato</p>
                  <p className="font-semibold text-gray-800">{oferta.tipoContrato}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Salario</p>
                  <p className="font-semibold text-gray-800">
                    {oferta.salario > 0 ? `S/ ${oferta.salario.toLocaleString()}` : 'No especificado'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Descripción del Puesto</h4>
            <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-xl">{oferta.descripcion}</p>
          </div>

          {/* Requisitos */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Requisitos</h4>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{oferta.requisitos || 'No especificado'}</p>
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Área</p>
              <p className="font-semibold text-gray-800">{oferta.area || 'No especificado'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Fecha de Publicación</p>
              <p className="font-semibold text-gray-800">
                {new Date(oferta.fechaPublicacion).toLocaleDateString()}
              </p>
            </div>

            {oferta.fechaCierre && (
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Fecha de Cierre</p>
                <p className="font-semibold text-gray-800">
                  {new Date(oferta.fechaCierre).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Aprobado</p>
              <p className="font-semibold text-gray-800">{oferta.aprobado ? 'Sí' : 'No'}</p>
            </div>
          </div>

          {/* Información de bloqueo/suspensión */}
          {(oferta.estado === 'Bloqueado' || oferta.estado === 'Suspendido') && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="text-red-600 mt-1" size={20} />
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-red-800 mb-2">
                    {oferta.estado === 'Bloqueado' ? 'Información de Bloqueo' : 'Información de Suspensión'}
                  </h4>
                  {oferta.motivoBloqueo && (
                    <div className="mb-2">
                      <p className="text-sm text-red-700 font-medium">Motivo del bloqueo:</p>
                      <p className="text-red-900">{oferta.motivoBloqueo}</p>
                    </div>
                  )}
                  {oferta.motivoSuspension && (
                    <div className="mb-2">
                      <p className="text-sm text-red-700 font-medium">Motivo de suspensión:</p>
                      <p className="text-red-900">{oferta.motivoSuspension}</p>
                    </div>
                  )}
                  {oferta.fechaBloqueo && (
                    <p className="text-sm text-red-700">
                      Fecha: {new Date(oferta.fechaBloqueo).toLocaleDateString()}
                    </p>
                  )}
                  {oferta.fechaSuspension && (
                    <p className="text-sm text-red-700">
                      Fecha: {new Date(oferta.fechaSuspension).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Link a la empresa */}
          {oferta.linkEmpresa && (
            <div className="mt-6">
              <a
                href={oferta.linkEmpresa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Ver más en sitio de la empresa
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalleOferta;
