"use client"

import { useState, useEffect } from "react"
import { X, Upload, Trash2, Bold, Italic, List, ListOrdered, Link as LinkIcon } from "lucide-react"
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
  const [imagenInfo, setImagenInfo] = useState(null)
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
      setImagenInfo(null)
    }
    setErrors({})
  }, [noticia, isOpen])

  const handleInputChange = (campo, valor) => {
    setFormData((prev) => ({
      ...prev,
      [campo]: valor,
    }))
    if (errors[campo]) {
      setErrors((prev) => ({
        ...prev,
        [campo]: "",
      }))
    }
  }

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          imagen:
            "La imagen supera el límite de 10MB. Selecciona una más liviana.",
        }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        imagen: file,
      }));

      setErrors((prev) => ({
        ...prev,
        imagen: "",
      }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImagen(e.target.result);
        const img = new window.Image();
        img.onload = () => {
          setImagenInfo({
            width: img.width,
            height: img.height,
            size: file.size,
            name: file.name,
            type: file.type,
          });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const eliminarImagen = () => {
    setFormData((prev) => ({
      ...prev,
      imagen: null,
    }))
    setPreviewImagen(null)
    setImagenInfo(null)
  }

  const insertarFormato = (tipo) => {
    const textarea = document.getElementById('contenido-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.contenido.substring(start, end);
    let newText = formData.contenido;
    
    switch(tipo) {
      case 'bold':
        newText = formData.contenido.substring(0, start) + `**${selectedText}**` + formData.contenido.substring(end);
        break;
      case 'italic':
        newText = formData.contenido.substring(0, start) + `*${selectedText}*` + formData.contenido.substring(end);
        break;
      case 'list':
        newText = formData.contenido.substring(0, start) + `\n• ${selectedText}` + formData.contenido.substring(end);
        break;
      case 'ordered':
        newText = formData.contenido.substring(0, start) + `\n1. ${selectedText}` + formData.contenido.substring(end);
        break;
      case 'link':
        newText = formData.contenido.substring(0, start) + `[${selectedText}](url)` + formData.contenido.substring(end);
        break;
    }
    
    handleInputChange('contenido', newText);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    let imagenUrl = noticia?.imagenUrl || null;
    if (formData.imagen) {
      imagenUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(formData.imagen);
      });
    }
    onSubmit({
      ...formData,
      imagenUrl,
      imagen: undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed! inset-0! backdrop-blur-sm! bg-black/20! flex! items-center! justify-center! z-50! p-4!">
      <div className="bg-white! rounded-2xl! max-w-6xl! w-full! max-h-[90vh]! overflow-y-auto! shadow-2xl!">
        {/* Header */}
        <div className="flex! items-center! justify-between! p-6! border-b! border-gray-200! sticky! top-0! z-10! rounded-t-2xl! bg-[#01a83c]!" >
          <h2 className="text-2xl! font-bold! text-white!">
            {noticia ? "Editar Noticia" : "Nueva Noticia"}
          </h2>
          <button
            onClick={onClose}
            className="text-white! hover:bg-white/20! transition-all! duration-300! rounded-full! p-2!"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8!">
          {/* Título - Full Width */}
          <div className="mb-6!">
            <label className="block! text-base! font-bold! text-gray-700! mb-3!">
              Título de la Noticia
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => handleInputChange("titulo", e.target.value)}
              placeholder="Ingrese un título llamativo para la noticia"
              className={`w-full! px-5! py-4! border-2! rounded-xl! focus:ring-2! focus:ring-green-500! focus:border-green-500! text-gray-900! placeholder-gray-400! transition-all! duration-300! text-lg! ${
                errors.titulo ? "border-red-500!" : "border-gray-300!"
              }`}
              style={{ outline: 'none' }}
            />
            {errors.titulo && (
              <p className="text-red-500! text-sm! mt-2! font-medium!">{errors.titulo}</p>
            )}
          </div>

          <div className="grid! grid-cols-1! lg:grid-cols-3! gap-6! mb-6!">
            {/* Columna izquierda - Campos pequeños */}
            <div className="space-y-6!">
              {/* Categoría */}
              <div>
                <label className="block! text-sm! font-bold! text-gray-700! mb-2!">
                  Categoría
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) =>
                    handleInputChange("categoria", e.target.value)
                  }
                  className={`w-full! px-4! py-3! border-2! rounded-xl! focus:ring-2! focus:ring-green-500! focus:border-green-500! bg-white! text-gray-900! transition-all! duration-300! ${
                    errors.categoria ? "border-red-500!" : "border-gray-300!"
                  }`}
                  style={{ outline: 'none' }}
                >
                  <option value="" className="text-gray-400!">
                    Seleccione una Categoría
                  </option>
                  {Object.values(CATEGORIAS_NOTICIAS).map((categoria) => (
                    <option
                      key={categoria}
                      value={categoria}
                      className="text-gray-900!"
                    >
                      {categoria}
                    </option>
                  ))}
                </select>
                {errors.categoria && (
                  <p className="text-red-500! text-sm! mt-1! font-medium!">
                    {errors.categoria}
                  </p>
                )}
              </div>

              {/* Tipo de Contenido */}
              <div>
                <label className="block! text-sm! font-bold! text-gray-700! mb-2!">
                  Tipo de Contenido
                </label>
                <select
                  value={formData.tipoContenido}
                  onChange={(e) =>
                    handleInputChange("tipoContenido", e.target.value)
                  }
                  className={`w-full! px-4! py-3! border-2! rounded-xl! focus:ring-2! focus:ring-green-500! focus:border-green-500! bg-white! text-gray-900! transition-all! duration-300! ${
                    errors.tipoContenido ? "border-red-500!" : "border-gray-300!"
                  }`}
                  style={{ outline: 'none' }}
                >
                  <option value="" className="text-gray-400!">
                    Seleccione un Tipo
                  </option>
                  {Object.values(TIPOS_CONTENIDO).map((tipo) => (
                    <option key={tipo} value={tipo} className="text-gray-900!">
                      {tipo}
                    </option>
                  ))}
                </select>
                {errors.tipoContenido && (
                  <p className="text-red-500! text-sm! mt-1! font-medium!">
                    {errors.tipoContenido}
                  </p>
                )}
              </div>

              {/* Fecha de Publicación */}
              <div>
                <label className="block! text-sm! font-bold! text-gray-700! mb-2!">
                  Fecha de Publicación
                </label>
                <input
                  type="date"
                  value={formData.fechaPublicacion}
                  onChange={(e) =>
                    handleInputChange("fechaPublicacion", e.target.value)
                  }
                  className={`w-full! px-4! py-3! border-2! rounded-xl! focus:ring-2! focus:ring-green-500! focus:border-green-500! text-gray-900! transition-all! duration-300! ${
                    errors.fechaPublicacion
                      ? "border-red-500!"
                      : "border-gray-300!"
                  }`}
                  min={new Date().toISOString().split("T")[0]}
                  style={{ colorScheme: "light", outline: 'none' }}
                />
                {errors.fechaPublicacion && (
                  <p className="text-red-500! text-sm! mt-1! font-medium!">
                    {errors.fechaPublicacion}
                  </p>
                )}
              </div>

              {/* Noticia Destacada */}
              <div className="bg-[#f0fdf4]! border-2! border-green-200! rounded-xl! p-4!">
                <label className="block! text-sm! font-bold! text-gray-700! mb-3!">
                  Noticia Destacada
                </label>
                <div className="flex! items-center!">
                  <input
                    type="checkbox"
                    id="destacada"
                    checked={formData.destacada}
                    onChange={(e) =>
                      handleInputChange("destacada", e.target.checked)
                    }
                    className="w-5! h-5! rounded! focus:ring-green-500! border-gray-300!"
                    style={{ accentColor: '#00C853' }}
                  />
                  <label
                    htmlFor="destacada"
                    className="ml-3! text-sm! text-gray-700! font-medium!"
                  >
                    Marcar como destacada
                  </label>
                </div>
                <p className="text-xs! text-gray-600! mt-2!">
                  Las noticias destacadas aparecen con mayor prominencia
                </p>
              </div>

              {/* Portada de la Noticia */}
              <div>
                <label className="block! text-sm! font-bold! text-gray-700! mb-2!">
                  Portada de la Noticia
                </label>
                <div className="border-2! border-dashed! border-gray-300! rounded-xl! p-4! bg-gray-50! transition-all! duration-300! hover:border-green-500!">
                  {previewImagen ? (
                    <div className="relative!">
                      <img
                        src={previewImagen || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full! h-40! object-cover! rounded-xl! shadow-md!"
                      />
                      <div className="mt-2! text-xs! text-gray-600! bg-white! p-2! rounded-lg!">
                        {imagenInfo ? (
                          <>
                            {imagenInfo.width} x {imagenInfo.height} px | {imagenInfo.size / 1024 < 1024
                              ? `${(imagenInfo.size / 1024).toFixed(2)} KB`
                              : `${(imagenInfo.size / 1024 / 1024).toFixed(2)} MB`}
                          </>
                        ) : (
                          "Cargando..."
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={eliminarImagen}
                        className="mt-2! bg-red-500! text-white! px-3! py-2! rounded-lg! text-xs! hover:bg-red-600! transition-all! duration-300! flex! items-center! w-full! justify-center!"
                        style={{ border: 'none' }}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Eliminar imagen
                      </button>
                    </div>
                  ) : (
                    <div className="text-center!">
                      <Upload
                        className="w-10! h-10! mx-auto! mb-2!"
                        style={{ color: '#00C853' }}
                      />
                      <p className="text-gray-700! mb-2! font-medium! text-sm!">
                        Agregar Portada
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImagenChange}
                        className="hidden!"
                        id="imagen-upload"
                      />
                      <label
                        htmlFor="imagen-upload"
                        className="cursor-pointer! px-4! py-2! rounded-lg! text-xs! font-bold! transition-all! duration-300! inline-block! hover:shadow-lg!"
                        style={{ background: '#01a83c', color: '#fff', border: 'none' }}
                      >
                        Seleccionar
                      </label>
                    </div>
                  )}
                  <div className="text-xs! text-gray-500! mt-2! text-center!">
                    Máx: 10MB | JPG, PNG
                  </div>
                  {errors.imagen && (
                    <div className="text-red-500! text-xs! mt-2! font-medium! bg-red-50! p-2! rounded-lg! text-center!">
                      {errors.imagen}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Columna derecha - Contenido (2 columnas) */}
            <div className="lg:col-span-2!">
              <label className="block! text-sm! font-bold! text-gray-700! mb-2!">
                Contenido de la Noticia
              </label>
              
              {/* Barra de herramientas de formato */}
              <div className="flex gap-2 mb-3 p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                <button
                  type="button"
                  onClick={() => insertarFormato('bold')}
                  className="p-2! bg-gray-100! hover:bg-white! rounded-lg! transition-all! duration-300! border! border-gray-300!"
                  title="Negrita"
                  style={{ border: '1px solid #d1d5db' }}
                >
                  <Bold className="w-4 h-4 text-gray-700!" />
                </button>
                <button
                  type="button"
                  onClick={() => insertarFormato('italic')}
                  className="p-2! bg-gray-100! hover:bg-white! rounded-lg! transition-all! duration-300! border! border-gray-300!"
                  title="Cursiva"
                  style={{ border: '1px solid #d1d5db' }}
                >
                  <Italic className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  type="button"
                  onClick={() => insertarFormato('list')}
                  className="p-2! bg-gray-100! hover:bg-white! rounded-lg! transition-all! duration-300! border! border-gray-300!"
                  title="Lista"
                  style={{ border: '1px solid #d1d5db' }}
                >
                  <List className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  type="button"
                  onClick={() => insertarFormato('ordered')}
                  className="p-2! bg-gray-100! hover:bg-white! rounded-lg! transition-all! duration-300! border! border-gray-300!"
                  title="Lista numerada"
                  style={{ border: '1px solid #d1d5db' }}
                >
                  <ListOrdered className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  type="button"
                  onClick={() => insertarFormato('link')}
                  className="p-2! bg-gray-100! hover:bg-white! rounded-lg! transition-all! duration-300! border! border-gray-300!"
                  title="Enlace"
                  style={{ border: '1px solid #d1d5db' }}
                >
                  <LinkIcon className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              <textarea
                id="contenido-textarea"
                value={formData.contenido}
                onChange={(e) =>
                  handleInputChange("contenido", e.target.value)
                }
                placeholder="Escribe aquí el contenido completo de tu noticia...&#10;&#10;Puedes usar formato markdown:&#10;**Negrita** *Cursiva* [Enlaces](url)&#10;• Listas&#10;1. Listas numeradas"
                rows={20}
                className={`w-full! px-5! py-4! border-2! rounded-xl! focus:ring-2! focus:ring-green-500! focus:border-green-500! resize-none! text-gray-900! placeholder-gray-400! transition-all! duration-300! font-mono! text-sm! ${
                  errors.contenido ? "border-red-500!" : "border-gray-300!"
                }`}
                style={{ outline: 'none' }}
              />
              {errors.contenido && (
                <p className="text-red-500! text-sm! mt-2! font-medium!">
                  {errors.contenido}
                </p>
              )}
              <p className="text-xs! text-gray-500! mt-2!">
                Caracteres: {formData.contenido.length}
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex! justify-end! space-x-4! pt-6! border-t-2! border-gray-200!">
            <button
              type="button"
              onClick={onClose}
              className="px-8! py-3! border-2! bg-gray-100! border-gray-300! rounded-xl! text-gray-700! font-bold! hover:bg-gray-50! transition-all! duration-300! hover:shadow-md!"
              disabled={loading}
              style={{ border: '2px solid #d1d5db' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8! py-3! text-white! rounded-xl! font-bold! transition-all! duration-300! disabled:opacity-50! disabled:cursor-not-allowed! flex! items-center! hover:shadow-xl!"
              style={{ background: '#01a83c', border: 'none' }}
            > 
              {loading && (
                <div className="animate-spin! rounded-full! h-5! w-5! border-b-2! border-white! mr-2!"></div>
              )}
              {noticia ? "Actualizar Noticia" : "Crear Noticia"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalNoticia