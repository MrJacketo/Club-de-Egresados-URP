import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Search,
  BookOpen,
  FileText,
  Image as ImageIcon,
  File,
  Tag,
  Clock,
} from "lucide-react";
import { obtenerNoticias } from "../../api/gestionNoticiasApi";

export default function Noticias() {
  const [currentSlide1, setCurrentSlide1] = useState(0);
  const [currentSlide2, setCurrentSlide2] = useState(0);
  const [currentSlide3, setCurrentSlide3] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [showFiltered, setShowFiltered] = useState(false);
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar noticias del backend
  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        setLoading(true);
        const data = await obtenerNoticias();
        setNoticias(data.noticias || []);
      } catch (error) {
        console.error("Error al cargar noticias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticias();
  }, []);

  // Categorizar noticias
  const destacadas = noticias.filter((n) => n.estado === "Destacado");
  const ultimas = noticias
    .filter((n) => n.estado !== "Destacado")
    .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
    .slice(0, 6);
  const podriaInteresar = noticias
    .filter((n) => n.estado !== "Destacado" && !ultimas.includes(n))
    .slice(0, 6);

  // Todas las noticias combinadas
  const todasNoticias = [...noticias];

  // Filtrar noticias
  const noticiasFilteradas = todasNoticias.filter((noticia) => {
    const matchSearch = noticia.titulo
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    let matchCategoria = true;
    if (categoriaSeleccionada && categoriaSeleccionada !== "todas") {
      matchCategoria = noticia.categoria === categoriaSeleccionada;
    }

    return matchSearch && matchCategoria;
  });

  const handleSearch = () => {
    if (searchTerm || categoriaSeleccionada) {
      setShowFiltered(true);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoriaSeleccionada("");
    setShowFiltered(false);
  };

  // Componente para cada sección de carrusel
  const CarouselSection = ({
    titulo,
    noticias,
    currentSlide,
    setCurrentSlide,
  }) => {
    if (!noticias || noticias.length === 0) {
      return null;
    }

    const nextSlide = () => {
      setCurrentSlide(
        (prev) => (prev + 1) % Math.max(1, noticias.length - 2)
      );
    };

    const prevSlide = () => {
      setCurrentSlide(
        (prev) =>
          (prev - 1 + Math.max(1, noticias.length - 2)) %
          Math.max(1, noticias.length - 2)
      );
    };

    return (
      <div className="mb-10">
        <h2 className="text-4xl font-bold text-start mb-6">
          <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
            {titulo}
          </span>
        </h2>
        <div className="relative">
          {noticias.length > 3 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white p-4 rounded-full! shadow-2xl! transition-all duration-300"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white p-4 rounded-full! shadow-2xl transition-all duration-300"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div className="overflow-hidden px-2 py-4">
            <div
              className="flex transition-transform duration-600 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}
            >
              {noticias.map((noticia) => (
                <div key={noticia._id} className="w-1/3 flex-shrink-0 px-3">
                  <NoticiaCard noticia={noticia} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente para cada tarjeta de noticia
  const NoticiaCard = ({ noticia }) => {
    const imagen =
      noticia.imagenUrl ||
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop";

    return (
      <div className="bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-3 shadow-lg hover:shadow-xl">
        <div className="relative h-72 overflow-hidden">
          <img
            src={imagen}
            alt={noticia.titulo}
            className="w-full h-full object-cover transition-transform duration-600 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300"></div>
          <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl">
            {getTipoContenidoLabel(noticia.tipoContenido)}
          </div>

          {/* Badge de categoría */}
          <div className="absolute top-4 right-4 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Tag size={14} />
            <span>{noticia.categoria}</span>
          </div>
        </div>

        <div className="p-6 bg-white">
          <div className="flex items-center gap-4 text-gray-500 text-sm mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar size={16} style={{ color: "#5DC554" }} />
              <span className="font-medium">
                {formatearFecha(noticia.fechaPublicacion)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} style={{ color: "#5DC554" }} />
              <span className="font-medium">{noticia.vistas} vistas</span>
            </div>
          </div>

          <h3 className="text-gray-800 text-start font-bold text-lg mb-3 line-clamp-2 transition-colors duration-300 hover:text-green-500">
            {noticia.titulo}
          </h3>

          <p className="text-gray-600 text-start text-sm mb-4 line-clamp-3">
            {noticia.contenido}
          </p>

          <div className="flex items-center justify-between mt-4">
            <span
              className="font-bold text-sm px-3 py-1 rounded-full bg-green-50"
              style={{ color: "#5DC554" }}
            >
              {noticia.estado}
            </span>
            <button
              onClick={() => window.open(`/noticias/${noticia._id}`, "_blank")}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-7 py-3 rounded-full! font-bold transition-all! duration-300 hover:shadow-2xl hover:scale-110! transform! hover:-translate-y-1"
            >
              Leer más
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Función para obtener etiqueta de tipo de contenido
  const getTipoContenidoLabel = (tipo) => {
    const iconMap = {
      Imagen: <ImageIcon size={14} />,
      Documento: <FileText size={14} />,
      "Contenido Web": <BookOpen size={14} />,
      PDF: <File size={14} />,
    };
    return (
      <div className="flex items-center gap-1">
        {iconMap[tipo]}
        <span>{tipo}</span>
      </div>
    );
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(fecha).toLocaleDateString("es-ES", options);
  };

  return (
    <div
      className="min-h-screen mb-10 pt-16"
      style={{
        background: "linear-gradient(to bottom right, #f9fafb, #ffffff)",
      }}
    >
      <style>
        {`
          input:focus { outline: none !important; border-color: #5DC554 !important; }
          select:focus { outline: none !important; border-color: #5DC554 !important; }
        `}
      </style>

      <div className="max-w-[95%] mx-auto px-4 mt-6">
        <div className="pb-12 text-start">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">
            <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
              Noticias
            </span>
          </h1>
          <p className="text-xl text-gray-500">
            Mantente informado con las últimas noticias y novedades
          </p>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="mb-12 bg-white rounded-2xl">
          <div className="flex gap-4 items-center">
            {/* Barra de búsqueda */}
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder="Buscar noticias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 text-gray-800 px-6 py-4 pl-14 rounded-xl transition-all duration-300 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white focus:shadow-lg"
                style={{ outline: "none", border: "2px solid #e5e7eb" }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#5DC554";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(93, 197, 84, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              />
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:scale-110"
                size={22}
                style={{ color: "#5DC554" }}
              />
            </div>

            {/* Filtro de categoría */}
            <div className="relative group">
              <select
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                className="bg-gray-50 text-gray-800 px-6 py-4 pl-14 pr-12 rounded-xl cursor-pointer transition-all duration-300 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white focus:shadow-lg appearance-none"
                style={{ outline: "none", border: "2px solid #e5e7eb" }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#5DC554";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(93, 197, 84, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="">Todas las categorías</option>
                <option value="General">General</option>
                <option value="Economia">Economía</option>
                <option value="Tecnologia">Tecnología</option>
                <option value="Deportes">Deportes</option>
                <option value="Salud">Salud</option>
                <option value="Academico">Académico</option>
              </select>
              <Tag
                className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-hover:scale-110"
                size={22}
                style={{ color: "#5DC554" }}
              />
            </div>

            {/* Botón buscar */}
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-2xl"
            >
              Buscar
            </button>

            {/* Botón limpiar filtros */}
            {(searchTerm || categoriaSeleccionada) && (
              <button
                onClick={clearFilters}
                className="bg-gray-100! hover:outline-0! hover:border-none! hover:bg-gray-200! text-gray-600! px-8 py-4 rounded-xl font-bold transition-all! duration-300 hover:shadow-lg"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Mostrar vista filtrada en grid o carruseles */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-gray-500 text-xl mt-4">Cargando noticias...</p>
          </div>
        ) : showFiltered ? (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold" style={{ color: "#5DC554" }}>
                Resultados de búsqueda ({noticiasFilteradas.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {noticiasFilteradas.map((noticia) => (
                <NoticiaCard key={noticia._id} noticia={noticia} />
              ))}
            </div>
            {noticiasFilteradas.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-xl">
                  No se encontraron noticias con los filtros seleccionados
                </p>
              </div>
            )}
          </div>
        ) : noticias.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay noticias disponibles
            </h3>
            <p className="text-gray-600">
              Pronto habrá nuevas noticias disponibles.
            </p>
          </div>
        ) : (
          <>
            {destacadas.length > 0 && (
              <CarouselSection
                titulo="Noticias destacadas"
                noticias={destacadas}
                currentSlide={currentSlide1}
                setCurrentSlide={setCurrentSlide1}
              />
            )}

            {ultimas.length > 0 && (
              <CarouselSection
                titulo="Últimas noticias"
                noticias={ultimas}
                currentSlide={currentSlide2}
                setCurrentSlide={setCurrentSlide2}
              />
            )}

            {podriaInteresar.length > 0 && (
              <CarouselSection
                titulo="Te podría interesar"
                noticias={podriaInteresar}
                currentSlide={currentSlide3}
                setCurrentSlide={setCurrentSlide3}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}