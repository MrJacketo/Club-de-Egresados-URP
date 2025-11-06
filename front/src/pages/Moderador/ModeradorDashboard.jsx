import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModeradorSidebar from '../../components/ModeradorSidebar';
import { Briefcase, CheckCircle, Clock, XCircle } from "lucide-react";
import apiClient from '../../api/apiClient';
import { ModeradorSidebarProvider, useModeradorSidebar } from '../../context/moderadorSidebarContext';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const ModeradorDashboard = () => {
  return (
    <ModeradorSidebarProvider>
      <ModeradorDashboardContent />
    </ModeradorSidebarProvider>
  );
};

const ModeradorDashboardContent = () => {
  const { collapsed } = useModeradorSidebar();
  const [stats, setStats] = useState({
    totalOfertas: 0,
    ofertasPendientes: 0,
    ofertasAprobadas: 0,
    ofertasActivas: 0,
    ofertasInactivas: 0
  });
  
  const [ofertasPorMes, setOfertasPorMes] = useState([0,0,0,0,0,0,0,0,0,0,0,0]);
  const [ofertasPorArea, setOfertasPorArea] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        console.log('🔄 Cargando estadísticas de ofertas...');
        
        const response = await apiClient.get('/api/moderador/estadisticas');
        console.log('✅ Estadísticas obtenidas:', response.data);
        
        const { 
          totalOfertas, 
          ofertasPendientes, 
          ofertasAprobadas, 
          ofertasActivas,
          ofertasInactivas,
          ofertasPorMes: meses,
          ofertasPorArea: areas
        } = response.data;
        
        setStats({
          totalOfertas,
          ofertasPendientes,
          ofertasAprobadas,
          ofertasActivas,
          ofertasInactivas
        });
        
        setOfertasPorMes(meses || [0,0,0,0,0,0,0,0,0,0,0,0]);
        setOfertasPorArea(areas || []);
        
        setLoading(false);
      } catch (error) {
        console.error('❌ Error al cargar estadísticas:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Datos para gráfica de dona - Estado de ofertas
  const ofertasEstadoData = {
    labels: ['Pendientes', 'Aprobadas', 'Inactivas'],
    datasets: [
      {
        data: [
          stats.ofertasPendientes,
          stats.ofertasActivas,
          stats.ofertasInactivas
        ],
        backgroundColor: [
          'rgba(251, 191, 36, 0.6)',  // Amarillo - Pendientes
          'rgba(34, 197, 94, 0.6)',   // Verde - Aprobadas
          'rgba(239, 68, 68, 0.5)',   // Rojo - Inactivas
        ],
        borderWidth: 1,
      },
    ],
  };

  // Datos para gráfica de barras - Ofertas por área
  const ofertasAreaData = {
    labels: ofertasPorArea.map(item => item.area),
    datasets: [
      {
        label: 'Ofertas por área',
        data: ofertasPorArea.map(item => item.cantidad),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  // Datos para gráfica de línea - Aprobaciones mensuales
  const aprobacionesMensualesData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [
      {
        label: 'Ofertas aprobadas',
        data: ofertasPorMes,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.3,
      },
    ],
  };

  if (loading) {
    return (
      <div className="bg-white">
        <ModeradorSidebar />
        <div className={`transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="pt-20 p-16">
            <div className="animate-pulse flex flex-col gap-8">
              <div className="h-32 bg-gray-800 rounded-3xl"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="h-56 bg-gray-800 rounded-3xl"></div>
                <div className="h-56 bg-gray-800 rounded-3xl"></div>
                <div className="h-56 bg-gray-800 rounded-3xl"></div>
                <div className="h-56 bg-gray-800 rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <ModeradorSidebar />
      <div className={`transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        
        {/* SECCIÓN 1: Título y Cards */}
        <section className="pt-16 p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Título */}
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-6xl font-black bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent tracking-tight mb-4">
                Panel de Moderador
              </h1>
              <div className="w-32 h-2 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full mx-auto"></div>
            </div>
            
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card Total Ofertas */}
              <div className="relative group overflow-hidden rounded-3xl bg-white border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6 flex flex-col justify-between h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-4 rounded-2xl bg-blue-500/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                      <Briefcase size={32} className="text-blue-400" />
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-blue-500/20 backdrop-blur-sm">
                      <span className="text-xs font-bold text-blue-300 tracking-wider">TOTAL</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">Total Ofertas</p>
                    <p className="text-5xl font-black text-gray-900">{stats.totalOfertas}</p>
                    <p className="text-xs text-gray-600 pt-4">Todas las ofertas registradas</p>
                  </div>
                </div>
              </div>
              
              {/* Card Pendientes */}
              <div className="relative group overflow-hidden rounded-3xl bg-white border border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6 flex flex-col justify-between h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-4 rounded-2xl bg-amber-500/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                      <Clock size={32} className="text-amber-400" />
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-sm">
                      <span className="text-xs font-bold text-amber-300 tracking-wider">PENDIENTE</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-amber-600 uppercase tracking-wider">Por Aprobar</p>
                    <p className="text-5xl font-black text-gray-900">{stats.ofertasPendientes}</p>
                    <p className="text-xs text-gray-600 pt-4">Requieren revisión</p>
                  </div>
                </div>
              </div>
              
              {/* Card Aprobadas */}
              <div className="relative group overflow-hidden rounded-3xl bg-white border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6 flex flex-col justify-between h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-4 rounded-2xl bg-emerald-500/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle size={32} className="text-emerald-400" />
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-sm">
                      <span className="text-xs font-bold text-emerald-300 tracking-wider">ACTIVAS</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-emerald-600 uppercase tracking-wider">Aprobadas</p>
                    <p className="text-5xl font-black text-gray-900">{stats.ofertasActivas}</p>
                    <div className="flex items-center gap-2 pt-3">
                      <div className="flex-1 h-2.5 bg-emerald-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-1000"
                          style={{ width: `${stats.totalOfertas > 0 ? Math.round((stats.ofertasActivas/stats.totalOfertas)*100) : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">{stats.totalOfertas > 0 ? Math.round((stats.ofertasActivas/stats.totalOfertas)*100) : 0}%</span>
                    </div>
                    <p className="text-xs text-gray-600 pt-0.5">Activas y publicadas</p>
                  </div>
                </div>
              </div>
              
              {/* Card Inactivas */}
              <div className="relative group overflow-hidden rounded-3xl bg-white border border-red-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6 flex flex-col justify-between h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-4 rounded-2xl bg-red-500/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                      <XCircle size={32} className="text-red-400" />
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-red-500/20 backdrop-blur-sm">
                      <span className="text-xs font-bold text-red-300 tracking-wider">INACTIVO</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-red-600 uppercase tracking-wider">Desactivadas</p>
                    <p className="text-5xl font-black text-gray-900">{stats.ofertasInactivas}</p>
                    <p className="text-xs text-gray-600 pt-4">Ofertas no disponibles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* SECCIÓN 2: Gráficos */}
        <section className="p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Gráfico de Barras - Ofertas por área */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                <div className="relative bg-white border border-gray-200 rounded-3xl p-8 shadow-lg overflow-hidden h-96">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 mb-2">Ofertas por Área</h2>
                      <p className="text-sm text-gray-600">Top 5 áreas más demandadas</p>
                    </div>
                    <div className="w-3 h-12 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                  </div>
                  <div className="h-64">
                    <Bar 
                      data={ofertasAreaData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          x: {
                            ticks: {
                              color: '#9CA3AF'
                            },
                            grid: {
                              color: 'rgba(75, 85, 99, 0.2)'
                            }
                          },
                          y: {
                            ticks: {
                              color: '#9CA3AF'
                            },
                            grid: {
                              color: 'rgba(75, 85, 99, 0.2)'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Gráfico de Dona - Estado de ofertas */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-amber-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                <div className="relative bg-white border border-gray-200 rounded-3xl p-8 shadow-lg overflow-hidden h-96">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-amber-500 to-yellow-500"></div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 mb-2">Estado de Ofertas</h2>
                      <p className="text-sm text-gray-600">Distribución por estado</p>
                    </div>
                    <div className="w-3 h-12 bg-gradient-to-b from-pink-500 to-amber-500 rounded-full"></div>
                  </div>
                  <div className="h-64 flex items-center justify-center">
                    <div className="w-full h-full max-w-xs">
                      <Doughnut 
                        data={ofertasEstadoData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: true,
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: {
                                color: '#9CA3AF',
                                padding: 20,
                                font: {
                                  size: 12,
                                  weight: 'bold'
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Gráfico de línea - Aprobaciones mensuales */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <div className="relative bg-white border border-gray-200 rounded-3xl p-8 shadow-lg overflow-hidden h-96">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Aprobaciones Mensuales</h2>
                    <p className="text-sm text-gray-600">Ofertas aprobadas por mes en 2025</p>
                  </div>
                  <div className="w-3 h-12 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                </div>
                <div className="h-64">
                  <Line 
                    data={aprobacionesMensualesData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        }
                      },
                      scales: {
                        x: {
                          ticks: {
                            color: '#9CA3AF'
                          },
                          grid: {
                            color: 'rgba(75, 85, 99, 0.2)'
                          }
                        },
                        y: {
                          ticks: {
                            color: '#9CA3AF'
                          },
                          grid: {
                            color: 'rgba(75, 85, 99, 0.2)'
                          }
                        }
                      }
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Botón de acceso rápido */}
        <section className="p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Link 
              to="/moderador/ofertas" 
              className="block w-full text-center py-6 px-8 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-xl font-bold transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
            >
              Gestionar Ofertas Laborales →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ModeradorDashboard;
