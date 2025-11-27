import React, { useState, useEffect } from "react";
import InspectorSidebar from '../../components/InspectorSidebar';
import { InspectorSidebarProvider, useInspectorSidebar } from '../../context/inspectorSidebarContext';
import { AlertTriangle, Users, FileText, CheckSquare, Eye, BarChart3, TrendingUp } from 'lucide-react';
import { getEstadisticasInspeccion } from '../../api/inspeccionLaboralApi';
import { getEstadisticasIncidenciasRequest, getIncidenciasRequest } from '../../api/incidenciasApi';
import toast from 'react-hot-toast';

const InspectorLaboralDashboardContent = () => {
  const { collapsed } = useInspectorSidebar();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    {
      title: "Inspecciones Pendientes",
      value: "0",
      icon: <AlertTriangle className="w-6 h-6" />,
      color: "orange",
      trend: "0%"
    },
    {
      title: "Empresas Monitoreadas",
      value: "0",
      icon: <Users className="w-6 h-6" />,
      color: "blue",
      trend: "0%"
    },
    {
      title: "Ofertas Activas",
      value: "0",
      icon: <CheckSquare className="w-6 h-6" />,
      color: "green",
      trend: "0%"
    },
    {
      title: "Incidencias Reportadas",
      value: "0",
      icon: <FileText className="w-6 h-6" />,
      color: "purple",
      trend: "0%"
    }
  ]);
  const [actividadReciente, setActividadReciente] = useState([]);

  const getColorClasses = (color) => {
    switch (color) {
      case 'orange': return 'bg-orange-100 text-orange-600';
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'green': return 'bg-green-100 text-green-600';
      case 'purple': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getBorderColor = (color) => {
    switch (color) {
      case 'orange': return 'border-orange-400 hover:border-orange-500';
      case 'blue': return 'border-blue-400 hover:border-blue-500';
      case 'green': return 'border-green-400 hover:border-green-500';
      case 'purple': return 'border-purple-400 hover:border-purple-500';
      default: return 'border-gray-300 hover:border-gray-400';
    }
  };

  // Cargar datos del dashboard
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // Cargar estadísticas de inspección
        const statsInspeccion = await getEstadisticasInspeccion();
        
        // Cargar estadísticas de incidencias
        const statsIncidencias = await getEstadisticasIncidenciasRequest();
        
        // Cargar incidencias recientes para actividad
        const incidenciasRecientes = await getIncidenciasRequest();
        
        if (statsInspeccion.success) {
          const { data } = statsInspeccion;
          
          // Calcular número único de empresas
          const empresasUnicas = data.empresasTop ? data.empresasTop.length : 0;
          
          setStats([
            {
              title: "Ofertas Bloqueadas",
              value: data.ofertasBloqueadas?.toString() || "0",
              icon: <AlertTriangle className="w-6 h-6" />,
              color: "orange",
              trend: "+0%"
            },
            {
              title: "Empresas Suspendidas",
              value: data.empresasSuspendidas?.toString() || "0",
              icon: <Users className="w-6 h-6" />,
              color: "blue",
              trend: "+0%"
            },
            {
              title: "Ofertas Activas",
              value: data.ofertasActivas?.toString() || "0",
              icon: <CheckSquare className="w-6 h-6" />,
              color: "green",
              trend: "+0%"
            },
            {
              title: "Total Incidencias",
              value: statsIncidencias.success ? statsIncidencias.data?.total?.toString() || "0" : "0",
              icon: <FileText className="w-6 h-6" />,
              color: "purple",
              trend: "+0%"
            }
          ]);
        }
        
        // Procesar actividad reciente desde incidencias
        if (incidenciasRecientes.success && incidenciasRecientes.data) {
          const actividadFormateada = incidenciasRecientes.data
            .slice(0, 3) // Solo las 3 más recientes
            .map(incidencia => ({
              id: incidencia._id,
              titulo: `Incidencia: ${incidencia.tipo}`,
              descripcion: incidencia.oferta_relacionada ? 
                `Empresa: ${incidencia.oferta_relacionada.empresa}` : 
                'Incidencia general',
              fecha: new Date(incidencia.createdAt).toLocaleString('es-PE'),
              estado: incidencia.estado,
              tipo: 'incidencia'
            }));
          setActividadReciente(actividadFormateada);
        }
        
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        toast.error('Error al cargar datos del dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-white">
        <InspectorSidebar />
        
        <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="pt-20 p-16">
            <div className="animate-pulse flex flex-col gap-8">
              <div className="h-20 bg-gray-200 rounded-3xl"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
                ))}
              </div>
              <div className="h-96 bg-gray-200 rounded-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-white">
      <InspectorSidebar />
      
      <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        
        {/* Header */}
        <div className="pt-16 p-8 bg-white shadow-md">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl text-start font-bold mb-2">
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                Panel Inspector Laboral
              </span>
            </h1>
            <p className="text-gray-600 font-medium text-lg mb-6">
              Sistema de inspección y control laboral
            </p>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-8">
          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${getBorderColor(stat.color)}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${getColorClasses(stat.color)} shadow-md`}>
                    {stat.icon}
                  </div>
                  <div className="flex items-center text-green-600 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="font-bold">{stat.trend}</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-700 font-semibold">{stat.title}</p>
              </div>
            ))}
          </div>

          {/* Secciones de acceso rápido */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Gestión de Incidencias */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Incidencias Laborales</h3>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
              <p className="text-gray-600 mb-4">Revisar y gestionar reportes de incidencias laborales.</p>
              <a 
                href="/inspector/incidencias" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 inline-flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Ver Incidencias
              </a>
            </div>

            {/* Inspección de Ofertas */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Inspección de Ofertas</h3>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-gray-600 mb-4">Supervisar ofertas laborales y verificar cumplimiento.</p>
              <a 
                href="/inspector/ofertas" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 inline-flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Inspeccionar Ofertas
              </a>
            </div>

            {/* Suspensión de Empresas */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Suspensión de Empresas</h3>
                <Users className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-gray-600 mb-4">Gestionar suspensiones y sanciones a empresas.</p>
              <a 
                href="/inspector/suspensiones" 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 inline-flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Gestionar Suspensiones
              </a>
            </div>
          </div>

          {/* Actividad reciente */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Actividad Reciente</h2>
              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold">
                Últimas 24 horas
              </span>
            </div>

            <div className="space-y-4">
              {actividadReciente.length > 0 ? (
                actividadReciente.map((actividad, index) => {
                  const getEstadoColor = (estado) => {
                    switch (estado) {
                      case 'En revisión':
                        return { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700' };
                      case 'Revisado':
                        return { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700' };
                      default:
                        return { bg: 'bg-gray-50', border: 'border-gray-200', badge: 'bg-gray-100 text-gray-700' };
                    }
                  };
                  
                  const colores = getEstadoColor(actividad.estado);
                  
                  return (
                    <div key={actividad.id} className={`flex items-center justify-between p-4 ${colores.bg} rounded-lg border ${colores.border}`}>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{actividad.titulo}</h4>
                        <p className="text-sm text-gray-600">{actividad.descripcion}</p>
                        <p className="text-xs text-gray-500">{actividad.fecha}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${colores.badge}`}>
                        {actividad.estado}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center p-8 text-gray-500">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No hay actividad reciente</p>
                    <p className="text-sm">Las actividades aparecerán aquí cuando se registren incidencias</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InspectorLaboralDashboard = () => {
  return (
    <InspectorSidebarProvider>
      <InspectorLaboralDashboardContent />
    </InspectorSidebarProvider>
  );
};

export default InspectorLaboralDashboard;