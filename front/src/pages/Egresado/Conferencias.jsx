import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Search,
  Filter,
} from "lucide-react";

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

  // Componente para cada sección de carrusel
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
      <div className="mb-16">
        <h2 className="text-4xl font-bold text-start mb-6">
              <span className="bg-[#01a83c]! bg-clip-text text-transparent">
                {titulo}
              </span>
            </h2>
        <div className="relative">
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-[#01a83c]! hover:from-green-600! hover:to-teal-600! text-white p-4 rounded-full! shadow-2xl transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, #16a34a, #14b8a6)', border: 'none' }}
          >
            <ChevronLeft size={24} />
          </button>

          <div className="overflow-hidden px-2 py-4">
            <div
              className="flex transition-transform duration-600 ease-in-out"
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
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-[#01a83c]! hover:from-green-600! hover:to-teal-600! text-white p-4 rounded-full! shadow-2xl transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, #16a34a, #14b8a6)', border: 'none' }}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    );
  };

  // Componente para cada tarjeta de conferencia
  const ConferenciaCard = ({ conf }) => (
    <div className="bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-3 shadow-lg hover:shadow-xl"
      >
      <div className="relative h-72 overflow-hidden">
        <img
          src={conf.imagen}
          alt={conf.titulo}
          className="w-full h-full object-cover transition-transform duration-600 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300"></div>
        <div className="absolute top-4 left-4 bg-[#01a83c]! text-white px-4 py-2 rounded-full! text-xs font-bold shadow-xl"
          style={{
            border: 'none'
          }}>
          {conf.tipo}
        </div>
      </div>

      <div className="p-6 bg-white">
        <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
          <div className="flex items-center gap-2 ">
            <Calendar size={16} style={{ color: '#5DC554' }} />
            <span className="font-medium">{conf.fecha}</span>
          </div>
          <div className="flex items-center gap-2 ">
            <Clock size={16} style={{ color: '#5DC554' }} />
            <span className="font-medium">{conf.hora}</span>
          </div>
        </div>

        <h3 className="text-gray-800 text-start font-bold text-lg mb-5 line-clamp-2 h-14 transition-colors duration-300 hover:text-green-500">
          {conf.titulo}
        </h3>

        <div className="flex items-center justify-between">
          <span className="font-bold text-xl transition-transform duration-300 hover:scale-110" style={{ color: '#5DC554' }}>
            {conf.precio}
          </span>
          <button className="bg-[#01a83c]! hover:from-green-600! hover:to-teal-600! text-white px-7 py-3 rounded-full! font-bold transition-all! duration-300 hover:shadow-2xl hover:scale-110 transform hover:-translate-y-1"
            style={{ 
              border: 'none'
            }}>
            Inscríbete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen mb-10 pt-16" style={{ background: 'linear-gradient(to bottom right, #f9fafb, #ffffff)' }}>
      <style>
        {`
          input:focus { outline: none !important; border-color: #5DC554 !important; }
        `}
      </style>
      <div className="max-w-[95%] mx-auto px-4 mt-6">
        <div className="pb-12 text-start">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">
              <span className="bg-[#01a83c]! bg-clip-text text-transparent">
                Conferencias
              </span>
          </h1>
          <p className="text-xl text-gray-500">
            Descubre todas las ventajas que tenemos preparadas para impulsar tu
            carrera profesional
          </p>
        </div>

        {/* Barra de búsqueda y filtros mejorada */}
        <div className="mb-12 bg-white rounded-2xl "
          >
          <div className="flex gap-4 items-center">
            {/* Barra de búsqueda */}
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder="Buscar conferencias..."
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

            {/* Filtro de fecha con calendario */}
            <div className="relative group">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-gray-50 text-gray-800 px-6 py-4 pl-14 pr-6 rounded-xl cursor-pointer transition-all duration-300 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white focus:shadow-lg"
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
              <Calendar
                className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-hover:scale-110"
                size={22}
                style={{ color: '#5DC554' }}
              />
            </div>

            {/* Botón buscar */}
            <button
              onClick={handleSearch}
              className="bg-[#01a83c]! hover:from-green-600! hover:to-teal-600! text-white px-8 py-4 rounded-xl! font-bold transition-all duration-300 hover:shadow-2xl"
              style={{ 
                border: 'none'
              }}
            >
              Buscar
            </button>

            {/* Botón limpiar filtros */}
            {(searchTerm || selectedDate) && (
              <button
                onClick={clearFilters}
                className="bg-gray-100! hover:bg-gray-200! text-gray-600 px-8 py-4 rounded-xl! font-bold transition-all duration-300 hover:shadow-lg"
                style={{ border: 'none' }}
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Mostrar vista filtrada en grid o carruseles */}
        {showFiltered ? (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold" style={{ color: '#5DC554' }}>
                Resultados de búsqueda ({conferenciasFilteradas.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {conferenciasFilteradas.map((conf) => (
                <ConferenciaCard key={conf.id} conf={conf} />
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