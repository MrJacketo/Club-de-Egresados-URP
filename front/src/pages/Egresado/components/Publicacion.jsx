import React, { useState, useEffect } from "react";
import { ThumbsUp, MessageCircle, Share, MoreHorizontal, X, Bookmark, Link, Flag, Trash2 } from "lucide-react";
import fotoPerfil from "../../../assets/foto_perfil_xdefecto.png";
import { useProfilePhoto, getCurrentUserId } from "../../../Hooks/useProfilePhoto"; 

function Publicacion({ post, isLiked, perfilesUsuarios, onLike, onDelete, onAddComment }) {
  const [menuActivo, setMenuActivo] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [horaPublicacion, setHoraPublicacion] = useState("");
  const comentariosRapidos = ["¡Qué buena noticia! 🎉", "Felicidades 👏", "Éxitos 💪"];
  
  //  Usar el hook personalizado para la foto
  const { photo: userPhoto } = useProfilePhoto();

  //  Cargar datos del usuario actual - OPTIMIZADO
  useEffect(() => {
    let lastUserState = null;
    let hasLoggedInitialLoad = false;
    
    const loadUserData = (forceLog = false) => {
      try {
        // Cargar información del usuario para identificar al usuario actual
        const userId = getCurrentUserId();
        const userAcademicKey = `academicData_${userId}`;
        
        let academicData = localStorage.getItem(userAcademicKey);
        if (!academicData) {
          academicData = localStorage.getItem('academicData');
        }

        const newUserData = academicData ? JSON.parse(academicData).nombreCompleto || "Usuario" : null;
        
        // Solo actualizar si hay cambios reales
        if (lastUserState !== newUserData) {
          lastUserState = newUserData;
          setCurrentUser(newUserData);
          hasLoggedInitialLoad = true;
        }
      } catch (error) {
        console.error('Error cargando datos del usuario:', error);
      }
    };

    // Cargar datos inicial con log
    loadUserData(true);

    // Escuchar cambios en el localStorage
    const handleStorageChange = (e) => {
      if (e.key && (e.key.includes('academicData') || e.key === 'currentUser')) {
        loadUserData(true);
      }
    };

    // Escuchar eventos customizados de actualización
    const handleCustomUpdate = () => {
      loadUserData(true);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('academicDataUpdated', handleCustomUpdate);
    window.addEventListener('localStorageUpdated', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('academicDataUpdated', handleCustomUpdate);
      window.removeEventListener('localStorageUpdated', handleCustomUpdate);
    };
  }, []);

  //  Calcular la hora de publicación
  useEffect(() => {
    const calcularHoraPublicacion = () => {
      if (post.timestamp) {
        // Si el post ya tiene un timestamp, usarlo
        const fechaPost = new Date(post.timestamp);
        setHoraPublicacion(fechaPost.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }));
      } else {
        // Si no tiene timestamp, usar la hora actual
        const ahora = new Date();
        setHoraPublicacion(ahora.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }));
      }
    };

    calcularHoraPublicacion();
  }, [post.timestamp]);

  // Función para formatear hora de comentarios
  const formatearHoraComentario = (comentario) => {
    if (comentario.timestamp) {
      const fechaComentario = new Date(comentario.timestamp);
      return fechaComentario.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    }
    const ahora = new Date();
    return ahora.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const obtenerImagenPerfil = (autor, perfilImgEspecifico = null) => {
    //  Verificar si este autor es el usuario actual
    const esUsuarioActual = currentUser && autor === currentUser;
    
    // Si es el usuario actual y tenemos foto, usarla
    if (esUsuarioActual && userPhoto) {
      return userPhoto;
    }
    
    // Si hay una imagen específica para este post/comentario, usarla
    if (perfilImgEspecifico) {
      return perfilImgEspecifico;
    }
    
    // Si hay una imagen en perfilesUsuarios para este autor, usarla
    if (perfilesUsuarios && perfilesUsuarios[autor]) {
      return perfilesUsuarios[autor];
    }
    
    //  Si no hay ninguna imagen, usar la imagen por defecto
    return fotoPerfil;
  };

  const manejarMenu = (accion) => {
    if (accion === "guardar") alert(`Guardaste la publicación de ${post.autor}`);
    if (accion === "copiar") {
      navigator.clipboard.writeText(post.contenido);
      alert("Contenido copiado al portapapeles");
    }
    if (accion === "reportar") alert(`Reportaste la publicación de ${post.autor}`);
    if (accion === "borrar") {
      if (window.confirm("¿Estás seguro de que quieres borrar esta publicación?")) {
        onDelete(post.id);
      }
    }
    setMenuActivo(false);
  };

  //  Verificar si el post es del usuario actual
  const esPostDelUsuario = currentUser && post.autor === currentUser;

  //  Función mejorada para eliminar publicación
  const handleDeletePost = () => {
    if (window.confirm("¿Estás seguro de que quieres borrar esta publicación?")) {
      onDelete(post.id);
    }
    setMenuActivo(false);
  };

  return (
    <article className="bg-white rounded-2xl p-10 relative shadow-sm">
      <header className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/*  Usar obtenerImagenPerfil que ahora identifica correctamente al usuario */}
          <img
            src={obtenerImagenPerfil(post.autor, post.perfilImg)}
            alt="Perfil"
            className="w-11 h-11 rounded-full object-cover border-2 border-green-500"
            onError={(e) => {
              // En caso de error, mostrar el avatar con iniciales
              e.target.style.display = 'none';
              const avatar = document.getElementById(`avatar-${post.id}`);
              if (avatar) avatar.style.display = 'flex';
            }}
          />
          {/* Avatar de respaldo que se muestra si la imagen falla */}
          <div 
            className="w-11 h-11 rounded-full bg-green-600 text-white flex items-center justify-center font-bold"
            style={{ display: 'none' }}
            id={`avatar-${post.id}`}
          >
            {post.autor.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-green-700">{post.autor}</h4>
            {/*  MOSTRAR SOLO LA HORA - Formato 24 horas */}
            <time className="text-xs text-gray-400">{horaPublicacion}</time>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setMenuActivo(!menuActivo)}
              className="flex items-center gap-2 bg-white !bg-white text-black px-3 py-2 rounded-lg shadow-sm transition-colors"
            >
              <MoreHorizontal size={18} />
            </button>
            
            {menuActivo && (
              <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[180px] z-20">
                <button
                  onClick={() => manejarMenu("guardar")}
                  className="flex items-center gap-2 bg-white !bg-white text-black px-3 py-2 rounded-lg shadow-sm transition-colors"
                >
                  <Bookmark size={16} className="text-gray-500" />
                  <span>Guardar publicación</span>
                </button>
                
                <button
                  onClick={() => manejarMenu("copiar")}
                  className="flex items-center gap-2 bg-white !bg-white text-black px-3 py-2 rounded-lg shadow-sm transition-colors"
                >
                  <Link size={16} className="text-gray-500" />
                  <span>Copiar enlace</span>
                </button>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                {esPostDelUsuario && (
                  <button
                    onClick={handleDeletePost}
                    className="flex items-center gap-2 bg-white !bg-white text-black px-3 py-2 rounded-lg shadow-sm transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Borrar publicación</span>
                  </button>
                )}
                
                {!esPostDelUsuario && (
                  <button
                    onClick={() => manejarMenu("reportar")}
                    className="flex items-center gap-2 bg-white !bg-white text-black px-3 py-2 rounded-lg shadow-sm transition-colors"
                  >
                    <Flag size={16} />
                    <span>Reportar publicación</span>
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/*  Botón de eliminar visible solo para el autor */}
          {esPostDelUsuario && (
            <button
              onClick={handleDeletePost}
              className="flex items-center gap-2 bg-white !bg-white text-red-600 px-3 py-2 rounded-lg shadow-sm transition-colors hover:bg-red-50"
              title="Eliminar publicación"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </header>

      <p className="text-gray-700 mt-3 leading-relaxed">{post.contenido}</p>

      {post.imagen && (
        <img
          src={post.imagen}
          alt="Adjunto"
          className="mt-3 rounded-xl w-full h-auto object-contain"
        />
      )}

      {post.video && (
        <video controls className="mt-3 rounded-xl max-h-96 w-full object-cover">
          <source src={post.video} type="video/mp4" />
        </video>
      )}

      <footer className="mt-4 flex items-center justify-around text-sm">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-2 bg-white !bg-white text-black px-3 py-2 rounded-lg shadow-sm transition-colors ${
            isLiked ? "text-green-600 font-semibold bg-green-50" : "bg-white text-black hover:bg-gray-50"
          }`}
        >
          <ThumbsUp size={16} /> Me gusta ({post.likes || 0})
        </button>

        <button className="flex items-center gap-2 bg-white !bg-white text-black px-3 py-2 rounded-lg shadow-sm transition-colors">
          <MessageCircle size={16} /> Comentar ({post.comentarios?.length || 0})
        </button>

        <button className="flex items-center gap-2 bg-white !bg-white text-black px-3 py-2 rounded-lg shadow-sm transition-colors">
          <Share size={16} /> Compartir
        </button>
      </footer>

      {post.comentarios && post.comentarios.length > 0 && (
        <div className="mt-4 pt-3 space-y-3 border-t border-gray-100">
          {post.comentarios.map((comentario, i) => (
            <div key={i} className="text-sm text-gray-700 flex items-start gap-3">
              <img
                src={obtenerImagenPerfil(comentario.autor, comentario.perfilImg)}
                alt="Perfil"
                className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-green-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const avatar = document.getElementById(`avatar-comentario-${post.id}-${i}`);
                  if (avatar) avatar.style.display = 'flex';
                }}
              />
              {/* Avatar de respaldo para comentarios */}
              <div 
                className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600 font-medium flex-shrink-0"
                style={{ display: 'none' }}
                id={`avatar-comentario-${post.id}-${i}`}
              >
                {comentario.autor.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="bg-gray-50 rounded-2xl rounded-tl-none px-3 py-2">
                  <p className="font-medium text-green-700 text-xs">{comentario.autor}</p>
                  <p className="text-gray-800 mt-1">{comentario.texto}</p>
                </div>
                {/*  MOSTRAR SOLO LA HORA para comentarios */}
                <time className="text-xs text-gray-400 mt-1 block pl-1">
                  {formatearHoraComentario(comentario)}
                </time>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-2 flex-wrap">
        {comentariosRapidos.map((c, i) => (
          <button
            key={i}
            onClick={() => onAddComment(post.id, c)}
            className="flex items-center gap-2 bg-white !bg-white text-black px-3 py-2 rounded-lg shadow-sm transition-colors"
          >
            {c}
          </button>
        ))}
      </div>
    </article>
  );
}

export default Publicacion;