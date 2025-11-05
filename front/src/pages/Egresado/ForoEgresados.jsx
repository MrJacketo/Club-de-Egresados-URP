import React, { useState } from "react";
import SidebarIzquierda from "./components/SidebarIzquierda";
import SidebarDerecha from "./components/SidebarDerecha";
import FeedPrincipal from "./components/FeedPrincipal";
import CrearPublicacion from "./components/CrearPublicacion";

function ForoEgresados() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      autor: "Ana Pérez",
      contenido: "¡Feliz de compartir mi nuevo proyecto con ustedes! 🚀",
      likes: 12,
      comentarios: [
        { 
          texto: "¡Felicitaciones Ana! 🎉", 
          autor: "Carlos López",
          perfilImg: null 
        },
        { 
          texto: "Se ve increíble 👏", 
          autor: "María García",
          perfilImg: null 
        }
      ],
      imagen: null,
      video: null,
      perfilImg: null,
    },
    {
      id: 2,
      autor: "Carlos López",
      contenido: "¿Alguien tiene recursos para mejorar en React? 🤔",
      likes: 5,
      comentarios: [
        { 
          texto: "Te paso un curso buenazo 🔗", 
          autor: "Ana Pérez",
          perfilImg: null 
        },
        { 
          texto: "Yo también ando en eso 💻", 
          autor: "Pedro Martínez",
          perfilImg: null 
        }
      ],
      imagen: null,
      video: null,
      perfilImg: null,
    },
  ]);

  const [perfil, setPerfil] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [perfilesUsuarios, setPerfilesUsuarios] = useState({
    "Ana Pérez": null,
    "Carlos López": null,
    "María García": null,
    "Pedro Martínez": null,
    "Tú": null
  });

  const agregarPost = (nuevoPost) => {
    setPosts([nuevoPost, ...posts]);
  };

  const darLike = (id) => {
    if (likedPosts.includes(id)) {
      setPosts(posts.map((p) => (p.id === id ? { ...p, likes: p.likes - 1 } : p)));
      setLikedPosts(likedPosts.filter((postId) => postId !== id));
    } else {
      setPosts(posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)));
      setLikedPosts([...likedPosts, id]);
    }
  };

  const eliminarPost = (id) => {
    setPosts(posts.filter((p) => p.id !== id));
    setLikedPosts(likedPosts.filter((postId) => postId !== id));
  };

  const agregarComentario = (id, texto) => {
    const nuevoComentario = {
      texto: texto,
      autor: "Tú",
      perfilImg: perfil || null
    };

    setPosts(
      posts.map((p) =>
        p.id === id ? { 
          ...p, 
          comentarios: [...p.comentarios, nuevoComentario] 
        } : p
      )
    );
  };

  const cambiarPerfil = (nuevaImagen) => {
    setPerfil(nuevaImagen);
    setPerfilesUsuarios(prev => ({
      ...prev,
      "Tú": nuevaImagen
    }));
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
        
        {/* Contenido Principal - OCUPA TODO EL ESPACIO */}
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
            <CrearPublicacion 
              perfil={perfil}
              agregarPost={agregarPost}
            />
            
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

export { ForoEgresados };
export default ForoEgresados;