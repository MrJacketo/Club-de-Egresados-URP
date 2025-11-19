import { X, User, Mail, GraduationCap, Calendar, Award, MapPin, Briefcase, Phone } from "lucide-react";

const ModalDetalleEgresado = ({ isOpen, onClose, egresado }) => {
  if (!isOpen || !egresado) return null;

  return (
    <div className="fixed! inset-0! backdrop-blur-sm! bg-black/20! flex! items-center! justify-center! z-50! p-4!">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold">Detalles del Egresado</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Información básica */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User size={20} className="text-green-600" />
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
              <div className="text-center">
                <p className="text-sm text-gray-600">Nombre completo</p>
                <p className="font-semibold text-gray-800">{egresado.name}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-800 flex items-center justify-center gap-2">
                  <Mail size={16} className="text-green-600" />
                  {egresado.email}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Estado</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  egresado.activo 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {egresado.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Fecha de registro</p>
                <p className="font-semibold text-gray-800 flex items-center justify-center gap-2">
                  <Calendar size={16} className="text-green-600" />
                  {new Date(egresado.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Información académica */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <GraduationCap size={20} className="text-green-600" />
              Información Académica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
              <div className="text-center">
                <p className="text-sm text-gray-600">Carrera</p>
                <p className="font-semibold text-gray-800">{egresado.carrera || 'No especificado'}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Año de egreso</p>
                <p className="font-semibold text-gray-800">{egresado.anioEgreso || 'No especificado'}</p>
              </div>
              <div className="md:col-span-2 text-center">
                <p className="text-sm text-gray-600">Grado académico</p>
                <p className="font-semibold text-gray-800 flex items-center justify-center gap-2">
                  <Award size={16} className="text-green-600" />
                  {egresado.gradoAcademico || 'No especificado'}
                </p>
              </div>
            </div>
          </div>

          {/* Perfil adicional si existe */}
          {egresado.perfil && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Briefcase size={20} className="text-green-600" />
                Información del Perfil
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                {egresado.perfil.telefono && (
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                      <Phone size={16} className="text-green-600" />
                      {egresado.perfil.telefono}
                    </p>
                  </div>
                )}
                {egresado.perfil.ciudad && (
                  <div>
                    <p className="text-sm text-gray-600">Ciudad</p>
                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                      <MapPin size={16} className="text-green-600" />
                      {egresado.perfil.ciudad}
                    </p>
                  </div>
                )}
                {egresado.perfil.biografia && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Biografía</p>
                    <p className="font-semibold text-gray-800">{egresado.perfil.biografia}</p>
                  </div>
                )}
              </div>
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

export default ModalDetalleEgresado;
