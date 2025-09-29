import { TIPO_BENEFICIO } from "../../constants/Beneficios/Beneficios.enum"
import { Calendar, User, MapPin, Award, DollarSign, BookOpen } from "lucide-react"

const CardBeneficio = ({ beneficio }) => {
  const getIcono = (tipo) => {
    const iconClass = "w-10 h-10"
    
    switch (tipo) {
      case TIPO_BENEFICIO.POSTGRADO:
        return (
          <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Award className={`${iconClass} text-emerald-600`} />
          </div>
        )
      case TIPO_BENEFICIO.CURSO:
        return (
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
            <BookOpen className={`${iconClass} text-blue-600`} />
          </div>
        )
      case TIPO_BENEFICIO.CONFERENCIA:
        return (
          <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
            <User className={`${iconClass} text-purple-600`} />
          </div>
        )
      default:
        return null
    }
  }

  const getBadgeColor = (tipo) => {
    switch (tipo) {
      case TIPO_BENEFICIO.POSTGRADO:
        return "bg-emerald-100 text-emerald-700"
      case TIPO_BENEFICIO.CURSO:
        return "bg-blue-100 text-blue-700"
      case TIPO_BENEFICIO.CONFERENCIA:
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const InfoItem = ({ icon: Icon, children, className = "" }) => (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <Icon size={18} className="text-theme-secondary" />
      <span className="text-theme-primary font-medium">{children}</span>
    </div>
  )

  const renderDetalles = () => {
    const {
      tipo,
      area,
      modalidad,
      docente,
      nivel,
      descuento,
      fechaInicio,
      fechaFin,
      expositor,
      lugar,
      fecha,
      tipoPostgrado,
    } = beneficio

    switch (tipo) {
      case TIPO_BENEFICIO.POSTGRADO:
        return (
          <div className="space-y-3">
            <InfoItem icon={MapPin}>{area}</InfoItem>
            <InfoItem icon={User}>Docente: {docente}</InfoItem>
            <InfoItem icon={Award}>{modalidad}</InfoItem>
            <InfoItem icon={BookOpen}>Tipo: {tipoPostgrado}</InfoItem>
            {descuento && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <InfoItem icon={DollarSign} className="text-emerald-700">
                  DESCUENTO {descuento} (Válido hasta {fechaFin})
                </InfoItem>
              </div>
            )}
            <InfoItem icon={Calendar} className="text-red-600">
              Inicio: {fechaInicio}
            </InfoItem>
          </div>
        )
      case TIPO_BENEFICIO.CURSO:
        return (
          <div className="space-y-3">
            <InfoItem icon={MapPin}>{area}</InfoItem>
            <InfoItem icon={User}>
              Docente: {docente} | Nivel: {nivel}
            </InfoItem>
            <InfoItem icon={Award}>{modalidad}</InfoItem>
            {descuento && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <InfoItem icon={DollarSign} className="text-emerald-700">
                  DESCUENTO {descuento} (Válido hasta {fechaFin})
                </InfoItem>
              </div>
            )}
            <InfoItem icon={Calendar} className="text-red-600">
              Inicio: {fechaInicio}
            </InfoItem>
          </div>
        )
      case TIPO_BENEFICIO.CONFERENCIA:
        return (
          <div className="space-y-3">
            <InfoItem icon={MapPin}>{area}</InfoItem>
            <InfoItem icon={User}>Expositor: {expositor}</InfoItem>
            <InfoItem icon={Award}>{modalidad}</InfoItem>
            <InfoItem icon={MapPin}>Gratuito | Lugar: {lugar}</InfoItem>
            <InfoItem icon={Calendar} className="text-red-600">
              Fecha: {fecha}
            </InfoItem>
          </div>
        )
      default:
        return null
    }
  }

  const getTitulo = () => {
    const { tipo, titulo, tipoPostgrado } = beneficio

    switch (tipo) {
      case TIPO_BENEFICIO.POSTGRADO:
        return `${tipoPostgrado} en ${titulo}`
      case TIPO_BENEFICIO.CURSO:
      case TIPO_BENEFICIO.CONFERENCIA:
        return titulo
      default:
        return ""
    }
  }

  return (
    <div className="bg-theme-secondary rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-theme group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${getBadgeColor(beneficio.tipo)}`}>
            {beneficio.tipo}
          </span>
          <h3 className="text-xl font-bold text-theme-primary group-hover:text-theme-accent transition-colors">
            {getTitulo()}
          </h3>
        </div>
        <div className="ml-4">
          {getIcono(beneficio.tipo)}
        </div>
      </div>
      
      <div className="mt-4">
        {renderDetalles()}
      </div>

      <button className="w-full mt-6 bg-theme-accent hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl transition-all">
        Ver más detalles
      </button>
    </div>
  )
}

export default CardBeneficio