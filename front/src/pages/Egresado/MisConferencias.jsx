import { useState } from "react";
import {
  Calendar,
  Clock,
  Search,
  X,
  CheckCircle,
  XCircle,
  Eye,
  MapPin,
  User,
  Mail,
  Phone,
} from "lucide-react";

export default function MisConferencias() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedConferencia, setSelectedConferencia] = useState(null);

  // Datos de conferencias inscritas
  const conferenciasInscritas = [
    {
      id: 1,
      nombre: "WEBINAR: Configuración de tablas y figuras en APA 7",
      fechaConferencia: "28/11/2024",
      horaConferencia: "6:30pm",
      fechaInscripcion: "15/11/2024",
      horaInscripcion: "3:45pm",
      estado: "Inscrito",
      tipo: "Webinar",
      descripcion: "Aprende a configurar correctamente tablas y figuras según las normas APA 7ma edición para tus trabajos académicos.",
      modalidad: "Virtual",
      plataforma: "Zoom",
      enlace: "https://zoom.us/j/123456789",
      ponente: "Dr. Carlos Mendoza",
      duracion: "2 horas",
      cupos: "150 participantes",
      imagen: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      nombre: "SEMINARIO de Defensa Nacional",
      fechaConferencia: "26/11/2024",
      horaConferencia: "7:30pm",
      fechaInscripcion: "10/11/2024",
      horaInscripcion: "2:20pm",
      estado: "Culminado",
      tipo: "Seminario",
      descripcion: "Análisis profundo sobre estrategias de defensa nacional y seguridad ciudadana en el contexto actual.",
      modalidad: "Presencial",
      lugar: "Auditorio Principal - Campus Lima",
      ponente: "Gral. Roberto Sánchez",
      duracion: "3 horas",
      cupos: "200 participantes",
      imagen: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      nombre: "CONFERENCIA: Impulsa tu carrera con bolsa de empleo",
      fechaConferencia: "28/11/2024",
      horaConferencia: "6:30pm",
      fechaInscripcion: "18/11/2024",
      horaInscripcion: "11:15am",
      estado: "Inscrito",
      tipo: "Conferencia",
      descripcion: "Descubre estrategias efectivas para destacar en procesos de selección y aprovecha nuestra bolsa de trabajo.",
      modalidad: "Híbrido",
      lugar: "Sala de Conferencias 201",
      plataforma: "Microsoft Teams",
      ponente: "Lic. María Torres",
      duracion: "2.5 horas",
      cupos: "100 participantes",
      imagen: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      nombre: "Marketing Digital para emprendedores",
      fechaConferencia: "20/11/2024",
      horaConferencia: "7:00pm",
      fechaInscripcion: "05/11/2024",
      horaInscripcion: "9:30am",
      estado: "Culminado",
      tipo: "Webinar",
      descripcion: "Estrategias actuales de marketing digital para impulsar tu emprendimiento en redes sociales y plataformas digitales.",
      modalidad: "Virtual",
      plataforma: "Google Meet",
      ponente: "Mg. Andrea Vega",
      duracion: "2 horas",
      cupos: "120 participantes",
      imagen: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=400&h=300&fit=crop",
    },
    {
      id: 5,
      nombre: "TALLER: Inteligencia Artificial aplicada a negocios",
      fechaConferencia: "05/12/2024",
      horaConferencia: "5:00pm",
      fechaInscripcion: "20/11/2024",
      horaInscripcion: "4:10pm",
      estado: "Inscrito",
      tipo: "Taller",
      descripcion: "Taller práctico sobre implementación de IA en procesos empresariales para optimizar resultados.",
      modalidad: "Presencial",
      lugar: "Laboratorio de Innovación - Piso 3",
      ponente: "PhD. Luis Ramírez",
      duracion: "4 horas",
      cupos: "50 participantes",
      imagen: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      nombre: "Liderazgo transformacional en el siglo XXI",
      fechaConferencia: "15/11/2024",
      horaConferencia: "7:30pm",
      fechaInscripcion: "01/11/2024",
      horaInscripcion: "10:00am",
      estado: "Culminado",
      tipo: "Conferencia",
      descripcion: "Desarrollo de competencias de liderazgo adaptadas a los desafíos del mundo empresarial moderno.",
      modalidad: "Virtual",
      plataforma: "Zoom",
      ponente: "Dr. Fernando Castillo",
      duracion: "2 horas",
      cupos: "180 participantes",
      imagen: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop",
    },
  ];

  // Filtrar conferencias
  const conferenciasFiltradas = conferenciasInscritas.filter((conf) => {
    const matchSearch = conf.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchEstado = selectedEstado ? conf.estado === selectedEstado : true;
    return matchSearch && matchEstado;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedEstado("");
  };

  const openModal = (conferencia) => {
    setSelectedConferencia(conferencia);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedConferencia(null);
  };

  // Modal de detalle
  const DetalleModal = ({ conferencia, onClose }) => (
    <div className="fixed inset-0 bg-[#00000092] backdrop-blur-xs  z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header con imagen */}
        <div className="relative h-64 overflow-hidden rounded-t-3xl">
          <img
            src={conferencia.imagen}
            alt={conferencia.nombre}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white! hover:bg-gray-100! p-2 rounded-full! transition-all! duration-300 shadow-lg!"
          >
            <X size={24} className="text-gray-800" />
          </button>
          <div className="absolute bottom-4 left-6">
            <span className="bg-[#01a83c]! text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl">
              {conferencia.tipo}
            </span>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {conferencia.nombre}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar size={20} className="text-green-500" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Fecha del evento</p>
                <p className="font-semibold">{conferencia.fechaConferencia}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Clock size={20} className="text-green-500" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Hora</p>
                <p className="font-semibold">{conferencia.horaConferencia}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <User size={20} className="text-green-500" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Ponente</p>
                <p className="font-semibold">{conferencia.ponente}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Clock size={20} className="text-green-500" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Duración</p>
                <p className="font-semibold">{conferencia.duracion}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Descripción</h3>
            <p className="text-gray-600 leading-relaxed">{conferencia.descripcion}</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-green-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500 font-medium">Modalidad</p>
                <p className="font-semibold text-gray-800">{conferencia.modalidad}</p>
                {conferencia.lugar && (
                  <p className="text-gray-600 text-sm">{conferencia.lugar}</p>
                )}
                {conferencia.plataforma && (
                  <p className="text-gray-600 text-sm">Plataforma: {conferencia.plataforma}</p>
                )}
                {conferencia.enlace && (
                  <a
                    href={conferencia.enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 text-sm font-medium underline"
                  >
                    Enlace de acceso
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Fecha de inscripción</p>
                <p className="font-semibold text-gray-800">
                  {conferencia.fechaInscripcion} - {conferencia.horaInscripcion}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2">
              {conferencia.estado === "Inscrito" ? (
                <>
                  <CheckCircle size={24} className="text-green-500" />
                  <span className="text-green-600 font-bold">Inscrito</span>
                </>
              ) : (
                <>
                  <CheckCircle size={24} className="text-blue-500" />
                  <span className="text-blue-600 font-bold">Culminado</span>
                </>
              )}
            </div>
            <button
              onClick={onClose}
              className="bg-[#01a83c]! hover:from-green-600 hover:to-teal-600 text-white px-8 py-3 rounded-full font-bold transition-all! duration-300 hover:shadow-xl hover:scale-105"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen mb-10 pt-16" style={{ background: 'linear-gradient(to bottom right, #f9fafb, #ffffff)' }}>
      <style>
        {`
          input:focus { outline: none !important; border-color: #5DC554 !important; }
          select:focus { outline: none !important; border-color: #5DC554 !important; }
        `}
      </style>

      {modalOpen && selectedConferencia && (
        <DetalleModal conferencia={selectedConferencia} onClose={closeModal} />
      )}

      <div className="max-w-[95%] mx-auto px-4 mt-6">
        <div className="pb-12 text-start">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">
            <span className="bg-[#01a83c]! bg-clip-text text-transparent">
              Mis Conferencias
            </span>
          </h1>
          <p className="text-xl text-gray-500">
            Gestiona y revisa todas tus conferencias inscritas
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
                className="w-full bg-gray-50 text-gray-800 px-6 py-4 pl-14 rounded-xl transition-all! duration-300 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white focus:shadow-lg"
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

            {/* Filtro de estado */}
            <div className="relative group">
              <select
                value={selectedEstado}
                onChange={(e) => setSelectedEstado(e.target.value)}
                className="bg-gray-50 text-gray-800 px-6 py-4 pr-10 rounded-xl cursor-pointer transition-all! duration-300 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white focus:shadow-lg appearance-none"
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
                <option value="">Todos los estados</option>
                <option value="Inscrito">Inscrito</option>
                <option value="Culminado">Culminado</option>
              </select>
            </div>

            {/* Botón limpiar filtros */}
            {(searchTerm || selectedEstado) && (
              <button
                onClick={clearFilters}
                className="bg-gray-100! hover:bg-gray-200! text-gray-600! px-8! py-4! rounded-xl! font-bold transition-all! duration-300 hover:shadow-lg"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Tabla de conferencias */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#01a83c]!">
                  <th className="px-6 py-4 text-left text-white font-bold text-sm">
                    Nombre de la Conferencia
                  </th>
                  <th className="px-6 py-4 text-left text-white font-bold text-sm">
                    Fecha y Hora
                  </th>
                  <th className="px-6 py-4 text-left text-white font-bold text-sm">
                    Fecha de Inscripción
                  </th>
                  <th className="px-6 py-4 text-center text-white font-bold text-sm">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-center text-white font-bold text-sm">
                    Detalle
                  </th>
                </tr>
              </thead>
              <tbody>
                {conferenciasFiltradas.map((conf, index) => (
                  <tr
                    key={conf.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={conf.imagen}
                          alt={conf.nombre}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {conf.nombre}
                          </p>
                          <p className="text-xs text-gray-500">{conf.tipo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar size={16} style={{ color: '#5DC554' }} />
                          <span className="text-sm font-medium">{conf.fechaConferencia}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock size={16} style={{ color: '#5DC554' }} />
                          <span className="text-sm font-medium">{conf.horaConferencia}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600 text-sm">
                        <p className="font-medium">{conf.fechaInscripcion}</p>
                        <p className="text-xs text-gray-500">{conf.horaInscripcion}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {conf.estado === "Inscrito" ? (
                        <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                          <CheckCircle size={16} />
                          Inscrito
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                          <CheckCircle size={16} />
                          Culminado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => openModal(conf)}
                        className="inline-flex items-center gap-2 bg-[#01a83c]! hover:from-green-600 hover:to-teal-600 text-white px-6 py-2 rounded-full!  text-sm font-bold transition-all! duration-300 hover:shadow-lg hover:scale-105"
                      >
                        <Eye size={16} />
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {conferenciasFiltradas.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl">
                No se encontraron conferencias con los filtros seleccionados
              </p>
            </div>
          )}
        </div>

        {/* Resumen estadístico */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-[#01a83c]! p-4 rounded-full">
                <Calendar size={32} className="text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Total</p>
                <p className="text-3xl font-bold text-gray-800">{conferenciasInscritas.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Inscritas</p>
                <p className="text-3xl font-bold text-gray-800">
                  {conferenciasInscritas.filter((c) => c.estado === "Inscrito").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <CheckCircle size={32} className="text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Culminadas</p>
                <p className="text-3xl font-bold text-gray-800">
                  {conferenciasInscritas.filter((c) => c.estado === "Culminado").length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}