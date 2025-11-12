import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
  Eye,
  Tag,
  User,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  ChevronRight,
} from "lucide-react";
import { obtenerNoticias } from "../../api/gestionNoticiasApi";

export default function NoticiaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noticia, setNoticia] = useState(null);
  const [noticiasRelacionadas, setNoticiasRelacionadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardada, setGuardada] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Cargar noticia y noticias relacionadas
  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        setLoading(true);
        const data = await obtenerNoticias();
        const noticiaEncontrada = data.noticias.find((n) => n._id === id);
        
        if (noticiaEncontrada) {
          setNoticia(noticiaEncontrada);
          
          // Filtrar noticias relacionadas por categoría
          const relacionadas = data.noticias
            .filter(
              (n) => n.categoria === noticiaEncontrada.categoria && n._id !== id
            )
            .slice(0, 3);
          setNoticiasRelacionadas(relacionadas);
        }
      } catch (error) {
        console.error("Error al cargar noticia:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticia();
    window.scrollTo(0, 0);
  }, [id]);

  const formatearFecha = (fecha) => {
    const options = { 
      year: "numeric", 
      month: "long", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    return new Date(fecha).toLocaleDateString("es-ES", options);
  };

  const handleGuardar = () => {
    setGuardada(!guardada);
  };

  const handleCompartir = (plataforma) => {
    const url = window.location.href;
    const texto = noticia.titulo;

    switch (plataforma) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "copiar":
        navigator.clipboard.writeText(url);
        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
          setShowShareMenu(false);
        }, 2000);
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-gray-500 text-xl mt-4">Cargando noticia...</p>
        </div>
      </div>
    );
  }

  if (!noticia) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Noticia no encontrada
          </h2>
          <button
            onClick={() => navigate("/noticias")}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-3 rounded-full! font-bold transition-all! duration-300"
          >
            Volver a Noticias
          </button>
        </div>
      </div>
    );
  }

  const imagen =
    noticia.imagenUrl ||
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=600&fit=crop";

  return (
    <div className="min-h-screen bg-gray-50">
      <style>
        {`
          .article-content p {
            margin-bottom: 1.5rem;
            line-height: 1.8;
            color: #374151;
          }
          .article-content h2 {
            font-size: 1.875rem;
            font-weight: 700;
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: #111827;
          }
          .article-content h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            color: #1f2937;
          }
          .article-content ul, .article-content ol {
            margin-bottom: 1.5rem;
            padding-left: 2rem;
          }
          .article-content li {
            margin-bottom: 0.5rem;
            line-height: 1.8;
          }
          .article-content blockquote {
            border-left: 4px solid #5DC554;
            padding-left: 1.5rem;
            margin: 2rem 0;
            font-style: italic;
            color: #6b7280;
          }
        `}
      </style>

      {/* Header con imagen de portada */}
      <div className="relative h-[500px] bg-black">
        <img
          src={imagen}
          alt={noticia.titulo}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Botón volver */}
        <button
          onClick={() => navigate("/noticias")}
          className="absolute top-8 left-8 bg-white/90 hover:bg-white text-gray-800 px-6 py-3 rounded-full! font-bold transition-all! duration-300 flex items-center gap-2 shadow-xl"
        >
          <ArrowLeft size={20} />
          Volver
        </button>

        {/* Título sobre la imagen */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                {noticia.categoria}
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold">
                {noticia.tipoContenido}
              </span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
              {noticia.titulo}
            </h1>
            <div className="flex items-center gap-6 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{formatearFecha(noticia.fechaPublicacion)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={18} />
                <span>{noticia.vistas} vistas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Barra lateral de acciones */}
          <div className="hidden lg:block sticky top-24 h-fit">
            <div className="flex flex-col gap-4">
              <button
                onClick={handleGuardar}
                className={`p-4 rounded-full! transition-all! duration-300 shadow-lg hover:shadow-xl ${
                  guardada
                    ? "bg-gradient-to-r! from-green-500! to-teal-500! text-white!"
                    : "bg-white! text-gray-600! hover:bg-gray-50!"
                }`}
                title="Guardar"
              >
                <Bookmark size={24} fill={guardada ? "white" : "none"} />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-4 bg-white! text-gray-600! rounded-full! shadow-lg hover:shadow-xl transition-all! duration-300 hover:bg-gray-50"
                  title="Compartir"
                >
                  <Share2 size={24} />
                </button>

                {/* Menú de compartir */}
                {showShareMenu && (
                  <div className="absolute left-full ml-4 top-0 bg-white! rounded-2xl shadow-2xl p-4 flex flex-col gap-2 min-w-[200px] z-50">
                    <button
                      onClick={() => handleCompartir("facebook")}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 transition-all!"
                    >
                      <Facebook size={20} className="text-blue-600" />
                      Facebook
                    </button>
                    <button
                      onClick={() => handleCompartir("twitter")}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-sky-50! text-gray-700 transition-all!"
                    >
                      <Twitter size={20} className="text-sky-500" />
                      Twitter
                    </button>
                    <button
                      onClick={() => handleCompartir("linkedin")}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50! text-gray-700 transition-all!"
                    >
                      <Linkedin size={20} className="text-blue-700" />
                      LinkedIn
                    </button>
                    <button
                      onClick={() => handleCompartir("copiar")}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-green-50! text-gray-700 transition-all!"
                    >
                      <LinkIcon size={20} className="text-green-600" />
                      {copySuccess ? "¡Copiado!" : "Copiar enlace"}
                    </button>
                  </div>
                )}
              </div>

              <div className="text-center mt-4">
                <div className="bg-white rounded-full! p-4 shadow-lg">
                  <Eye size={24} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-700">
                    {noticia.vistas}
                  </p>
                  <p className="text-xs text-gray-500">vistas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido del artículo */}
          <div className="flex-1">
            <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              {/* Metadata */}
              <div className="flex items-center gap-4 pb-6 mb-8 border-b-2 border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <Tag size={18} style={{ color: "#5DC554" }} />
                  <span className="font-medium">{noticia.categoria}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={18} style={{ color: "#5DC554" }} />
                  <span className="font-medium">
                    {Math.ceil(noticia.contenido.length / 200)} min de lectura
                  </span>
                </div>
              </div>

              {/* Contenido principal */}
              <div className="article-content text-lg text-gray-700">
                {noticia.contenido.split("\n").map((parrafo, index) => (
                  <p key={index} className="mb-6 leading-relaxed">
                    {parrafo}
                  </p>
                ))}
              </div>

              {/* Tags/Estado */}
              <div className="mt-12 pt-8 border-t-2 border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 font-semibold">Estado:</span>
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
                    {noticia.estado}
                  </span>
                </div>
              </div>
            </article>

            {/* Noticias relacionadas */}
            {noticiasRelacionadas.length > 0 && (
              <div className="mt-12">
                <h2 className="text-3xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                    Noticias relacionadas
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {noticiasRelacionadas.map((relacionada) => (
                    <div
                      key={relacionada._id}
                      onClick={() => navigate(`/noticias/${relacionada._id}`)}
                      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all! duration-300 cursor-pointer hover:-translate-y-2"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={
                            relacionada.imagenUrl ||
                            "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop"
                          }
                          alt={relacionada.titulo}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          {relacionada.categoria}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 hover:text-green-500 transition-colors">
                          {relacionada.titulo}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {relacionada.contenido}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatearFecha(relacionada.fechaPublicacion).split(",")[0]}
                          </span>
                          <ChevronRight
                            size={20}
                            className="text-green-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botones de acción móvil */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-around shadow-2xl z-50">
        <button
          onClick={handleGuardar}
          className={`flex flex-col items-center gap-1 transition-all! ${
            guardada ? "text-green-500" : "text-gray-600"
          }`}
        >
          <Bookmark size={24} fill={guardada ? "currentColor" : "none"} />
          <span className="text-xs font-medium">
            {guardada ? "Guardado" : "Guardar"}
          </span>
        </button>
        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="flex flex-col items-center gap-1 text-gray-600 transition-all!"
        >
          <Share2 size={24} />
          <span className="text-xs font-medium">Compartir</span>
        </button>
      </div>
    </div>
  );
}