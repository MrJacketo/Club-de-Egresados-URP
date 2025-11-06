import React, { useState, useEffect } from "react";
import SidebarIzquierda from "./components/SidebarIzquierda";
import SidebarDerecha from "./components/SidebarDerecha";
import FeedPrincipal from "./components/FeedPrincipal";
import CrearPublicacion from "./components/CrearPublicacion";
import { forosApi } from "../../api/ForosApi"; // 🔹 Importación del cliente API real

function ForoEgresados() {
  const [posts, setPosts] = useState([]); // 🔹 Ahora los posts vienen del backend
  const [perfil, setPerfil] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [perfilesUsuarios, setPerfilesUsuarios] = useState({ "Tú": null });

  // ===========================================================
  // 🔹 1. Cargar publicaciones desde el backend al iniciar
  // ===========================================================
  useEffect(() => {
    const cargarPublicaciones = async () => {
      try {
        const data = await forosApi.getAllPublicaciones();
        setPosts(data);
      } catch (error) {
        console.error("❌ Error al obtener publicaciones:", error);
      }
    };
    cargarPublicaciones();
  }, []);

  // ===========================================================
  // 🔹 2. Crear nueva publicación
  // ===========================================================
const agregarPost = async (formData) => {
  try {
    const nuevaPublicacion = await forosApi.createPublicacion(formData);
    setPosts([nuevaPublicacion, ...posts]);
  } catch (error) {
    console.error("❌ Error al crear publicación:", error);
  }
};

  // ===========================================================
  // 🔹 3. Dar y quitar “like” (solo local, no guardado en backend)
  // ===========================================================
  const darLike = (id) => {
    if (likedPosts.includes(id)) {
      setPosts(posts.map((p) => (p._id === id ? { ...p, likes: (p.likes || 0) - 1 } : p)));
      setLikedPosts(likedPosts.filter((postId) => postId !== id));
    } else {
      setPosts(posts.map((p) => (p._id === id ? { ...p, likes: (p.likes || 0) + 1 } : p)));
      setLikedPosts([...likedPosts, id]);
    }
  };

  // ===========================================================
  // 🔹 4. Ocultar (eliminar visualmente) una publicación
  // ===========================================================
  const eliminarPost = async (id) => {
    try {
      await forosApi.ocultarPublicacion(id);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (error) {
      console.error("❌ Error al ocultar publicación:", error);
    }
  };

  // ===========================================================
  // 🔹 5. Agregar comentario a publicación
  // ===========================================================
  const agregarComentario = async (id, texto) => {
    try {
      const actualizada = await forosApi.addComentario(id, "Tú", texto);
      setPosts(posts.map((p) => (p._id === id ? actualizada : p)));
    } catch (error) {
      console.error("❌ Error al agregar comentario:", error);
    }
  };

  // ===========================================================
  // 🔹 6. Cambiar imagen de perfil local
  // ===========================================================
  const cambiarPerfil = (nuevaImagen) => {
    setPerfil(nuevaImagen);
    setPerfilesUsuarios((prev) => ({
      ...prev,
      "Tú": nuevaImagen,
    }));
  };

  // ===========================================================
  // 🔹 7. Renderizado visual
  // ===========================================================
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
      `}</style>

      <div
        style={{
          width: "100vw",
          margin: 0,
          padding: 0,
          backgroundColor: "#f3f4f6",
          minHeight: "100vh",
          paddingTop: "80px",
          overflow: "auto",
        }}
      >
        <div
          className="foro-container"
          style={{
            display: "flex",
            width: "100%",
            margin: 0,
            padding: "0 20px",
            minHeight: "100%",
            maxWidth: "1400px",
            marginLeft: "auto",
            marginRight: "auto",
            gap: "16px",
          }}
        >
          {/* Sidebar Izquierda */}
          <div
            className="foro-sidebar-left"
            style={{
              width: "300px",
              minWidth: "280px",
              flexShrink: 1,
              position: "sticky",
              top: 0,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <SidebarIzquierda perfil={perfil} cambiarPerfil={cambiarPerfil} />
          </div>

          {/* Contenido principal */}
          <div
            className="foro-contenido"
            style={{
              flex: 1,
              padding: "24px 16px",
              minWidth: "300px",
              margin: 0,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "700px",
                margin: "0 auto",
              }}
            >
              <CrearPublicacion perfil={perfil} agregarPost={agregarPost} />

              <FeedPrincipal
                posts={posts}
                perfil={perfil}
                likedPosts={likedPosts}
                perfilesUsuarios={perfilesUsuarios}
                darLike={darLike}
                eliminarPost={eliminarPost}
                agregarComentario={agregarComentario}
                cambiarPerfil={cambiarPerfil}
              />
            </div>
          </div>

          {/* Sidebar Derecha */}
          <div
            className="foro-sidebar-right"
            style={{
              width: "300px",
              minWidth: "280px",
              flexShrink: 1,
              position: "sticky",
              top: 0,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <SidebarDerecha />
          </div>
        </div>
      </div>
    </>
  );
}

export { ForoEgresados };
export default ForoEgresados;
