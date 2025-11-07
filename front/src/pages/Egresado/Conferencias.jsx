import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Search,
  CheckCircle,
  X,
  Users,
  MapPin,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  getConferenciasDisponibles,
  inscribirseConferencia,
  getMisInscripciones,
} from "../../api/conferenciaApi";
import { useUser } from "../../context/userContext";

export default function Conferencias() {
  const [currentSlide1, setCurrentSlide1] = useState(0);
  const [currentSlide2, setCurrentSlide2] = useState(0);
  const [currentSlide3, setCurrentSlide3] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showFiltered, setShowFiltered] = useState(false);
  const [notification, setNotification] = useState(null);
  const [errorNotification, setErrorNotification] = useState(null);
  const [inscritos, setInscritos] = useState([]);
  const [conferencias, setConferencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  // Cargar conferencias del backend
  useEffect(() => {
    const fetchConferencias = async () => {
      try {
        setLoading(true);
        const data = await getConferenciasDisponibles();
        setConferencias(data || []);
      } catch (error) {
        console.error("Error al cargar conferencias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConferencias();
  }, []);

  // Cargar inscripciones del usuario
  useEffect(() => {
    const fetchInscripciones = async () => {
      if (user) {
        try {
          const inscripciones = await getMisInscripciones();
          const idsInscritos = inscripciones.map((insc) => insc.conferencia_id._id || insc.conferencia_id);
          setInscritos(idsInscritos);
        } catch (error) {
          console.error("Error al cargar inscripciones:", error);
        }
      }
    };

    fetchInscripciones();
  }, [user]);

  // Categorizar conferencias (filtrar las que ya está inscrito)
  const conferenciasFiltradas = conferencias.filter((c) => !inscritos.includes(c._id));
  
  const destacadas = conferenciasFiltradas.filter((c) => c.destacado === true);
  const ultimas = conferenciasFiltradas
    .filter((c) => !c.destacado)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);
  const podriaInteresar = conferenciasFiltradas
    .filter((c) => !c.destacado && !ultimas.includes(c))
    .slice(0, 6);

  // Todas las conferencias combinadas (sin las inscritas)
  const todasConferencias = [...conferenciasFiltradas];

  // Filtrar conferencias
  const conferenciasFilteradas = todasConferencias.filter((conf) => {
    const matchSearch = conf.titulo
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    let matchDate = true;
    if (selectedDate) {
      const confFecha = new Date(conf.fecha_evento)
        .toISOString()
        .split("T")[0];
      matchDate = confFecha === selectedDate;
    }

    return matchSearch && matchDate;
  });

  const handleSearch = () => {
    if (searchTerm || selectedDate) {
      setShowFiltered(true);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDate("");
    setShowFiltered(false);
  };

  const handleInscribirse = async (conferencia) => {
    if (!user) {
      setErrorNotification({
        titulo: conferencia.titulo,
        mensaje: "Debes iniciar sesión para inscribirte",
        tipo: "warning",
      });
      setTimeout(() => setErrorNotification(null), 6000);
      return;
    }

    if (!inscritos.includes(conferencia._id)) {
      try {
        await inscribirseConferencia(conferencia._id);
        setInscritos([...inscritos, conferencia._id]);
        setNotification({
          titulo: conferencia.titulo,
          modalidad: conferencia.modalidad,
        });
        setTimeout(() => setNotification(null), 5000);
      } catch (error) {
        console.error("Error al inscribirse:", error);

        let errorMessage = "Error al inscribirse a la conferencia";
        let errorType = "error";

        if (error.response?.status === 400) {
          const errorData = error.response.data;
          if (errorData.message?.includes("ya estás inscrito")) {
            errorMessage = "Ya estás inscrito en esta conferencia";
            errorType = "warning";
          } else if (errorData.message?.includes("cupos disponibles")) {
            errorMessage = "No hay cupos disponibles";
            errorType = "error";
          } else if (errorData.message?.includes("inscripción")) {
            errorMessage = errorData.message;
            errorType = "error";
          } else {
            errorMessage =
              errorData.message || "No se pudo completar la inscripción";
            errorType = "error";
          }
        } else if (error.response?.status === 401) {
          errorMessage = "Debes iniciar sesión para inscribirte";
          errorType = "warning";
        } else if (error.response?.status === 404) {
          errorMessage = "La conferencia no está disponible";
          errorType = "error";
        } else if (error.response?.status === 500) {
          errorMessage = "Error del servidor. Inténtalo más tarde";
          errorType = "error";
        } else if (!error.response) {
          errorMessage = "Sin conexión a internet. Verifica tu conexión";
          errorType = "error";
        }

        setErrorNotification({
          titulo: conferencia.titulo,
          mensaje: errorMessage,
          tipo: errorType,
        });
        setTimeout(() => setErrorNotification(null), 6000);
      }
    }
  };

  // Componente de notificación de éxito
  const Notification = ({ notification, onClose }) => (
    <div className="fixed top-20 right-8 z-50 animate-slide-in">
      <div className="bg-white rounded-2xl shadow-2xl p-4 flex items-start gap-3 min-w-[320px] border-2 border-green-500">
        <div className="flex-shrink-0">
          <CheckCircle className="text-green-500" size={24} />
        </div>
        <div className="flex-1">
          <h4 className="text-gray-900 font-semibold mb-1">
            ¡Inscripción Exitosa!
          </h4>
          <p className="text-gray-600 text-sm">{notification.titulo}</p>
          <p className="text-green-500 text-xs mt-1">
            {getModalidadLabel(notification.modalidad)}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400! hover:text-gray-900! transition-all!"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );

  // Componente de notificación de error
  const ErrorNotification = ({ errorNotification, onClose }) => {
    const isWarning = errorNotification.tipo === "warning";
    const borderColor = isWarning ? "border-yellow-500" : "border-red-500";
    const iconColor = isWarning ? "text-yellow-500" : "text-red-500";
    const textColor = isWarning ? "text-yellow-500" : "text-red-500";

    return (
      <div className="fixed top-20 right-8 z-50 animate-slide-in">
        <div
          className={`bg-white rounded-2xl shadow-2xl p-4 flex items-start gap-3 min-w-[320px] border-2 ${borderColor}`}
        >
          <div className="flex-shrink-0">
            {isWarning ? (
              <Clock className={iconColor} size={24} />
            ) : (
              <X className={iconColor} size={24} />
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-gray-900 font-semibold mb-1">
              {isWarning ? "¡Atención!" : "¡Error!"}
            </h4>
            <p className="text-gray-600 text-sm mb-1">
              {errorNotification.titulo}
            </p>
            <p className={`text-sm font-medium ${textColor}`}>
              {errorNotification.mensaje}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400! hover:text-gray-900! transition-all!"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    );
  };

  // Componente para cada sección de carrusel
  const CarouselSection = ({
    titulo,
    conferencias,
    currentSlide,
    setCurrentSlide,
  }) => {
    if (!conferencias || conferencias.length === 0) {
      return null;
    }

    const nextSlide = () => {
      setCurrentSlide(
        (prev) => (prev + 1) % Math.max(1, conferencias.length - 2)
      );
    };

    const prevSlide = () => {
      setCurrentSlide(
        (prev) =>
          (prev - 1 + Math.max(1, conferencias.length - 2)) %
          Math.max(1, conferencias.length - 2)
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
          {conferencias.length > 3 && (
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
              {conferencias.map((conf) => (
                <div key={conf._id} className="w-1/3 flex-shrink-0 px-3">
                  <ConferenciaCard
                    conf={conf}
                    onInscribirse={handleInscribirse}
                    isInscrito={inscritos.includes(conf._id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente para cada tarjeta de conferencia
  const ConferenciaCard = ({ conf, onInscribirse, isInscrito }) => {
    const inscripcionCerrada =
      new Date(conf.fecha_inscripcion_fin) < new Date();
    const cuposLimitados = conf.cupos_disponibles !== null;
    const cuposAgotados = cuposLimitados && conf.cupos_restantes <= 0;
    const puedeInscribirse =
      !inscripcionCerrada && !cuposAgotados && !isInscrito;

    const imagen =
      conf.imagen_conferencia ||
      "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=300&fit=crop";

    return (
      <div className="bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-3 shadow-lg hover:shadow-xl">
        <div className="relative h-72 overflow-hidden">
          <img
            src={imagen}
            alt={conf.titulo}
            className="w-full h-full object-cover transition-transform duration-600 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300"></div>
          <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl">
            {getModalidadLabel(conf.modalidad)}
          </div>

          {/* Mostrar cupos */}
          {cuposLimitados && (
            <div className="absolute top-4 right-4 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Users size={14} />
              <span>{conf.cupos_restantes} cupos</span>
            </div>
          )}
        </div>

        <div className="p-6 bg-white">
          <div className="flex items-center gap-4 text-gray-500 text-sm mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar size={16} style={{ color: "#5DC554" }} />
              <span className="font-medium">
                {formatearFecha(conf.fecha_evento)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} style={{ color: "#5DC554" }} />
              <span className="font-medium">{conf.hora_inicio}</span>
            </div>
          </div>

          <h3 className="text-gray-800 text-start font-bold text-lg mb-3 line-clamp-2 transition-colors duration-300 hover:text-green-500">
            {conf.titulo}
          </h3>

          <div className="space-y-2 mb-4 text-gray-600 text-sm">
            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 mt-1" />
              <span>Ponente: {conf.ponente}</span>
            </div>
            {conf.plataforma && conf.modalidad === "virtual" && (
              <div className="flex items-center gap-2">
                <MapPin size={16} style={{ color: "#5DC554" }} />
                <span className="font-medium">{conf.plataforma}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <span>Duración: {conf.duracion_horas}h</span>
            </div>
          </div>

          <p className="text-gray-600 text-start text-sm mb-4 line-clamp-2">
            {conf.descripcion}
          </p>

          <div className="flex items-center justify-between mt-4">
            <span
              className="font-bold text-xl transition-transform duration-300 hover:scale-110"
              style={{ color: "#5DC554" }}
            >
              Gratis
            </span>
            <button
              onClick={() => onInscribirse(conf)}
              disabled={!puedeInscribirse}
              className={`px-7 py-3 rounded-full! font-bold transition-all! duration-300 hover:shadow-2xl hover:scale-110! transform! hover:-translate-y-1 ${
                isInscrito
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : cuposAgotados
                  ? "bg-red-400 text-white cursor-not-allowed"
                  : inscripcionCerrada
                  ? "bg-red-400 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
              }`}
            >
              {isInscrito
                ? "Inscrito"
                : cuposAgotados
                ? "Cupos agotados"
                : inscripcionCerrada
                ? "Cerrada"
                : "Inscríbete"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Función para obtener etiqueta de modalidad
  const getModalidadLabel = (modalidad) => {
    switch (modalidad) {
      case "virtual":
        return "Virtual";
      case "presencial":
        return "Presencial";
      case "hibrida":
        return "Híbrida";
      default:
        return "Conferencia";
    }
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(fecha).toLocaleDateString("es-ES", options);
  };

  return (
    <div
      className="min-h-screen mb-10 pt-16"
      style={{ background: "linear-gradient(to bottom right, #f9fafb, #ffffff)" }}
    >
      <style>
        {`
          input:focus { outline: none !important; border-color: #5DC554 !important; }
          @keyframes slide-in {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .animate-slide-in {
            animation: slide-in 0.3s ease-out;
          }
        `}
      </style>

      {notification && (
        <Notification
          notification={notification}
          onClose={() => setNotification(null)}
        />
      )}

      {errorNotification && (
        <ErrorNotification
          errorNotification={errorNotification}
          onClose={() => setErrorNotification(null)}
        />
      )}

      <div className="max-w-[95%] mx-auto px-4 mt-6">
        <div className="pb-12 text-start">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">
            <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
              Conferencias
            </span>
          </h1>
          <p className="text-xl text-gray-500">
            Descubre todas las conferencias que tenemos preparadas para impulsar
            tu carrera profesional
          </p>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="mb-12 bg-white rounded-2xl">
          <div className="flex gap-4 items-center">
            {/* Barra de búsqueda */}
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder="Buscar conferencias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 text-gray-800 px-6 py-4 pl-14 rounded-xl transition-all duration-300 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white focus:shadow-lg"
                style={{ outline: "none", border: "2px solid #e5e7eb" }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#5DC554";
                  e.target.style.boxShadow = "0 0 0 3px rgba(93, 197, 84, 0.1)";
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

            {/* Filtro de fecha */}
            <div className="relative group">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-gray-50 text-gray-800 px-6 py-4 pl-14 pr-6 rounded-xl cursor-pointer transition-all duration-300 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white focus:shadow-lg"
                style={{ outline: "none", border: "2px solid #e5e7eb" }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#5DC554";
                  e.target.style.boxShadow = "0 0 0 3px rgba(93, 197, 84, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              />
              <CalendarIcon
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
            {(searchTerm || selectedDate) && (
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
            <p className="text-gray-500 text-xl mt-4">
              Cargando conferencias...
            </p>
          </div>
        ) : showFiltered ? (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold" style={{ color: "#5DC554" }}>
                Resultados de búsqueda ({conferenciasFilteradas.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {conferenciasFilteradas.map((conf) => (
                <ConferenciaCard
                  key={conf._id}
                  conf={conf}
                  onInscribirse={handleInscribirse}
                  isInscrito={inscritos.includes(conf._id)}
                />
              ))}
            </div>
            {conferenciasFilteradas.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-xl">
                  No se encontraron conferencias con los filtros seleccionados
                </p>
              </div>
            )}
          </div>
        ) : conferenciasFiltradas.length === 0 ? (
          <div className="text-center py-20">
            <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay conferencias disponibles
            </h3>
            <p className="text-gray-600">
              {user 
                ? "Ya estás inscrito en todas las conferencias disponibles o pronto habrá nuevas conferencias."
                : "Pronto habrá nuevas conferencias disponibles."}
            </p>
          </div>
        ) : (
          <>
            {destacadas.length > 0 && (
              <CarouselSection
                titulo="Eventos destacados"
                conferencias={destacadas}
                currentSlide={currentSlide1}
                setCurrentSlide={setCurrentSlide1}
              />
            )}

            {ultimas.length > 0 && (
              <CarouselSection
                titulo="Últimas conferencias"
                conferencias={ultimas}
                currentSlide={currentSlide2}
                setCurrentSlide={setCurrentSlide2}
              />
            )}

            {podriaInteresar.length > 0 && (
              <CarouselSection
                titulo="Te podría interesar"
                conferencias={podriaInteresar}
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