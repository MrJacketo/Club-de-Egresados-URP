import { useState } from "react";
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
} from "lucide-react";

export default function Cursos() {
  const [currentSlide1, setCurrentSlide1] = useState(0);
  const [currentSlide2, setCurrentSlide2] = useState(0);
  const [currentSlide3, setCurrentSlide3] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [showFiltered, setShowFiltered] = useState(false);
  const [notification, setNotification] = useState(null);
  const [reclamados, setReclamados] = useState([]);

  // Descuentos
  const descuentos = [
    {
      id: 1,
      titulo: "Descuento 15% en Libros Técnicos",
      tipo: "Descuento",
      categoria: "Descuentos",
      descripcion: "Descuento especial en la librería universitaria para libros de especialización",
      validoHasta: "31/12/2025",
      imagen: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&h=400&fit=crop",
    },
    {
      id: 2,
      titulo: "Descuento 20% en Coursera",
      tipo: "Descuento",
      categoria: "Descuentos",
      descripcion: "Accede a miles de cursos online con descuento exclusivo para estudiantes",
      validoHasta: "1/10/2025",
      imagen: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=400&fit=crop",
    },
    {
      id: 3,
      titulo: "Descuento 25% en Material Deportivo",
      tipo: "Descuento",
      categoria: "Descuentos",
      descripcion: "Equipamiento deportivo con descuento para miembros de la comunidad universitaria",
      validoHasta: "15/11/2025",
      imagen: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop",
    },
    {
      id: 4,
      titulo: "Descuento 30% en Software Educativo",
      tipo: "Descuento",
      categoria: "Descuentos",
      descripcion: "Licencias de software especializado con descuento estudiantil",
      validoHasta: "31/12/2025",
      imagen: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop",
    },
  ];

  // Cursos
  const cursos = [
    {
      id: 5,
      titulo: "Curso Gratuito de Python",
      tipo: "Curso",
      categoria: "Cursos",
      carrera: "Ingeniería Informática",
      docente: "LINAREZ COLOMA, HUMBERTO VICTOR",
      nivel: "Intermedio",
      modalidad: "Presencial",
      descuento: "20%",
      validoHasta: "1/10/2025",
      inicio: "10 de Julio",
      imagen: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=400&fit=crop",
    },
    {
      id: 6,
      titulo: "Curso | Lenguaje C#",
      tipo: "Curso",
      categoria: "Cursos",
      carrera: "Ingeniería Informática",
      docente: "LINAREZ COLOMA, HUMBERTO VICTOR",
      nivel: "Intermedio",
      modalidad: "Presencial",
      descuento: "20%",
      validoHasta: "13/06/2025",
      inicio: "10 de Julio",
      imagen: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
    },
    {
      id: 7,
      titulo: "Curso de Machine Learning",
      tipo: "Curso",
      categoria: "Cursos",
      carrera: "Ingeniería de Sistemas",
      docente: "RODRIGUEZ PEREZ, MARIA ELENA",
      nivel: "Avanzado",
      modalidad: "Virtual",
      descuento: "20%",
      validoHasta: "30/08/2025",
      inicio: "15 de Agosto",
      imagen: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
    },
    {
      id: 8,
      titulo: "Curso de Desarrollo Web Full Stack",
      tipo: "Curso",
      categoria: "Cursos",
      carrera: "Ingeniería Informática",
      docente: "GARCIA TORRES, CARLOS ALBERTO",
      nivel: "Intermedio",
      modalidad: "Híbrido",
      descuento: "20%",
      validoHasta: "20/09/2025",
      inicio: "5 de Septiembre",
      imagen: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=600&h=400&fit=crop",
    },
  ];

  // Otros Beneficios
  const otrosBeneficios = [
    {
      id: 9,
      titulo: "Conferencia Ciberseguridad",
      tipo: "Evento",
      categoria: "Otros",
      descripcion: "Conferencia magistral sobre las nuevas tendencias del mercado laboral peruano",
      validoHasta: "15/10/2025",
      hora: "7:00pm",
      imagen: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
    },
    {
      id: 10,
      titulo: "Acceso a Biblioteca Digital Premium",
      tipo: "Acceso",
      categoria: "Otros",
      descripcion: "Acceso ilimitado a recursos digitales académicos y bases de datos especializadas",
      validoHasta: "31/12/2025",
      hora: "6:30pm",
      imagen: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop",
    },
    {
      id: 11,
      titulo: "Membresía Gimnasio Universitario",
      tipo: "Membresía",
      categoria: "Otros",
      descripcion: "Acceso gratuito a las instalaciones deportivas durante todo el semestre",
      validoHasta: "30/06/2025",
      hora: "5:00pm",
      imagen: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop",
    },
    {
      id: 12,
      titulo: "Asesoría Académica Personalizada",
      tipo: "Servicio",
      categoria: "Otros",
      descripcion: "Sesiones de asesoría con docentes expertos para apoyo en tus estudios",
      validoHasta: "31/12/2025",
      hora: "6:00pm",
      imagen: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
    },
  ];

  // Todos los beneficios combinados
  const todosBeneficios = [...descuentos, ...cursos, ...otrosBeneficios];

  // Filtrar beneficios
  const beneficiosFilterados = todosBeneficios.filter((benef) => {
    const matchSearch = benef.titulo
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchType = selectedType ? benef.categoria === selectedType : true;
    return matchSearch && matchType;
  });

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

  const handleReclamar = (beneficio) => {
    if (!reclamados.includes(beneficio.id)) {
      setReclamados([...reclamados, beneficio.id]);
      setNotification({
        titulo: beneficio.titulo,
        tipo: beneficio.tipo,
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // Componente de notificación
  const Notification = ({ notification, onClose }) => (
    <div className="fixed top-20 right-8 z-50 animate-slide-in">
      <div className="bg-[#2A2B2F] rounded-lg shadow-2xl p-4 flex items-start gap-3 min-w-[320px] border border-[#00BC4F]">
        <div className="flex-shrink-0">
          <CheckCircle className="text-[#00BC4F]" size={24} />
        </div>
        <div className="flex-1">
          <h4 className="text-white font-semibold mb-1">
            ¡Beneficio Reclamado!
          </h4>
          <p className="text-gray-300 text-sm">{notification.titulo}</p>
          <p className="text-[#00BC4F] text-xs mt-1">{notification.tipo}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-white transition"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );

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
      <div className="mb-12">
        <h2 className="text-3xl text-start font-bold text-[#00BC4F] mb-6">
          {titulo}
        </h2>
        <div className="relative">
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-[#00BC4F]! hover:bg-[#00a544]! text-white p-3 rounded-full! shadow-lg transition border-none!"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}
            >
              {beneficios.map((benef) => (
                <div key={benef.id} className="w-1/3 flex-shrink-0 px-3">
                  <BeneficioCard
                    benef={benef}
                    onReclamar={handleReclamar}
                    isReclamado={reclamados.includes(benef.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-[#00BC4F]! hover:bg-[#00a544]! text-white p-3 rounded-full! shadow-lg transition border-none!"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    );
  };

  // Componente para cada tarjeta de beneficio
  const BeneficioCard = ({ benef, onReclamar, isReclamado }) => {
    // Tarjeta de curso con información detallada
    if (benef.categoria === "Cursos") {
      return (
        <div className="bg-[#2A2B2F]! rounded-xl! overflow-hidden hover:scale-105 transition-transform duration-300">
          <div className="relative h-72 ">
            <img
              src={benef.imagen}
              alt={benef.titulo}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-[#00BC4F]! text-white px-3 py-1 rounded-full! text-xs font-semibold border-none!">
              {benef.tipo}
            </div>
          </div>

          <div className="p-5">
            <h3 className="text-white mb-2 text-start font-bold text-lg  line-clamp-2">
              {benef.titulo}
            </h3>

            <div className="space-y-2 mb-4 text-gray-300 text-sm">
              <div className="flex items-start gap-2">
                <span>{benef.carrera}</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="text-start">
                  <span className="font-semibold">Docente: </span>
                  <span>{benef.docente}</span>
                </div>
              </div>
              <div className="flex font-bold items-center gap-2">
                <span>{benef.modalidad}</span>
              </div>
              <div className="flex items-center gap-2 text-[#00BC4F]! font-semibold">
                <span>DESCUENTO {benef.descuento} (Válido hasta {benef.validoHasta})</span>
              </div>
              <div className="flex items-center gap-2 text-red-400">
                <Calendar size={16} />
                <span>Inicio: {benef.inicio}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-[#00BC4F]! font-bold text-lg">Gratis</span>
              <button
                onClick={() => onReclamar(benef)}
                disabled={isReclamado}
                className={`px-6 py-2 rounded-full! font-medium transition border-none! ${
                  isReclamado
                    ? "bg-gray-600! text-gray-300! cursor-not-allowed"
                    : "bg-[#00BC4F]! hover:bg-[#00a544]! text-white"
                }`}
              >
                {isReclamado ? "Reclamado" : "Reclamar"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Tarjeta estándar (Descuentos y Otros)
    return (
      <div className="bg-[#2A2B2F]! rounded-xl! overflow-hidden hover:scale-105 transition-transform duration-300">
        <div className="relative h-72">
          <img
            src={benef.imagen}
            alt={benef.titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-[#00BC4F]! text-white px-3 py-1 rounded-full! text-xs font-semibold border-none!">
            {benef.tipo}
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-4 text-gray-400 text-sm mb-3">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>Válido hasta {benef.validoHasta}</span>
            </div>
            {benef.hora && (
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{benef.hora}</span>
              </div>
            )}
          </div>

          <h3 className="text-white text-start font-bold text-lg  line-clamp-2 mb-2">
            {benef.titulo}
          </h3>

          {benef.descripcion && (
            <p className="text-gray-400 text-start text-sm mb-4 line-clamp-2 ">
              {benef.descripcion}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-[#00BC4F]! font-bold text-lg">Gratis</span>
            <button
              onClick={() => onReclamar(benef)}
              disabled={isReclamado}
              className={`px-6 py-2 rounded-full! font-medium transition border-none! ${
                isReclamado
                  ? "bg-gray-600! text-gray-300! cursor-not-allowed"
                  : "bg-[#00BC4F]! hover:bg-[#00a544]! text-white"
              }`}
            >
              {isReclamado ? "Reclamado" : "Reclamar"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen mb-10 bg-[#1C1D21]! pt-16 text-white">
      {notification && (
        <Notification
          notification={notification}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-6">
        <div className="pb-10 text-start">
          <h1 className="text-6xl font-bold">Beneficios y Descuentos</h1>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="mb-8 flex gap-4 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar beneficios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#2A2B2F]! text-white px-4 py-3 pl-12 rounded-lg! focus:outline-none focus:ring-2 focus:ring-[#00BC4F]! border-none!"
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>

          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-[#2A2B2F]! text-white px-4 py-3 pr-10 rounded-lg! focus:outline-none focus:ring-2 focus:ring-[#00BC4F]! cursor-pointer appearance-none border-none!"
            >
              <option value="">Todas las categorías</option>
              <option value="Descuentos">Descuentos</option>
              <option value="Cursos">Cursos</option>
              <option value="Otros">Otros Beneficios</option>
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="bg-[#00BC4F]! hover:bg-[#00a544]! text-white px-6 py-3 rounded-lg! font-medium transition border-none!"
          >
            Buscar
          </button>

          {(searchTerm || selectedType) && (
            <button
              onClick={clearFilters}
              className="bg-[#2A2B2F]! hover:bg-[#35363B]! text-white px-6 py-3 rounded-lg! font-medium transition border-none!"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Mostrar vista filtrada en grid o carruseles */}
        {showFiltered ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-[#00BC4F]!">
                Resultados de búsqueda ({beneficiosFilterados.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {beneficiosFilterados.map((benef) => (
                <BeneficioCard
                  key={benef.id}
                  benef={benef}
                  onReclamar={handleReclamar}
                  isReclamado={reclamados.includes(benef.id)}
                />
              ))}
            </div>
            {beneficiosFilterados.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  No se encontraron beneficios con los filtros seleccionados
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            <CarouselSection
              titulo="Descuentos"
              beneficios={descuentos}
              currentSlide={currentSlide1}
              setCurrentSlide={setCurrentSlide1}
            />

            <CarouselSection
              titulo="Cursos"
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