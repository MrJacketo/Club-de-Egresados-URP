import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Search,
  Filter,
} from "lucide-react";
import Footer from "../../components/footer.jsx";

export default function Conferencias() {
  const [currentSlide1, setCurrentSlide1] = useState(0);
  const [currentSlide2, setCurrentSlide2] = useState(0);
  const [currentSlide3, setCurrentSlide3] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showFiltered, setShowFiltered] = useState(false);

  // Conferencias destacadas
  const conferenciasDestacadas = [
    {
      id: 1,
      titulo: "WEBINAR: Configuración de tablas y figuras en APA 7",
      fecha: "Noviembre 28, 2024",
      hora: "6:30pm",
      tipo: "Webinar",
      precio: "Gratis",
      imagen:
        "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      titulo: "SEMINARIO de Defensa Nacional",
      fecha: "Noviembre 26, 2024",
      hora: "7:30pm",
      tipo: "Seminario",
      precio: "Gratis",
      imagen:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      titulo: "CONFERENCIA: Impulsa tu carrera con bolsa de empleo",
      fecha: "Noviembre 28, 2024",
      hora: "6:30pm",
      tipo: "Conferencia",
      precio: "Gratis",
      imagen:
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      titulo: "TALLER: Inteligencia Artificial aplicada a negocios",
      fecha: "Diciembre 5, 2024",
      hora: "5:00pm",
      tipo: "Taller",
      precio: "Gratis",
      imagen:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
    },
  ];

  // Últimas conferencias
  const ultimasConferencias = [
    {
      id: 5,
      titulo: "Marketing Digital para emprendedores",
      fecha: "Noviembre 20, 2024",
      hora: "7:00pm",
      tipo: "Webinar",
      precio: "Gratis",
      imagen:
        "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      titulo: "Gestión de proyectos con metodologías ágiles",
      fecha: "Noviembre 18, 2024",
      hora: "6:00pm",
      tipo: "Taller",
      precio: "Gratis",
      imagen:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    },
    {
      id: 7,
      titulo: "Liderazgo transformacional en el siglo XXI",
      fecha: "Noviembre 15, 2024",
      hora: "7:30pm",
      tipo: "Conferencia",
      precio: "Gratis",
      imagen:
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop",
    },
    {
      id: 8,
      titulo: "Finanzas personales para profesionales",
      fecha: "Noviembre 12, 2024",
      hora: "6:30pm",
      tipo: "Webinar",
      precio: "Gratis",
      imagen:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop",
    },
  ];

  // Te podría interesar
  const podriaInteresar = [
    {
      id: 9,
      titulo: "Innovación y tecnología en la educación",
      fecha: "Diciembre 10, 2024",
      hora: "5:30pm",
      tipo: "Conferencia",
      precio: "Gratis",
      imagen:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop",
    },
    {
      id: 10,
      titulo: "Networking efectivo para profesionales",
      fecha: "Diciembre 8, 2024",
      hora: "7:00pm",
      tipo: "Taller",
      precio: "Gratis",
      imagen:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
    },
    {
      id: 11,
      titulo: "Emprendimiento digital: De la idea al negocio",
      fecha: "Diciembre 12, 2024",
      hora: "6:00pm",
      tipo: "Seminario",
      precio: "Gratis",
      imagen:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
    },
    {
      id: 12,
      titulo: "Desarrollo profesional en la era digital",
      fecha: "Diciembre 15, 2024",
      hora: "7:30pm",
      tipo: "Webinar",
      precio: "Gratis",
      imagen:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
    },
  ];

  // Todas las conferencias combinadas
  const todasConferencias = [
    ...conferenciasDestacadas,
    ...ultimasConferencias,
    ...podriaInteresar,
  ];

  // Filtrar conferencias
  const conferenciasFilteradas = todasConferencias.filter((conf) => {
    const matchSearch = conf.titulo
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchDate = selectedDate ? conf.fecha === selectedDate : true;
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

  // Componente para cada sección de carrusel, se separara en un componente aparte cuando se haga la conexion con el backend
  const CarouselSection = ({
    titulo,
    conferencias,
    currentSlide,
    setCurrentSlide,
  }) => {
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
      <div className="mb-12">
        <h2 className="text-3xl text-start font-bold text-[#00BC4F] mb-6">
          {titulo}
        </h2>
        <div className="relative">
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-[#00BC4F]! hover:bg-[#00a544]! text-white p-3 rounded-full! shadow-lg transition"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}
            >
              {conferencias.map((conf) => (
                <div key={conf.id} className="w-1/3 flex-shrink-0 px-3">
                  <ConferenciaCard conf={conf} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-[#00BC4F]! hover:bg-[#00a544]! text-white p-3 rounded-full! shadow-lg transition"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    );
  };

  // Componente para cada tarjeta de conferencia
  const ConferenciaCard = ({ conf }) => (
    <div className="bg-[#2A2B2F] rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300">
      <div className="relative h-72">
        <img
          src={conf.imagen}
          alt={conf.titulo}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-[#00BC4F] text-white px-3 py-1 rounded-full text-xs font-semibold">
          {conf.tipo}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-4 text-gray-400 text-sm mb-3">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{conf.fecha}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{conf.hora}</span>
          </div>
        </div>

        <h3 className="text-white text-start font-bold text-lg mb-4 line-clamp-2 h-14">
          {conf.titulo}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-[#00BC4F] font-bold text-lg">
            {conf.precio}
          </span>
          <button className="bg-[#00BC4F]! hover:bg-[#00a544]! text-white px-6 py-2 rounded-full! hover:border-none! font-medium transition">
            Inscríbete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen mb-10 bg-[#1C1D21] pt-16">
      <div className="max-w-7xl mx-auto">
        <div className="pb-10 text-start">
          <h1 className="text-6xl font-bold">Conferencias</h1>
        </div>
        {/* Barra de búsqueda y filtros */}
        <div className="mb-8 flex gap-4 items-center">
          {/* Barra de búsqueda */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar conferencias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#2A2B2F] text-white px-4 py-3 pl-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BC4F]"
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>

          {/* Filtro de fecha con calendario */}
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-[#2A2B2F] text-white px-4 py-3 pl-12 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BC4F] cursor-pointer"
            />
            <Calendar
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={20}
            />
          </div>

          {/* Botón buscar */}
          <button
            onClick={handleSearch}
            className="bg-[#00BC4F]! hover:bg-[#00a544]! hover: border-none! text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Buscar
          </button>

          {/* Botón limpiar filtros */}
          {(searchTerm || selectedDate) && (
            <button
              onClick={clearFilters}
              className="bg-[#2A2B2F]! hover:bg-[#35363B]!  text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Mostrar vista filtrada en grid o carruseles */}
        {showFiltered ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-[#00BC4F]">
                Resultados de búsqueda ({conferenciasFilteradas.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {conferenciasFilteradas.map((conf) => (
                <ConferenciaCard key={conf.id} conf={conf} />
              ))}
            </div>
            {conferenciasFilteradas.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  No se encontraron conferencias con los filtros seleccionados
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Conferencias Destacadas */}
            <CarouselSection
              titulo="Eventos destacados"
              conferencias={conferenciasDestacadas}
              currentSlide={currentSlide1}
              setCurrentSlide={setCurrentSlide1}
            />

            {/* Últimas Conferencias */}
            <CarouselSection
              titulo="Últimas conferencias"
              conferencias={ultimasConferencias}
              currentSlide={currentSlide2}
              setCurrentSlide={setCurrentSlide2}
            />

            {/* Te podría interesar */}
            <CarouselSection
              titulo="Te podría interesar"
              conferencias={podriaInteresar}
              currentSlide={currentSlide3}
              setCurrentSlide={setCurrentSlide3}
            />
          </>
        )}
      </div>

    </div>
  );
}
