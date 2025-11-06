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
}) {//aqui se cambio y se puso un _id
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Publicacion
          key={post.id}
          post={post}
          perfil={perfil}
          isLiked={likedPosts.includes(post.id)}
          perfilesUsuarios={perfilesUsuarios}
          onLike={darLike}
          onDelete={eliminarPost}
          onAddComment={agregarComentario}
        />
      ))}
    </div>
  );
}

export default FeedPrincipal;