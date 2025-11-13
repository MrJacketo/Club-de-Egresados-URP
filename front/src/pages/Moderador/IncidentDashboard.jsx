import React, { useState } from "react";
import ModeradorSidebar from '../Egresado/components/moderadorSidebar';
import { ModeradorSidebarProvider, useModeradorSidebar } from '../../context/moderadorSidebarContext';
import { AlertTriangle, CheckCircle, Search,Eye,EyeOff,User,Calendar,Download,FileText,CheckSquare,XCircle,Hourglass,} from 'lucide-react';
import IncidentModal from "../../components/IncidentesLaborales/IncidentModal";

const IncidentDashboardContent = () => {
  const { collapsed } = useModeradorSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroTipo, setFiltroTipo] = useState('Todos los tipos');
  const [orden, setOrden] = useState('Mas recientes');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [incidenteSeleccionado, setIncidenteSeleccionado] = useState(null);
  
  // Estado para los incidentes 
  const [incidentsData, setIncidentsData] = useState([
    {
      id: 1,
      tipo: "Información engañosa",
      reportado_por: "Maria Cristina",
      email: "m.cris@gmail.com",
      fecha: "07/10/2023",
      estado: "En revisión",
      descripcion: "El salario anunciado no coincide con la oferta real, prometían $16.5 pero ofrecen $6.0",
      complejidad: "Alta",
      oculto: false,
      eliminado: false
    },
    {
      id: 2,
      tipo: "Descripción poco clara",
      reportado_por: "John Doe",
      email: "j.doe@sunmplc.com",
      fecha: "07/11/2023",
      estado: "En revisión",
      descripcion: "Las responsabilidades del puesto están mal definidas y son ambiguas",
      complejidad: "Media",
      oculto: false,
      eliminado: false
    },
    {
      id: 3,
      tipo: "Empresa no verificada",
      reportado_por: "Ana Rodriguez",
      email: "a.rodriguez@sunmplc.com",
      fecha: "07/12/2023",
      estado: "En revisión",
      descripcion: "La empresa no aparece en registros oficiales y tiene datos contradictorios",
      complejidad: "Alta",
      oculto: false,
      eliminado: false
    },
    {
      id: 4,
      tipo: "Discriminación",
      reportado_por: "Carlos Santos",
      email: "c.santos@sunmplc.com",
      fecha: "07/11/2023",
      estado: "Revisado",
      descripcion: "La oferta excluye candidatos por edad de manera explícita",
      complejidad: "Alta",
      oculto: false,
      eliminado: false
    },
    {
      id: 5,
      tipo: "Enlaces rotos",
      reportado_por: "Beth Chris",
      email: "b.chris@sunmplc.com",
      fecha: "07/10/2023",
      estado: "En revisión",
      descripcion: "Los links para aplicar a la posición redirigen a páginas que no existen",
      complejidad: "Baja",
      oculto: false,
      eliminado: false
    }
  ]);

  // Función para actualizar un incidente
  const handleIncidentUpdate = (updatedIncident) => {
    setIncidentsData(prevData => 
      prevData.map(incident => 
        incident.id === updatedIncident.id 
          ? { ...incident, ...updatedIncident }
          : incident
      )
    );
  };

  // Función para ocultar un incidente
  const handleOcultarIncidente = (incidentId) => {
    if (window.confirm("¿Estás seguro de que quieres ocultar este incidente?")) {
      setIncidentsData(prevData =>
        prevData.map(incident =>
          incident.id === incidentId
            ? { ...incident, oculto: true }
            : incident
        )
      );
      alert("✅ Incidente ocultado correctamente");
    }
  };

  // Función para eliminar un incidente
  const handleEliminarIncidente = (incidentId) => {
    if (window.confirm("¿Estás seguro de que quieres ELIMINAR permanentemente este incidente? Esta acción no se puede deshacer.")) {
      setIncidentsData(prevData =>
        prevData.map(incident =>
          incident.id === incidentId
            ? { ...incident, eliminado: true }
            : incident
        )
      );
      alert("🗑️ Incidente eliminado correctamente");
    }
  };

  // Función para mostrar incidentes ocultos
  const handleMostrarIncidente = (incidentId) => {
    setIncidentsData(prevData =>
      prevData.map(incident =>
        incident.id === incidentId
          ? { ...incident, oculto: false }
          : incident
      )
    );
    alert("👁️ Incidente hecho visible nuevamente");
  };

  // Filtrar incidentes basado en el filtro seleccionado
  const getFilteredIncidents = () => {
    let filtered = incidentsData.filter(incident => !incident.eliminado);

    // Aplicar filtro de estado
    if (filtroEstado === 'Ocultos') {
      filtered = filtered.filter(incident => incident.oculto);
    } else if (filtroEstado !== 'Todos') {
      filtered = filtered.filter(incident => incident.estado === filtroEstado && !incident.oculto);
    } else {
      filtered = filtered.filter(incident => !incident.oculto);
    }

    // Aplicar filtro de tipo
    if (filtroTipo !== 'Todos los tipos') {
      filtered = filtered.filter(incident => incident.tipo === filtroTipo);
    }

    // Aplicar búsqueda
    if (searchTerm) {
      filtered = filtered.filter(incident =>
        incident.reportado_por.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredIncidents = getFilteredIncidents();

  // Funciones auxiliares actualizadas
  const getStatusColor = (estado) => {
    switch (estado) {
      case 'En revisión': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Revisado': return 'bg-green-100 text-green-700 border-green-200';
      case 'Ocultos': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSeverityColor = (complejidad) => {
    switch (complejidad) {
      case 'Alta': return 'bg-red-100 text-red-700 border-red-200';
      case 'Media': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Baja': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeColor = (tipo) => {
    switch (tipo) {
      case 'Información engañosa': return 'bg-red-100 text-red-700 border-red-200';
      case 'Empresa no verificada': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Discriminación': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'Estafa laboral': return 'bg-red-100 text-red-700 border-red-200';
      case 'Descripción poco clara': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Enlaces rotos': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Falta de respuesta': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Oferta duplicada': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Contenido inapropiado': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Datos de contacto inválidos': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'Otras Incidencias': return 'bg-teal-100 text-teal-700 border-teal-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-600';
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'orange': return 'bg-orange-100 text-orange-600';
      case 'red': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Función para abrir el modal
  const abrirModal = (incidente) => {
    setIncidenteSeleccionado(incidente);
    setModalAbierto(true);
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setModalAbierto(false);
    setIncidenteSeleccionado(null);
  };

  // Datos para las métricas - ahora se calculan dinámicamente basado en incidentes no ocultos ni eliminados
  const incidentesVisibles = incidentsData.filter(incident => !incident.eliminado && !incident.oculto);
  const totalIncidents = incidentesVisibles.length;
  const enRevisionIncidents = incidentesVisibles.filter(incident => incident.estado === "En revisión").length;
  const revisadoIncidents = incidentesVisibles.filter(incident => incident.estado === "Revisado").length;
  const highSeverityIncidents = incidentesVisibles.filter(incident => incident.complejidad === "Alta").length;

  // Cálculo de porcentajes
  const enRevisionPercentage = totalIncidents > 0 ? ((enRevisionIncidents / totalIncidents) * 100).toFixed(1) : "0";
  const revisadoPercentage = totalIncidents > 0 ? ((revisadoIncidents / totalIncidents) * 100).toFixed(1) : "0";
  const highSeverityPercentage = totalIncidents > 0 ? ((highSeverityIncidents / totalIncidents) * 100).toFixed(1) : "0";

  // Métricas principales
  const mainStats = [
    { 
      title: "Total de Incidentes", 
      value: totalIncidents.toString(), 
      percentage: "100%", 
      icon: <FileText className="w-6 h-6" />,
      color: "blue"
    },
    { 
      title: "En revisión", 
      value: enRevisionIncidents.toString(), 
      percentage: `${enRevisionPercentage}%`, 
      icon: <Hourglass className="w-6 h-6" />,
      color: "orange"
    },
    { 
      title: "Revisados", 
      value: revisadoIncidents.toString(), 
      percentage: `${revisadoPercentage}%`, 
      icon: <CheckSquare className="w-6 h-6" />,
      color: "green"
    },
    { 
      title: "Alta Gravedad", 
      value: highSeverityIncidents.toString(), 
      percentage: `${highSeverityPercentage}%`, 
      icon: <AlertTriangle className="w-6 h-6" />,
      color: "red"
    }
  ];

  const limpiarFiltros = () => {
    setSearchTerm('');
    setFiltroEstado('Todos');
    setFiltroTipo('Todos los tipos');
  };

  // Contadores para incidentes ocultos y eliminados
  const incidentesOcultos = incidentsData.filter(incident => incident.oculto && !incident.eliminado).length;
  const incidentesEliminados = incidentsData.filter(incident => incident.eliminado).length;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-white">
      <ModeradorSidebar />
      
      <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        
        {/* Header */}
        <div className="pt-16 p-8 bg-white shadow-md">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl text-start font-bold mb-2">
              <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                Panel de Incidencias
              </span>
            </h1>
            <p className="text-gray-600 font-medium text-lg mb-6">
              Gestionar e informar sobre incidentes laborales
            </p>
            
            {/* Contadores de incidentes ocultos y eliminados */}
            <div className="flex gap-4 text-sm">
              {incidentesOcultos > 0 && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  {incidentesOcultos} Ocultos
                </span>
              )}
              {incidentesEliminados > 0 && (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
                  {incidentesEliminados} eliminados
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-8">
          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {mainStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${getColorClasses(stat.color)}`}>
                    {stat.icon}
                  </div>
                  <span className="text-sm font-bold text-green-600">{stat.percentage}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 font-medium">{stat.title}</p>
              </div>
            ))}
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Barra de búsqueda */}
              <div className="flex-1 w-full lg:w-auto">
                <div className="relative max-w-2xl">
                  <input
                    type="text"
                    placeholder="Buscar por ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-50 text-gray-800 px-4 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:bg-white"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" size={20} />
                </div>
              </div>

              {/* Filtros */}
              <div className="flex flex-wrap gap-3 items-center">
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="bg-gray-50 text-gray-800 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 text-sm font-medium"
                >
                  <option value="Todos">Todos</option>
                  <option value="En revisión">En revisión</option>
                  <option value="Revisado">Revisado</option>
                  <option value="Ocultos">Ocultos</option>
                </select>

                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="bg-gray-50 text-gray-800 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 text-sm font-medium"
                >
                  <option value="Todos los tipos">Todos los tipos</option>
                  <option value="Información engañosa">Información engañosa</option>
                  <option value="Descripción poco clara">Descripción poco clara</option>
                  <option value="Empresa no verificada">Empresa no verificada</option>
                  <option value="Discriminación">Discriminación</option>
                  <option value="Enlaces rotos">Enlaces rotos</option>
                  <option value="Estafa laboral">Estafa laboral</option>
                  <option value="Falta de respuesta">Falta de respuesta</option>
                  <option value="Oferta duplicada">Oferta duplicada</option>
                  <option value="Contenido inapropiado">Contenido inapropiado</option>
                  <option value="Datos de contacto inválidos">Datos de contacto inválidos</option>
                  <option value="Otras Incidencias">Otras Incidencias</option>
                </select>

                <select
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                  className="bg-gray-50 text-gray-800 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 text-sm font-medium"
                >
                  <option value="Mas recientes">Mas recientes</option>
                  <option value="Mas antiguos">Mas antiguos</option>
                  <option value="A-Z">A-Z</option>
                  <option value="Z-A">Z-A</option>
                </select>

                <button className="bg-gradient-to-r! from-green-500! to-teal-500! hover:from-green-600! hover:to-teal-600! text-white! px-6! py-4! rounded-xl! font-bold! transition-all! duration-300! hover:shadow-xl! hover:scale-105! flex! items-center! gap-2! whitespace-nowrap!">
                  <Download size={18} />
                  Exportar
                </button>
              </div>
            </div>
          </div>

          {/* Tabla de Incidentes */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Reportes de Incidencias</h2>
              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold">
                {filteredIncidents.length} Incidencias
              </span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {filteredIncidents.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">No se encontraron incidentes</p>
                  <button
                    onClick={limpiarFiltros}
                    className="mt-4 text-green-600 hover:text-green-700 font-medium"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                filteredIncidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="border-2 border-gray-100 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:border-green-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getTypeColor(incident.tipo)}`}>
                            {incident.tipo}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getSeverityColor(incident.complejidad)}`}>
                            {incident.complejidad}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(incident.oculto ? 'Ocultos' : incident.estado)}`}>
                            {incident.oculto ? 'Oculto' : incident.estado}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{incident.tipo}</h3>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{incident.descripcion}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {incident.reportado_por}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {incident.fecha}
                        </span>
                      </div>
                      <span className="text-gray-400 text-xs">
                        {incident.email}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => abrirModal(incident)}
                        className="bg-green-100! hover:bg-green-200! text-gray-700! px-4! py-2! rounded-lg! font-bold! transition-all! duration-300! flex! items-center! gap-2!"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalles
                      </button>
                      
                      {incident.oculto ? (
                        <button 
                          onClick={() => handleMostrarIncidente(incident.id)}
                          className="bg-blue-100! hover:bg-blue-200! text-gray-700! px-4! py-2! rounded-lg! font-bold! transition-all! duration-300! flex! items-center! gap-2!"
                        >
                          <Eye className="w-4 h-4" />
                          Mostrar
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleOcultarIncidente(incident.id)}
                          className="bg-gray-100! hover:bg-gray-200! text-gray-700! px-4! py-2! rounded-lg! font-bold! transition-all! duration-300! flex! items-center! gap-2!"
                        >
                          <EyeOff className="w-4 h-4" />
                          Ocultar
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleEliminarIncidente(incident.id)}
                        className="bg-red-100! hover:bg-red-200! text-gray-700! px-4! py-2! rounded-lg! font-bold! transition-all! duration-300! flex! items-center! gap-2!"
                      >
                        <XCircle className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <IncidentModal 
        isOpen={modalAbierto} 
        onClose={cerrarModal} 
        incident={incidenteSeleccionado} 
        onIncidentUpdate={handleIncidentUpdate}
      />
    </div>
  );
};

const IncidentDashboard = () => {
  return (
    <ModeradorSidebarProvider>
      <IncidentDashboardContent />
    </ModeradorSidebarProvider>
  );
};

export default IncidentDashboard;