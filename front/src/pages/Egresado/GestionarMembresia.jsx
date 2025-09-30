import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import {
  Calendar,
  Clock,
  Award,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Gift,
  RefreshCw,
  User,
} from "lucide-react";
import { getMembresiaRequest } from "../../api/membresiaApi";
import { getBeneficiosRedimidosRequest } from "../../api/beneficiosApi";
import { useNavigate } from "react-router-dom";

export default function GestionarMembresiaForm() {
  // --- No changes to state or logic ---
  const { user } = useContext(UserContext); // Assuming your UserContext provides a 'user' object with 'userName'
  const navigate = useNavigate();
  const [beneficiosAbiertos, setBeneficiosAbiertos] = useState(true);
  const [membresia, setMembresia] = useState({
    estado: "inactiva",
    beneficios: [],
    fechaActivacion: null,
    fechaVencimiento: null,
  });
  const [beneficiosRedimidos, setBeneficiosRedimidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembresia = async () => {
      try {
        const data = await getMembresiaRequest();
        if (data) setMembresia(data);
      } catch (err) {
        setError("Error al cargar la membresía");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembresia();
  }, []);

  useEffect(() => {
    const fetchRedimidos = async () => {
      if (membresia.estado === "activa") {
        try {
          const response = await getBeneficiosRedimidosRequest();
          if (response.success && Array.isArray(response.beneficiosRedimidos)) {
            const beneficios = response.beneficiosRedimidos.map((item) => ({
              nombre: item.beneficioId.titulo,
              descripcion: item.beneficioId.descripcion,
              tipo: item.beneficioId.tipo,
              codigo: item.codigo_unico,
              fechaReclamo: item.fecha_redencion,
            }));
            setBeneficiosRedimidos(beneficios);
          }
        } catch (error) {
          console.error("Error al cargar beneficios redimidos", error);
        }
      }
    };
    fetchRedimidos();
  }, [membresia.estado]);

  const calcularDiasRestantes = (fechaVencimiento) => {
    if (!fechaVencimiento) return 0;
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diferencia = vencimiento.getTime() - hoy.getTime();
    return Math.max(0, Math.ceil(diferencia / (1000 * 3600 * 24)));
  };

  const handleRenovar = () => {
    if (membresia.estado !== "activa") {
      navigate("/membresia");
    }
  };

  // --- STYLING CHANGES START HERE ---

  // Improved loading state for better UX in a dark theme
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1C1D21] flex flex-col items-center justify-center text-gray-400">
        <RefreshCw size={32} className="animate-spin mb-4 text-green-500" />
        <p>Cargando información de tu membresía...</p>
      </div>
    );
  }

  const diasRestantes = calcularDiasRestantes(membresia.fechaVencimiento);
  const porcentajeCompletado =
    100 - Math.min(100, Math.round((diasRestantes / 365) * 100));

  return (
    // Set the overall background to dark gray
    <div className="min-h-screen w-full bg-[#1C1D21] text-white">
      <main className="w-full px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Mi Membresía</h1>

          {/* User Info Card: removed bg-white, changed to dark style */}
          <div className="border border-gray-700/50 rounded-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-gray-800 p-3 rounded-full">
                  <User size={24} className="text-gray-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {user?.userName || "Usuario"}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg text-gray-300">Membresía Anual</span>
                    {/* Status tags restyled for dark mode */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        membresia.estado === "activa"
                          ? "bg-green-500/10 text-green-300 border-green-500/20"
                          : "bg-red-500/10 text-red-300 border-red-500/20"
                      }`}
                    >
                      {membresia.estado === "activa" ? "Activa" : "Inactiva"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Button restyled from blue to green */}
              <button
                className={`px-5 py-2.5 rounded-lg flex items-center justify-center font-semibold transition-colors ${
                  membresia.estado === "activa"
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                }`}
                onClick={handleRenovar}
                disabled={membresia.estado === "activa"}
              >
                <RefreshCw size={16} className="mr-2" />
                {membresia.estado === "activa" ? "Membresía activa" : "Activar membresía"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Details Card: restyled for dark mode */}
            <div className="border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-6 text-white">Detalles de membresía</h3>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                    <Calendar size={14} className="text-green-400" /> Fecha de inicio
                  </span>
                  <span className="font-medium text-lg text-gray-100">
                    {membresia.fechaActivacion ? new Date(membresia.fechaActivacion).toLocaleDateString() : "--/--/----"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                    <Calendar size={14} className="text-green-400" /> Fecha de vencimiento
                  </span>
                  <span className="font-medium text-lg text-gray-100">
                    {membresia.fechaVencimiento ? new Date(membresia.fechaVencimiento).toLocaleDateString() : "--/--/----"}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progreso de membresía</span>
                  <span className="font-medium text-gray-200">
                    {membresia.estado === "activa" ? `${porcentajeCompletado}%` : "0%"}
                  </span>
                </div>
                {/* Progress bar with updated dark theme track */}
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: `${membresia.estado === "activa" ? porcentajeCompletado : 0}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-sm text-gray-400 flex items-center">
                    <Clock size={14} className="mr-2 text-green-400" />
                    {membresia.estado === "activa" ? `${diasRestantes} días restantes` : "No activa"}
                  </span>
                  {/* Expiration warning tag restyled */}
                  {membresia.estado === "activa" && diasRestantes < 15 && (
                    <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full">
                      ¡Próximo a vencer!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Benefits Card: restyled for dark mode */}
            <div className="border border-gray-700/50 rounded-xl p-6">
              <button
                className="flex justify-between items-center w-full font-semibold text-xl"
                onClick={() => setBeneficiosAbiertos(!beneficiosAbiertos)}
              >
                <span className="flex items-center text-left">
                  <Award size={20} className="mr-3 text-green-400 flex-shrink-0" />
                  Beneficios de tu membresía
                </span>
                {beneficiosAbiertos ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {beneficiosAbiertos && (
                <ul className="space-y-3 mt-6">
                  {membresia.estado === "activa" ? (
                    beneficiosRedimidos.length > 0 ? (
                      beneficiosRedimidos.map((beneficio, index) => (
                        <li key={index} className="flex items-start gap-3 bg-gray-800/50 p-4 rounded-lg">
                          <CheckCircle size={20} className="text-green-400 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-1">{beneficio.nombre}</h4>
                            {beneficio.codigo && (
                              <p className="text-sm text-gray-300 mb-1">
                                <span className="font-medium text-gray-400">Código:</span> {beneficio.codigo}
                              </p>
                            )}
                            {beneficio.fechaReclamo && (
                              <p className="text-xs text-gray-400 italic">
                                Reclamado el: {new Date(beneficio.fechaReclamo).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </li>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-4">No has redimido beneficios aún.</p>
                    )
                  ) : (
                    ["Acceso a bolsa exclusiva", "Conferencias gratuitas", "Descuentos en cursos"].map((b, i) => (
                      <li key={i} className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg">
                        <CheckCircle size={18} className="text-gray-400 flex-shrink-0" />
                        <span className="text-gray-300">{b}</span>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}