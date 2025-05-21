import { TIPO_BENEFICIO } from "../../constants/Beneficios/Beneficios.enum"

const CardBeneficio = ({ beneficio }) => {
  const getIcono = (tipo) => {
    switch (tipo) {
      case TIPO_BENEFICIO.POSTGRADO:
        // Imagen para Maestría/Postgrado
        return (
          <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center">
            <img src="https://cdn-icons-png.flaticon.com/512/3976/3976631.png" alt="Postgrado" className="w-16 h-16" />
          </div>
        )
      case TIPO_BENEFICIO.CURSO:
        if (beneficio.tema === "Lenguaje c#") {
          return (
            <div className="w-24 h-24 bg-purple-100 rounded-2xl flex items-center justify-center">
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg"
                alt="C#"
                className="w-16 h-16"
              />
            </div>
          )
        }
        // Imagen genérica para otros cursos
        return (
          <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center">
            <img src="https://cdn-icons-png.flaticon.com/512/2232/2232688.png" alt="Curso" className="w-16 h-16" />
          </div>
        )
      case TIPO_BENEFICIO.CONFERENCIA:
        // Imagen para Conferencia
        return (
          <div className="w-24 h-24 bg-yellow-100 rounded-2xl flex items-center justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1205/1205526.png"
              alt="Conferencia"
              className="w-16 h-16"
            />
          </div>
        )
      default:
        return null
    }
  }

  const renderDetalles = () => {
    const {
      tipo,
      titulo,
      modalidad,
      docente,
      nivel,
      descuento,
      fechaInicio,
      fechaFin,
      expositor,
      lugar,
      fecha,
      gratuito,
      area,
    } = beneficio

    switch (tipo) {
      case TIPO_BENEFICIO.POSTGRADO:
        return (
          <div className="text-left">
            <p className="text-lg font-semibold">
              {area || "Derecho Constitucional"} | {modalidad}
            </p>
            <p>Docente: {docente}</p>
            {descuento && (
              <p>
                <span className="text-yellow-500"></span> DESCUENTO {descuento} (Válido hasta {fechaFin})
              </p>
            )}
            <p>
              <span className="w-4 h-4 bg-red-400"></span> Inicio: {fechaInicio}
            </p>
          </div>
        )
      case TIPO_BENEFICIO.CURSO:
        return (
          <div className="text-left">
            <p className="text-lg font-semibold">
              {titulo} - {modalidad}
            </p>
            <p>
              Docente: {docente} | Nivel: {nivel}
            </p>
            {descuento && (
              <p>
                <span className="text-yellow-500"></span> DESCUENTO {descuento} (Válido hasta {fechaFin})
              </p>
            )}
            <p>
              <span className="w-4 h-4 bg-red-400"></span> Inicio: {fechaInicio}
            </p>
          </div>
        )
      case TIPO_BENEFICIO.CONFERENCIA:
        return (
          <div className="text-left">
            <p className="text-lg font-semibold">
              {titulo} | {modalidad}
            </p>
            <p>Expositor: {expositor}</p>
            <p>
              {gratuito ? "Gratuito" : `Costo: ${beneficio.costo}`} | Lugar: {lugar}
            </p>
            <p>Fecha: {fecha}</p>
          </div>
        )
      default:
        return null
    }
  }

  const getTitulo = () => {
    const { tipo, area, titulo } = beneficio

    switch (tipo) {
      case TIPO_BENEFICIO.POSTGRADO:
        return `${tipo} | ${titulo || "Cyberseguridad"}`
      case TIPO_BENEFICIO.CURSO:
      case TIPO_BENEFICIO.CONFERENCIA:
        return `${tipo} | ${area || "Ingeniería Informática"}`
      default:
        return ""
    }
  }

  return (
    <div className="w-full bg-white rounded-3xl p-4 mb-4 flex items-start shadow-md overflow-hidden">
      <div className="mr-4 flex-shrink-0">{getIcono(beneficio.tipo)}</div>
      <div className="flex-1">
        <h3 className="text-xl font-bold mb-3 text-center text-blue-800">{getTitulo()}</h3>
        {renderDetalles()}
      </div>
    </div>
  )
}

export default CardBeneficio