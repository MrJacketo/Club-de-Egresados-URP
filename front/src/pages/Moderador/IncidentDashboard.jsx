import React, { useState } from "react";
import ModeradorSidebar from '../Egresado/components/moderadorSidebar';
import { ModeradorSidebarProvider, useModeradorSidebar } from '../../context/moderadorSidebarContext';
import { AlertTriangle, CheckCircle, Search, Eye, EyeOff, User, Calendar, Download, FileText, CheckSquare, XCircle, Hourglass, Plus, Filter } from 'lucide-react';
import IncidentModal from "../../components/IncidentesLaborales/IncidentModal";
import CreateIncidentModal from "../../components/IncidentesLaborales/CreateIncidentModal";
import { getStatusColor, getSeverityColor, getTypeColor, parseDate, truncateText } from "../../components/IncidentesLaborales/incidentUtils";
import jsPDF from 'jspdf';

const IncidentDashboardContent = () => {
  const { collapsed } = useModeradorSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroTipo, setFiltroTipo] = useState('Todos los tipos');
  const [filtroFecha, setFiltroFecha] = useState('Todas las fechas');
  const [orden, setOrden] = useState('Mas recientes');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalCreacionAbierto, setModalCreacionAbierto] = useState(false);
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

  // Función para crear una nueva incidencia
  const handleCreateIncident = (newIncident) => {
    setIncidentsData(prevData => [...prevData, newIncident]);
  };

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



  // Filtrar incidentes basado en los filtros seleccionados
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

    // Aplicar filtro de fecha
    if (filtroFecha !== 'Todas las fechas') {
      const today = new Date();
      const dateLimit = new Date();

      switch (filtroFecha) {
        case 'Última semana':
          dateLimit.setDate(today.getDate() - 7);
          break;
        case 'Último mes':
          dateLimit.setMonth(today.getMonth() - 1);
          break;
        case 'Últimos 3 meses':
          dateLimit.setMonth(today.getMonth() - 3);
          break;
        default:
          break;
      }

      filtered = filtered.filter(incident => {
        const incidentDate = parseDate(incident.fecha);
        return incidentDate >= dateLimit;
      });
    }

    // Aplicar búsqueda
    if (searchTerm) {
      filtered = filtered.filter(incident =>
        incident.reportado_por.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      switch (orden) {
        case 'Mas antiguos':
          return parseDate(a.fecha) - parseDate(b.fecha);
        case 'A-Z':
          return a.tipo.localeCompare(b.tipo);
        case 'Z-A':
          return b.tipo.localeCompare(a.tipo);
        case 'Mas recientes':
        default:
          return parseDate(b.fecha) - parseDate(a.fecha);
      }
    });

    return filtered;
  };

  const filteredIncidents = getFilteredIncidents();



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
    setFiltroFecha('Todas las fechas');
    setOrden('Mas recientes');
  };

  // Contadores para incidentes ocultos y eliminados
  const incidentesOcultos = incidentsData.filter(incident => incident.oculto && !incident.eliminado).length;
  const incidentesEliminados = incidentsData.filter(incident => incident.eliminado).length;

  // Función para exportar reporte general de incidencias
  const handleExportReport = () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let currentY = margin;

      // Obtener incidencias filtradas actuales
      const incidents = getFilteredIncidents();
      const incidentesVisibles = incidentsData.filter(incident => !incident.eliminado && !incident.oculto);

      // Encabezado del reporte
      pdf.setFontSize(18);
      pdf.setTextColor(34, 139, 34); // Verde
      pdf.text('REPORTE GENERAL DE INCIDENCIAS LABORALES', margin, currentY);
      currentY += 12;

      // Información del reporte
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Generado el: ${new Date().toLocaleDateString('es-PE', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, margin, currentY);
      currentY += 8;

      // Estadísticas generales
      pdf.setFontSize(14);
      pdf.setTextColor(34, 139, 34);
      pdf.text('ESTADÍSTICAS GENERALES', margin, currentY);
      currentY += 8;

      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      const stats = [
        `Total de incidencias: ${totalIncidents}`,
        `En revisión: ${enRevisionIncidents} (${enRevisionPercentage}%)`,
        `Revisadas: ${revisadoIncidents} (${revisadoPercentage}%)`,
        `Alta gravedad: ${highSeverityIncidents} (${highSeverityPercentage}%)`,
        `Incidencias mostradas en este reporte: ${incidents.length}`
      ];

      stats.forEach(stat => {
        pdf.text(`• ${stat}`, margin, currentY);
        currentY += 5;
      });

      currentY += 10;

      // Filtros aplicados
      if (searchTerm || filtroEstado !== 'Todos' || filtroTipo !== 'Todos los tipos' || filtroFecha !== 'Todas las fechas') {
        pdf.setFontSize(12);
        pdf.setTextColor(34, 139, 34);
        pdf.text('FILTROS APLICADOS', margin, currentY);
        currentY += 8;

        pdf.setFontSize(9);
        pdf.setTextColor(0, 0, 0);
        if (searchTerm) pdf.text(`Búsqueda: "${searchTerm}"`, margin, currentY), currentY += 4;
        if (filtroEstado !== 'Todos') pdf.text(`Estado: ${filtroEstado}`, margin, currentY), currentY += 4;
        if (filtroTipo !== 'Todos los tipos') pdf.text(`Tipo: ${filtroTipo}`, margin, currentY), currentY += 4;
        if (filtroFecha !== 'Todas las fechas') pdf.text(`Fecha: ${filtroFecha}`, margin, currentY), currentY += 4;
        currentY += 6;
      }

      // Lista de incidencias
      pdf.setFontSize(12);
      pdf.setTextColor(34, 139, 34);
      pdf.text('DETALLE DE INCIDENCIAS', margin, currentY);
      currentY += 8;

      if (incidents.length === 0) {
        pdf.setFontSize(10);
        pdf.setTextColor(128, 128, 128);
        pdf.text('No hay incidencias que coincidan con los filtros aplicados.', margin, currentY);
      } else {
        incidents.forEach((incident, index) => {
          // Verificar si necesitamos nueva página
          if (currentY > pageHeight - 50) {
            pdf.addPage();
            currentY = margin;
          }

          pdf.setFontSize(11);
          pdf.setTextColor(0, 0, 0);
          pdf.text(`${index + 1}. ID #${incident.id} - ${incident.tipo}`, margin, currentY);
          currentY += 5;

          pdf.setFontSize(9);
          pdf.setTextColor(64, 64, 64);
          pdf.text(`   Reportado por: ${incident.reportado_por} (${incident.email})`, margin, currentY);
          currentY += 4;
          pdf.text(`   Fecha: ${incident.fecha} | Estado: ${incident.estado} | Gravedad: ${incident.complejidad}`, margin, currentY);
          currentY += 4;
          
          // Descripción truncada
          const descText = incident.descripcion.length > 80 ? 
            incident.descripcion.substring(0, 80) + '...' : 
            incident.descripcion;
          const splitDesc = pdf.splitTextToSize(`   Descripción: ${descText}`, pageWidth - 2 * margin);
          pdf.text(splitDesc, margin, currentY);
          currentY += splitDesc.length * 4 + 6;
        });
      }

      // Pie de página
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      const footerY = pageHeight - 10;
      pdf.text('Sistema de Gestión de Incidencias Laborales - Reporte generado automáticamente', margin, footerY);

      // Descargar PDF
      const fileName = `Reporte_Incidencias_${new Date().toISOString().split('T')[0]}_${incidents.length}_registros.pdf`;
      pdf.save(fileName);
      
      alert(`✅ Reporte exportado exitosamente con ${incidents.length} incidencias`);
    } catch (error) {
      console.error('Error al exportar reporte:', error);
      alert('❌ Error al generar el reporte de exportación');
    }
  };

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
            {mainStats.map((stat, index) => {
              const getBorderColor = (color) => {
                switch (color) {
                  case 'blue': return 'border-blue-400 hover:border-blue-500 hover:shadow-blue-100';
                  case 'orange': return 'border-orange-400 hover:border-orange-500 hover:shadow-orange-100';
                  case 'green': return 'border-green-400 hover:border-green-500 hover:shadow-green-100';
                  case 'red': return 'border-red-400 hover:border-red-500 hover:shadow-red-100';
                  default: return 'border-gray-300 hover:border-gray-400';
                }
              };
              
              return (
                <div key={index} className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${getBorderColor(stat.color)}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${getColorClasses(stat.color)} shadow-md`}>
                      {stat.icon}
                    </div>
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">{stat.percentage}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-gray-700 font-semibold">{stat.title}</p>
                </div>
              );
            })}
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            <div className="flex flex-col gap-4">
              {/* Primera fila: Búsqueda y botón crear */}
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex-1 w-full lg:w-auto">
                  <div className="relative max-w-2xl">
                    <input
                      type="text"
                      placeholder="Buscar por nombre, tipo, descripción o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white text-gray-800 px-4 py-3 pl-12 rounded-xl border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 placeholder:text-gray-500 shadow-sm"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" size={20} />
                  </div>
                </div>

                <button 
                  onClick={() => setModalCreacionAbierto(true)}
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap min-w-[180px] shadow-lg"
                >
                  <Plus size={18} />
                  Nueva Incidencia
                </button>
              </div>

              {/* Segunda fila: Filtros */}
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <Filter size={16} />
                  Filtros:
                </div>

                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="bg-gray-50 text-gray-800 px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-green-500 text-sm font-medium"
                >
                  <option value="Todos">📋 Todos los estados</option>
                  <option value="En revisión">🔍 En revisión</option>
                  <option value="Revisado">✅ Revisado</option>
                  <option value="Ocultos">👁️ Ocultos</option>
                </select>

                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="bg-gray-50 text-gray-800 px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-green-500 text-sm font-medium"
                >
                  <option value="Todos los tipos">🏷️ Todos los tipos</option>
                  <option value="Información engañosa">⚠️ Información engañosa</option>
                  <option value="Descripción poco clara">📝 Descripción poco clara</option>
                  <option value="Empresa no verificada">🏢 Empresa no verificada</option>
                  <option value="Discriminación">🚫 Discriminación</option>
                  <option value="Enlaces rotos">🔗 Enlaces rotos</option>
                  <option value="Estafa laboral">💸 Estafa laboral</option>
                  <option value="Falta de respuesta">📵 Falta de respuesta</option>
                  <option value="Oferta duplicada">📑 Oferta duplicada</option>
                  <option value="Contenido inapropiado">🚨 Contenido inapropiado</option>
                  <option value="Datos de contacto inválidos">📧 Datos de contacto inválidos</option>
                  <option value="Otras Incidencias">📋 Otras Incidencias</option>
                </select>

                <select
                  value={filtroFecha}
                  onChange={(e) => setFiltroFecha(e.target.value)}
                  className="bg-gray-50 text-gray-800 px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-green-500 text-sm font-medium"
                >
                  <option value="Todas las fechas">📅 Todas las fechas</option>
                  <option value="Última semana">📅 Última semana</option>
                  <option value="Último mes">📅 Último mes</option>
                  <option value="Últimos 3 meses">📅 Últimos 3 meses</option>
                </select>

                <select
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                  className="bg-gray-50 text-gray-800 px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-green-500 text-sm font-medium"
                >
                  <option value="Mas recientes">🔽 Más recientes</option>
                  <option value="Mas antiguos">🔼 Más antiguos</option>
                  <option value="A-Z">🔤 A-Z</option>
                  <option value="Z-A">🔤 Z-A</option>
                </select>

                {(searchTerm || filtroEstado !== 'Todos' || filtroTipo !== 'Todos los tipos' || filtroFecha !== 'Todas las fechas' || orden !== 'Mas recientes') && (
                  <button
                    onClick={limpiarFiltros}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-1 text-sm"
                  >
                    <XCircle size={14} />
                    Limpiar
                  </button>
                )}

                <div className="ml-auto">
                  <button 
                    onClick={handleExportReport}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-sm hover:shadow-lg"
                  >
                    <Download size={16} />
                    Exportar
                  </button>
                </div>
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
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron incidentes</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || filtroEstado !== 'Todos' || filtroTipo !== 'Todos los tipos' || filtroFecha !== 'Todas las fechas'
                      ? 'Intenta ajustar los filtros o crear una nueva incidencia'
                      : 'Comienza creando tu primera incidencia laboral'
                    }
                  </p>
                  <div className="flex gap-3 justify-center">
                    {(searchTerm || filtroEstado !== 'Todos' || filtroTipo !== 'Todos los tipos' || filtroFecha !== 'Todas las fechas') && (
                      <button
                        onClick={limpiarFiltros}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Limpiar filtros
                      </button>
                    )}
                    <button
                      onClick={() => setModalCreacionAbierto(true)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Nueva Incidencia
                    </button>
                  </div>
                </div>
              ) : (
                filteredIncidents.map((incident) => (
                  <div
                    key={incident.id}
                    className={`border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-xl ${
                      incident.oculto 
                        ? 'border-gray-300 bg-gray-50 hover:border-gray-400' 
                        : 'border-gray-200 bg-white hover:border-blue-300 shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getTypeColor(incident.tipo)}`}>
                            {incident.tipo}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getSeverityColor(incident.complejidad)}`}>
                            🔥 {incident.complejidad}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(incident.oculto ? 'Ocultos' : incident.estado)}`}>
                            {incident.oculto ? '👁️ Oculto' : `📋 ${incident.estado}`}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            ID: {incident.id}
                          </span>
                        </div>
                        <h3 className={`text-xl font-bold mb-3 ${incident.oculto ? 'text-gray-600' : 'text-gray-900'}`}>
                          {incident.tipo}
                        </h3>
                      </div>
                    </div>

                    {/* Descripción mejorada */}
                    <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">📝 Descripción detallada:</h4>
                      <p className={`text-sm leading-relaxed ${incident.oculto ? 'text-gray-500' : 'text-gray-800'}`}>
                        {truncateText(incident.descripcion, 150)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col gap-2">
                        <span className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-500" />
                          <span className="text-base font-bold text-gray-900">{incident.reportado_por}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600 font-medium">{incident.fecha}</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">Contacto:</div>
                        <span className="text-gray-700 text-sm font-medium bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                          {incident.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-center pt-2">
                      <button 
                        onClick={() => abrirModal(incident)}
                        className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 text-sm min-w-[120px] justify-center"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalles
                      </button>
                      
                      {incident.oculto ? (
                        <button 
                          onClick={() => handleMostrarIncidente(incident.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 text-sm min-w-[100px] justify-center"
                        >
                          <Eye className="w-4 h-4" />
                          Mostrar
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleOcultarIncidente(incident.id)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 text-sm min-w-[100px] justify-center"
                        >
                          <EyeOff className="w-4 h-4" />
                          Ocultar
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleEliminarIncidente(incident.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 text-sm min-w-[100px] justify-center"
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

      {/* Modales */}
      <IncidentModal 
        isOpen={modalAbierto} 
        onClose={cerrarModal} 
        incident={incidenteSeleccionado} 
        onIncidentUpdate={handleIncidentUpdate}
      />
      
      <CreateIncidentModal
        isOpen={modalCreacionAbierto}
        onClose={() => setModalCreacionAbierto(false)}
        onCreateIncident={handleCreateIncident}
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