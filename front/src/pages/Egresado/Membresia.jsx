import { Briefcase, Award, Users, BookOpen, Calendar, CheckCircle, Sparkles, Zap, Star, TrendingUp, ShieldCheck, Loader } from "lucide-react"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext";
import { Toaster, toast} from "sonner";

const beneficios = [
  { icon: Briefcase, titulo: "Acceso a Bolsa Laboral Premium", descripcion: "Ofertas exclusivas para egresados de la URP" },
  { icon: Award, titulo: "Certificaciones Profesionales", descripcion: "Descuento en certificaciones" },
  { icon: Users, titulo: "Networking Profesional", descripcion: "Eventos con empleadores y alumnos" },
  { icon: BookOpen, titulo: "Cursos de Especialización", descripcion: "Acceso a cursos profesionales" },
  { icon: Calendar, titulo: "Asesorías Personalizadas", descripcion: "Optimización de CV y LinkedIn" },
  { icon: Sparkles, titulo: "Eventos Exclusivos", descripcion: "Acceso prioritario a conferencias y talleres" },
];

const features = [
  "Acceso inmediato a todos los beneficios",
  "Renovación anual automática",
  "Cancela cuando quieras",
  "Garantía de devolución en los primeros 14 días"
];

export default function Membresia() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 font-sans">
      <Toaster position="bottom-center" richColors />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        <div className="mb-8 text-left">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-full px-4 py-2 mb-4 shadow-lg">
            <Star className="w-4 h-4 text-white fill-white" />
            <span className="text-white text-sm font-semibold">Oferta Limitada</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-3 text-left">
            Únete a <span className="text-green-600">URPex</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl text-left">
            La membresía exclusiva para egresados que impulsa tu crecimiento profesional
          </p>
        </div>

        <div className="mb-12 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 border border-gray-100 p-8 lg:p-12">
          
          <div className="mb-6">
            <div className="flex items-baseline gap-3 flex-wrap mb-2">
              <span className="text-6xl font-black text-gray-900">S/ 120</span>
              <span className="text-2xl text-gray-500 line-through">S/ 150</span>
              <span className="text-green-600 font-semibold text-sm">/año</span>
              <div className="inline-flex items-center gap-2 bg-green-100 rounded-lg px-3 py-1">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-bold text-sm">Ahorra S/ 30 hoy</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => toast.error('Función aun no implementada')}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-xl mb-6 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="animate-spin h-5 w-5" />
                Procesando...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Activar Membresía
              </span>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-gray-600 text-xs">
            <ShieldCheck className="w-4 h-4" />
            Pago 100% seguro y encriptado
          </div>
        </div>

        <div className="space-y-6">
          <div className="mb-8 text-left">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-3 flex items-center gap-3">
              <TrendingUp className="w-10 h-10 text-green-600" />
              Todo lo que incluye
            </h2>
            <p className="text-xl text-gray-600">Beneficios diseñados para acelerar tu carrera</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {beneficios.map((beneficio, idx) => {
              const Icon = beneficio.icon;
              return (
                <div key={idx} className="group relative bg-white border border-gray-200 hover:border-green-300 hover:shadow-lg rounded-xl p-6 transition-all duration-300 hover:translate-x-2">
                  <div className="absolute -left-3 top-6 w-8 h-8 bg-green-600 text-white font-black rounded-full flex items-center justify-center text-sm shadow-lg">
                    {idx + 1}
                  </div>
                  <div className="ml-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                      <Icon className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-bold text-lg mb-1 group-hover:text-green-600 transition-colors">
                        {beneficio.titulo}
                      </h3>
                      <p className="text-gray-600 text-sm">{beneficio.descripcion}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 bg-gradient-to-r from-green-50 to-transparent border-l-4 border-green-600 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-green-600 border-2 border-white flex items-center justify-center text-white font-semibold text-sm">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-gray-900 font-semibold">Únete a la comunidad más activa de la URP</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
