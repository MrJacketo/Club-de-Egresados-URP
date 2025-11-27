// frontend/src/pages/ForoEgresados.js - VERSIÓN CORREGIDA
import React, { useState, useEffect } from "react";
import SidebarIzquierda from "./components/SidebarIzquierda";
import SidebarDerecha from "./components/SidebarDerecha";
import FeedPrincipal from "./components/FeedPrincipal";
import CrearPublicacion from "./components/CrearPublicacion";
import { 
  obtenerPublicaciones, 
  crearPublicacion, 
  darLikePublicacion, 
  quitarLikePublicacion,
  comentarPublicacion,
  eliminarPublicacion
} from "../../api/foroPublicacionesApi";

function ForoEgresados() {
  const [posts, setPosts] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  
// Cargar imagen de perfil desde localStorage al iniciar
useEffect(() => {
  try {
    const userId = getCurrentUserId();
    const userPhotoKey = `userProfilePhoto_${userId}`;
    const imagenGuardada = localStorage.getItem(userPhotoKey);
    
    if (imagenGuardada && imagenGuardada.startsWith('data:image')) {
      setPerfil(imagenGuardada);
      console.log('✅ Imagen de perfil cargada desde localStorage para usuario:', userId);
    } else if (imagenGuardada) {
      console.log('⚠️ Imagen en formato no válido, limpiando...');
      localStorage.removeItem(userPhotoKey);
    }
  } catch (error) {
    console.error('❌ Error cargando imagen de perfil:', error);
  }
}, []);

// Y carga desde ambos lugares
useEffect(() => {
  try {
    const userId = getCurrentUserId();
    const userPhotoKey = `userProfilePhoto_${userId}`;
    
    // Intentar cargar desde la clave específica del usuario
    let imagenGuardada = localStorage.getItem(userPhotoKey);
    
    // Si no existe, intentar desde la clave forzada como fallback
    if (!imagenGuardada) {
      imagenGuardada = localStorage.getItem('imagenPerfilForzado');
      // Si existe en el fallback, migrarla a la clave específica
      if (imagenGuardada) {
        localStorage.setItem(userPhotoKey, imagenGuardada);
        localStorage.removeItem('imagenPerfilForzado');
      }
    }
    
    if (imagenGuardada && imagenGuardada.startsWith('data:image')) {
      setPerfil(imagenGuardada);
      console.log('✅ Imagen de perfil cargada exitosamente para usuario:', userId);
    }
  } catch (error) {
    console.error('❌ Error cargando imagen de perfil:', error);
  }
}, []);
  // FUNCIÓN PARA OBTENER USUARIO
  const getUsuarioActual = () => {
    try {
      const todasLasClaves = Object.keys(localStorage);
      
      for (let clave of todasLasClaves) {
        try {
          const valor = localStorage.getItem(clave);
          
          let datos = null;
          try {
            datos = JSON.parse(valor);
          } catch (e) {
            continue;
          }
          
          if (datos && typeof datos === 'object') {
            const posiblesIds = [
              datos.id,
              datos._id,
              datos.userId,
              datos.userID,
              datos.usuarioId,
              datos.usuarioID
            ];
            
            const userId = posiblesIds.find(id => id != null);
            
            if (userId) {
              return {
                id: userId,
                user: datos
              };
            }
          }
        } catch (error) {
          continue;
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  };

  // Función específica para obtener solo el ID
  const getUsuarioActualId = () => {
    const usuario = getUsuarioActual();
    return usuario ? usuario.id : null;
  };

  // Función para convertir imagen a Base64
  const convertirImagenABase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Manejar error de imagen
  const handleImageError = (postId) => {
    console.log(`Error cargando imagen para post ${postId}`);
    setImageErrors(prev => ({ ...prev, [postId]: true }));
  };

  // Cargar publicaciones desde la API
  const cargarPublicaciones = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await obtenerPublicaciones({ page, limit: 10 });
      
      if (response && response.success) {
        const publicacionesRecibidas = response.publicaciones || [];

        // Mapeo seguro con verificaciones
        const publicacionesFormateadas = publicacionesRecibidas.map(pub => {
          if (!pub) return null;
          
          // Manejar imagen - usar directamente lo que viene del backend
          let imagenUrl = null;
          if (pub.imagen) {
            if (typeof pub.imagen === 'string') {
              // Si es Base64, usarlo directamente
              if (pub.imagen.startsWith('data:image')) {
                imagenUrl = pub.imagen;
              }
              // Si es una URL que falla, ignorarla
              else if (pub.imagen.startsWith('http') || pub.imagen.startsWith('/')) {
                // No usar URLs que sabemos que fallan
                imagenUrl = null;
              }
              // Cualquier otro caso, intentar como Base64
              else {
                imagenUrl = pub.imagen;
              }
            }
          }

          return {
  id: pub._id || pub.id || `temp-${Date.now()}`,
  autor: pub.autor?.name || 'Usuario',
  contenido: pub.contenido || 'Sin contenido',
  titulo: pub.titulo || '',
  categoria: pub.categoria || 'General',
  etiquetas: pub.etiquetas || [],
  likes: Array.isArray(pub.likes) ? pub.likes.length : 0,
  usuariosQueDieronLike: Array.isArray(pub.likes) ? pub.likes : [],
  comentarios: (pub.comentarios || []).map(com => ({
    id: com._id || com.id || `com-${Date.now()}`,
    texto: com.contenido || '',
    autor: com.autor?.name || 'Usuario',
    perfilImg: com.perfilImg || com.autor?.profilePicture || null,
    fechaCreacion: com.fechaCreacion || com.createdAt || new Date().toISOString(),
    likes: com.likes || 0
  })),
  imagen: imagenUrl,
  video: pub.video || null,
  perfilImg: pub.perfilImg || pub.autor?.profilePicture || null,
  vistas: pub.vistas || 0,
  fechaCreacion: pub.fechaCreacion || pub.createdAt || new Date().toISOString(),
  fechaActualizacion: pub.fechaActualizacion || pub.updatedAt || new Date().toISOString()
};
        }).filter(Boolean);

        setPosts(publicacionesFormateadas);
        
        setPagination(response.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: publicacionesFormateadas.length,
          itemsPerPage: 10
        });
        
        // Actualizar likedPosts
        const usuarioActualId = getUsuarioActualId();
        if (usuarioActualId) {
          const userLikedPosts = publicacionesFormateadas
            .filter(post => 
              Array.isArray(post.usuariosQueDieronLike) &&
              post.usuariosQueDieronLike.some(user => 
                user && (user._id === usuarioActualId || user.id === usuarioActualId)
              )
            )
            .map(post => post.id);
          setLikedPosts(userLikedPosts);
        } else {
          setLikedPosts([]);
        }
      } else {
        throw new Error(response?.error || "Error al cargar las publicaciones");
      }
    } catch (err) {
      setError(err.message || "Error de conexión con el servidor");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar publicaciones al montar el componente
  useEffect(() => {
    cargarPublicaciones();
  }, []);

  // Agregar nueva publicación CON BASE64
  // Agregar nueva publicación CON BASE64 Y PERFIL
const agregarPost = async (nuevoPost) => {
  try {
    // Verificar autenticación primero
    const usuario = getUsuarioActual();
    if (!usuario) {
      setError("Debes iniciar sesión para crear publicaciones");
      return;
    }

    if (!nuevoPost.contenido || nuevoPost.contenido.trim() === '') {
      setError("El contenido de la publicación es obligatorio");
      return;
    }

    let imagenUrl = null;

    // CONVERTIR IMAGEN A BASE64 para evitar problemas de servidor
    if (nuevoPost.imagen && nuevoPost.imagen instanceof File) {
      try {
        imagenUrl = await convertirImagenABase64(nuevoPost.imagen);
      } catch (error) {
        console.error("Error convirtiendo imagen:", error);
        setError("Error al procesar la imagen");
        return;
      }
    } else if (nuevoPost.imagen) {
      imagenUrl = nuevoPost.imagen;
    }

    const publicacionData = {
      contenido: nuevoPost.contenido.trim(),
      titulo: nuevoPost.titulo || '',
      categoria: nuevoPost.categoria || 'General',
      etiquetas: nuevoPost.etiquetas || [],
      imagen: imagenUrl,
      video: nuevoPost.video || null,
        perfilImg: perfil // ← ESTA LÍNEA DEBE ESTAR PRESENTE
    };

    const response = await crearPublicacion(publicacionData);

    if (response.success) {
      await cargarPublicaciones(1);
      setError(null);
    } else {
      throw new Error(response.error || "Error al crear publicación");
    }
  } catch (err) {
    setError(err.message || "Error al crear publicación");
  }
};

  // Dar like a publicación
  const darLike = async (id) => {
    try {
      const usuario = getUsuarioActual();
      
      if (!usuario || !usuario.id) {
        setError("Debes iniciar sesión para dar like");
        return;
      }

      if (likedPosts.includes(id)) {
        // Quitar like
        const response = await quitarLikePublicacion(id);
        if (response.success) {
          setPosts(posts.map(p => 
            p.id === id ? { 
              ...p, 
              likes: response.likes || (p.likes > 0 ? p.likes - 1 : 0)
            } : p
          ));
          setLikedPosts(likedPosts.filter(postId => postId !== id));
        }
      } else {
        // Dar like
        const response = await darLikePublicacion(id);
        if (response.success) {
          setPosts(posts.map(p => 
            p.id === id ? { 
              ...p, 
              likes: response.likes || p.likes + 1
            } : p
          ));
          setLikedPosts([...likedPosts, id]);
        }
      }
    } catch (err) {
      setError(err.message || "Error al procesar el like");
    }
  };

  // ELIMINAR PUBLICACIÓN PERMANENTEMENTE - VERSIÓN CORREGIDA
  const eliminarPost = async (id) => {
    try {
      // PRIMERO eliminar del backend
      const response = await eliminarPublicacion(id);
      
      if (response && response.success) {
        // Si se eliminó correctamente del backend, eliminar del estado local
        setPosts(posts.filter(p => p.id !== id));
        setLikedPosts(likedPosts.filter(postId => postId !== id));
      } else {
        throw new Error(response?.error || "Error al eliminar publicación");
      }
    } catch (err) {
      setError(err.message || "Error al eliminar publicación");
      // Si hay error, igual eliminar del estado local para mejor UX
      setPosts(posts.filter(p => p.id !== id));
      setLikedPosts(likedPosts.filter(postId => postId !== id));
    }
  };

  // Agregar comentario
  // Agregar comentario CON IMAGEN DE PERFIL
const agregarComentario = async (id, texto) => {
  try {
    // Verificar autenticación
    const usuario = getUsuarioActual();
    if (!usuario) {
      setError("Debes iniciar sesión para comentar");
      return;
    }

    if (!texto || texto.trim() === '') {
      setError("El comentario no puede estar vacío");
      return;
    }

    // OBTENER LA IMAGEN DEL SIDEBAR (del estado o localStorage específico del usuario)
    const userId = getCurrentUserId();
    const userPhotoKey = `userProfilePhoto_${userId}`;
    const imagenPerfilActual = perfil || localStorage.getItem(userPhotoKey);

    console.log('💬 Enviando comentario con imagen:', {
      tieneImagen: !!imagenPerfilActual,
      imagen: imagenPerfilActual ? imagenPerfilActual.substring(0, 50) + '...' : 'No tiene'
    });

    // AGREGAR INMEDIATAMENTE AL ESTADO LOCAL (para feedback instantáneo)
    const comentarioTemporal = {
      id: `temp-com-${Date.now()}`,
      texto: texto.trim(),
      autor: 'Tú',
      perfilImg: imagenPerfilActual || '/default-avatar.png',
      fechaCreacion: new Date().toISOString(),
      likes: 0
    };

    setPosts(posts.map(post => 
      post.id === id 
        ? { ...post, comentarios: [...post.comentarios, comentarioTemporal] }
        : post
    ));

    // ENVIAR AL BACKEND
    const comentarioData = {
      contenido: texto.trim(),
      perfilImg: imagenPerfilActual // ← ENVIAR LA IMAGEN AL BACKEND
    };

    const response = await comentarPublicacion(id, comentarioData);
    
    if (response.success) {
      console.log('✅ Comentario guardado en backend');
    } else {
      throw new Error(response.error || "Error al agregar comentario");
    }
  } catch (err) {
    setError(err.message || "Error al agregar comentario");
    // Revertir el comentario temporal si hay error
    setPosts(posts.map(post => 
      post.id === id 
        ? { ...post, comentarios: post.comentarios.filter(com => !com.id.includes('temp-com')) }
        : post
    ));
  }
};
 const cambiarPerfil = (nuevaImagen) => {
  const userId = getCurrentUserId();
  const userPhotoKey = `userProfilePhoto_${userId}`;
  
  setPerfil(nuevaImagen);
  // Guardar en localStorage de forma segura con clave específica del usuario
  if (nuevaImagen) {
    localStorage.setItem(userPhotoKey, nuevaImagen);
    console.log('✅ Imagen de perfil guardada en localStorage para usuario:', userId);
  } else {
    localStorage.removeItem(userPhotoKey);
  }
};

  // Cargar más publicaciones
  const cargarMasPublicaciones = async () => {
    if (pagination.currentPage < pagination.totalPages) {
      await cargarPublicaciones(pagination.currentPage + 1);
    }
  };

  return (
    <>
      <style>{`
        @media (max-width: 1024px) {
          .foro-sidebar-right {
            display: none !important;
          }
        }
        
        @media (max-width: 768px) {
          .foro-container {
            flex-direction: column !important;
            padding: 0 12px !important;
          }
          .foro-sidebar-left {
            width: 100% !important;
            min-width: unset !important;
            position: relative !important;
            height: auto !important;
            order: 2;
          }
          .foro-contenido {
            order: 1;
            min-width: unset !important;
            padding: 16px 8px !important;
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={{ 
        width: '100vw',
        margin: 0, 
        padding: 0, 
        backgroundColor: '#f3f4f6',
        minHeight: '100vh',
        paddingTop: '80px',
        overflow: 'auto'
      }}>
        <div 
          className="foro-container"
          style={{ 
            display: 'flex', 
            width: '100%', 
            margin: 0, 
            padding: '0 20px',
            minHeight: '100%',
            maxWidth: '1400px',
            marginLeft: 'auto',
            marginRight: 'auto',
            gap: '16px'
          }}
        >
          
          {/* Sidebar Izquierda */}
          <div 
            className="foro-sidebar-left"
            style={{ 
              width: '300px',
              minWidth: '280px',
              flexShrink: 1,
              position: 'sticky',
              top: 0,
              height: '100vh',
              overflow: 'auto'
            }}
          >
            <SidebarIzquierda 
              perfil={perfil}
              cambiarPerfil={cambiarPerfil}
            />
          </div>
          
          {/* Contenido Principal */}
          <div 
            className="foro-contenido"
            style={{ 
              flex: 1,
              padding: '24px 16px',
              minWidth: '300px',
              margin: 0
            }}
          >
            <div style={{ 
              width: '100%',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              
              {/* Mostrar error */}
              {error && (
                <div style={{
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>{error}</span>
                  <button 
                    onClick={() => setError(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#dc2626',
                      cursor: 'pointer',
                      fontSize: '18px'
                    }}
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Mostrar loading */}
              {loading && posts.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#6b7280'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #e5e7eb',
                    borderTop: '3px solid #00BC4F',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 16px'
                  }}></div>
                  <p>Cargando publicaciones...</p>
                </div>
              )}

              <CrearPublicacion 
                perfil={perfil}
                agregarPost={agregarPost}
                loading={loading}
              />
              
              {!loading && posts.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#6b7280',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ marginBottom: '8px' }}>No hay publicaciones aún</h3>
                  <p>Sé el primero en compartir algo con la comunidad</p>
                </div>
              ) : (
                <FeedPrincipal 
                  posts={posts}
                  perfil={perfil}
                  likedPosts={likedPosts}
                  darLike={darLike}
                  eliminarPost={eliminarPost}
                  agregarComentario={agregarComentario}
                  cambiarPerfil={cambiarPerfil}
                  loading={loading}
                  onImageError={handleImageError}
                  imageErrors={imageErrors}
                />
              )}

              {/* Botón para cargar más publicaciones */}
              {!loading && pagination.currentPage < pagination.totalPages && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button 
                    onClick={cargarMasPublicaciones}
                    style={{
                      backgroundColor: '#00BC4F',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Cargar más publicaciones
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Derecha */}
          <div 
            className="foro-sidebar-right"
            style={{ 
              width: '300px',
              minWidth: '280px',
              flexShrink: 1,
              position: 'sticky',
              top: 0,
              height: '100vh',
              overflow: 'auto'
            }}
          >
            <SidebarDerecha />
          </div>
        </div>
      </div>
    </>
  );
}

export default ForoEgresados;