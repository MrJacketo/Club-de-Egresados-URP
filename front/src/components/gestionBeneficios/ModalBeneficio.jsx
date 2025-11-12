"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

const TIPOS_BENEFICIO = {
  ACADEMICO: "academico",
  LABORAL: "laboral", 
  SALUD: "salud",
  CULTURAL: "cultural",
  CONVENIO: "convenio"
}

const ESTADOS_BENEFICIO = {
  ACTIVO: "activo",
  INACTIVO: "inactivo"
}

const ModalBeneficio = ({ isOpen, onClose, onSubmit, beneficio = null, loading }) => {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    tipo_beneficio: "academico",
    empresa_asociada: "",
    fecha_inicio: new Date().toISOString().split("T")[0],
    fecha_fin: "",
    estado: "activo",
    url_detalle: "",
    imagen_beneficio: "",
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (beneficio) {
      setFormData({
        titulo: beneficio.titulo || "",
        descripcion: beneficio.descripcion || "",
        tipo_beneficio: beneficio.tipo_beneficio || "academico",
        empresa_asociada: beneficio.empresa_asociada || "",
        fecha_inicio: beneficio.fecha_inicio || new Date().toISOString().split("T")[0],
        fecha_fin: beneficio.fecha_fin || "",
        estado: beneficio.estado || "activo",
        url_detalle: beneficio.url_detalle || "",
        imagen_beneficio: beneficio.imagen_beneficio || "",
      })
    } else {
      setFormData({
        titulo: "",
        descripcion: "",
        tipo_beneficio: "academico",
        empresa_asociada: "",
        fecha_inicio: new Date().toISOString().split("T")[0],
        fecha_fin: "",
        estado: "activo",
        url_detalle: "",
        imagen_beneficio: "",
      })
    }
    setErrors({})
  }, [beneficio, isOpen])

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

  const validarFormulario = () => {
    const nuevosErrores = {}

    if (!formData.titulo.trim()) {
      nuevosErrores.titulo = "El título es obligatorio"
    }

    if (!formData.descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción es obligatoria"
    }

    if (!formData.tipo_beneficio) {
      nuevosErrores.tipo_beneficio = "El tipo de beneficio es obligatorio"
    }

    if (!formData.fecha_inicio) {
      nuevosErrores.fecha_inicio = "La fecha de inicio es obligatoria"
    }

    setErrors(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed! inset-0! backdrop-blur-sm! bg-black/20! flex! items-center! justify-center! z-50! p-4!">
      <div className="bg-white! rounded-2xl! max-w-6xl! w-full! max-h-[90vh]! overflow-y-auto! shadow-2xl!">
        {/* Header */}
        <div className="flex! items-center! justify-between! p-6! border-b! border-gray-200! sticky! top-0! z-10! bg-white! rounded-t-2xl!" style={{ background: 'linear-gradient(135deg, #00C853, #00E676)' }}>
          <h2 className="text-2xl! font-bold! text-white!">
            {beneficio ? "Editar Beneficio" : "Nuevo Beneficio"}
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
              Título del Beneficio
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => handleInputChange("titulo", e.target.value)}
              placeholder="Ingrese un título llamativo para el beneficio"
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
              {/* Tipo de Beneficio */}
              <div>
                <label className="block! text-sm! font-bold! text-gray-700! mb-2!">
                  Tipo de Beneficio
                </label>
                <select
                  value={formData.tipo_beneficio}
                  onChange={(e) =>
                    handleInputChange("tipo_beneficio", e.target.value)
                  }
                  className={`w-full! px-4! py-3! border-2! rounded-xl! focus:ring-2! focus:ring-green-500! focus:border-green-500! bg-white! text-gray-900! transition-all! duration-300! ${
                    errors.tipo_beneficio ? "border-red-500!" : "border-gray-300!"
                  }`}
                  style={{ outline: 'none' }}
                >
                  <option value="" className="text-gray-400!">
                    Seleccione un Tipo
                  </option>
                  {Object.values(TIPOS_BENEFICIO).map((tipo) => (
                    <option
                      key={tipo}
                      value={tipo}
                      className="text-gray-900!"
                    >
                      {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.tipo_beneficio && (
                  <p className="text-red-500! text-sm! mt-1! font-medium!">
                    {errors.tipo_beneficio}
                  </p>
                )}
              </div>

              {/* Estado */}
              <div>
                <label className="block! text-sm! font-bold! text-gray-700! mb-2!">
                  Estado del Beneficio
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) =>
                    handleInputChange("estado", e.target.value)
                  }
                  className="w-full! px-4! py-3! border-2! rounded-xl! focus:ring-2! focus:ring-green-500! focus:border-green-500! bg-white! text-gray-900! transition-all! duration-300! border-gray-300!"
                  style={{ outline: 'none' }}
                >
                  {Object.values(ESTADOS_BENEFICIO).map((estado) => (
                    <option key={estado} value={estado} className="text-gray-900!">
                      {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha de Inicio */}
              <div>
                <label className="block! text-sm! font-bold! text-gray-700! mb-2!">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  value={formData.fecha_inicio}
                  onChange={(e) =>
                    handleInputChange("fecha_inicio", e.target.value)
                  }
                  className={`w-full! px-4! py-3! border-2! rounded-xl! focus:ring-2! focus:ring-green-500! focus:border-green-500! text-gray-900! transition-all! duration-300! ${
                    errors.fecha_inicio
                      ? "border-red-500!"
                      : "border-gray-300!"
                  }`}
                  style={{ colorScheme: "light", outline: 'none' }}
                />
                {errors.fecha_inicio && (
                  <p className="text-red-500! text-sm! mt-1! font-medium!">
                    {errors.fecha_inicio}
                  </p>
                )}
              </div>

              {/* Fecha de Fin */}
              <div>
                <label className="block! text-sm! font-bold! text-gray-700! mb-2!">
                  Fecha de Fin (Opcional)
                </label>
                <input
                  type="date"
                  value={formData.fecha_fin}
                  onChange={(e) =>
                    handleInputChange("fecha_fin", e.target.value)
                  }
                  className="w-full! px-4! py-3! border-2! rounded-xl! focus:ring-2! focus:ring-green-500! focus:border-green-500! text-gray-900! transition-all! duration-300! border-gray-300!"
                  style={{ colorScheme: "light", outline: 'none' }}
                />
              </div>
            </div>

            {/* Columna central - Campos medianos */}
            <div className="space-y-6!">
              {/* Empresa Asociada */}
              <div>
                <label className="block! text-sm! font-bold! text-gray-700! mb-2!">
                  Empresa Asociada
                </label>
                <input
                  type="text"
                  value={formData.empresa_asociada}
                  onChange={(e) => handleInputChange("empresa_asociada", e.target.value)}
                  placeholder="Ej: Coursera, Netflix, Amazon"
                  className="w-full! px-4! py-3! border-2! rounded-xl! focus:ring-2! focus:ring-green-500! focus:border-green-500! text-gray-900! placeholder-gray-400! transition-all! duration-300! border-gray-300!"
                  style={{ outline: 'none' }}
                />
              </div>

              {/* URL Detalle / Código */}
              <div>
                <label className="block! text-sm! font-bold! text-gray-700! mb-2!">
                  URL Detalle / Código de Descuento
                </label>
                <input
                  type="text"
                  value={formData.url_detalle}
                  onChange={(e) => handleInputChange("url_detalle", e.target.value)}
                  placeholder="https://ejemplo.com o CODIGO20"
                  className="w-full! px-4! py-3! border-2! rounded-xl! focus:ring-2! focus:ring-green-500! focus:border-green-500! text-gray-900! placeholder-gray-400! transition-all! duration-300! border-gray-300!"
                  style={{ outline: 'none' }}
                />
              </div>

              {/* Imagen del Beneficio */}
              <div>
                <label className="block! text-sm! font-bold! text-gray-700! mb-2!">
                  Imagen del Beneficio (URL)
                </label>
                <input
                  type="url"
                  value={formData.imagen_beneficio}
                  onChange={(e) => handleInputChange("imagen_beneficio", e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full! px-4! py-3! border-2! rounded-xl! focus:ring-2! focus:ring-green-500! focus:border-green-500! text-gray-900! placeholder-gray-400! transition-all! duration-300! border-gray-300!"
                  style={{ outline: 'none' }}
                />
                {formData.imagen_beneficio && (
                  <div className="mt-3! border! border-gray-300! rounded-xl! p-2! bg-gray-50!">
                    <img
                      src={formData.imagen_beneficio}
                      alt="Preview del beneficio"
                      className="w-full! h-32! object-cover! rounded-lg!"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="text-center! text-gray-500! text-sm! py-8!" style={{ display: 'none' }}>
                      URL de imagen inválida
                    </div>
                  </div>
                )}
                <p className="text-xs! text-gray-500! mt-2!">
                  Ingresa la URL completa de una imagen (JPG, PNG, etc.)
                </p>
              </div>
            </div>

            {/* Columna derecha - Descripción */}
            <div className="space-y-6!">
              {/* Descripción del Beneficio */}
              <div>
                <label className="block! text-sm! font-bold! text-gray-700! mb-2!">
                  Descripción del Beneficio
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) =>
                    handleInputChange("descripcion", e.target.value)
                  }
                  placeholder="Describe detalladamente en qué consiste este beneficio, cómo se puede usar, restricciones, etc."
                  rows={20}
                  className={`w-full! px-5! py-4! border-2! rounded-xl! focus:ring-2! focus:ring-green-500! focus:border-green-500! resize-none! text-gray-900! placeholder-gray-400! transition-all! duration-300! text-sm! ${
                    errors.descripcion ? "border-red-500!" : "border-gray-300!"
                  }`}
                  style={{ outline: 'none' }}
                />
                {errors.descripcion && (
                  <p className="text-red-500! text-sm! mt-2! font-medium!">
                    {errors.descripcion}
                  </p>
                )}
                <p className="text-xs! text-gray-500! mt-2!">
                  Caracteres: {formData.descripcion.length}
                </p>
              </div>
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
              style={{ background: '#00C853', border: 'none' }}
            > 
              {loading && (
                <div className="animate-spin! rounded-full! h-5! w-5! border-b-2! border-white! mr-2!"></div>
              )}
              {beneficio ? "Actualizar Beneficio" : "Crear Beneficio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalBeneficio