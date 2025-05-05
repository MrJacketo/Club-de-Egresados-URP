import { Briefcase, Award, Users, BookOpen, Calendar, CheckCircle } from "lucide-react"

export default function Membresia() {
  const beneficios = [
    {
      icon: <Briefcase className="w-6 h-6 text-teal-600" />,
      titulo: "Acceso a Bolsa Laboral Premium",
      descripcion: "Ofertas exclusivas para egresados de la URP",

    },
    {
      icon: <Award className="w-6 h-6 text-teal-600" />,
      titulo: "Certificaciones Profesionales",
      descripcion: "Descuento en certificaciones",
    },
    {
      icon: <Users className="w-6 h-6 text-teal-600" />,
      titulo: "Networking Profesional",
      descripcion: "Eventos con empleadores y alumnos",

    },
    {
      icon: <BookOpen className="w-6 h-6 text-teal-600" />,
      titulo: "Cursos de Especialización",
      descripcion: "Acesso a cursos profesionales",

    },
    {
      icon: <Calendar className="w-6 h-6 text-teal-600" />,
      titulo: "Asesorías Personalizadas",
      descripcion: "Optimizacion de CV y Linkendl",
    },
  ]

  return (
    <div className="h-screen flex items-center justify-center px-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-6">
          Membresía <span className="text-teal-200">URPex</span> Premium
        </h1>
        <p className="text-xl text-white text-center mb-8 max-w-3xl mx-auto">
          Impulsa tu carrera profesional con nuestra membresía para egresados URP
        </p>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:shadow-teal-900/30 hover:shadow-2xl">
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Membresía Anual</h2>
              <div className="flex items-center gap-3">
                <span className="text-lg line-through opacity-75">S/ 180</span>
                <span className="bg-white text-teal-700 text-sm font-bold px-3 py-1 rounded-full">AHORRA 17%</span>
              </div>
            </div>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-4xl font-extrabold">S/ 150</span>
              <span className="text-xl mb-1">/año</span>
            </div>
            <p className="mt-2 text-teal-100 text-base">Renovación automática anual. Cancela cuando quieras.</p>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Beneficios exclusivos para tu desarrollo profesional:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {beneficios.map((beneficio, idx) => (
                <div key={idx} className="flex items-start gap-3 text-left">
                  <div className="flex-shrink-0 w-8">{beneficio.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-base">{beneficio.titulo}</h4>
                    {beneficio.descripcion?.trim() !== "" && (
                      <p className="text-gray-600 text-sm">{beneficio.descripcion}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <button className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-4 px-6 rounded-xl transition duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-teal-600/30 text-xl">
                Obtener Membresía Anual
              </button>
              <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-1">
                <CheckCircle className="w-4 h-4 text-teal-600" />
                <span>Garantía de devolución durante los primeros 14 días</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
