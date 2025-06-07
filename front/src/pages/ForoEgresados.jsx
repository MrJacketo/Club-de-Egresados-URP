import React, { useState, useEffect, useCallback } from "react";
import { ThumbsUp, MessageCircle, MoreVertical, Trash2, Send, Pencil, X } from "lucide-react";

function ForoEgresados() {
  const [postText, setPostText] = useState("");
  const [media, setMedia] = useState(null);
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const etiquetasDisponibles = [
    "Debate",
    "Opiniones",
    "Sugerencias",
    "Eventos",
    "Oportunidades",
    "Otros",
  ];

  const getFormattedDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${date} ${time}`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith("video") ? "video" : "image";
      setMedia({ url, type });
    }
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handlePost = useCallback(() => {
    if (postText.trim() === "" && !media) return;

    const tagsFromText = postText.match(/#\w+/g)?.map(tag => tag.slice(1)) || [];
    const allTags = [...new Set([...tagsFromText])];

    const newPost = {
      id: Date.now(),
      user: "Tú",
      datetime: getFormattedDateTime(),
      content: postText.trim(),
      media,
      tags: allTags,
      comments: [],
      likedByUser: false,
      likesCount: 0,
    };

    setPosts((prev) => [newPost, ...prev]);
    setPostText("");
    setMedia(null);
  }, [postText, media]);

  const handleCancel = () => {
    setPostText("");
    setMedia(null);
  };

  const handleDeletePost = useCallback(
    (id) => setPosts((prev) => prev.filter((post) => post.id !== id)),
    []
  );

  const handleEditPost = useCallback((id, newContent) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, content: newContent } : post))
    );
  }, []);

  const handleAddComment = useCallback((postId, commentText, clearInput) => {
    if (commentText.trim() === "") return;

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: Date.now(),
            user: "Tú",
            datetime: getFormattedDateTime(),
            content: commentText.trim(),
          };
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      })
    );
    clearInput();
  }, []);

  const handleDeleteComment = useCallback((postId, commentId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: post.comments.filter((c) => c.id !== commentId) }
          : post
      )
    );
  }, []);

  const handleToggleLike = useCallback((postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const liked = !post.likedByUser;
          const likesCount = liked ? post.likesCount + 1 : Math.max(post.likesCount - 1, 0);
          return { ...post, likedByUser: liked, likesCount };
        }
        return post;
      })
    );
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.content.toLowerCase().includes(search.toLowerCase()) ||
      post.user.toLowerCase().includes(search.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      (post.tags && selectedTags.some(tag => post.tags.includes(tag)));
    
    return matchesSearch && matchesTags;
  });

  return (
    <div className="bg-gradient-to-b from-green-90 to-white flex flex-col">
      <header className="mt-12 bg-white shadow sticky top-0 z-30 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-extrabold text-green-700 cursor-pointer select-none hover:text-green-800 transition">
          ForoEgresados
        </h1>

        <input
          type="text"
          placeholder="Buscar en el foro..."
          className="w-full max-w-sm px-4 py-2 rounded-full border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 text-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <nav className="flex space-x-3">
          {["Inicio", "Mensajes", "Notificaciones", "Perfil"].map((item) => (
            <a
              key={item}
              href={item === "Inicio" ? "/" : "#"}
              className="bg-green-700 text-white px-5 py-2 rounded-full hover:bg-green-800 shadow-md transition"
            >
              {item}
            </a>
          ))}
        </nav>
      </header>

      <main className="flex flex-1 max-w-7xl mx-auto p-6 gap-8">
        <aside className="hidden md:block w-64 bg-white rounded-xl shadow p-5 text-green-700 space-y-6 sticky top-20 self-start">
          <h2 className="font-semibold text-xl border-b border-green-200 pb-2 mb-3">
            Accesos Rápidos
          </h2>
          <ul className="flex flex-col gap-3">
            {["Mi Perfil", "Grupos", "Eventos", "Amigos"].map((item) => (
              <li
                key={item}
                className="cursor-pointer hover:underline hover:text-green-800 transition"
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <h3 className="font-semibold text-lg border-b border-green-200 pb-2 mb-3">
              Filtrar por etiquetas
            </h3>
            <div className="space-y-2">
              {etiquetasDisponibles.map((etiqueta) => (
                <label key={etiqueta} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(etiqueta)}
                    onChange={() => handleTagToggle(etiqueta)}
                    className="form-checkbox h-4 w-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span>{etiqueta}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <section className="flex-1 flex flex-col gap-6">
          <NewPostInput
            postText={postText}
            setPostText={setPostText}
            media={media}
            setMedia={setMedia}
            onFileChange={handleFileChange}
            onPost={handlePost}
            onCancel={handleCancel}
            availableTags={etiquetasDisponibles}
          />

          {filteredPosts.length === 0 ? (
            <p className="text-center text-gray-500 mt-10 text-lg select-none">
              No se encontraron publicaciones.
            </p>
          ) : (
            filteredPosts.map((post) => (
              <Post
                key={post.id}
                post={post}
                onDelete={() => handleDeletePost(post.id)}
                onEdit={handleEditPost}
                onAddComment={handleAddComment}
                onDeleteComment={handleDeleteComment}
                onToggleLike={handleToggleLike}
              />
            ))
          )}
        </section>

        <aside className="hidden lg:block w-64 bg-white rounded-xl shadow p-5 space-y-8 sticky top-20 self-start text-black">
          <PopularTopics />
          <UpcomingEvents />
        </aside>
      </main>
    </div>
  );
}

function NewPostInput({ postText, setPostText, media, setMedia, onFileChange, onPost, onCancel, availableTags }) {
  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    
    if (!postText.includes(`#${tag}`)) {
      setPostText(prev => `${prev} #${tag}`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col gap-4">
      <textarea
        className="resize-none w-full h-24 p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-500 text-black placeholder:text-gray-400"
        placeholder="¿Qué quieres compartir con tus compañeros? (Usa # para etiquetas)"
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
      />

      

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <label className="cursor-pointer bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold hover:bg-green-200 flex items-center justify-center gap-2 transition">
          Seleccionar archivo
          <input
            type="file"
            accept="image/*,video/*"
            onChange={onFileChange}
            className="hidden"
          />
        </label>

        {media && (
          <div className="relative max-w-xs max-h-48 rounded-lg overflow-hidden shadow-md border border-green-300">
            {media.type === "image" ? (
              <img src={media.url} alt="Vista previa" className="object-cover w-full h-40" />
            ) : (
              <video src={media.url} controls className="object-cover w-full h-40" />
            )}
            <button
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition"
              onClick={() => setMedia(null)}
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className="ml-auto flex gap-2">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-4 py-2 rounded-full transition text-white"
          >
            Cancelar
          </button>
          <button
            onClick={onPost}
            disabled={postText.trim() === "" && !media}
            className="bg-green-700 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-full transition"
          >
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
}

function Post({ post, onDelete, onEdit, onAddComment, onDeleteComment, onToggleLike }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);

  const clearCommentInput = () => setCommentText("");

  const handleSaveEdit = () => {
    if (editedContent.trim() === "") return;
    onEdit(post.id, editedContent.trim());
    setIsEditing(false);
  };

  const predefinedComments = ["¡Gracias!", "¡Muy bien!", "¡Interesante!", "¡Felicidades!", "¡Qué buena noticia!"];

  const handlePredefinedComment = (text) => {
    onAddComment(post.id, text, () => {});
  };

  return (
    <article className="bg-white rounded-xl shadow-md p-5 text-black relative group hover:shadow-lg transition-shadow">
      <header className="flex justify-between items-center mb-4" >
        <div className="flex items-center gap-3 te">
          <div className="bg-green-700 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg select-none ">
            {post.user.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-green-700">{post.user}</h3>
            <time className="text-gray-400 text-xs">{post.datetime}</time>
          </div>
        </div>

        <div className="relative">
          <button
            className="p-1 rounded-full hover:bg-green-100 transition text-white"
            onClick={() => setShowOptions((v) => !v)}
          >
            <MoreVertical size={20} />
          </button>
          {showOptions && (
            <div
              className="absolute right-0 mt-2 w-28 bg-white border border-green-300 rounded-md shadow-md z-10"
              onMouseLeave={() => setShowOptions(false)}
            >
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowOptions(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-green-50 text-white"
              >
                <Pencil size={16} className="inline mr-1" />
                Editar
              </button>
              <button
                onClick={() => {
                  if (window.confirm("¿Seguro que deseas eliminar esta publicación?")) onDelete();
                }}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-white"
              >
                <Trash2 size={16} className="inline mr-1" />
                Eliminar
              </button>
            </div>
          )}
        </div>
      </header>

      <section className="mb-4">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full border border-green-300 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-600 text-black"
            rows={3}
          />
        ) : (
          <p className="whitespace-pre-wrap">{post.content}</p>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {post.tags.map(tag => (
              <span key={tag} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {post.media && (
          <div className="mt-3 rounded-lg overflow-hidden border border-green-300 max-w-full max-h-60">
            {post.media.type === "image" ? (
              <img
                src={post.media.url}
                alt="Contenido adjunto"
                className="w-full object-cover max-h-60"
                loading="lazy"
              />
            ) : (
              <video
                src={post.media.url}
                controls
                className="w-full max-h-60"
                preload="metadata"
              />
            )}
          </div>
        )}
      </section>

      {isEditing && (
        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-4 py-1 rounded-full transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveEdit}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold px-4 py-1 rounded-full transition"
          >
            Guardar
          </button>
        </div>
      )}

      <footer className="flex items-center justify-between text-gray-600 text-sm select-none">
        <button
          onClick={() => onToggleLike(post.id)}
          className={`flex items-center gap-1 transition ${
            post.likedByUser ? "text-green-600 font-semibold" : "hover:text-green-600 text-white"
          }`}
        >
          <ThumbsUp size={18} />
          {post.likesCount > 0 ? post.likesCount : "Me gusta"}
        </button>

        <button
          onClick={() => setShowCommentBox((v) => !v)}
          className="flex items-center gap-1 hover:text-green-600 transition text-white"
        >
          <MessageCircle size={18} />
          Comentarios ({post.comments.length})
        </button>
      </footer>

      {showCommentBox && (
        <div className="mt-4 border-t border-green-200 pt-3 space-y-3">
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {post.comments.length === 0 ? (
              <p className="text-gray-400 italic select-none">Sin comentarios aún</p>
            ) : (
              post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start justify-between bg-green-50 p-2 rounded-lg">
                  <div>
                    <p className="font-semibold text-green-700">{comment.user}</p>
                    <p className="text-sm">{comment.content}</p>
                    <time className="text-xs text-gray-400">{comment.datetime}</time>
                  </div>
                  <button
                    onClick={() => onDeleteComment(post.id, comment.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {predefinedComments.map((msg, i) => (
              <button
                key={i}
                onClick={() => handlePredefinedComment(msg)}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full hover:bg-green-200 text-sm transition text-white"
              >
                {msg}
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function PopularTopics() {
  const topics = [
    "Programación",
    "Emprendimiento",
    "Aprendizaje Continuo",
    "Networking",
    "Eventos U. Ricardo Palma",
  ];
  return (
    <section className="text-green-700">
      <h3 className="font-semibold text-lg border-b border-green-200 pb-2 mb-3">
        Temas Populares
      </h3>
      <ul className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <li
            key={topic}
            className="bg-green-100 hover:bg-green-200 cursor-pointer rounded-full px-3 py-1 text-sm select-none"
          >
            {topic}
          </li>
        ))}
      </ul>
    </section>
  );
}

function UpcomingEvents() {
  const events = [
    { date: "2025-06-15", title: "Taller de React" },
    { date: "2025-07-01", title: "Conferencia de IA" },
    { date: "2025-08-12", title: "Encuentro de Egresados" },
  ];
  return (
    <section className="text-green-700">
      <h3 className="font-semibold text-lg border-b border-green-200 pb-2 mb-3">
        Eventos Próximos
      </h3>
      <ul className="space-y-2">
        {events.map(({ date, title }) => (
          <li key={date} className="cursor-pointer hover:underline hover:text-green-800 transition select-none">
            <time dateTime={date} className="font-mono mr-2 text-sm text-gray-500">
              {new Date(date).toLocaleDateString()}
            </time>
            {title}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ForoEgresados;