import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  Ticket,
  GraduationCap,
  Gift,
  CheckCircle,
  X,
  Clock,
  Building2,
  Tag,
  Eye,
} from "lucide-react";
import { getBeneficiosRequest, redimirBeneficioRequest } from '../../api/gestionarBeneficiosApi';
import { useUser } from '../../context/userContext';

export default function Cursos() {
  const [currentSlide1, setCurrentSlide1] = useState(0);
  const [currentSlide2, setCurrentSlide2] = useState(0);
  const [currentSlide3, setCurrentSlide3] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [showFiltered, setShowFiltered] = useState(false);
  const [notification, setNotification] = useState(null);
  const [errorNotification, setErrorNotification] = useState(null);
  const [reclamados, setReclamados] = useState([]);
  const [beneficios, setBeneficios] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  // Cargar beneficios del backend
  useEffect(() => {
    const fetchBeneficios = async () => {
      try {
        setLoading(true);
        const data = await getBeneficiosRequest();
        setBeneficios(data || []);
      } catch (error) {
        console.error('Error al cargar beneficios:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBeneficios();
    }
  }, [user]);

  // Categorizar beneficios
  const descuentos = beneficios.filter(b => b.tipo_beneficio === 'convenio');
  const cursos = beneficios.filter(b => b.tipo_beneficio === 'academico');
  const otrosBeneficios = beneficios.filter(b => ['laboral', 'salud', 'cultural'].includes(b.tipo_beneficio));

  // Todos los beneficios combinados para filtros
  const todosBeneficios = [...beneficios];

  // Filtrar beneficios
  const beneficiosFilterados = todosBeneficios.filter((benef) => {
    const matchSearch = benef.titulo
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchType = selectedType ? getCategoryFromType(benef.tipo_beneficio) === selectedType : true;
    return matchSearch && matchType;
  });

  // Función para mapear tipos a categorías
  const getCategoryFromType = (tipo) => {
    switch (tipo) {
      case 'convenio':
        return 'Descuentos';
      case 'academico':
        return 'Cursos';
      case 'laboral':
      case 'salud':
      case 'cultural':
        return 'Otros';
      default:
        return 'Otros';
    }
  };

  const handleSearch = () => {
    if (searchTerm || selectedType) {
      setShowFiltered(true);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("");
    setShowFiltered(false);
  };

  const handleReclamar = async (beneficio) => {
    if (!reclamados.includes(beneficio._id)) {
      try {
        await redimirBeneficioRequest(beneficio._id);
        setReclamados([...reclamados, beneficio._id]);
        setNotification({
          titulo: beneficio.titulo,
          tipo: beneficio.tipo_beneficio,
        });
        setTimeout(() => setNotification(null), 5000);
      } catch (error) {
        console.error('Error al reclamar beneficio:', error);
        
        // Determinar el tipo de error y mostrar mensaje apropiado
        let errorMessage = 'Error al reclamar el beneficio';
        let errorType = 'error';
        
        if (error.response?.status === 400) {
          const errorData = error.response.data;
          if (errorData.message?.includes('ya ha sido redimido')) {
            errorMessage = 'Ya has reclamado este beneficio anteriormente';
            errorType = 'warning';
          } else if (errorData.message?.includes('no encontrado')) {
            errorMessage = 'El beneficio no está disponible';
            errorType = 'error';
          } else {
            errorMessage = errorData.message || 'Datos inválidos para reclamar el beneficio';
            errorType = 'error';
          }
        } else if (error.response?.status === 401) {
          errorMessage = 'Debes iniciar sesión para reclamar beneficios';
          errorType = 'warning';
        } else if (error.response?.status === 500) {
          errorMessage = 'Error del servidor. Inténtalo más tarde';
          errorType = 'error';
        } else if (!error.response) {
          errorMessage = 'Sin conexión a internet. Verifica tu conexión';
          errorType = 'error';
        }
        
        setErrorNotification({
          titulo: beneficio.titulo,
          mensaje: errorMessage,
          tipo: errorType
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
            ¡Beneficio Reclamado!
          </h4>
          <p className="text-gray-600 text-sm">{notification.titulo}</p>
          <p className="text-green-500 text-xs mt-1">{getTipoLabel(notification.tipo)}</p>
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
    const isWarning = errorNotification.tipo === 'warning';
    const borderColor = isWarning ? 'border-yellow-500' : 'border-red-500';
    const iconColor = isWarning ? 'text-yellow-500' : 'text-red-500';
    const textColor = isWarning ? 'text-yellow-500' : 'text-red-500';
    
    return (
      <div className="fixed top-20 right-8 z-50 animate-slide-in">
        <div className={`bg-white rounded-2xl shadow-2xl p-4 flex items-start gap-3 min-w-[320px] border-2 ${borderColor}`}>
          <div className="flex-shrink-0">
            {isWarning ? (
              <Clock className={iconColor} size={24} />
            ) : (
              <X className={iconColor} size={24} />
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-gray-900 font-semibold mb-1">
              {isWarning ? '¡Atención!' : '¡Error!'}
            </h4>
            <p className="text-gray-600 text-sm mb-1">{errorNotification.titulo}</p>
            <p className={`text-sm font-medium ${textColor}`}>{errorNotification.mensaje}</p>
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
    beneficios,
    currentSlide,
    setCurrentSlide,
  }) => {
    const nextSlide = () => {
      setCurrentSlide(
        (prev) => (prev + 1) % Math.max(1, beneficios.length - 2)
      );
    };

    const prevSlide = () => {
      setCurrentSlide(
        (prev) =>
          (prev - 1 + Math.max(1, beneficios.length - 2)) %
          Math.max(1, beneficios.length - 2)
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
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white p-4 rounded-full! shadow-2xl! transition-all duration-300"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="overflow-hidden px-2 py-4">
            <div
              className="flex transition-transform duration-600 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}
            >
              {beneficios.map((benef) => (
                <div key={benef._id} className="w-1/3 flex-shrink-0 px-3">
                  <BeneficioCard
                    benef={benef}
                    onReclamar={handleReclamar}
                    isReclamado={reclamados.includes(benef._id)}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white p-4 rounded-full! shadow-2xl transition-all duration-300"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    );
  };

  // Componente para cada tarjeta de beneficio
  const BeneficioCard = ({ benef, onReclamar, isReclamado }) => {
    const fechaFin = benef.fecha_fin ? new Date(benef.fecha_fin) : null;
    const hoy = new Date();
    const vigente = !fechaFin || fechaFin >= hoy;

    // Usar imagen por defecto si no hay imagen
    const imagen = benef.imagen_beneficio || "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&h=400&fit=crop";

    // Tarjeta de curso con información detallada
    if (benef.tipo_beneficio === "academico") {
      return (
        <div className="bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-3 shadow-lg hover:shadow-xl">
          <div className="relative h-72 overflow-hidden">
            <img
              src={imagen}
              alt={benef.titulo}
              className="w-full h-full object-cover transition-transform duration-600 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300"></div>
            <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl">
              Académico
            </div>
          </div>

          <div className="p-6 bg-white">
            <h3 className="text-gray-800 text-start font-bold text-lg mb-3 line-clamp-2 transition-colors duration-300 hover:text-green-500">
              {benef.titulo}
            </h3>

            <div className="space-y-2 mb-4 text-gray-600 text-sm">
              {benef.empresa_asociada && (
                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 mt-1" />
                  <span>{benef.empresa_asociada}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <span>Beneficio Gratuito</span>
                {fechaFin && (
                  <span>(Válido hasta {fechaFin.toLocaleDateString()})</span>
                )}
              </div>
              {benef.fecha_inicio && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar size={16} style={{ color: '#5DC554' }} />
                  <span className="font-medium">Inicio: {new Date(benef.fecha_inicio).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <p className="text-gray-600 text-start text-sm mb-4 line-clamp-3">
              {benef.descripcion}
            </p>

            <div className="flex items-center justify-between mt-4">
              <span className="font-bold text-xl transition-transform duration-300 hover:scale-110" style={{ color: '#5DC554' }}>
                Gratis
              </span>
              <button
                onClick={() => onReclamar(benef)}
                disabled={isReclamado || !vigente}
                className={`px-7 py-3 rounded-full! font-bold transition-all! duration-300 hover:shadow-2xl hover:scale-110! transform! hover:-translate-y-1 ${
                  isReclamado
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : !vigente
                    ? "bg-red-400 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                }`}
              >
                {isReclamado ? "Reclamado" : !vigente ? "Expirado" : "Reclamar"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Tarjeta estándar (Descuentos y Otros)
    return (
      <div className="bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-3 shadow-lg hover:shadow-xl">
        <div className="relative h-72 overflow-hidden">
          <img
            src={imagen}
            alt={benef.titulo}
            className="w-full h-full object-cover transition-transform duration-600 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300"></div>
          <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl">
            {getTipoLabel(benef.tipo_beneficio)}
          </div>
        </div>

        <div className="p-6 bg-white">
          <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
            {fechaFin && (
              <div className="flex items-center gap-2">
                <Calendar size={16} style={{ color: '#5DC554' }} />
                <span className="font-medium">Válido hasta {fechaFin.toLocaleDateString()}</span>
              </div>
            )}
          </div>

          <h3 className="text-gray-800 text-start font-bold text-lg line-clamp-2 mb-4 transition-colors duration-300 hover:text-green-500">
            {benef.titulo}
          </h3>

          {benef.descripcion && (
            <p className="text-gray-600 text-start text-sm mb-4 line-clamp-2">
              {benef.descripcion}
            </p>
          )}

          {benef.url_detalle && (
            <div className="mb-4">
              <a
                href={benef.url_detalle}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 text-sm hover:text-blue-800 transition-colors"
              >
                <Eye className="w-4 h-4 mr-1" />
                Ver más detalles
              </a>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="font-bold text-xl transition-transform duration-300 hover:scale-110" style={{ color: '#5DC554' }}>
              Gratis
            </span>
            <button
              onClick={() => onReclamar(benef)}
              disabled={isReclamado || !vigente}
              className={`px-7 py-3 rounded-full! font-bold transition-all! duration-300 hover:shadow-2xl hover:scale-110 transform hover:-translate-y-1 ${
                isReclamado
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : !vigente
                  ? "bg-red-400 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
              }`}
            >
              {isReclamado ? "Reclamado" : !vigente ? "Expirado" : "Reclamar"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Función para obtener etiqueta del tipo
  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 'academico':
        return 'Académico';
      case 'laboral':
        return 'Laboral';
      case 'salud':
        return 'Salud';
      case 'cultural':
        return 'Cultural';
      case 'convenio':
        return 'Convenio';
      default:
        return 'Beneficio';
    }
  };

  return (
    <div className="min-h-screen mb-10 pt-16" style={{ background: 'linear-gradient(to bottom right, #f9fafb, #ffffff)' }}>
      <style>
        {`
          input:focus { outline: none !important; border-color: #5DC554 !important; }
          select:focus { outline: none !important; border-color: #5DC554 !important; }
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
              Beneficios y Descuentos
            </span>
          </h1>
          <p className="text-xl text-gray-500">
            Descubre todas las ventajas que tenemos preparadas para impulsar tu carrera profesional
          </p>
        </div>

        {/* Barra de búsqueda y filtros mejorada */}
        <div className="mb-12 bg-white rounded-2xl ">
          <div className="flex gap-4 items-center">
            {/* Barra de búsqueda */}
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder="Buscar beneficios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 text-gray-800 px-6 py-4 pl-14 rounded-xl transition-all duration-300 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white focus:shadow-lg"
                style={{ outline: 'none', border: '2px solid #e5e7eb' }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#5DC554';
                  e.target.style.boxShadow = '0 0 0 3px rgba(93, 197, 84, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:scale-110"
                size={22}
                style={{ color: '#5DC554' }}
              />
            </div>

            {/* Filtro de categoría */}
            <div className="relative group">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-gray-50 text-gray-800 px-6 py-4 pr-10 rounded-xl cursor-pointer transition-all duration-300 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white focus:shadow-lg appearance-none"
                style={{ outline: 'none', border: '2px solid #e5e7eb' }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#5DC554';
                  e.target.style.boxShadow = '0 0 0 3px rgba(93, 197, 84, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">Todas las categorías</option>
                <option value="Descuentos">Descuentos</option>
                <option value="Cursos">Cursos</option>
                <option value="Otros">Otros Beneficios</option>
              </select>
            </div>

            {/* Botón buscar */}
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-2xl"
            >
              Buscar
            </button>

            {/* Botón limpiar filtros */}
            {(searchTerm || selectedType) && (
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
            <p className="text-gray-500 text-xl mt-4">Cargando beneficios...</p>
          </div>
        ) : showFiltered ? (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold" style={{ color: '#5DC554' }}>
                Resultados de búsqueda ({beneficiosFilterados.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {beneficiosFilterados.map((benef) => (
                <BeneficioCard
                  key={benef._id}
                  benef={benef}
                  onReclamar={handleReclamar}
                  isReclamado={reclamados.includes(benef._id)}
                />
              ))}
            </div>
            {beneficiosFilterados.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-xl">
                  No se encontraron beneficios con los filtros seleccionados
                </p>
              </div>
            )}
          </div>
        ) : beneficios.length === 0 ? (
          <div className="text-center py-20">
            <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay beneficios disponibles
            </h3>
            <p className="text-gray-600">
              Pronto habrá nuevos beneficios disponibles.
            </p>
          </div>
        ) : (
          <>
            <CarouselSection
              titulo="Convenios y Descuentos"
              beneficios={descuentos}
              currentSlide={currentSlide1}
              setCurrentSlide={setCurrentSlide1}
            />

            <CarouselSection
              titulo="Beneficios Académicos"
              beneficios={cursos}
              currentSlide={currentSlide2}
              setCurrentSlide={setCurrentSlide2}
            />

            <CarouselSection
              titulo="Otros Beneficios"
              beneficios={otrosBeneficios}
              currentSlide={currentSlide3}
              setCurrentSlide={setCurrentSlide3}
            />
          </>
        )}
      </div>
    </div>
  );
}