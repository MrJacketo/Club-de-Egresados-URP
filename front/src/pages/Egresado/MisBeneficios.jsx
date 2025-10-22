import { useState } from "react";
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
} from "lucide-react";

export default function MisBeneficios() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBeneficio, setSelectedBeneficio] = useState(null);
  const [modalSolicitudOpen, setModalSolicitudOpen] = useState(false);
  const [formData, setFormData] = useState({
    tipoBeneficio: "",
    nombreBeneficio: "",
    facultad: "",
    carrera: "",
    motivo: "",
    fechaPreferida: "",
    modalidadPreferida: "",
  });

  // Datos de beneficios reclamados
  const beneficiosReclamados = [
    {
      id: 1,
      nombre: "Descuento 15% en Libros Técnicos",
      tipo: "Descuento",
      fechaSolicitud: "15/11/2024",
      horaSolicitud: "3:45pm",
      fechaVencimiento: "31/12/2025",
      estado: "Reclamado",
      descripcion:
        "Descuento especial en la librería universitaria para libros de especialización técnica y académica.",
      categoria: "Descuentos",
      porcentaje: "15%",
      proveedor: "Librería Universitaria Central",
      codigoDescuento: "LIB15-2024",
      terminosCondiciones:
        "Válido solo para compras presenciales. No acumulable con otras promociones.",
      imagen:
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      nombre: "Descuento 20% en Coursera",
      tipo: "Descuento",
      fechaSolicitud: "20/10/2024",
      horaSolicitud: "10:20am",
      fechaVencimiento: "1/10/2025",
      estado: "Canjeado",
      descripcion:
        "Accede a miles de cursos online con descuento exclusivo para estudiantes de la institución.",
      categoria: "Descuentos",
      porcentaje: "20%",
      proveedor: "Coursera",
      codigoDescuento: "COURS20-EDU",
      fechaCanje: "25/10/2024",
      terminosCondiciones:
        "Aplicable a cualquier curso. Válido por 3 meses desde la activación.",
      imagen:
        "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      nombre: "Curso Gratuito de Python",
      tipo: "Curso",
      fechaSolicitud: "01/11/2024",
      horaSolicitud: "2:15pm",
      fechaVencimiento: "1/10/2025",
      fechaInicio: "10 de Julio 2025",
      estado: "Aprobado",
      descripcion:
        "Curso completo de programación en Python desde nivel básico hasta intermedio con certificación oficial.",
      categoria: "Cursos",
      carrera: "Ingeniería Informática",
      docente: "LINAREZ COLOMA, HUMBERTO VICTOR",
      nivel: "Intermedio",
      modalidad: "Presencial",
      duracion: "40 horas",
      lugar: "Laboratorio de Cómputo - Piso 2",
      horario: "Lunes y Miércoles 6:00pm - 8:00pm",
      imagen:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      nombre: "Marketing Digital para emprendedores",
      tipo: "Curso",
      fechaSolicitud: "28/10/2024",
      horaSolicitud: "11:30am",
      fechaVencimiento: "20/11/2024",
      estado: "Canjeado",
      descripcion:
        "Estrategias actuales de marketing digital para impulsar tu emprendimiento en redes sociales y plataformas digitales.",
      categoria: "Cursos",
      carrera: "Administración de Empresas",
      docente: "Mg. Andrea Vega",
      nivel: "Básico",
      modalidad: "Virtual",
      duracion: "30 horas",
      plataforma: "Google Meet",
      horario: "Martes y Jueves 7:00pm - 9:00pm",
      fechaCanje: "05/11/2024",
      imagen:
        "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=400&h=300&fit=crop",
    },
    {
      id: 5,
      nombre: "Conferencia Ciberseguridad",
      tipo: "Evento",
      fechaSolicitud: "12/11/2024",
      horaSolicitud: "9:00am",
      fechaEvento: "15/10/2025",
      horaEvento: "7:00pm",
      estado: "Solicitado",
      descripcion:
        "Conferencia magistral sobre las nuevas tendencias en ciberseguridad y protección de datos en el entorno digital actual.",
      categoria: "Eventos",
      ponente: "Dr. Roberto Maldonado",
      modalidad: "Presencial",
      lugar: "Auditorio Principal",
      duracion: "3 horas",
      cupos: "200 participantes",
      imagen:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      nombre: "Acceso a Biblioteca Digital Premium",
      tipo: "Acceso",
      fechaSolicitud: "05/11/2024",
      horaSolicitud: "4:20pm",
      fechaVencimiento: "31/12/2025",
      estado: "Reclamado",
      descripcion:
        "Acceso ilimitado a recursos digitales académicos, bases de datos especializadas y revistas científicas internacionales.",
      categoria: "Servicios",
      proveedor: "Biblioteca Digital Universitaria",
      recursos: "Más de 100,000 libros digitales, 5,000 revistas científicas",
      plataformas: "EBSCO, ProQuest, JSTOR, IEEE Xplore",
      codigoAcceso: "BDU-2024-PREMIUM",
      imagen:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    },
    {
      id: 7,
      nombre: "Descuento 25% en Material Deportivo",
      tipo: "Descuento",
      fechaSolicitud: "18/11/2024",
      horaSolicitud: "1:45pm",
      fechaVencimiento: "15/11/2025",
      estado: "Aprobado",
      descripcion:
        "Equipamiento deportivo con descuento para miembros de la comunidad universitaria en tiendas seleccionadas.",
      categoria: "Descuentos",
      porcentaje: "25%",
      proveedor: "SportZone Universitario",
      codigoDescuento: "SPORT25-UNI",
      terminosCondiciones:
        "Válido en compras mayores a S/100. Presentar carnet universitario.",
      imagen:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop",
    },
    {
      id: 8,
      nombre: "Membresía Gimnasio Universitario",
      tipo: "Membresía",
      fechaSolicitud: "22/10/2024",
      horaSolicitud: "8:30am",
      fechaVencimiento: "30/06/2025",
      estado: "Reclamado",
      descripcion:
        "Acceso gratuito a las instalaciones deportivas durante todo el semestre académico con todas las facilidades.",
      categoria: "Servicios",
      beneficios:
        "Acceso a gimnasio, piscina, canchas deportivas, clases grupales",
      horarioDisponible: "Lunes a Sábado 6:00am - 10:00pm",
      lugar: "Complejo Deportivo Universitario",
      codigoMembresia: "GYM-2024-S2",
      imagen:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
    },
  ];

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
                {beneficio.tipo}
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
                    Fecha de solicitud
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
                    Hora de solicitud
                  </p>
                  <p className="font-semibold text-gray-800">
                    {beneficio.horaSolicitud}
                  </p>
                </div>
              </div>

              {beneficio.fechaVencimiento && (
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

              {beneficio.fechaCanje && (
                <div className="flex items-center gap-3 bg-purple-50 rounded-xl p-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <CheckCircle size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Fecha de canje
                    </p>
                    <p className="font-semibold text-gray-800">
                      {beneficio.fechaCanje}
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

            {/* Información específica según el tipo - DESCUENTO */}
            {beneficio.tipo === "Descuento" && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-teal-500 rounded-full"></div>
                  Detalles del Descuento
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {beneficio.porcentaje && (
                    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <Tag size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Descuento
                        </p>
                        <p className="font-bold text-green-600 text-xl">
                          {beneficio.porcentaje}
                        </p>
                      </div>
                    </div>
                  )}

                  {beneficio.proveedor && (
                    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <User size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Proveedor
                        </p>
                        <p className="font-semibold text-gray-800">
                          {beneficio.proveedor}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {beneficio.codigoDescuento && (
                  <div className="mt-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm font-medium mb-1">
                          Código de descuento
                        </p>
                        <p className="font-bold text-white text-2xl tracking-wide">
                          {beneficio.codigoDescuento}
                        </p>
                      </div>
                      <Award size={32} className="text-white opacity-80" />
                    </div>
                  </div>
                )}

                {beneficio.terminosCondiciones && (
                  <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
                    <p className="text-sm text-gray-700 font-semibold mb-2">
                      Términos y condiciones:
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {beneficio.terminosCondiciones}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Información específica según el tipo - CURSO */}
            {beneficio.tipo === "Curso" && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-teal-500 rounded-full"></div>
                  Información del Curso
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {beneficio.carrera && (
                    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <Award size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Carrera
                        </p>
                        <p className="font-semibold text-gray-800">
                          {beneficio.carrera}
                        </p>
                      </div>
                    </div>
                  )}

                  {beneficio.docente && (
                    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <User size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Docente
                        </p>
                        <p className="font-semibold text-gray-800">
                          {beneficio.docente}
                        </p>
                      </div>
                    </div>
                  )}

                  {beneficio.nivel && (
                    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <Gift size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Nivel
                        </p>
                        <p className="font-semibold text-gray-800">
                          {beneficio.nivel}
                        </p>
                      </div>
                    </div>
                  )}

                  {beneficio.duracion && (
                    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <Clock size={20} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Duración
                        </p>
                        <p className="font-semibold text-gray-800">
                          {beneficio.duracion}
                        </p>
                      </div>
                    </div>
                  )}

                  {beneficio.modalidad && (
                    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 md:col-span-2">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 font-medium">
                          Modalidad
                        </p>
                        <p className="font-semibold text-gray-800">
                          {beneficio.modalidad}
                        </p>
                        {beneficio.lugar && (
                          <p className="text-gray-600 text-sm mt-1">
                            {beneficio.lugar}
                          </p>
                        )}
                        {beneficio.plataforma && (
                          <p className="text-gray-600 text-sm mt-1">
                            {beneficio.plataforma}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {beneficio.horario && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-900 font-semibold mb-1">
                      Horario:
                    </p>
                    <p className="text-sm text-blue-800">{beneficio.horario}</p>
                  </div>
                )}

                {beneficio.fechaInicio && (
                  <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                    <p className="text-sm text-green-900 font-semibold mb-1">
                      Fecha de inicio:
                    </p>
                    <p className="text-sm font-semibold text-green-800">
                      {beneficio.fechaInicio}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Información específica según el tipo - EVENTO/ACCESO/MEMBRESÍA */}
            {(beneficio.tipo === "Evento" ||
              beneficio.tipo === "Acceso" ||
              beneficio.tipo === "Membresía") && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-teal-500 rounded-full"></div>
                  Detalles del {beneficio.tipo}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {beneficio.ponente && (
                    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <User size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Ponente
                        </p>
                        <p className="font-semibold text-gray-800">
                          {beneficio.ponente}
                        </p>
                      </div>
                    </div>
                  )}

                  {beneficio.proveedor && (
                    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <Award size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Proveedor
                        </p>
                        <p className="font-semibold text-gray-800">
                          {beneficio.proveedor}
                        </p>
                      </div>
                    </div>
                  )}

                  {beneficio.modalidad && (
                    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Modalidad
                        </p>
                        <p className="font-semibold text-gray-800">
                          {beneficio.modalidad}
                        </p>
                        {beneficio.lugar && (
                          <p className="text-gray-600 text-sm mt-1">
                            📍 {beneficio.lugar}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {beneficio.duracion && (
                    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <Clock size={20} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Duración
                        </p>
                        <p className="font-semibold text-gray-800">
                          {beneficio.duracion}
                        </p>
                      </div>
                    </div>
                  )}

                  {beneficio.fechaEvento && (
                    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 md:col-span-2">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <Calendar size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Fecha del evento
                        </p>
                        <p className="font-semibold text-gray-800">
                          {beneficio.fechaEvento} - {beneficio.horaEvento}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {beneficio.recursos && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-900 font-semibold mb-1">
                      Recursos disponibles:
                    </p>
                    <p className="text-sm text-blue-800">
                      {beneficio.recursos}
                    </p>
                  </div>
                )}

                {beneficio.plataformas && (
                  <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-4 mb-4">
                    <p className="text-sm text-purple-900 font-semibold mb-1">
                      Plataformas:
                    </p>
                    <p className="text-sm text-purple-800">
                      {beneficio.plataformas}
                    </p>
                  </div>
                )}

                {beneficio.beneficios && (
                  <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 mb-4">
                    <p className="text-sm text-green-900 font-semibold mb-1">
                      Beneficios incluidos:
                    </p>
                    <p className="text-sm text-green-800">
                      {beneficio.beneficios}
                    </p>
                  </div>
                )}

                {(beneficio.codigoAcceso || beneficio.codigoMembresia) && (
                  <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm font-medium mb-1">
                          Código de acceso
                        </p>
                        <p className="font-bold text-white text-2xl tracking-wide">
                          {beneficio.codigoAcceso || beneficio.codigoMembresia}
                        </p>
                      </div>
                      <Award size={32} className="text-white opacity-80" />
                    </div>
                  </div>
                )}

                {beneficio.horarioDisponible && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
                    <p className="text-sm text-yellow-900 font-semibold mb-1">
                      - Horario disponible:
                    </p>
                    <p className="text-sm text-yellow-800">
                      {beneficio.horarioDisponible}
                    </p>
                  </div>
                )}
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

        {/* Resumen estadístico */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-12">
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
              <div className="bg-yellow-100 p-4 rounded-full!">
                <Clock size={32} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Solicitados</p>
                <p className="text-3xl font-bold text-gray-800">
                  {
                    beneficiosReclamados.filter(
                      (b) => b.estado === "Solicitado"
                    ).length
                  }
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
                <p className="text-gray-500 text-sm font-medium">Aprobados</p>
                <p className="text-3xl font-bold text-gray-800">
                  {
                    beneficiosReclamados.filter((b) => b.estado === "Aprobado")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-4 rounded-full!">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Reclamados</p>
                <p className="text-3xl font-bold text-gray-800">
                  {
                    beneficiosReclamados.filter((b) => b.estado === "Reclamado")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Estadística adicional para canjeados */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-4 rounded-full!">
                <Award size={32} className="text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Canjeados</p>
                <p className="text-3xl font-bold text-gray-800">
                  {
                    beneficiosReclamados.filter((b) => b.estado === "Canjeado")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
