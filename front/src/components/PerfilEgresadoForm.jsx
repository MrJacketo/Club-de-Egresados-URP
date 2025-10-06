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
  <div className="w-full min-h-screen bg-[#1C1D21] text-white flex flex-col ">
    <main className="flex flex-col md:flex-row flex-1 p-10 gap-10">
      
      {/* Columna izquierda: foto */}
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
      <div className="md:w-2/3  rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-8 text-[#00BC4F] text-left">
          Perfil del Egresado
        </h2>

        <div className="flex flex-col space-y-6 text-left text-xl">
          <div>
            <span className="text-[#00BC4F] font-semibold">Nombres: </span>
            <span className="text-white">Joseph Miguel</span>
          </div>
          <div>
            <span className="text-[#00BC4F] font-semibold">Apellidos: </span>
            <span className="text-white">Zavaleta Polo</span>
          </div>
          <div>
            <span className="text-[#00BC4F] font-semibold">Código de estudiante: </span>
            <span className="text-white">202111354</span>
          </div>
          <div>
            <span className="text-[#00BC4F] font-semibold">Correo: </span>
            <span className="text-white">miguel.zavaleta@urp.edu.pe</span>
          </div>
          <div>
            <span className="text-[#00BC4F] font-semibold">Año de egreso: </span>
            <span className="text-white">2025</span>
          </div>
          <div>
            <span className="text-[#00BC4F] font-semibold">Facultad: </span>
            <span className="text-white">Ingeniería</span>
          </div>
          <div>
            <span className="text-[#00BC4F] font-semibold">Carrera: </span>
            <span className="text-white">Ingeniería Informática</span>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-start mt-10 space-x-4">
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
