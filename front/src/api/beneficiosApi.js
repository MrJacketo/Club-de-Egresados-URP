import apiClient from "../api/apiClient"

export const getBeneficios = async (filtros = {}) => {
  try {
    const response = await apiClient.get("/beneficios", { params: filtros })
    return response.data
  } catch (error) {
    console.error("Error al obtener beneficios:", error)
    throw error
  }
}

export const enviarFeedback = async (feedbackData) => {
  try {
    const response = await apiClient.post("/feedback", feedbackData)
    return response.data
  } catch (error) {
    console.error("Error al enviar feedback:", error)
    throw error
  }
}

export const getTiposCursos = async () => {
  try {
    const response = await apiClient.get("/tipos-cursos")
    return response.data
  } catch (error) {
    console.error("Error al obtener tipos de cursos:", error)
    throw error
  }
}

export const getTemasCursos = async () => {
  try {
    const response = await apiClient.get("/temas-cursos")
    return response.data
  } catch (error) {
    console.error("Error al obtener temas de cursos:", error)
    throw error
  }
}
