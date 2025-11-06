import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Search,
  X,
  CheckCircle,
  Eye,
  MapPin,
  User,
  Gift,
  Tag,
  Award,
  Building2,
} from "lucide-react";
import { getBeneficiosRedimidosRequest } from '../../api/gestionarBeneficiosApi';
import { useUser } from '../../context/userContext';

export default function MisBeneficios() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBeneficio, setSelectedBeneficio] = useState(null);
  const [modalSolicitudOpen, setModalSolicitudOpen] = useState(false);
  const [beneficiosReclamados, setBeneficiosReclamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [formData, setFormData] = useState({
    tipoBeneficio: "",
    nombreBeneficio: "",
    facultad: "",
    carrera: "",
    motivo: "",
    fechaPreferida: "",
    modalidadPreferida: "",
  });

  // Cargar beneficios reclamados del backend
  useEffect(() => {
    const fetchBeneficiosReclamados = async () => {
      try {
        setLoading(true);
        const data = await getBeneficiosRedimidosRequest();
        console.log('Beneficios reclamados:', data);
        
        // Mapear los datos del backend al formato esperado por el frontend
        const beneficiosFormateados = (data?.beneficiosRedimidos || []).map((item) => ({
          id: item._id,
          nombre: item.beneficioId?.titulo || 'Beneficio no disponible',
          tipo: item.beneficioId?.tipo_beneficio || 'N/A',
          fechaSolicitud: new Date(item.fecha_redencion).toLocaleDateString(),
          horaSolicitud: new Date(item.fecha_redencion).toLocaleTimeString(),
          fechaVencimiento: item.beneficioId?.fecha_fin ? new Date(item.beneficioId.fecha_fin).toLocaleDateString() : 'Sin fecha límite',
          estado: "Reclamado",
          descripcion: item.beneficioId?.descripcion || 'Sin descripción',
          categoria: getTipoLabel(item.beneficioId?.tipo_beneficio),
          empresa: item.beneficioId?.empresa_asociada || '',
          urlDetalle: item.beneficioId?.url_detalle || '',
          imagen: item.beneficioId?.imagen_beneficio || "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=300&fit=crop",
          // Datos adicionales del beneficio original
          beneficioOriginal: item.beneficioId,
          fechaRedencion: item.fecha_redencion,
        }));

        setBeneficiosReclamados(beneficiosFormateados);
      } catch (error) {
        console.error('Error al cargar beneficios reclamados:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBeneficiosReclamados();
    }
  }, [user]);

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

  // Filtrar beneficios
  const beneficiosFiltrados = beneficiosReclamados.filter((benef) => {
    const matchSearch = benef.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchEstado = selectedEstado ? benef.estado === selectedEstado : true;
    return matchSearch && matchEstado;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedEstado("");
  };

  const openModal = (beneficio) => {
    setSelectedBeneficio(beneficio);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBeneficio(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Función para enviar solicitud
  const handleSubmitSolicitud = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar la solicitud
    console.log("Solicitud enviada:", formData);
    setModalSolicitudOpen(false);
    // Resetear formulario
    setFormData({
      tipoBeneficio: "",
      nombreBeneficio: "",
      facultad: "",
      carrera: "",
      motivo: "",
      fechaPreferida: "",
      modalidadPreferida: "",
    });
    // Mostrar notificación de éxito (opcional)
    alert("¡Solicitud enviada exitosamente!");
  };

  // Obtener color del estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Solicitado":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          icon: "text-yellow-500",
        };
      case "Aprobado":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          icon: "text-blue-500",
        };
      case "Reclamado":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          icon: "text-green-500",
        };
      case "Canjeado":
        return {
          bg: "bg-purple-100",
          text: "text-purple-700",
          icon: "text-purple-500",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          icon: "text-gray-500",
        };
    }
  };

  // Modal de detalle
  const DetalleModal = ({ beneficio, onClose }) => {
    const estadoColor = getEstadoColor(beneficio.estado);

    return (
      <div className="fixed inset-0 bg-[#00000092] backdrop-blur-xs z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header con imagen */}
          <div className="relative h-64 overflow-hidden rounded-t-3xl">
            <img
              src={beneficio.imagen}
              alt={beneficio.nombre}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white! hover:bg-gray-100! p-2 rounded-full! transition-all! duration-300! shadow-lg!"
            >
              <X size={24} className="text-gray-800" />
            </button>
            <div className="absolute bottom-4 left-6">
              <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full! text-sm font-bold shadow-xl">
                {beneficio.categoria}
              </span>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {beneficio.nombre}
            </h2>

            {/* Información principal en grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Calendar size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Fecha de reclamo
                  </p>
                  <p className="font-semibold text-gray-800">
                    {beneficio.fechaSolicitud}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Clock size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Hora de reclamo
                  </p>
                  <p className="font-semibold text-gray-800">
                    {beneficio.horaSolicitud}
                  </p>
                </div>
              </div>

              {beneficio.fechaVencimiento && beneficio.fechaVencimiento !== 'Sin fecha límite' && (
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Calendar size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Válido hasta
                    </p>
                    <p className="font-semibold text-gray-800">
                      {beneficio.fechaVencimiento}
                    </p>
                  </div>
                </div>
              )}

              {beneficio.empresa && (
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Building2 size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Empresa asociada
                    </p>
                    <p className="font-semibold text-gray-800">
                      {beneficio.empresa}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Descripción */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 mb-6 border border-green-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-teal-500 rounded-full"></div>
                Descripción
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {beneficio.descripcion}
              </p>
            </div>

            {/* URL de detalle si existe */}
            {beneficio.urlDetalle && (
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900 font-semibold mb-2">
                  Más información:
                </p>
                <a
                  href={beneficio.urlDetalle}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                >
                  {beneficio.urlDetalle}
                </a>
              </div>
            )}

            {/* Footer con estado y botón */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div
                className={`flex items-center gap-3 ${estadoColor.bg} px-6 py-3 rounded-xl`}
              >
                <CheckCircle size={24} className={estadoColor.icon} />
                <span className={`${estadoColor.text} font-bold text-lg`}>
                  {beneficio.estado}
                </span>
              </div>
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-3 rounded-full font-bold transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal de Solicitud de Beneficio
  const ModalSolicitud = ({ onClose }) => (
    <div className="fixed inset-0 bg-[#00000092] backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-green-500 to-teal-500 p-8 rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white! hover:bg-gray-100! p-2 rounded-full! transition-all! duration-300 shadow-lg"
          >
            <X size={24} className="text-gray-800" />
          </button>
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-2">Solicitar Beneficio</h2>
            <p className="text-green-100">
              Completa el formulario para solicitar un nuevo beneficio
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmitSolicitud} className="p-8">
          <div className="space-y-6">
            {/* Tipo de Beneficio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Beneficio *
              </label>
              <select
                name="tipoBeneficio"
                value={formData.tipoBeneficio}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:bg-white transition-all duration-300"
                style={{ outline: "none" }}
              >
                <option value="">Selecciona un tipo</option>
                <option value="Curso">Curso</option>
                <option value="Descuento">Descuento</option>
                <option value="Evento">Evento</option>
                <option value="Membresía">Membresía</option>
                <option value="Acceso">Acceso a Recursos</option>
              </select>
            </div>

            {/* Nombre del Beneficio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre del Beneficio *
              </label>
              <input
                type="text"
                name="nombreBeneficio"
                value={formData.nombreBeneficio}
                onChange={handleInputChange}
                required
                placeholder="Ej: Curso de Python, Descuento en libros..."
                className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:bg-white transition-all duration-300"
                style={{ outline: "none" }}
              />
            </div>

            {/* Facultad y Carrera en grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Facultad *
                </label>
                <select
                  name="facultad"
                  value={formData.facultad}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:bg-white transition-all duration-300"
                  style={{ outline: "none" }}
                >
                  <option value="">Selecciona facultad</option>
                  <option value="Ingeniería">Ingeniería</option>
                  <option value="Administración">Administración</option>
                  <option value="Derecho">Derecho</option>
                  <option value="Medicina">Medicina</option>
                  <option value="Arquitectura">Arquitectura</option>
                  <option value="Educación">Educación</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Carrera *
                </label>
                <input
                  type="text"
                  name="carrera"
                  value={formData.carrera}
                  onChange={handleInputChange}
                  required
                  placeholder="Tu carrera"
                  className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:bg-white transition-all duration-300"
                  style={{ outline: "none" }}
                />
              </div>
            </div>

            {/* Fecha Preferida y Modalidad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha Preferida
                </label>
                <input
                  type="date"
                  name="fechaPreferida"
                  value={formData.fechaPreferida}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:bg-white transition-all duration-300"
                  style={{ outline: "none" }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Modalidad Preferida
                </label>
                <select
                  name="modalidadPreferida"
                  value={formData.modalidadPreferida}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:bg-white transition-all duration-300"
                  style={{ outline: "none" }}
                >
                  <option value="">Selecciona modalidad</option>
                  <option value="Presencial">Presencial</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>
            </div>

            {/* Motivo de Solicitud */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Motivo de Solicitud *
              </label>
              <textarea
                name="motivo"
                value={formData.motivo}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder="Explica brevemente por qué deseas este beneficio..."
                className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:bg-white transition-all duration-300 resize-none"
                style={{ outline: "none" }}
              />
            </div>

            {/* Información adicional */}
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Nota:</span> Tu solicitud será
                revisada por el equipo administrativo. Recibirás una
                notificación una vez que sea procesada.
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100! hover:bg-gray-200! text-gray-700! px-6 py-3 rounded-full! font-bold transition-all! duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-3 rounded-full! font-bold transition-all! duration-300 hover:shadow-xl hover:scale-105"
            >
              Enviar Solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  );

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

      {modalOpen && selectedBeneficio && (
        <DetalleModal beneficio={selectedBeneficio} onClose={closeModal} />
      )}

      {modalSolicitudOpen && (
        <ModalSolicitud onClose={() => setModalSolicitudOpen(false)} />
      )}

      <div className="max-w-[95%] mx-auto px-4 mt-6">
        <div className="justify-between md:flex md:items-center ">
          <div className="pb-12 text-start">
            <h1 className="text-6xl font-bold text-gray-900 mb-2">
              <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                Mis Beneficios
              </span>
            </h1>
            <p className="text-xl text-gray-500">
              Gestiona y revisa todos tus beneficios reclamados
            </p>
          </div>
          {/* Botón Solicitar Beneficio */}
          <div className="mb-8 flex justify-end">
            <button
              onClick={() => setModalSolicitudOpen(true)}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-3"
            >
              <Gift size={20} />
              Solicitar Nuevo Beneficio
            </button>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="mb-12 bg-white rounded-2xl">
          <div className="flex gap-4 items-center">
            {/* Barra de búsqueda */}
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder="Buscar beneficios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 text-gray-800 px-6 py-4 pl-14 rounded-xl transition-all! duration-300 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white focus:shadow-lg"
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

            {/* Filtro de estado */}
            <div className="relative group">
              <select
                value={selectedEstado}
                onChange={(e) => setSelectedEstado(e.target.value)}
                className="bg-gray-50 text-gray-800 px-6 py-4 pr-10 rounded-xl cursor-pointer transition-all! duration-300 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white focus:shadow-lg appearance-none"
                style={{ outline: "none", border: "2px solid #e5e7eb" }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#5DC554";
                  e.target.style.boxShadow = "0 0 0 3px rgba(93, 197, 84, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="">Todos los estados</option>
                <option value="Solicitado">Solicitado</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Reclamado">Reclamado</option>
                <option value="Canjeado">Canjeado</option>
              </select>
            </div>

            {/* Botón limpiar filtros */}
            {(searchTerm || selectedEstado) && (
              <button
                onClick={clearFilters}
                className="bg-gray-100! hover:bg-gray-200! text-gray-600! px-8 py-4 rounded-xl! font-bold transition-all! duration-300 hover:shadow-lg"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Tabla de beneficios */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-20 text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-500 text-xl">Cargando beneficios reclamados...</p>
          </div>
        ) : beneficiosReclamados.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-20 text-center">
            <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes beneficios reclamados
            </h3>
            <p className="text-gray-600">
              Cuando reclames beneficios, aparecerán aquí.
            </p>
          </div>
        ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-green-500 to-teal-500">
                  <th className="px-6 py-4 text-left text-white font-bold text-sm">
                    Nombre del Beneficio
                  </th>
                  <th className="px-6 py-4 text-left text-white font-bold text-sm">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-white font-bold text-sm">
                    Fecha de Solicitud
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
                {beneficiosFiltrados.map((benef, index) => {
                  const estadoColor = getEstadoColor(benef.estado);
                  return (
                    <tr
                      key={benef.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={benef.imagen}
                            alt={benef.nombre}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">
                              {benef.nombre}
                            </p>
                            <p className="text-xs text-gray-500">
                              {benef.categoria}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-teal-100 text-green-700 px-3 py-1 rounded-full! text-sm font-semibold">
                          <Gift size={14} />
                          {benef.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar size={16} style={{ color: "#5DC554" }} />
                            <span className="text-sm font-medium">
                              {benef.fechaSolicitud}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Clock size={16} style={{ color: "#5DC554" }} />
                            <span className="text-sm font-medium">
                              {benef.horaSolicitud}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-2 ${estadoColor.bg} ${estadoColor.text} px-4 py-2 rounded-full! text-sm font-semibold`}
                        >
                          <CheckCircle size={16} />
                          {benef.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openModal(benef)}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-2 rounded-full! text-sm font-bold transition-all! duration-300 hover:shadow-lg hover:scale-105"
                        >
                          <Eye size={16} />
                          Ver Detalle
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {beneficiosFiltrados.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl">
                No se encontraron beneficios con los filtros seleccionados
              </p>
            </div>
          )}
        </div>
        )}

        {/* Resumen estadístico */}
        {!loading && beneficiosReclamados.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-full!">
                <Gift size={32} className="text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Total</p>
                <p className="text-3xl font-bold text-gray-800">
                  {beneficiosReclamados.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-full!">
                <CheckCircle size={32} className="text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Académicos</p>
                <p className="text-3xl font-bold text-gray-800">
                  {beneficiosReclamados.filter(b => b.tipo === 'academico').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-4 rounded-full!">
                <Award size={32} className="text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Convenios</p>
                <p className="text-3xl font-bold text-gray-800">
                  {beneficiosReclamados.filter(b => b.tipo === 'convenio').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-4 rounded-full!">
                <Tag size={32} className="text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Otros</p>
                <p className="text-3xl font-bold text-gray-800">
                  {beneficiosReclamados.filter(b => ['laboral', 'salud', 'cultural'].includes(b.tipo)).length}
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
