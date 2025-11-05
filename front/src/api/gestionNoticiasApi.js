import apiClient from "./apiClient"

// Crear nueva noticia
// Crear nueva noticia - VERSIÓN CORREGIDA
export const crearNoticia = async (noticiaData) => {
  try {
    // Verificar si noticiaData es FormData (tiene archivo) o JSON
    let config = {};
    
    if (noticiaData instanceof FormData) {
      // Si es FormData (con archivo), usar multipart/form-data
      config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
    }
    
    const response = await apiClient.post("/api/noticias", noticiaData, config);
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.error || "Error desconocido");
    }
  } catch (error) {
    console.error("Error en crearNoticia:", error);

    if (error.response) {
      const errorMessage =
        error.response.data?.error || error.response.data?.message || `Error ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("No se pudo conectar con el servidor");
    } else {
      throw new Error(error.message || "Error desconocido");
    }
  }
};
// Servir imagen de noticia
const obtenerImagen = async (req, res) => {
  try {
    const { nombreImagen } = req.params;
    
    // Construir la ruta completa a la imagen
    const rutaImagen = path.join(__dirname, '../uploads/noticias', nombreImagen);
    
    // Verificar si la imagen existe
    if (!fs.existsSync(rutaImagen)) {
      return res.status(404).json({
        success: false,
        error: "Imagen no encontrada"
      });
    }
    
    // Determinar el tipo de contenido
    const extension = path.extname(nombreImagen).toLowerCase();
    let contentType = 'image/jpeg'; // por defecto
    
    switch (extension) {
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
    }
    
    // Servir la imagen
    res.setHeader('Content-Type', contentType);
    fs.createReadStream(rutaImagen).pipe(res);
    
  } catch (error) {
    console.error("Error al servir imagen:", error);
    res.status(500).json({
      success: false,
      error: "Error al cargar la imagen"
    });
  }
};
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
    const url = `http://localhost:8000/api/noticias/public?categoria=${categoria}`;
    console.log("🌐 Llamando a la API:", url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log("📡 Respuesta de la API:", data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching noticias:', error);
    return {
      success: false,
      error: 'Error al cargar las noticias'
    };
  }
};

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