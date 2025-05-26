import { TIPO_BENEFICIO } from "../../constants/Beneficios/Beneficios.enum"

const CardBeneficio = ({ beneficio }) => {
  const getIcono = (tipo) => {
    switch (tipo) {
      case TIPO_BENEFICIO.POSTGRADO:
        // Imagen para Postgrado
        return (
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <img src="https://cdn-icons-png.flaticon.com/512/3976/3976631.png" alt="Postgrado" className="w-8 h-8" />
          </div>
        )
      case TIPO_BENEFICIO.CURSO:
        if (beneficio.tema === "Lenguaje c#") {
          return (
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg"
                alt="C#"
                className="w-8 h-8"
              />
            </div>
          )
        }
        // Imagen genérica para otros cursos
        return (
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <img src="https://cdn-icons-png.flaticon.com/512/2232/2232688.png" alt="Curso" className="w-8 h-8" />
          </div>
        )
      case TIPO_BENEFICIO.CONFERENCIA:
        // Imagen para Conferencia
        return (
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <img src="https://cdn-icons-png.flaticon.com/512/1205/1205526.png" alt="Conferencia" className="w-8 h-8" />
          </div>
        )
      default:
        return null
    }
  }

  const getAreaIcon = () => {
    return (
      <div className="flex items-center mb-2 text-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <span className="font-bold">{beneficio.area}</span>
      </div>
    )
  }

  const getModalidadIcon = () => {
    return (
      <div className="flex items-center text-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        <span className=" font-bold">{beneficio.modalidad}</span>
      </div>
    )
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
      tipoPostgrado,
    } = beneficio

    switch (tipo) {
      case TIPO_BENEFICIO.POSTGRADO:
        return (
          <div className="mt-3">
            <div className="flex items-center mb-2 text-black">{getAreaIcon()}</div>
            <div className="flex items-center mb-2 text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="font-bold">Docente: {docente}</span>
            </div>
            <div className="flex items-center mb-2 text-black">{getModalidadIcon()}</div>
            <div className="flex items-center mb-2 text-green-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="font-bold ">Tipo: {tipoPostgrado}</span>
            </div>
            {descuento && (
              <div className="flex items-center mb-2 text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                <span className="font-bold ">
                  DESCUENTO {descuento} (Válido hasta {fechaFin})
                </span>
              </div>
            )}
            <div className="flex items-center mb-2 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="font-bold">Inicio: {fechaInicio}</span>
            </div>
          </div>
        )
      case TIPO_BENEFICIO.CURSO:
        return (
          <div className="mt-3">
            <div className="flex items-center mb-2 text-black">{getAreaIcon()}</div>
            <div className="flex items-center mb-2 text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="font-bold">
                Docente: {docente} | Nivel: {nivel}
              </span>
            </div>
            <div className="flex items-center mb-2">{getModalidadIcon()}</div>
            {descuento && (
              <div className="flex items-center mb-2 text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                <span className="font-bold">
                  DESCUENTO {descuento} (Válido hasta {fechaFin})
                </span>
              </div>
            )}
            <div className="flex items-center text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="font-bold">Inicio: {fechaInicio}</span>
            </div>
          </div>
        )
      case TIPO_BENEFICIO.CONFERENCIA:
        return (
          <div className="mt-3">
            <div className="flex items-center mb-2 text-black">{getAreaIcon()}</div>
            <div className="flex items-center mb-2 text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="font-bold">Expositor: {expositor}</span>
            </div>
            <div className="flex items-center mb-2 text-black">{getModalidadIcon()}</div>
            <div className="flex items-center mb-2 text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="font-bold text-black">Gratuito | Lugar: {lugar}</span>
            </div>
            <div className="flex items-center mb-2 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="font-bold">Fecha: {fecha}</span>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const getTitulo = () => {
    const { tipo, area, titulo, tipoPostgrado } = beneficio

    switch (tipo) {
      case TIPO_BENEFICIO.POSTGRADO:
        return `${tipo} | ${tipoPostgrado} en ${titulo}`
      case TIPO_BENEFICIO.CURSO:
        return `${tipo} | ${titulo}`
      case TIPO_BENEFICIO.CONFERENCIA:
        return `${tipo} | ${titulo}`
      default:
        return ""
    }
  }

  return (
    <div className="w-full bg-white rounded-3xl p-6 mb-4 shadow-md">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-black">{getTitulo()}</h3>
      </div>
      <div className="flex mt-4">
        <div className="mr-4">{getIcono(beneficio.tipo)}</div>
        <div className="flex-1">{renderDetalles()}</div>
      </div>
    </div>
  )
}

export default CardBeneficio