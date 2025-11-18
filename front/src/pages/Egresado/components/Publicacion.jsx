import React, { useState } from "react";
import {
  ThumbsUp,
  MessageCircle,
  Share,
  MoreHorizontal,
  X,
  Bookmark,
  Link,
  Flag,
} from "lucide-react";

function Publicacion({
  post,
  isLiked,
  perfilesUsuarios,
  onLike,
  onDelete,
  onAddComment,
}) {
  const [menuActivo, setMenuActivo] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");

  const comentariosRapidos = ["¡Qué buena noticia! 🎉", "Felicidades 👏", "Éxitos 💪"];

  const obtenerImagenPerfil = (autor, perfilImgEspecifico = null) => {
    if (perfilImgEspecifico) return perfilImgEspecifico;
    return perfilesUsuarios?.[autor] || null;
  };

  // ---- Wrappers con console.log para debugear ----
  const handleLike = async () => {
    console.log("[DEBUG] handleLike called", { postId: post._id, currentlyLiked: isLiked });
    try {
      await onLike(post._id);
      console.log("[DEBUG] onLike finished (parent handler called).");
    } catch (err) {
      console.error("[DEBUG] onLike threw:", err);
    }
  };

  const handleDelete = async () => {
    console.log("[DEBUG] handleDelete called", { postId: post._id });
    try {
      await onDelete(post._id);
      console.log("[DEBUG] onDelete finished (parent handler called).");
    } catch (err) {
      console.error("[DEBUG] onDelete threw:", err);
    }
  };

  const handleAddComment = async (texto) => {
    if (!texto || !texto.trim()) return;
    console.log("[DEBUG] handleAddComment called", { postId: post._id, texto });
    try {
      const result = await onAddComment(post._id, texto);
      console.log("[DEBUG] onAddComment finished, result:", result);
      setCommentText("");
      setShowCommentBox(false);
    } catch (err) {
      console.error("[DEBUG] onAddComment threw:", err);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    handleAddComment(commentText);
  };

  const handleQuickComment = (texto) => {
    console.log("[DEBUG] quick comment clicked", { postId: post._id, texto });
    handleAddComment(texto);
  };

  const manejarMenu = (accion) => {
    if (accion === "guardar") alert(`Guardaste la publicación de ${post.autor}`);
    if (accion === "copiar") {
      navigator.clipboard.writeText(post.contenido);
      alert("Contenido copiado al portapapeles");
    }
    if (accion === "reportar") alert(`Reportaste la publicación de ${post.autor}`);
    setMenuActivo(false);
  };

  return (
    <article className="bg-white rounded-2xl p-6 relative shadow-sm text-white">
      {/* HEADER */}
      <header className="flex items-start justify-between text-black">
        <div className="flex items-center gap-3">
          {obtenerImagenPerfil(post.autor, post.perfilImg) ? (
            <img
              src={obtenerImagenPerfil(post.autor, post.perfilImg)}
              alt="Perfil"
              className="w-11 h-11 rounded-full object-cover"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
              {post.autor?.charAt(0)}
            </div>
          )}

          <div>
            <h4 className="font-semibold text-green-700">{post.autor}</h4>
            <time className="text-xs text-gray-500">
              {post.fechaCreacion ? new Date(post.fechaCreacion).toLocaleString() : "Hace poco"}
            </time>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Menú ... */}
          <div className="relative">
            <button
              onClick={() => setMenuActivo(!menuActivo)}
              className="flex items-center gap-2 bg-gray-100 text-white px-3 py-2 rounded-lg transition"
            >
              <MoreHorizontal size={18} />
            </button>

            {menuActivo && (
              <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[180px] z-20 text-white">
                <button
                  onClick={() => manejarMenu("guardar")}
                  className="flex items-center gap-2 px-3 py-2 w-full text-sm"
                >
                  <Bookmark size={16} className="text-gray-500" />
                  <span>Guardar publicación</span>
                </button>

                <button
                  onClick={() => manejarMenu("copiar")}
                  className="flex items-center gap-2 px-3 py-2 w-full text-sm"
                >
                  <Link size={16} className="text-gray-500" />
                  <span>Copiar enlace</span>
                </button>

                <div className="border-t border-gray-100 my-1" />

                <button
                  onClick={() => manejarMenu("reportar")}
                  className="flex items-center gap-2 px-3 py-2 w-full text-sm text-red-600 hover:bg-red-50"
                >
                  <Flag size={16} />
                  <span>Reportar publicación</span>
                </button>
              </div>
            )}
          </div>

          {/* Botón eliminar (solo si autor es Tú) - rojo */}
          {post.autor === "Tú" && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg transition"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </header>

      {/* CONTENIDO */}
      <p className="text-gray-900 mt-3 leading-relaxed">{post.contenido}</p>

      {/* ARCHIVO IMAGEN (vista) */}
      {post.medios?.length > 0 &&
        post.medios.map((m, i) => {
          if (m.tipo === "imagen" || (m.url && m.url.match(/\.(jpg|jpeg|png|gif|webp)$/i))) {
            return (
              <img
                key={i}
                src={m.url}
                alt={`Adjunto-${i}`}
                className="mt-3 rounded-xl w-full h-auto object-contain"
              />
            );
          }
          if (m.tipo === "video" || (m.url && m.url.match(/\.(mp4|webm|ogg)$/i))) {
            return (
              <video
                key={i}
                controls
                className="mt-3 rounded-xl max-h-96 w-full object-cover"
              >
                <source src={m.url} />
              </video>
            );
          }
          return null;
        })}

      {/* FOOTER: Likes / Comentarios / Compartir */}
      <footer className="mt-4 flex items-center justify-around text-sm">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
            isLiked ? "text-green-600 font-semibold bg-gray-100" : "text-white bg-gray-100"
          }`}
        >
          <ThumbsUp size={16} /> Me gusta ({typeof post.likesCount === "number" ? post.likesCount : 0})
        </button>

        <button
          onClick={() => {
            console.log("[DEBUG] comentar button clicked", { postId: post._id, showCommentBox });
            setShowCommentBox((s) => !s);
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200 text-white transition"
        >
          <MessageCircle size={16} /> Comentar ({post.comentarios?.length || 0})
        </button>

        {/* Compartir (placeholder) */}
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-white transition">
          <Share size={16} /> Compartir
        </button>
      </footer>

      {/* Caja de comentar (toggle) */}
      {showCommentBox && (
        <form onSubmit={handleCommentSubmit} className="mt-3">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Escribe tu comentario..."
            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg resize-none text-black"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleAddComment(commentText);
              }
            }}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                setShowCommentBox(false);
                setCommentText("");
              }}
              className="px-4 py-2 rounded-lg bg-gray-100 text-white"
            >
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-gray-100 text-white">
              Enviar
            </button>
          </div>
        </form>
      )}

      {/* COMENTARIOS */}
      {post.comentarios?.length > 0 && (
        <div className="mt-4 pt-3 space-y-3 border-t border-gray-100">
          {post.comentarios.map((comentario, i) => (
            <div key={i} className="text-sm text-white flex items-start gap-3">
              {obtenerImagenPerfil(comentario.autor, comentario.perfilImg) ? (
                <img
                  src={obtenerImagenPerfil(comentario.autor, comentario.perfilImg)}
                  alt="Perfil"
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                  {comentario.autor.charAt(0)}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="bg-gray-50 rounded-2xl rounded-tl-none px-3 py-2">
                  <p className="font-medium text-green-700 text-xs">{comentario.autor}</p>
                  <p className="text-gray-900 mt-1">{comentario.contenido}</p>
                </div>
                <time className="text-xs text-gray-400 mt-1 block pl-1">
                  {comentario.fechaCreacion ? new Date(comentario.fechaCreacion).toLocaleString() : "Hace poco"}
                </time>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* COMENTARIOS RÁPIDOS */}
      <div className="mt-3 flex gap-2 flex-wrap">
        {comentariosRapidos.map((c, i) => (
          <button
            key={i}
            onClick={() => handleQuickComment(c)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-white text-xs"
          >
            {c}
          </button>
        ))}
      </div>
    </article>
  );
}

export default Publicacion;
