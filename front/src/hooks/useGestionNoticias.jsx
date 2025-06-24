"use client"

import { useState, useEffect } from "react"
import {
  crearNoticia as apiCrearNoticia,
  obtenerNoticias as apiObtenerNoticias,
  actualizarNoticia as apiActualizarNoticia,
  eliminarNoticia as apiEliminarNoticia
} from "../api/gestionNoticiasApi"
import { MENSAJES } from "../constants/GestionNoticias/GestionNoticias.enum"

export const useGestionNoticias = () => {
  const [noticias, setNoticias] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filtros, setFiltros] = useState({
    titulo: "",
    categoria: "",
    tipo: "",
    estado: "",
  })
  const [paginacion, setPaginacion] = useState({})
  const [success, setSuccess] = useState(null)

  // Cargar noticias
  const cargarNoticias = async (filtrosAplicados = filtros) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiObtenerNoticias(filtrosAplicados)

      if (response.success) {
        setNoticias(response.noticias || [])
        setPaginacion(response.pagination || {})
      } else {
        setNoticias([])
        setError(response.error || "Error al cargar noticias")
      }
    } catch (error) {
      console.error("Error al cargar noticias:", error)
      setNoticias([])
      setError(error.message || "Error al cargar noticias")
    } finally {
      setLoading(false)
    }
  }

  // Crear noticia
  const crearNoticia = async (datosNoticia) => {
    setLoading(true)
    setError(null)
    try {
      console.log("Creando noticia con datos:", datosNoticia)
      const response = await apiCrearNoticia(datosNoticia)
      console.log("Noticia creada exitosamente:", response)
      // Actualizar la lista de noticias
      await cargarNoticias()

      setSuccess("Noticia creada exitosamente")
      return response
    } catch (error) {
      console.error("Error al crear noticia:", error)
      const errorMessage = error.message || "Error al crear la noticia"
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Actualizar noticia
  const actualizarNoticia = async (id, noticiaData) => {
    setLoading(true)
    setError(null)
    try {
      await apiActualizarNoticia(id, noticiaData)
      await cargarNoticias()
      return { success: true, message: MENSAJES.EXITO.ACTUALIZAR }
    } catch (err) {
      setError(MENSAJES.ERROR.ACTUALIZAR)
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Eliminar noticia
  const eliminarNoticia = async (id) => {
    setLoading(true)
    setError(null)
    try {
      await apiEliminarNoticia(id)
      await cargarNoticias()
      return { success: true, message: MENSAJES.EXITO.ELIMINAR }
    } catch (err) {
      setError(MENSAJES.ERROR.ELIMINAR)
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Aplicar filtros
  const aplicarFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros)
  }

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      titulo: "",
      categoria: "",
      tipo: "",
      estado: "",
    })
  }

  useEffect(() => {
    cargarNoticias()
  }, [filtros])

  return {
    noticias,
    loading,
    error,
    filtros,
    crearNoticia,
    actualizarNoticia,
    eliminarNoticia,
    aplicarFiltros,
    limpiarFiltros,
    cargarNoticias,
    paginacion,
    success,
  }
}
