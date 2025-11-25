import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Search,
  X,
  CheckCircle,
  XCircle,
  Eye,
  MapPin,
  Briefcase,
  Loader,
  DollarSign,
  Users,
} from "lucide-react";
import { getOfertasPostuladasPorUsuario, getOfertaRequest } from "../../api/ofertaLaboralApi";

export default function MisPostulaciones() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOferta, setSelectedOferta] = useState(null);
  const [ofertasPostuladas, setOfertasPostuladas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar ofertas postuladas desde el backend
  useEffect(() => {
    cargarMisPostulaciones();
  }, []);

  const cargarMisPostulaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = JSON.parse(localStorage.getItem('user_data'));
      const userId = user?.id;

      if (!userId) {
        setError("No se pudo identificar el usuario");
        return;
      }

      const idsOfertas = await getOfertasPostuladasPorUsuario(userId);
      
      // Obtener detalles de cada oferta
      const ofertasDetalladas = await Promise.all(
        idsOfertas.map(async (id) => {
          try {
            const oferta = await getOfertaRequest(id);
            return oferta;
          } catch (err) {
            console.error(`Error al cargar oferta ${id}:`, err);
            return null;
          }
        })
      );

      // Filtrar ofertas nulas y transformar datos
      const ofertasTransformadas = ofertasDetalladas
        .filter(oferta => oferta !== null)
        .map(oferta => ({
          id: oferta._id,
          titulo: oferta.titulo || "Sin título",
          empresa: oferta.empresa || "Empresa no especificada",
          fechaOferta: formatearFecha(oferta.fecha_publicacion),
          fechaPostulacion: formatearFecha(oferta.fecha_postulacion || new Date()),
          horaPostulacion: formatearHora(oferta.fecha_postulacion || new Date()),
          estado: oferta.estado || "Activo",
          tipo: oferta.modalidad_trabajo || "Tiempo completo",
          descripcion: oferta.descripcion || "Sin descripción",
          ubicacion: oferta.ubicacion || "Por definir",
          salario: oferta.salario ? `S/. ${oferta.salario}` : "Por definir",
          requisitos: oferta.requisitos || "No especificados",
          beneficios: oferta.beneficios || "No especificados",
          vacantes: oferta.vacantes || "1",
          area: oferta.area || "General",
          imagen: oferta.imagen || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop",
          apto: oferta.apto !== undefined ? oferta.apto : true,
        }));

      setOfertasPostuladas(ofertasTransformadas);
    } catch (err) {
      console.error("Error al cargar postulaciones:", err);
      setError("No se pudieron cargar tus postulaciones. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Funciones auxiliares para formatear datos
  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A";
    const date = new Date(fecha);
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatearHora = (fecha) => {
    if (!fecha) return "N/A";
    const date = new Date(fecha);
    return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Filtrar ofertas
  const ofertasFiltradas = ofertasPostuladas.filter((oferta) => {
    const matchSearch = oferta.titulo
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) || 
      oferta.empresa.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEstado = selectedEstado ? 
      (selectedEstado === "Apto" ? oferta.apto : !oferta.apto) : true;
    return matchSearch && matchEstado;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedEstado("");
  };

  const openModal = (oferta) => {
    setSelectedOferta(oferta);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOferta(null);
  };

  // Modal de detalle
  const DetalleModal = ({ oferta, onClose }) => (
    <div className="fixed inset-0 bg-[#00000092] backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header con imagen */}
        <div className="relative h-64 overflow-hidden rounded-t-3xl">
          <img
            src={oferta.imagen}
            alt={oferta.titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white hover:bg-gray-100 p-2 rounded-full transition-all duration-300 shadow-lg !important"
          >
            <X size={24} className="text-gray-800" />
          </button>
          <div className="absolute bottom-4 left-6">
            <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl">
              {oferta.tipo}
            </span>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {oferta.titulo}
          </h2>
          <p className="text-xl text-gray-600 mb-6">{oferta.empresa}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar size={20} className="text-green-500" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Fecha de publicación</p>
                <p className="font-semibold">{oferta.fechaOferta}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <MapPin size={20} className="text-green-500" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Ubicación</p>
                <p className="font-semibold">{oferta.ubicacion}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <DollarSign size={20} className="text-green-500" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Salario</p>
                <p className="font-semibold">{oferta.salario}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Users size={20} className="text-green-500" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Vacantes</p>
                <p className="font-semibold">{oferta.vacantes} posiciones</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Descripción del puesto</h3>
            <div 
              className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: oferta.descripcion }}
            />
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Requisitos</h3>
            <div 
              className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: oferta.requisitos }}
            />
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Beneficios</h3>
            <div 
              className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: oferta.beneficios }}
            />
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Fecha de postulación</p>
                <p className="font-semibold text-gray-800">
                  {oferta.fechaPostulacion} - {oferta.horaPostulacion}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2">
              {oferta.apto ? (
                <>
                  <CheckCircle size={24} className="text-green-500" />
                  <span className="text-green-600 font-bold">Apto</span>
                </>
              ) : (
                <>
                  <XCircle size={24} className="text-red-500" />
                  <span className="text-red-600 font-bold">No Apto</span>
                </>
              )}
            </div>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-3 rounded-full font-bold transition-all duration-300 hover:shadow-xl hover:scale-105 !important"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen mb-10 pt-16 flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #f9fafb, #ffffff)' }}>
        <div className="text-center">
          <Loader size={48} className="animate-spin text-green-500 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Cargando tus postulaciones...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen mb-10 pt-16 flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #f9fafb, #ffffff)' }}>
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <XCircle size={64} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={cargarMisPostulaciones}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-3 rounded-full font-bold transition-all duration-300 !important"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mb-10 pt-16" style={{ background: 'linear-gradient(to bottom right, #f9fafb, #ffffff)' }}>
      <style>
        {`
          input:focus { outline: none !important; border-color: #5DC554 !important; }
          select:focus { outline: none !important; border-color: #5DC554 !important; }
        `}
      </style>

      {modalOpen && selectedOferta && (
        <DetalleModal oferta={selectedOferta} onClose={closeModal} />
      )}

      <div className="max-w-[95%] mx-auto px-4 mt-6">
        <div className="pb-12 text-start">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">
            <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
              Mis Postulaciones
            </span>
          </h1>
          <p className="text-xl text-gray-500">
            Gestiona y revisa todas tus postulaciones a ofertas laborales
          </p>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="mb-12 bg-white rounded-2xl">
          <div className="flex gap-4 items-center">
            {/* Barra de búsqueda */}
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder="Buscar ofertas laborales..."
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

            {/* Filtro de estado */}
            <div className="relative group">
              <select
                value={selectedEstado}
                onChange={(e) => setSelectedEstado(e.target.value)}
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
                <option value="">Todos los estados</option>
                <option value="Apto">Apto</option>
                <option value="No Apto">No Apto</option>
              </select>
            </div>

            {/* Botón limpiar filtros */}
            {(searchTerm || selectedEstado) && (
              <button
                onClick={clearFilters}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-lg !important"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Tabla de ofertas */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-green-500 to-teal-500">
                  <th className="px-6 py-4 text-left text-white font-bold text-sm">
                    Oferta Laboral
                  </th>
                  <th className="px-6 py-4 text-left text-white font-bold text-sm">
                    Empresa
                  </th>
                  <th className="px-6 py-4 text-left text-white font-bold text-sm">
                    Fecha de Postulación
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
                {ofertasFiltradas.map((oferta, index) => (
                  <tr
                    key={oferta.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={oferta.imagen}
                          alt={oferta.titulo}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {oferta.titulo}
                          </p>
                          <p className="text-xs text-gray-500">{oferta.tipo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Briefcase size={16} style={{ color: '#5DC554' }} />
                        <span className="text-sm font-medium">{oferta.empresa}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600 text-sm">
                        <p className="font-medium">{oferta.fechaPostulacion}</p>
                        <p className="text-xs text-gray-500">{oferta.horaPostulacion}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {oferta.apto ? (
                        <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                          <CheckCircle size={16} />
                          Apto
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                          <XCircle size={16} />
                          No Apto
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => openModal(oferta)}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 !important"
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

          {ofertasFiltradas.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl">
                {ofertasPostuladas.length === 0 
                  ? "No tienes postulaciones aún" 
                  : "No se encontraron postulaciones con los filtros seleccionados"}
              </p>
            </div>
          )}
        </div>

        {/* Resumen estadístico */}
        {ofertasPostuladas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-full">
                  <Briefcase size={32} className="text-white" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total</p>
                  <p className="text-3xl font-bold text-gray-800">{ofertasPostuladas.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Aptos</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {ofertasPostuladas.filter((o) => o.apto).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-4 rounded-full">
                  <XCircle size={32} className="text-red-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">No Aptos</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {ofertasPostuladas.filter((o) => !o.apto).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}