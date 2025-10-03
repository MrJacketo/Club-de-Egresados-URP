import { useState } from "react";

export default function PerfilEgresadoForm() {
  const [photo, setPhoto] = useState("/default-profile.png"); // Imagen default en /public

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#1C1D21] text-white flex flex-col">
   
      
      
      <main className="flex flex-col md:flex-row flex-1 p-10 gap-10">
        
        <div className="flex flex-col items-center md:w-1/3">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#00BC4F] shadow-lg">
            <img
              src={photo}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          </div>
          <label
            htmlFor="photo"
            className="mt-4 px-4 py-2 bg-[#00BC4F] rounded-lg text-white font-semibold cursor-pointer hover:bg-green-600 transition"
          >
            Editar foto de perfil
          </label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>

        {/* Columna derecha: Información */}
        <div className="md:w-2/3 bg-[#2A2B30] rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-[#00BC4F]">
            Perfil del Egresado
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
            {/* Nombre */}
            <div>
              <p className="text-[#00BC4F] font-semibold">Nombres:</p>
              <p className="text-white">Joseph Miguel</p>
            </div>
            {/* Apellidos */}
            <div>
              <p className="text-[#00BC4F] font-semibold">Apellidos:</p>
              <p className="text-white">Zavaleta Polo</p>
              
            </div>
          
            <div>
              <p className="text-[#00BC4F] font-semibold">Código de estudiante:</p>
              <p className="text-white">202111354</p>
            </div>
            
            <div>
              <p className="text-[#00BC4F] font-semibold">Correo:</p>
                            <input
                type="number"
                className="w-full mt-1 px-3 py-2 bg-[#1C1D21] text-white border border-[#00BC4F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BC4F]"
                placeholder="Ej: 202110609@urp.edu.pe"
              />
            </div>
         
            <div>
              <p className="text-[#00BC4F] font-semibold">Año de egreso:</p>
     <p className="text-white">2025</p>
            </div>
         <div>
              <p className="text-[#00BC4F] font-semibold">Facultad:</p>
              <p className="text-white">Ingenieria</p>
            </div>
            <div>
              <p className="text-[#00BC4F] font-semibold">Carrera:</p>
              <p className="text-white">Ingenieria Informatica</p>
            </div>
          </div>

          
          <div className="flex justify-center mt-10 space-x-4">
            <button
              type="submit"
              className="px-8 py-3 bg-[#00BC4F] text-white rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Guardar Cambios
            </button>

            <button
              type="submit"
              onClick={() => window.history.back()}
              className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Volver
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
