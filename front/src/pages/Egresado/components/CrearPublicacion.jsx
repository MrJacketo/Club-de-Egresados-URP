import React, { useState, useEffect } from "react";
import { Globe, Video, Image, Smile } from "lucide-react";
import { useProfilePhoto,  } from "../../../Hooks/useProfilePhoto"; // Ruta corregida

function CrearPublicacion({ agregarPost }) {
  const [nuevoPost, setNuevoPost] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [ setTipoPublicacion] = useState("texto");
  const [mostrarEmojis, setMostrarEmojis] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("Usuario URP");
  
  // ✅ Usar el hook personalizado para la foto
  const { photo: userPhoto } = useProfilePhoto();

  // Obtener ID y datos del usuario específico
  useEffect(() => {
    const cargarDatosUsuario = () => {
      try {
        // 1. Obtener el usuario actual del localStorage
        const currentUser = localStorage.getItem('currentUser');
        let userIdentifier = 'default-user';
        let userNameFromAuth = 'Usuario URP';

        if (currentUser) {
          const userData = JSON.parse(currentUser);
          userIdentifier = userData.id || userData._id || 'default-user';
          userNameFromAuth = userData.name || 'Usuario URP';
        }

        // 2. Cargar datos académicos ESPECÍFICOS del usuario
        const userAcademicKey = `academicData_${userIdentifier}`;
        const academicData = localStorage.getItem(userAcademicKey);
        
        if (academicData) {
          const datos = JSON.parse(academicData);
          if (datos.nombreCompleto && datos.nombreCompleto.trim() !== "") {
            setNombreUsuario(datos.nombreCompleto);
            return;
          }
        }

        // 3. Si no hay datos académicos, intentar con clave general
        const generalAcademicData = localStorage.getItem('academicData');
        if (generalAcademicData) {
          const datos = JSON.parse(generalAcademicData);
          if (datos.nombreCompleto && datos.nombreCompleto.trim() !== "") {
            setNombreUsuario(datos.nombreCompleto);
            return;
          }
        }

        // 4. Si no hay datos académicos, usar nombre del auth
        if (userNameFromAuth && userNameFromAuth.trim() !== "") {
          setNombreUsuario(userNameFromAuth);
          return;
        }

        // 5. Finalmente, usar valor por defecto
        setNombreUsuario("Usuario URP");

      } catch (error) {
        console.error("Error al cargar el nombre del usuario:", error);
        setNombreUsuario("Usuario URP");
      }
    };

    cargarDatosUsuario();

    // Escuchar cambios en el localStorage
    const handleStorageChange = () => {
      cargarDatosUsuario();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Verificar cada 2 segundos por cambios
    const interval = setInterval(cargarDatosUsuario, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const emojis = [
    "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
    "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
    "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩"
  ];

  const handleArchivoChange = (e, tipo) => {
    if (e.target.files && e.target.files[0]) {
      setArchivo(e.target.files[0]);
      setTipoPublicacion(tipo);
    }
  };

  const agregarEmoji = (emoji) => {
    setNuevoPost((prev) => prev + emoji);
    setMostrarEmojis(false);
  };

  const handlePublicar = () => {
    if (nuevoPost.trim() === "" && !archivo) return;

    let nuevo = {
      id: Date.now(),
      autor: nombreUsuario,
      contenido: nuevoPost,
      likes: 0,
      comentarios: [],
      imagen: null,
      video: null,
      perfilImg: userPhoto, // ✅ Usar la foto actualizada del hook
      timestamp: new Date().toISOString()
    };

    if (archivo) {
      if (archivo.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          nuevo.imagen = event.target.result;
          agregarPost(nuevo);
          setNuevoPost("");
          setArchivo(null);
          setTipoPublicacion("texto");
        };
        reader.readAsDataURL(archivo);
        return;
      } else if (archivo.type.startsWith("video/")) {
        nuevo.video = URL.createObjectURL(archivo);
      }
    }

    agregarPost(nuevo);
    setNuevoPost("");
    setArchivo(null);
    setTipoPublicacion("texto");
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl w-full mb-8">
      <div className="flex items-center justify-between mb-6"> 
        <div className="flex items-center gap-4"> 
          {/* ✅ Usar userPhoto del hook en lugar de la prop perfil */}
          {userPhoto ? (
            <img
              src={userPhoto}
              alt="Perfil"
              className="w-14 h-14 rounded-full object-cover border-2 border-green-200" 
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xl"> 
              {nombreUsuario.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-bold text-gray-800 text-lg">
              {nombreUsuario}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500"> 
              <Globe size={14} /> 
              <span>Publicar para Cualquiera</span>
            </div>
          </div>
        </div>
      </div>

      <textarea
        className="w-full border-0 rounded-xl p-4 focus:outline-none focus:ring-0 resize-none min-h-[120px] text-black text-xl placeholder-gray-400 bg-gray-50"
        placeholder="¿Sobre qué quieres hablar? 😊"
        value={nuevoPost}
        onChange={(e) => setNuevoPost(e.target.value)}
      />

      <div className="flex items-center justify-between mt-4"> 
        <label
          onClick={() => setMostrarEmojis(!mostrarEmojis)}
          className="flex items-center gap-3 bg-gray-50 text-gray-700 px-4 py-3 rounded-xl cursor-pointer transition-colors hover:bg-gray-100 border border-gray-200 font-medium"
        >
          <Smile size={20} /> 
          <span className="text-base">Emojis</span> 
        </label>
      </div>

      {mostrarEmojis && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 max-h-48 overflow-y-auto"> 
          <div className="grid grid-cols-10 gap-2"> 
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => agregarEmoji(emoji)}
                className="flex items-center gap-2 bg-white !bg-white text-black px-3 py-2 rounded-lg shadow-sm transition-colors" 
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {archivo && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200"> 
          <div className="flex items-center justify-between">
            <span className="text-base text-gray-600">📂 {archivo.name}</span> 
            <button
              onClick={() => setArchivo(null)}
              className="flex items-center gap-2 bg-white !bg-white text-black px-3 py-2 rounded-lg shadow-sm transition-colors" 
            >
              ✕ Eliminar
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200"> 
        <div className="flex items-center gap-3"> 
          <label className="flex items-center gap-3 bg-gray-50 text-gray-700 px-4 py-3 rounded-xl cursor-pointer transition-colors hover:bg-gray-100 border border-gray-200 font-medium">
            <Video size={20} /> 
            <span className="text-base">Video</span> 
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => handleArchivoChange(e, "video")}
            />
          </label>

          <label className="flex items-center gap-3 bg-gray-50 text-gray-700 px-4 py-3 rounded-xl cursor-pointer transition-colors hover:bg-gray-100 border border-gray-200 font-medium">
            <Image size={20} />
            <span className="text-base">Foto</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleArchivoChange(e, "foto")}
            />
          </label>
        </div>

        <button
          onClick={handlePublicar}
          disabled={!nuevoPost.trim() && !archivo}
          className="flex items-center gap-2 bg-white !bg-white text-black px-3 py-2 rounded-lg shadow-sm transition-colors" 
        >
          Publicar
        </button>
      </div>
    </div>
  );
}

export default CrearPublicacion;