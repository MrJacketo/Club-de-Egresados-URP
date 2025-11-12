import React, { useState, useEffect } from 'react';
import ModeradorSidebar from '../Egresado/components/moderadorSidebar';
import { Briefcase, CheckCircle, Clock, XCircle, TrendingUp } from "lucide-react";
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
          'rgba(251, 191, 36, 0.6)',
          'rgba(34, 197, 94, 0.6)',
          'rgba(239, 68, 68, 0.5)',
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
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
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
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
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

  const handleNavigate = () => {
    window.location.href = '/moderador/ofertas';
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #f0f9ff, #ffffff)' }}>
      <ModeradorSidebar />
      <div className={`transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        
        {/* Header */}
        <div className="pt-16 p-8 bg-white shadow-md">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl text-start font-bold mb-2">
              <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                Panel de Moderador
              </span>
            </h1>
            <p className="text-gray-600 font-medium text-lg">
              Gestiona y supervisa las ofertas laborales del sistema
            </p>
          </div>
        </div>

        {/* Métricas */}
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Card Total Ofertas */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-xl">
                    <Briefcase className="text-white" size={32} />
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp size={20} />
                    <span className="text-sm font-bold">100%</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Ofertas</p>
                <p className="text-4xl font-bold text-gray-800">{stats.totalOfertas}</p>
                <p className="text-xs text-gray-600 mt-2">Todas las ofertas registradas</p>
              </div>
              
              {/* Card Pendientes */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-amber-100 p-4 rounded-xl">
                    <Clock className="text-amber-600" size={32} />
                  </div>
                  <div className="flex items-center gap-1 text-amber-600">
                    <TrendingUp size={20} />
                    <span className="text-sm font-bold">{stats.ofertasPendientes}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm font-medium mb-1">Por Aprobar</p>
                <p className="text-4xl font-bold text-gray-800">{stats.ofertasPendientes}</p>
                <p className="text-xs text-gray-600 mt-2">Requieren revisión</p>
              </div>
              
              {/* Card Aprobadas */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 p-4 rounded-xl">
                    <CheckCircle className="text-green-600" size={32} />
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp size={20} />
                    <span className="text-sm font-bold">{stats.totalOfertas > 0 ? Math.round((stats.ofertasActivas/stats.totalOfertas)*100) : 0}%</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm font-medium mb-1">Aprobadas</p>
                <p className="text-4xl font-bold text-gray-800">{stats.ofertasActivas}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-2.5 bg-green-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-1000"
                      style={{ width: `${stats.totalOfertas > 0 ? Math.round((stats.ofertasActivas/stats.totalOfertas)*100) : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Card Inactivas */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-red-100 p-4 rounded-xl">
                    <XCircle className="text-red-600" size={32} />
                  </div>
                  <div className="flex items-center gap-1 text-red-600">
                    <TrendingUp size={20} />
                    <span className="text-sm font-bold">{stats.ofertasInactivas}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm font-medium mb-1">Desactivadas</p>
                <p className="text-4xl font-bold text-gray-800">{stats.ofertasInactivas}</p>
                <p className="text-xs text-gray-600 mt-2">Ofertas no disponibles</p>
              </div>
            </div>
            
            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Gráfico de Barras - Ofertas por área */}
              <div className="bg-white rounded-2xl p-8 shadow-xl overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Ofertas por Área</h2>
                    <p className="text-sm text-gray-600">Top 5 áreas más demandadas</p>
                  </div>
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
              
              {/* Gráfico de Dona - Estado de ofertas */}
              <div className="bg-white rounded-2xl p-8 shadow-xl overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Estado de Ofertas</h2>
                    <p className="text-sm text-gray-600">Distribución por estado</p>
                  </div>
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
            
            {/* Gráfico de línea - Aprobaciones mensuales */}
            <div className="bg-white rounded-2xl p-8 shadow-xl overflow-hidden mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-2">Aprobaciones Mensuales</h2>
                  <p className="text-sm text-gray-600">Ofertas aprobadas por mes en 2025</p>
                </div>
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
      </div>
    </div>
  );
};

export default ModeradorDashboard;