import { useState, useEffect } from "react";
import {
  Calendar, Clock, Search, X, CheckCircle, Eye, Gift, MessageSquare,
  AlertCircle, CheckCircle2, XCircle, Building2, Tag, Award
} from "lucide-react";
import { 
  getBeneficiosRedimidosRequest, 
  getMisFeedbacks, 
  enviarFeedback 
} from '../../api/gestionarBeneficiosApi';
import { useUser } from '../../context/userContext';

// Función para obtener etiqueta del tipo
const getTipoLabel = (tipo) => {
  switch (tipo) {
    case 'academico': return 'Académico';
    case 'laboral': return 'Laboral';
    case 'salud': return 'Salud';
    case 'cultural': return 'Cultural';
    case 'convenio': return 'Convenio';
    default: return 'Beneficio';
  }
};

// Obtener color del estado
const getEstadoColor = (estado) => {
  switch (estado?.toLowerCase()) {
    case "solicitado":
      return { bg: "bg-yellow-100", text: "text-yellow-700", icon: "text-yellow-500" };
    case "aprobado":
      return { bg: "bg-green-100", text: "text-green-700", icon: "text-green-500" };
    case "reclamado":
      return { bg: "bg-blue-100", text: "text-blue-700", icon: "text-blue-500" };
    case "rechazado":
      return { bg: "bg-red-100", text: "text-red-700", icon: "text-red-500" };
    case "canjeado":
      return { bg: "bg-purple-100", text: "text-purple-700", icon: "text-purple-500" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-700", icon: "text-gray-500" };
  }
};

// Modal de detalle de beneficio redimido
const DetalleModal = ({ beneficio, onClose }) => {
  const estadoColor = getEstadoColor(beneficio.estado);

  return (
    <div className="fixed inset-0 bg-[#00000092] backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative h-64 overflow-hidden rounded-t-3xl">
          <img src={beneficio.imagen} alt={beneficio.nombre} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <button onClick={onClose} className="absolute top-4 right-4 bg-white hover:bg-gray-100 p-2 rounded-full transition-all duration-300 shadow-lg">
            <X size={24} className="text-gray-800" />
          </button>
          <div className="absolute bottom-4 left-6">
            <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl">
              {beneficio.categoria}
            </span>
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{beneficio.nombre}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Fecha de reclamo</p>
                <p className="font-semibold text-gray-800">{beneficio.fechaSolicitud}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Clock size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Hora de reclamo</p>
                <p className="font-semibold text-gray-800">{beneficio.horaSolicitud}</p>
              </div>
            </div>

            {beneficio.fechaVencimiento && beneficio.fechaVencimiento !== 'Sin fecha límite' && (
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Calendar size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Válido hasta</p>
                  <p className="font-semibold text-gray-800">{beneficio.fechaVencimiento}</p>
                </div>
              </div>
            )}

            {beneficio.empresa && (
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Building2 size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Empresa asociada</p>
                  <p className="font-semibold text-gray-800">{beneficio.empresa}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 mb-6 border border-green-100">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-teal-500 rounded-full"></div>
              Descripción
            </h3>
            <p className="text-gray-700 leading-relaxed">{beneficio.descripcion}</p>
          </div>

          {beneficio.urlDetalle && (
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900 font-semibold mb-2">Más información:</p>
              <a href={beneficio.urlDetalle} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors text-sm">
                {beneficio.urlDetalle}
              </a>
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className={`flex items-center gap-3 ${estadoColor.bg} px-6 py-3 rounded-xl`}>
              <CheckCircle size={24} className={estadoColor.icon} />
              <span className={`${estadoColor.text} font-bold text-lg`}>{beneficio.estado}</span>
            </div>
            <button onClick={onClose} className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-3 rounded-full font-bold transition-all duration-300 hover:shadow-xl hover:scale-105">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal de detalle de solicitud/feedback
const DetalleFeedbackModal = ({ feedback, onClose }) => {
  const estadoColor = getEstadoColor(feedback.estado);

  return (
    <div className="fixed inset-0 bg-[#00000092] backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative bg-gradient-to-r from-green-500 to-teal-500 p-8 rounded-t-3xl">
          <button onClick={onClose} className="absolute top-4 right-4 bg-white! hover:bg-gray-100! p-2 rounded-full transition-all duration-300 shadow-lg">
            <X size={24} className="text-gray-800" />
          </button>
          <div className="text-white">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare size={32} />
              <h2 className="text-3xl font-bold">Solicitud de Beneficio</h2>
            </div>
            <p className="text-purple-100">Detalles de tu solicitud</p>
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">{feedback.beneficioDeseado}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Gift size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Tipo de Beneficio</p>
                <p className="font-semibold text-gray-800">{feedback.tipoBeneficio || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Fecha de Solicitud</p>
                <p className="font-semibold text-gray-800">{feedback.fechaSolicitud}</p>
              </div>
            </div>

            {feedback.facultad && (
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Building2 size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Facultad</p>
                  <p className="font-semibold text-gray-800">{feedback.facultad}</p>
                </div>
              </div>
            )}

            {feedback.carrera && (
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Carrera</p>
                  <p className="font-semibold text-gray-800">{feedback.carrera}</p>
                </div>
              </div>
            )}

            {feedback.fechaPreferida && (
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Calendar size={20} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Fecha Preferida</p>
                  <p className="font-semibold text-gray-800">{feedback.fechaPreferida}</p>
                </div>
              </div>
            )}

            {feedback.modalidadPreferida && (
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <div className="bg-pink-100 p-3 rounded-lg">
                  <CheckCircle size={20} className="text-pink-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Modalidad Preferida</p>
                  <p className="font-semibold text-gray-800">{feedback.modalidadPreferida}</p>
                </div>
              </div>
            )}
          </div>

          {feedback.motivo && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border border-purple-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                Motivo de Solicitud
              </h3>
              <p className="text-gray-700 leading-relaxed">{feedback.motivo}</p>
            </div>
          )}

          {feedback.respuestaAdministrador && (
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900 font-semibold mb-2">Respuesta del Administrador:</p>
              <p className="text-gray-700">{feedback.respuestaAdministrador}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className={`flex items-center gap-3 ${estadoColor.bg} px-6 py-3 rounded-xl`}>
              {feedback.estado === 'aprobado' && <CheckCircle2 size={24} className={estadoColor.icon} />}
              {feedback.estado === 'rechazado' && <XCircle size={24} className={estadoColor.icon} />}
              {feedback.estado === 'solicitado' && <AlertCircle size={24} className={estadoColor.icon} />}
              <span className={`${estadoColor.text} font-bold text-lg capitalize`}>{feedback.estado}</span>
            </div>
            <button onClick={onClose} className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-3 rounded-full font-bold transition-all duration-300 hover:shadow-xl hover:scale-105">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal de Solicitud
const ModalSolicitud = ({ onClose, formData, handleInputChange, handleSubmitSolicitud }) => (
  <div className="fixed inset-0 bg-[#00000092] backdrop-blur-xs z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="relative bg-gradient-to-r from-green-500 to-teal-500 p-8 rounded-t-3xl">
        <button onClick={onClose} className="absolute top-4 right-4 bg-white! hover:bg-gray-100! p-2 rounded-full transition-all duration-300 shadow-lg">
          <X size={24} className="text-gray-800" />
        </button>
        <div className="text-white">
          <h2 className="text-3xl font-bold mb-2">Solicitar Beneficio</h2>
          <p className="text-green-100">Completa el formulario para solicitar un nuevo beneficio</p>
        </div>
      </div>

      <form onSubmit={handleSubmitSolicitud} className="p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Beneficio *</label>
            <select name="tipoBeneficio" value={formData.tipoBeneficio} onChange={handleInputChange} required className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:bg-white transition-all duration-300" style={{ outline: "none" }}>
              <option value="">Selecciona un tipo</option>
              <option value="Curso">Curso</option>
              <option value="Descuento">Descuento</option>
              <option value="Evento">Evento</option>
              <option value="Membresía">Membresía</option>
              <option value="Acceso">Acceso a Recursos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Beneficio *</label>
            <input type="text" name="nombreBeneficio" value={formData.nombreBeneficio} onChange={handleInputChange} required placeholder="Ej: Curso de Python, Descuento en libros..." className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:bg-white transition-all duration-300" style={{ outline: "none" }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Facultad *</label>
              <select name="facultad" value={formData.facultad} onChange={handleInputChange} required className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:bg-white transition-all duration-300" style={{ outline: "none" }}>
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Carrera *</label>
              <input type="text" name="carrera" value={formData.carrera} onChange={handleInputChange} required placeholder="Tu carrera" className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:bg-white transition-all duration-300" style={{ outline: "none" }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha Preferida</label>
              <input type="date" name="fechaPreferida" value={formData.fechaPreferida} onChange={handleInputChange} className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:bg-white transition-all duration-300" style={{ outline: "none" }} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Modalidad Preferida</label>
              <select name="modalidadPreferida" value={formData.modalidadPreferida} onChange={handleInputChange} className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:bg-white transition-all duration-300" style={{ outline: "none" }}>
                <option value="">Selecciona modalidad</option>
                <option value="Presencial">Presencial</option>
                <option value="Virtual">Virtual</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Motivo de Solicitud *</label>
            <textarea name="motivo" value={formData.motivo} onChange={handleInputChange} required rows="4" placeholder="Explica brevemente por qué deseas este beneficio..." className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:bg-white transition-all duration-300 resize-none" style={{ outline: "none" }} />
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Nota:</span> Tu solicitud será revisada por el equipo administrativo. Recibirás una notificación una vez que sea procesada.
            </p>
          </div>
        </div>

        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
          <button type="button" onClick={onClose} className="flex-1 bg-gray-100! hover:bg-gray-200! text-gray-700 px-6 py-3 rounded-full font-bold transition-all duration-300">
            Cancelar
          </button>
          <button type="submit" className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-3 rounded-full font-bold transition-all duration-300 hover:shadow-xl hover:scale-105">
            Enviar Solicitud
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default function MisBeneficios() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBeneficio, setSelectedBeneficio] = useState(null);
  const [modalSolicitudOpen, setModalSolicitudOpen] = useState(false);
  const [beneficiosReclamados, setBeneficiosReclamados] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('beneficios');
  const { user } = useUser();
  const [formData, setFormData] = useState({
    tipoBeneficio: "", nombreBeneficio: "", facultad: "", carrera: "",
    motivo: "", fechaPreferida: "", modalidadPreferida: "",
  });

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Cargar beneficios redimidos
        const dataBeneficios = await getBeneficiosRedimidosRequest();
        const beneficiosFormateados = (dataBeneficios?.beneficiosRedimidos || []).map((item) => ({
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
        }));
        setBeneficiosReclamados(beneficiosFormateados);

        // Cargar feedbacks
        const dataFeedbacks = await getMisFeedbacks();
        const feedbacksFormateados = (dataFeedbacks || []).map((item) => ({
          id: item._id,
          nombre: item.beneficioDeseado,
          beneficioDeseado: item.beneficioDeseado,
          tipoBeneficio: item.tipoBeneficio,
          facultad: item.facultad,
          carrera: item.carrera,
          fechaPreferida: item.fechaPreferida ? new Date(item.fechaPreferida).toLocaleDateString() : '',
          modalidadPreferida: item.modalidadPreferida,
          motivo: item.comentariosAdicionales,
          fechaSolicitud: new Date(item.fechaCreacion).toLocaleDateString(),
          horaSolicitud: new Date(item.fechaCreacion).toLocaleTimeString(),
          estado: item.estado,
          respuestaAdministrador: item.respuestaAdministrador,
          prioridad: item.prioridad,
        }));
        setFeedbacks(feedbacksFormateados);
        
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Filtrar según tab activo
  const itemsFiltrados = activeTab === 'beneficios' 
    ? beneficiosReclamados.filter((item) => {
        const matchSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchEstado = selectedEstado ? item.estado === selectedEstado : true;
        return matchSearch && matchEstado;
      })
    : feedbacks.filter((item) => {
        const matchSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchEstado = selectedEstado ? item.estado === selectedEstado : true;
        return matchSearch && matchEstado;
      });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedEstado("");
  };

  const openModal = (item) => {
    setSelectedBeneficio(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBeneficio(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitSolicitud = async (e) => {
    e.preventDefault();
    
    try {
      if (!user) {
        alert("Debes iniciar sesión para enviar una solicitud");
        return;
      }

      const feedbackData = {
        userId: user.uid || user.id,
        nombreUsuario: user.displayName || user.nombre,
        emailUsuario: user.email,
        beneficioDeseado: formData.nombreBeneficio,
        tipoBeneficio: formData.tipoBeneficio,
        facultad: formData.facultad,
        carrera: formData.carrera,
        fechaPreferida: formData.fechaPreferida,
        modalidadPreferida: formData.modalidadPreferida,
        comentariosAdicionales: formData.motivo,
      };

      await enviarFeedback(feedbackData);
      
      setModalSolicitudOpen(false);
      setFormData({
        tipoBeneficio: "", nombreBeneficio: "", facultad: "", carrera: "",
        motivo: "", fechaPreferida: "", modalidadPreferida: "",
      });
      
      alert("¡Solicitud enviada exitosamente!");
      
      // Recargar feedbacks
      const dataFeedbacks = await getMisFeedbacks();
      const feedbacksFormateados = (dataFeedbacks || []).map((item) => ({
        id: item._id,
        nombre: item.beneficioDeseado,
        beneficioDeseado: item.beneficioDeseado,
        tipoBeneficio: item.tipoBeneficio,
        facultad: item.facultad,
        carrera: item.carrera,
        fechaPreferida: item.fechaPreferida ? new Date(item.fechaPreferida).toLocaleDateString() : '',
        modalidadPreferida: item.modalidadPreferida,
        motivo: item.comentariosAdicionales,
        fechaSolicitud: new Date(item.fechaCreacion).toLocaleDateString(),
        horaSolicitud: new Date(item.fechaCreacion).toLocaleTimeString(),
        estado: item.estado,
        respuestaAdministrador: item.respuestaAdministrador,
        prioridad: item.prioridad,
      }));
      setFeedbacks(feedbacksFormateados);
      
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      alert("Error al enviar la solicitud. Por favor, intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen mb-10 pt-16" style={{ background: "linear-gradient(to bottom right, #f9fafb, #ffffff)" }}>
      <style>
        {`
          input:focus { outline: none !important; border-color: #5DC554 !important; }
          select:focus { outline: none !important; border-color: #5DC554 !important; }
        `}
      </style>

      {modalOpen && selectedBeneficio && (
        activeTab === 'beneficios' ? (
          <DetalleModal beneficio={selectedBeneficio} onClose={closeModal} />
        ) : (
          <DetalleFeedbackModal feedback={selectedBeneficio} onClose={closeModal} />
        )
      )}

      {modalSolicitudOpen && (
        <ModalSolicitud 
          onClose={() => setModalSolicitudOpen(false)} 
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmitSolicitud={handleSubmitSolicitud}
        />
      )}

      <div className="max-w-[95%] mx-auto px-4 mt-6">
        <div className="justify-between md:flex md:items-center">
          <div className="pb-12 text-start">
            <h1 className="text-6xl font-bold text-gray-900 mb-2">
              <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                Mis Beneficios
              </span>
            </h1>
            <p className="text-xl text-gray-500">Gestiona tus beneficios reclamados y solicitudes</p>
          </div>
          <div className="mb-8 flex justify-end">
            <button onClick={() => setModalSolicitudOpen(true)} className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-3">
              <Gift size={20} />
              Solicitar Nuevo Beneficio
            </button>
          </div>
        </div>

        {/* Pestañas */}
        <div className="mb-8 bg-white rounded-2xl p-2 shadow-lg inline-flex gap-2">
          <button onClick={() => setActiveTab('beneficios')} className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'beneficios' ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
            <Gift size={20} />
            Beneficios Reclamados
            {beneficiosReclamados.length > 0 && (
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${activeTab === 'beneficios' ? 'bg-white text-green-600' : 'bg-gray-200 text-gray-700'}`}>
                {beneficiosReclamados.length}
              </span>
            )}
          </button>
          <button onClick={() => setActiveTab('solicitudes')} className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'solicitudes' ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
            <MessageSquare size={20} />
            Mis Solicitudes
            {feedbacks.length > 0 && (
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${activeTab === 'solicitudes' ? 'bg-white text-purple-600' : 'bg-gray-200 text-gray-700'}`}>
                {feedbacks.length}
              </span>
            )}
          </button>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="mb-12 bg-white rounded-2xl">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder={activeTab === 'beneficios' ? "Buscar beneficios..." : "Buscar solicitudes..."}
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
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:scale-110" size={22} style={{ color: "#5DC554" }} />
            </div>

            <div className="relative group">
              <select value={selectedEstado} onChange={(e) => setSelectedEstado(e.target.value)} className="bg-gray-50 text-gray-800 px-6 py-4 pr-10 rounded-xl cursor-pointer transition-all duration-300 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white focus:shadow-lg appearance-none" style={{ outline: "none", border: "2px solid #e5e7eb" }} onFocus={(e) => { e.target.style.borderColor = "#5DC554"; e.target.style.boxShadow = "0 0 0 3px rgba(93, 197, 84, 0.1)"; }} onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}>
                <option value="">Todos los estados</option>
                {activeTab === 'beneficios' ? (
                  <>
                    <option value="Reclamado">Reclamado</option>
                    <option value="Canjeado">Canjeado</option>
                  </>
                ) : (
                  <>
                    <option value="solicitado">Solicitado</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="rechazado">Rechazado</option>
                  </>
                )}
              </select>
            </div>

            {(searchTerm || selectedEstado) && (
              <button onClick={clearFilters} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-lg">
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Tabla */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-20 text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-500 text-xl">Cargando datos...</p>
          </div>
        ) : itemsFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-20 text-center">
            {activeTab === 'beneficios' ? (
              <>
                <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes beneficios reclamados</h3>
                <p className="text-gray-600">Cuando reclames beneficios, aparecerán aquí.</p>
              </>
            ) : (
              <>
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes solicitudes registradas</h3>
                <p className="text-gray-600">Haz clic en "Solicitar Nuevo Beneficio" para comenzar.</p>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-green-500 to-teal-500">
                    <th className="px-6 py-4 text-left text-white font-bold text-sm">{activeTab === 'beneficios' ? 'Nombre del Beneficio' : 'Solicitud'}</th>
                    <th className="px-6 py-4 text-left text-white font-bold text-sm">Tipo</th>
                    <th className="px-6 py-4 text-left text-white font-bold text-sm">Fecha de Solicitud</th>
                    <th className="px-6 py-4 text-center text-white font-bold text-sm">Estado</th>
                    <th className="px-6 py-4 text-center text-white font-bold text-sm">Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsFiltrados.map((item, index) => {
                    const estadoColor = getEstadoColor(item.estado);
                    return (
                      <tr key={item.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {activeTab === 'beneficios' ? (
                              <>
                                <img src={item.imagen} alt={item.nombre} className="w-12 h-12 rounded-lg object-cover" />
                                <div>
                                  <p className="font-semibold text-gray-800 text-sm">{item.nombre}</p>
                                  <p className="text-xs text-gray-500">{item.categoria}</p>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-r from-green-100 to-teal-100 p-3 rounded-lg">
                                  <MessageSquare size={20} className="text-green-600" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800 text-sm">{item.nombre}</p>
                                  {item.tipoBeneficio && <p className="text-xs text-gray-500">{item.tipoBeneficio}</p>}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 ${activeTab === 'beneficios' ? 'bg-gradient-to-r from-green-100 to-teal-100 text-green-700' : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700'} px-3 py-1 rounded-full text-sm font-semibold`}>
                            <Gift size={14} />
                            {item.tipoBeneficio || item.tipo || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-gray-700">
                              <Calendar size={16} style={{ color: "#5DC554" }} />
                              <span className="text-sm font-medium">{item.fechaSolicitud}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <Clock size={16} style={{ color: "#5DC554" }} />
                              <span className="text-sm font-medium">{item.horaSolicitud}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-2 ${estadoColor.bg} ${estadoColor.text} px-4 py-2 rounded-full text-sm font-semibold capitalize`}>
                            {item.estado === 'aprobado' && <CheckCircle2 size={16} />}
                            {item.estado === 'rechazado' && <XCircle size={16} />}
                            {(item.estado === 'solicitado' || item.estado === 'Solicitado') && <AlertCircle size={16} />}
                            {(item.estado === 'Reclamado' || item.estado === 'Canjeado') && <CheckCircle size={16} />}
                            {item.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => openModal(item)} className={`inline-flex items-center gap-2  bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-105`}>
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
          </div>
        )}

        {/* Estadísticas */}
        {!loading && (beneficiosReclamados.length > 0 || feedbacks.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            {activeTab === 'beneficios' ? (
              <>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-full">
                      <Gift size={32} className="text-white" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Total</p>
                      <p className="text-3xl font-bold text-gray-800">{beneficiosReclamados.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-4 rounded-full">
                      <CheckCircle size={32} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Académicos</p>
                      <p className="text-3xl font-bold text-gray-800">{beneficiosReclamados.filter(b => b.tipo === 'academico').length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-100 p-4 rounded-full">
                      <Award size={32} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Convenios</p>
                      <p className="text-3xl font-bold text-gray-800">{beneficiosReclamados.filter(b => b.tipo === 'convenio').length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-4 rounded-full">
                      <Tag size={32} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Otros</p>
                      <p className="text-3xl font-bold text-gray-800">{beneficiosReclamados.filter(b => ['laboral', 'salud', 'cultural'].includes(b.tipo)).length}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-full">
                      <MessageSquare size={32} className="text-white" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Total Solicitudes</p>
                      <p className="text-3xl font-bold text-gray-800">{feedbacks.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-yellow-100 p-4 rounded-full">
                      <AlertCircle size={32} className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Solicitadas</p>
                      <p className="text-3xl font-bold text-gray-800">{feedbacks.filter(f => f.estado === 'solicitado').length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-4 rounded-full">
                      <CheckCircle2 size={32} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Aprobadas</p>
                      <p className="text-3xl font-bold text-gray-800">{feedbacks.filter(f => f.estado === 'aprobado').length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-100 p-4 rounded-full">
                      <XCircle size={32} className="text-red-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Rechazadas</p>
                      <p className="text-3xl font-bold text-gray-800">{feedbacks.filter(f => f.estado === 'rechazado').length}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}