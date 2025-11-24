import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, Sparkles, Star, Calendar, TrendingUp, Briefcase, Award, Users, Loader } from "lucide-react";
import { getMembresiaRequest } from "../../api/membresiaApi";
import { simulatePagoRequest } from "../../api/pagoApi";
import { Toaster, toast } from "sonner";

const MembresiaSucess = () => {
  const [membresia, setMembresia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulatingPayment, setSimulatingPayment] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarMembresia = async () => {
      try {
        const data = await getMembresiaRequest();
        setMembresia(data);
      } catch (error) {
        console.error("Error al verificar membresía:", error);
      } finally {
        setLoading(false);
      }
    };

    verificarMembresia();
  }, []);

  const handleSimularPago = async () => {
    try {
      setSimulatingPayment(true);
      const response = await simulatePagoRequest();
      
      if (response.success) {
        toast.success("¡Membresía activada exitosamente!");
        setMembresia(response.membresia);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error al activar membresía";
      toast.error(errorMessage);
      console.error("Error al simular pago:", error);
    } finally {
      setSimulatingPayment(false);
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "No disponible";
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-teal-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verificando membresía...</p>
        </div>
      </div>
    );
  }

  const beneficios = [
    { icon: Briefcase, text: "Acceso a Bolsa Laboral Premium", color: "text-green-600" },
    { icon: Award, text: "Descuentos en certificaciones profesionales", color: "text-blue-600" },
    { icon: Users, text: "Networking con profesionales", color: "text-purple-600" },
    { icon: TrendingUp, text: "Cursos de especialización", color: "text-orange-600" },
    { icon: Calendar, text: "Asesorías personalizadas (CV, LinkedIn)", color: "text-teal-600" },
    { icon: Sparkles, text: "Eventos exclusivos para miembros", color: "text-pink-600" },
  ];

  const isActive = membresia?.estado === "activa";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-teal-50">
      <Toaster position="bottom-center" richColors />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header con animación */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mb-6 shadow-lg">
            {isActive ? (
              <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
            ) : (
              <Sparkles className="w-12 h-12 text-white" />
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            {isActive ? (
              <>¡Bienvenido a <span className="text-green-600">URPex</span>!</>
            ) : (
              <>¡Ya casi eres parte de <span className="text-green-600">URPex</span>!</>
            )}
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {isActive 
              ? "Tu membresía está activa y lista para usar"
              : "Activa tu membresía para acceder a todos los beneficios exclusivos"
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Card de Estado */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-green-600 fill-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Estado de Membresía</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-5">
                <p className="text-sm font-medium text-gray-600 mb-2 text-center">Estado actual</p>
                <div className="flex items-center justify-center gap-2">
                  <span className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-lg ${
                    isActive 
                      ? "bg-green-100 text-green-700" 
                      : "bg-orange-100 text-orange-700"
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isActive ? "bg-green-500" : "bg-orange-500"}`}></span>
                    {membresia?.estado?.toUpperCase() || "PENDIENTE"}
                  </span>
                </div>
              </div>

              {isActive ? (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Fecha de activación</p>
                    <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      {formatFecha(membresia?.fechaActivacion)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Válida hasta</p>
                    <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-teal-600" />
                      {formatFecha(membresia?.fechaVencimiento)}
                    </p>
                  </div>
                </>
              ) : (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                  <p className="text-sm text-orange-800 mb-4">
                    Para activar tu membresía, haz clic en el botón de abajo después de completar tu pago.
                  </p>
                  <button
                    onClick={handleSimularPago}
                    disabled={simulatingPayment}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    {simulatingPayment ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Activando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Activar Membresía
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Card de Beneficios */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Tus Beneficios</h2>
            </div>
            
            <div className="space-y-4">
              {beneficios.map((beneficio, index) => {
                const Icon = beneficio.icon;
                return (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className={`p-2 rounded-lg bg-gray-100`}>
                      <Icon className={`w-5 h-5 ${beneficio.color}`} />
                    </div>
                    <span className="text-gray-700 font-medium leading-relaxed">{beneficio.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl shadow-2xl p-8 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            {isActive ? "¡Comienza a disfrutar tus beneficios!" : "¿Ya completaste tu pago?"}
          </h3>
          <p className="text-green-50 mb-8 max-w-2xl mx-auto">
            {isActive 
              ? "Explora todas las oportunidades que tenemos para ti"
              : "Activa tu membresía para comenzar a disfrutar de todos los beneficios exclusivos"
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/mis-beneficios"
              className="bg-white text-green-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Ver mis beneficios
            </Link>
            <Link
              to="/VerMembresia"
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 font-bold py-4 px-8 rounded-xl transition-all duration-300"
            >
              Gestionar membresía
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MembresiaSucess;
