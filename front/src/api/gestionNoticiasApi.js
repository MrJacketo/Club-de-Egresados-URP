import apiClient from "./apiClient"

// Crear nueva noticia
export const crearNoticia = async (noticiaData) => {
  try {
    const response = await apiClient.post("/api/noticias", noticiaData)
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

// Obtener noticias (para administración - con autenticación)
export const obtenerNoticias = async (filtros = {}) => {
  try {
    const params = new URLSearchParams()

    // Agregar paginación por defecto
    if (!filtros.page) params.append("page", "1")
    if (!filtros.limit) params.append("limit", "10")

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

// Obtener noticias públicas (para el frontend - sin autenticación)
export const obtenerNoticiasPublicas = async (categoria = "Todos") => {
  try {
    const params = new URLSearchParams()
    if (categoria && categoria !== "Todos") {
      params.append("categoria", categoria)
    }

    const url = `/api/noticias/public${params.toString() ? `?${params.toString()}` : ''}`
    const response = await apiClient.get(url)

    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.error || "Error al obtener noticias públicas")
    }
  } catch (error) {
    console.error("Error en obtenerNoticiasPublicas:", error)
    
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

// Obtener noticia por ID (para administración - con autenticación)
export const obtenerNoticiaPorId = async (id) => {
  try {
    const response = await apiClient.get(`/api/noticias/${id}`)
    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.error || "Error al obtener noticia")
    }
  } catch (error) {
    console.error("Error en obtenerNoticiaPorId:", error)
    
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

// Obtener noticia pública por ID (para el frontend - sin autenticación)
export const obtenerNoticiaPublicaPorId = async (id) => {
  try {
    const response = await apiClient.get(`/api/noticias/public/${id}`)
    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.error || "Error al obtener noticia")
    }
  } catch (error) {
    console.error("Error en obtenerNoticiaPublicaPorId:", error)
    
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

// Cambiar estado de noticia (Destacado/Normal)
export const cambiarEstadoNoticia = async (id, destacada) => {
  try {
    const response = await apiClient.put(`/api/noticias/${id}`, { destacada })
    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.error || "Error al cambiar estado de noticia")
    }
  } catch (error) {
    console.error("Error en cambiarEstadoNoticia:", error)
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