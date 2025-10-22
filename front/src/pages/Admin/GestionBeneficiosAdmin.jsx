import { useState, useEffect } from "react"
import { Plus, AlertCircle, CheckCircle, Star, Gift, TrendingUp, FileText, Archive, Edit, Trash2 } from "lucide-react"
import { getBeneficiosAdmin, createBeneficio, updateBeneficio, deleteBeneficio } from '../../api/gestionarBeneficiosApi'
import ModalBeneficio from "../../components/gestionBeneficios/ModalBeneficio"
import ModalConfirmacion from "../../components/gestionBeneficios/ModalConfirmacion"
import AdminSidebar from '../../components/AdminSidebar';
import { AdminSidebarProvider, useAdminSidebar } from '../../context/adminSidebarContext';

// Componente contenedor con el Provider
const GestionBeneficios = () => {
  return (
    <AdminSidebarProvider>
      <GestionBeneficiosContent />
    </AdminSidebarProvider>
  );
};

// Componente principal con acceso al contexto
const GestionBeneficiosContent = () => {
  const { collapsed } = useAdminSidebar();
  
  const [beneficios, setBeneficios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [modalBeneficioAbierto, setModalBeneficioAbierto] = useState(false)
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false)
  const [beneficioSeleccionado, setBeneficioSeleccionado] = useState(null)
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" })

  // Cargar beneficios
  useEffect(() => {
    fetchBeneficios();
  }, []);

  const fetchBeneficios = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getBeneficiosAdmin();
      const normalized = (data || []).map((b) => ({
        _id: b._id || b.id,
        titulo: b.titulo || b.nombre || '',
        descripcion: b.descripcion || b.detalle || '',
        tipo_beneficio: b.tipo_beneficio || b.tipo || 'academico',
        empresa_asociada: b.empresa_asociada || '',
        fecha_inicio: b.fecha_inicio ? new Date(b.fecha_inicio).toISOString().slice(0,10) : '',
        fecha_fin: b.fecha_fin ? new Date(b.fecha_fin).toISOString().slice(0,10) : '',
        estado: b.estado || 'activo',
        url_detalle: b.url_detalle || '',
        imagen_beneficio: b.imagen_beneficio || '',
        fechaCreacion: b.fechaCreacion || b.createdAt || new Date(),
      }));
      setBeneficios(normalized);
    } catch (err) {
      console.error('error fetching beneficios', err);
      setError("Error al cargar los beneficios");
      setBeneficios([]);
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas
  const totalBeneficios = beneficios.length
  const beneficiosActivos = beneficios.filter(b => b.estado === "activo").length
  const beneficiosInactivos = beneficios.filter(b => b.estado === "inactivo").length
  const beneficiosAcademicos = beneficios.filter(b => b.tipo_beneficio === "academico").length
  const activosRate = totalBeneficios > 0 ? ((beneficiosActivos / totalBeneficios) * 100).toFixed(1) : 0

  // Manejar creación de nuevo beneficio
  const handleNuevoBeneficio = () => {
    setBeneficioSeleccionado(null)
    setModalBeneficioAbierto(true)
  }

  // Manejar edición de beneficio
  const handleEditarBeneficio = (beneficio) => {
    setBeneficioSeleccionado(beneficio)
    setModalBeneficioAbierto(true)
  }

  // Manejar eliminación de beneficio
  const handleEliminarBeneficio = (beneficio) => {
    setBeneficioSeleccionado(beneficio)
    setModalConfirmacionAbierto(true)
  }

  // Manejar envío del formulario
  const handleSubmitBeneficio = async (formData) => {
    try {
      let resultado
      if (beneficioSeleccionado) {
        resultado = await updateBeneficio(beneficioSeleccionado._id, formData)
      } else {
        resultado = await createBeneficio(formData)
      }

      if (resultado.success) {
        setMensaje({ tipo: "success", texto: beneficioSeleccionado ? "Beneficio actualizado exitosamente" : "Beneficio creado exitosamente" })
        setModalBeneficioAbierto(false)
        setBeneficioSeleccionado(null)
        await fetchBeneficios()

        // Limpiar mensaje después de 5 segundos
        setTimeout(() => setMensaje({ tipo: "", texto: "" }), 5000)
      } else {
        setMensaje({ tipo: "error", texto: resultado.message || "Error al procesar el beneficio" })
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje({ tipo: "error", texto: error.response?.data?.message || error.message || "Error inesperado al procesar el beneficio" })
    }
  }

  // Confirmar eliminación
  const handleConfirmarEliminacion = async () => {
    try {
      const resultado = await deleteBeneficio(beneficioSeleccionado._id)

      if (resultado.success) {
        setMensaje({ tipo: "success", texto: "Beneficio eliminado exitosamente" })
        setModalConfirmacionAbierto(false)
        setBeneficioSeleccionado(null)
        await fetchBeneficios()

        // Limpiar mensaje después de 5 segundos
        setTimeout(() => setMensaje({ tipo: "", texto: "" }), 5000)
      } else {
        setMensaje({ tipo: "error", texto: resultado.message || "Error al eliminar el beneficio" })
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje({ tipo: "error", texto: "Error inesperado al eliminar el beneficio" })
    }
  }
  
  return (
    <div className="flex min-h-screen pt-12" style={{ background: 'linear-gradient(to bottom right, #f9fafb, #ffffff)' }}>
      <AdminSidebar />
      <div className={`flex-1 transition-all duration-300 py-8 px-8 ${
          collapsed ? "ml-20" : "ml-64"
        }`}>
        
          {/* Header de la página */}
          <div className="flex flex-wrap items-center justify-between mb-8">
            <h1 className="text-5xl! font-bold! mb-2!">
              <span className="bg-gradient-to-r! from-green-500! to-teal-500! bg-clip-text! text-transparent!">
                Gestión de Beneficios
              </span>
            </h1>
            <button
              onClick={handleNuevoBeneficio}
              className="flex! items-center! px-6! py-3! text-white! rounded-full! font-bold! transition-all! duration-300! hover:scale-110! transform! hover:-translate-y-1!"
              style={{ 
                background: 'linear-gradient(135deg, #16a34a, #14b8a6)',
                border: 'none'
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Nuevo Beneficio
            </button>
          </div>

          {/* Métricas estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-xl">
                  <Gift style={{ fontSize: 32, color: '#fff' }} />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp style={{ fontSize: 20 }} />
                  <span className="text-sm font-bold">100%</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Beneficios</p>
              <p className="text-4xl font-bold text-gray-800">{totalBeneficios}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-4 rounded-xl">
                  <Star style={{ fontSize: 32, color: '#16a34a' }} />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp style={{ fontSize: 20 }} />
                  <span className="text-sm font-bold">{activosRate}%</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Beneficios Activos</p>
              <p className="text-4xl font-bold text-gray-800">{beneficiosActivos}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gray-100 p-4 rounded-xl">
                  <FileText style={{ fontSize: 32, color: '#6b7280' }} />
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <TrendingUp style={{ fontSize: 20 }} />
                  <span className="text-sm font-bold">{totalBeneficios > 0 ? ((beneficiosAcademicos / totalBeneficios) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Beneficios Académicos</p>
              <p className="text-4xl font-bold text-gray-800">{beneficiosAcademicos}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-red-100 p-4 rounded-xl">
                  <Archive style={{ fontSize: 32, color: '#dc2626' }} />
                </div>
                <div className="flex items-center gap-1 text-red-600">
                  <TrendingUp style={{ fontSize: 20 }} />
                  <span className="text-sm font-bold">{totalBeneficios > 0 ? ((beneficiosInactivos / totalBeneficios) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Beneficios Inactivos</p>
              <p className="text-4xl font-bold text-gray-800">{beneficiosInactivos}</p>
            </div>
          </div>

          {/* Mensajes de estado */}
          {mensaje.texto && (
            <div
              className={`mb-6! p-4! rounded-xl! flex! items-center! shadow-lg! ${
                mensaje.tipo === "success"
                  ? "bg-green-100! text-green-800! border! border-green-300!"
                  : "bg-red-100! text-red-800! border! border-red-300!"
              }`}
            >
              {mensaje.tipo === "success" ? (
                <CheckCircle className="w-5 h-5 mr-2" style={{ color: '#16a34a' }} />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" style={{ color: '#dc2626' }} />
              )}
              <span className="font-medium!">{mensaje.texto}</span>
            </div>
          )}

          {/* Error general */}
          {error && (
            <div className="mb-6! p-4! bg-red-100! text-red-800! rounded-xl! flex! items-center! border! border-red-300! shadow-lg!">
              <AlertCircle className="w-5 h-5 mr-2" style={{ color: '#dc2626' }} />
              <span className="font-medium!">{error}</span>
            </div>
          )}

          {/* Lista de beneficios */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Lista de Beneficios</h2>
              <p className="text-gray-600 mt-1">Gestiona todos los beneficios disponibles para los egresados</p>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                <p className="text-gray-600 mt-4">Cargando beneficios...</p>
              </div>
            ) : beneficios.length === 0 ? (
              <div className="p-8 text-center">
                <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay beneficios registrados</p>
                <button
                  onClick={handleNuevoBeneficio}
                  className="mt-4 text-green-600 hover:text-green-700 font-medium"
                >
                  Crear el primer beneficio
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {beneficios.map((beneficio) => (
                  <div key={beneficio._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{beneficio.titulo}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            beneficio.estado === 'activo' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {beneficio.estado}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {beneficio.tipo_beneficio}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2 line-clamp-2">{beneficio.descripcion}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {beneficio.empresa_asociada && (
                            <span>🏢 {beneficio.empresa_asociada}</span>
                          )}
                          {beneficio.fecha_inicio && (
                            <span>📅 {beneficio.fecha_inicio}</span>
                          )}
                          {beneficio.url_detalle && (
                            <span>🔗 Enlace disponible</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleEditarBeneficio(beneficio)}
                          className="inline-flex! items-center! gap-2! px-4! py-2! rounded-lg! transition-all! duration-300! hover:shadow-md! hover:scale-105!"
                          style={{ background: '#00C853', border: 'none' }}
                          title="Editar beneficio"
                        >
                          <Edit className="w-4! h-4!" style={{ color: '#fff' }} />
                          <span className="text-white! text-xs! font-bold!">Editar</span>
                        </button>
                        <button
                          onClick={() => handleEliminarBeneficio(beneficio)}
                          className="inline-flex! items-center! gap-2! bg-red-500! px-4! py-2! rounded-lg! transition-all! duration-300! hover:bg-red-600! hover:shadow-md! hover:scale-105!"
                          style={{ border: 'none' }}
                          title="Eliminar beneficio"
                        >
                          <Trash2 className="w-4! h-4!" style={{ color: '#fff' }} />
                          <span className="text-white! text-xs! font-bold!">Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal de beneficio */}
          <ModalBeneficio
            isOpen={modalBeneficioAbierto}
            onClose={() => {
              setModalBeneficioAbierto(false);
              setBeneficioSeleccionado(null);
            }}
            onSubmit={handleSubmitBeneficio}
            beneficio={beneficioSeleccionado}
            loading={loading}
          />

          {/* Modal de confirmación */}
          <ModalConfirmacion
            isOpen={modalConfirmacionAbierto}
            onClose={() => {
              setModalConfirmacionAbierto(false);
              setBeneficioSeleccionado(null);
            }}
            onConfirm={handleConfirmarEliminacion}
            beneficio={beneficioSeleccionado}
            loading={loading}
          />
        
      </div>
    </div>
  );
};

export default GestionBeneficios;
