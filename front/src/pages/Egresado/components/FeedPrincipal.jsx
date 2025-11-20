import React from "react";
import Publicacion from "./Publicacion";

function FeedPrincipal({ 
  posts, 
  perfil, 
  likedPosts, 
  perfilesUsuarios, 
  darLike, 
  eliminarPost, 
  agregarComentario 
}) {
  // ✅ Asegurar que posts siempre sea un array
  const postsSeguros = Array.isArray(posts) ? posts : [];

  // ✅ Asegurar que likedPosts siempre sea un array
  const likedPostsSeguros = Array.isArray(likedPosts) ? likedPosts : [];

  // ✅ Asegurar que perfilesUsuarios siempre sea un objeto
  const perfilesUsuariosSeguros = perfilesUsuarios || {};

  return (
    <div className="space-y-6">
      {postsSeguros.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay publicaciones para mostrar</p>
        </div>
      ) : (
        postsSeguros.map((post) => (
          <Publicacion
            key={post.id || Math.random()} // ✅ Key segura
            post={post}
            perfil={perfil}
            isLiked={likedPostsSeguros.includes(post.id)}
            perfilesUsuarios={perfilesUsuariosSeguros}
            onLike={darLike}
            onDelete={eliminarPost}
            onAddComment={agregarComentario}
          />
        ))
      )}
    </div>
  );
}

export default FeedPrincipal;