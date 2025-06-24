import apiClient from "./apiClient"

// Crear nueva noticia
export const crearNoticia = async (noticiaData) => {
  try {
    console.log("Enviando datos:", noticiaData)

    const response = await apiClient.post("/api/noticias", noticiaData)

    console.log("Respuesta del servidor:", response.data)

    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.error || "Error desconocido")
    }
  } catch (error) {
    console.error("Error en crearNoticia:", error)

    if (error.response) {
      // El servidor respondió con un código de error
      const errorMessage =
        error.response.data?.error || error.response.data?.message || `Error ${error.response.status}`
      throw new Error(errorMessage)
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      throw new Error("No se pudo conectar con el servidor")
    } else {
      // Error en la configuración de la petición
      throw new Error(error.message || "Error desconocido")
    }
  }
}

// Obtener noticias
export const obtenerNoticias = async (filtros = {}) => {
  try {
    const params = new URLSearchParams()

    Object.keys(filtros).forEach((key) => {
      if (filtros[key] && filtros[key] !== "" && filtros[key] !== "todas" && filtros[key] !== "todos") {
        params.append(key, filtros[key])
      }
    })

    const response = await apiClient.get(`/api/noticias?${params.toString()}`)

    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.error || "Error al obtener noticias")
    }
  } catch (error) {
    console.error("Error en obtenerNoticias:", error)
    throw error
  }
}

// Actualizar noticia
export const actualizarNoticia = async (id, noticiaData) => {
  try {
    const response = await apiClient.put(`/api/noticias/${id}`, noticiaData)
    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.error || "Error al actualizar noticia")
    }
  } catch (error) {
    console.error("Error en actualizarNoticia:", error)
    if (error.response) {
      const errorMessage =
        error.response.data?.error || error.response.data?.message || `Error ${error.response.status}`
      throw new Error(errorMessage)
    } else if (error.request) {
      throw new Error("No se pudo conectar con el servidor")
    } else {
      throw new Error(error.message || "Error desconocido")
    }
  }
}

// Eliminar noticia
export const eliminarNoticia = async (id) => {
  try {
    const response = await apiClient.delete(`/api/noticias/${id}`)
    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.error || "Error al eliminar noticia")
    }
  } catch (error) {
    console.error("Error en eliminarNoticia:", error)
    if (error.response) {
      const errorMessage =
        error.response.data?.error || error.response.data?.message || `Error ${error.response.status}`
      throw new Error(errorMessage)
    } else if (error.request) {
      throw new Error("No se pudo conectar con el servidor")
    } else {
      throw new Error(error.message || "Error desconocido")
    }
  }
}
