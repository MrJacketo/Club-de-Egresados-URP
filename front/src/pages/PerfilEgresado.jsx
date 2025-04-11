// PerfilEgresado.jsx
export default function PerfilEgresado() {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Mi Perfil</h1>
          <p className="text-gray-600 text-center mb-6">
            Aquí puedes ver y actualizar tu información como egresado URPex.
          </p>
  
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value="Juan Pérez"
                disabled
                className="mt-1 block w-full px-4 py-2 bg-gray-100 border rounded-md"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700">Carrera</label>
              <input
                type="text"
                value="Ingeniería Informática"
                disabled
                className="mt-1 block w-full px-4 py-2 bg-gray-100 border rounded-md"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700">Año de Egreso</label>
              <input
                type="text"
                value="2023"
                disabled
                className="mt-1 block w-full px-4 py-2 bg-gray-100 border rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  