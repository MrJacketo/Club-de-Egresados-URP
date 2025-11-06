import React, { useState } from "react";
import { Globe, Video, Image, Smile } from "lucide-react";
import { forosApi } from "../../../api/ForosApi";

function CrearPublicacion({ perfil, agregarPost }) {
  const [nuevoPost, setNuevoPost] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [mostrarEmojis, setMostrarEmojis] = useState(false);

  const emojis = [
    "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
    "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
    "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩"
  ];

  const handleArchivoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setArchivo(e.target.files[0]);
    }
  };

  const agregarEmoji = (emoji) => {
    setNuevoPost((prev) => prev + emoji);
    setMostrarEmojis(false);
  };

  const handlePublicar = async () => {
    if (nuevoPost.trim() === "" && !archivo) return;

    try {
      const formData = new FormData();
      formData.append("contenido", nuevoPost);
      formData.append("autor", "Tú"); // o el UID real del usuario
      if (archivo) {
        formData.append("archivo", archivo);
      }

      // 🔹 Llamamos a la API actualizada con el nuevo endpoint
      const data = await forosApi.createPublicacion(formData);

      // 🔹 Actualiza el feed en el front con la nueva publicación
      if (agregarPost) agregarPost(data);

      // Reset de campos
      setNuevoPost("");
      setArchivo(null);
    } catch (error) {
      console.error("Error al publicar:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl w-full mb-8">
      {/* 🔹 Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {perfil ? (
            <img
              src={perfil}
              alt="Perfil"
              className="w-14 h-14 rounded-full object-cover border-2 border-green-200"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xl">
              G
            </div>
          )}
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Gonzalo Quineche</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Globe size={14} />
              <span>Publicar para cualquiera</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Texto de publicación */}
      <textarea
        className="w-full border-0 rounded-xl p-4 focus:outline-none focus:ring-0 resize-none min-h-[120px] text-black text-xl placeholder-gray-400 bg-gray-50"
        placeholder="¿Sobre qué quieres hablar? 😊"
        value={nuevoPost}
        onChange={(e) => setNuevoPost(e.target.value)}
      />

      {/* 🔹 Botón emojis */}
      <div className="flex items-center justify-between mt-4">
        <label
          onClick={() => setMostrarEmojis(!mostrarEmojis)}
          className="flex items-center gap-3 bg-gray-50 text-gray-700 px-4 py-3 rounded-xl cursor-pointer transition-colors hover:bg-gray-100 border border-gray-200 font-medium"
        >
          <Smile size={20} />
          <span className="text-base">Emojis</span>
        </label>
      </div>

      {/* 🔹 Selector de emojis */}
      {mostrarEmojis && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 max-h-48 overflow-y-auto">
          <div className="grid grid-cols-10 gap-2">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => agregarEmoji(emoji)}
                className="flex items-center gap-2 bg-white text-black px-3 py-2 rounded-lg shadow-sm transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 🔹 Archivo adjunto */}
      {archivo && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-base text-gray-600">📂 {archivo.name}</span>
            <button
              onClick={() => setArchivo(null)}
              className="flex items-center gap-2 bg-white text-black px-3 py-2 rounded-lg shadow-sm transition-colors"
            >
              ✕ Eliminar
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Botones de acción */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-3 bg-gray-50 text-gray-700 px-4 py-3 rounded-xl cursor-pointer hover:bg-gray-100 border border-gray-200 font-medium">
            <Video size={20} />
            <span className="text-base">Video</span>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleArchivoChange}
            />
          </label>

          <label className="flex items-center gap-3 bg-gray-50 text-gray-700 px-4 py-3 rounded-xl cursor-pointer hover:bg-gray-100 border border-gray-200 font-medium">
            <Image size={20} />
            <span className="text-base">Foto</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleArchivoChange}
            />
          </label>
        </div>

        <button
          onClick={handlePublicar}
          disabled={!nuevoPost.trim() && !archivo}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-sm hover:bg-green-700 transition-colors font-semibold"
        >
          Publicar
        </button>
      </div>
    </div>
  );
}

export default CrearPublicacion;
