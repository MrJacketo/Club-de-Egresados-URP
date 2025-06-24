"use client"

import { useState, useEffect } from "react"
import { X, Upload, Trash2 } from "lucide-react"
import { CATEGORIAS_NOTICIAS, TIPOS_CONTENIDO } from "../../constants/GestionNoticias/GestionNoticias.enum"

const ModalNoticia = ({ isOpen, onClose, onSubmit, noticia = null, loading }) => {
  const [formData, setFormData] = useState({
    titulo: "",
    contenido: "",
    categoria: "",
    tipoContenido: "",
    fechaPublicacion: "",
    destacada: false,
    imagen: null,
  })
  const [previewImagen, setPreviewImagen] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (noticia) {
      setFormData({
        titulo: noticia.titulo || "",
        contenido: noticia.contenido || "",
        categoria: noticia.categoria || "",
        tipoContenido: noticia.tipoContenido || "",
        fechaPublicacion: noticia.fechaPublicacion
          ? new Date(noticia.fechaPublicacion).toISOString().split("T")[0]
          : "",
        destacada: noticia.estado === "Destacado",
        imagen: null,
      })
      if (noticia.imagenUrl) {
        setPreviewImagen(noticia.imagenUrl)
      }
    } else {
      setFormData({
        titulo: "",
        contenido: "",
        categoria: "",
        tipoContenido: "",
        fechaPublicacion: new Date().toISOString().split("T")[0],
        destacada: false,
        imagen: null,
      })
      setPreviewImagen(null)
    }
    setErrors({})
  }, [noticia, isOpen])

  const handleInputChange = (campo, valor) => {
    setFormData((prev) => ({
      ...prev,
      [campo]: valor,
    }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[campo]) {
      setErrors((prev) => ({
        ...prev,
        [campo]: "",
      }))
    }
  }

  const handleImagenChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imagen: file,
      }))

      // Crear preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImagen(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const eliminarImagen = () => {
    setFormData((prev) => ({
      ...prev,
      imagen: null,
    }))
    setPreviewImagen(null)
  }

  const validarFormulario = () => {
    const nuevosErrores = {}

    if (!formData.titulo.trim()) {
      nuevosErrores.titulo = "El título es obligatorio"
    }

    if (!formData.contenido.trim()) {
      nuevosErrores.contenido = "El contenido es obligatorio"
    }

    if (!formData.categoria) {
      nuevosErrores.categoria = "La categoría es obligatoria"
    }

    if (!formData.tipoContenido) {
      nuevosErrores.tipoContenido = "El tipo de contenido es obligatorio"
    }

    if (!formData.fechaPublicacion) {
      nuevosErrores.fechaPublicacion = "La fecha de publicación es obligatoria"
    }

    setErrors(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validarFormulario()) {
      return
    }

    const dataToSubmit = {
      ...formData,
      estado: formData.destacada ? "Destacado" : "Normal",
    }

    onSubmit(dataToSubmit)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-black">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{noticia ? "Editar Noticia" : "Nueva Noticia"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-4">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange("titulo", e.target.value)}
                  placeholder="Ingresar el título de la noticia"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400 ${
                    errors.titulo ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.titulo && <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>}
              </div>

              {/* Contenido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contenido</label>
                <textarea
                  value={formData.contenido}
                  onChange={(e) => handleInputChange("contenido", e.target.value)}
                  placeholder="Ingrese el cuerpo de la noticia"
                  rows={6}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400 ${
                    errors.contenido ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.contenido && <p className="text-red-500 text-sm mt-1">{errors.contenido}</p>}
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => handleInputChange("categoria", e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 ${
                    errors.categoria ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="" className="text-gray-400">Seleccione una Categoría</option>
                  {Object.values(CATEGORIAS_NOTICIAS).map((categoria) => (
                    <option key={categoria} value={categoria} className="text-gray-900">
                      {categoria}
                    </option>
                  ))}
                </select>
                {errors.categoria && <p className="text-red-500 text-sm mt-1">{errors.categoria}</p>}
              </div>

              {/* Tipo de Contenido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Contenido</label>
                <select
                  value={formData.tipoContenido}
                  onChange={(e) => handleInputChange("tipoContenido", e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 ${
                    errors.tipoContenido ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="" className="text-gray-400">Seleccione un Tipo</option>
                  {Object.values(TIPOS_CONTENIDO).map((tipo) => (
                    <option key={tipo} value={tipo} className="text-gray-900">
                      {tipo}
                    </option>
                  ))}
                </select>
                {errors.tipoContenido && <p className="text-red-500 text-sm mt-1">{errors.tipoContenido}</p>}
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-4">

              
              {/* Portada de la Noticia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Portada de la Noticia</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {previewImagen ? (
                    <div className="relative">
                      <img
                        src={previewImagen || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="mt-2 text-sm text-gray-600">
                        1600 x 900px | 240.56 KB
                        <br />
                        imagen_imagen_prueba.png
                      </div>
                      <button
                        type="button"
                        onClick={eliminarImagen}
                        className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Borrar
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" style={{ color: "#9ca3af" }} />
                      <p className="text-gray-600 mb-2">Agregar Portada de la Noticia</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImagenChange}
                        className="hidden"
                        id="imagen-upload"
                      />
                      <label
                        htmlFor="imagen-upload"
                        className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm transition-colors"
                        style={{ background: "#e5e7eb", color: "#222" }}
                      >
                        Seleccionar archivo
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Fecha de Publicación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Publicación</label>
                <input
                  type="date"
                  value={formData.fechaPublicacion}
                  onChange={(e) => handleInputChange("fechaPublicacion", e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 ${
                    errors.fechaPublicacion ? "border-red-500" : "border-gray-300"
                  }`}
                  min={new Date().toISOString().split("T")[0]}
                  style={{ colorScheme: "light" }}
                />
                {errors.fechaPublicacion && <p className="text-red-500 text-sm mt-1">{errors.fechaPublicacion}</p>}
              </div>

              {/* Noticia Destacada */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Noticia Destacada</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="destacada"
                    checked={formData.destacada}
                    onChange={(e) => handleInputChange("destacada", e.target.checked)}
                    className="w-4 h-4 accent-white border-gray-300 rounded focus:ring-green-500 bg-white"
                  />
                  <label htmlFor="destacada" className="ml-2 text-sm text-gray-700">
                    Las noticias destacadas aparecen con mayor importancia
                  </label>
                </div>
              </div>
            </div>
          </div>









          {/* Botones */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
              {noticia ? "Actualizar Noticia" : "Crear Noticia"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalNoticia