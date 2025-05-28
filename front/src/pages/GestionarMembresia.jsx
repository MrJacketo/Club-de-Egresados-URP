import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
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
import { getMembresiaRequest } from "../api/membresiaApi";
import { getBeneficiosRedimidosRequest } from "../api/beneficiosApi";
import { useNavigate } from "react-router-dom";

export default function GestionarMembresiaForm() {
  const user = useContext(UserContext);
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
        if (data) {
          setMembresia(data);
        }
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
      try {
        if (membresia.estado === "activa") {
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
        }
      } catch (error) {
        console.error("Error al cargar beneficios redimidos", error);
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

  const handleRenovar = async () => {
    if (membresia.estado !== "activa") {
      navigate("/membresia");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Cargando información de membresía...
      </div>
    );
  }

  const diasRestantes = calcularDiasRestantes(membresia.fechaVencimiento);
  const porcentajeCompletado =
    100 - Math.min(100, Math.round((diasRestantes / 365) * 100));

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <header className="w-full py-8 px-6 mt-10 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Mi Membresía</h1>
        </div>
      </header>

      <main className="flex-1 w-full px-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-6 mb-6 text-black shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {user?.userName || "Usuario"}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">Membresía Anual</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        membresia.estado === "activa"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {membresia.estado === "activa" ? "Activa" : "Inactiva"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    membresia.estado === "activa"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  }`}
                  onClick={handleRenovar}
                  disabled={membresia.estado === "activa"}
                >
                  <RefreshCw size={18} className="mr-2" />
                  {membresia.estado === "activa"
                    ? "Membresía activa"
                    : "Activar membresía"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Detalles de membresía */}
            <div className="bg-white rounded-lg p-6 text-black shadow-lg">
              <h3 className="text-xl font-semibold mb-4">
                Detalles de membresía
              </h3>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col">
                  <span className="text-sm opacity-70 flex items-center gap-1 mb-1">
                    <Calendar size={14} /> Fecha de inicio
                  </span>
                  <span className="font-medium text-lg">
                    {membresia.fechaActivacion
                      ? new Date(
                          membresia.fechaActivacion
                        ).toLocaleDateString()
                      : "--/--/----"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm opacity-70 flex items-center gap-1 mb-1">
                    <Calendar size={14} /> Fecha de vencimiento
                  </span>
                  <span className="font-medium text-lg">
                    {membresia.fechaVencimiento
                      ? new Date(
                          membresia.fechaVencimiento
                        ).toLocaleDateString()
                      : "--/--/----"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="opacity-70">Progreso de membresía</span>
                  <span className="font-medium">
                    {membresia.estado === "activa"
                      ? `${porcentajeCompletado}%`
                      : "0%"}
                  </span>
                </div>
                <div className="w-full bg-black/50 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full"
                    style={{
                      width: `${
                        membresia.estado === "activa"
                          ? porcentajeCompletado
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-70 flex items-center">
                    <Clock size={14} className="mr-1" />
                    {membresia.estado === "activa"
                      ? `${diasRestantes} días restantes`
                      : "No activa"}
                  </span>
                  {membresia.estado === "activa" && diasRestantes < 15 && (
                    <span className="text-xs bg-amber-400/50 border border-amber-400/50 text-white px-2 py-0.5 rounded-full">
                      ¡Próximo a vencer!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Beneficios */}
            <div className="bg-white rounded-lg p-6 text-white shadow-lg">
              <button
                className="flex justify-between items-center w-full font-semibold text-xl mb-4"
                onClick={() => setBeneficiosAbiertos(!beneficiosAbiertos)}
              >
                <span className="flex items-center">
                  <Award size={20} className="mr-2" />
                  {membresia.estado === "activa"
                    ? "Beneficios actuales con su membresía:"
                    : "Beneficios si activa su membresía:"}
                </span>
                {beneficiosAbiertos ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              {beneficiosAbiertos && (
                <ul className="space-y-3">
                  {membresia.estado === "activa" ? (
                    beneficiosRedimidos.length > 0 ? (
                      beneficiosRedimidos.map((beneficio, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-4 bg-black/40 p-4 rounded-lg border border-white/10"
                        >
                          <div className="mt-1">
                            <CheckCircle
                              size={20}
                              className="text-green-400"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-white mb-1">
                              {beneficio.nombre}
                            </h4>
                            {beneficio.codigo && (
                              <p className="text-sm text-white/80 mb-1">
                                <span className="font-medium text-white/70">
                                  Código:
                                </span>{" "}
                                {beneficio.codigo}
                              </p>
                            )}
                            {beneficio.fechaReclamo && (
                              <p className="text-xs text-gray-300 italic">
                                Reclamado el:{" "}
                                {new Date(
                                  beneficio.fechaReclamo
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </li>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">
                        No tienes beneficios redimidos aún.
                      </p>
                    )
                  ) : (
                    [
                      "Acceso a la bolsa exclusiva de URPex",
                      "Conferencias gratuitas",
                      "Descuento en diferentes paquetes de cursos",
                    ].map((beneficio, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 bg-black/40 p-3 rounded-lg"
                      >
                        <CheckCircle
                          size={18}
                          className="text-white-400 mt-0.5 flex-shrink-0"
                        />
                        <span>{beneficio}</span>
                      </li>
                    ))
                  )}
                </ul>
              )}

              <button className="w-full mt-6 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center">
                <Gift size={18} className="mr-2" />
                Ver beneficios adicionales
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}