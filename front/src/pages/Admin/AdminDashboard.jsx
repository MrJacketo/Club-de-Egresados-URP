import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import { Users, Award, Newspaper, Percent } from "lucide-react";
import axios from 'axios';
import { AdminSidebarProvider, useAdminSidebar } from '../../context/adminSidebarContext';
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

const AdminDashboard = () => {
  return (
    <AdminSidebarProvider>
      <AdminDashboardContent />
    </AdminSidebarProvider>
  );
};

const AdminDashboardContent = () => {
  const { collapsed } = useAdminSidebar();
  const [stats, setStats] = useState({
    totalEgresados: 0,
    egresadosActivos: 0,
    totalMembresias: 0,
    membresiasPremium: 0,
    membresiasBasicas: 0,
    totalNoticias: 0,
    totalBeneficios: 0,
    registrosRecientes: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [recentEgresados, setRecentEgresados] = useState([]);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Detectar cambios de tamaño y forzar re-render
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    // Aquí se cargarían los datos reales desde el backend
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Para una demo, usamos datos de ejemplo
        // const response = await axios.get('/api/admin/dashboard');
        // setStats(response.data.stats);
        // setRecentEgresados(response.data.recentEgresados);
        
        // Datos simulados
        setTimeout(() => {
          setStats({
            totalEgresados: 1250,
            egresadosActivos: 875,
            totalMembresias: 950,
            membresiasPremium: 320,
            membresiasBasicas: 630,
            totalNoticias: 45,
            totalBeneficios: 28,
            registrosRecientes: 68
          });
          
          setRecentEgresados([
            { id: 1, nombre: 'Christian Saavedra', carrera: 'Ingeniería Informática', fecha: '2024-06-05' },
            { id: 2, nombre: 'Carlos López', carrera: 'Arquitectura', fecha: '2024-06-04' },
            { id: 3, nombre: 'María Rodríguez', carrera: 'Medicina', fecha: '2024-06-03' },
            { id: 4, nombre: 'Luis Gutierrez', carrera: 'Ingeniería Industrial', fecha: '2024-06-02' },
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Datos para gráfica de barras - Distribución por carrera
  const carrerasData = {
    labels: ['Ing. Software', 'Arquitectura', 'Medicina', 'Ing. Civil', 'Derecho', 'Psicología'],
    datasets: [
      {
        label: 'Egresados por carrera',
        data: [250, 180, 220, 190, 150, 260],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
  
  // Datos para gráfica de dona - Tipos de membresías
  const membresiasData = {
    labels: ['Premium', 'Básica', 'Sin membresía'],
    datasets: [
      {
        data: [stats.membresiasPremium, stats.membresiasBasicas, stats.totalEgresados - stats.totalMembresias],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Datos para gráfica de línea - Registros mensuales
  const registrosMensualesData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        label: 'Nuevos registros',
        data: [65, 59, 80, 81, 56, 68],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
      },
    ],
  };
  if (loading) {
    return (
      <div className="flex h-screen bg-[#1C1D21] overflow-hidden">
        <AdminSidebar />
        <div className="flex-1">
          <div className="p-16">
            <div className="animate-pulse flex flex-col gap-8">
              <div className="h-32 bg-gray-800 rounded-3xl"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="h-56 bg-gray-800 rounded-3xl"></div>
                <div className="h-56 bg-gray-800 rounded-3xl"></div>
                <div className="h-56 bg-gray-800 rounded-3xl"></div>
                <div className="h-56 bg-gray-800 rounded-3xl"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-96 bg-gray-800 rounded-3xl"></div>
                <div className="h-96 bg-gray-800 rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }  return (
    <div className="fixed inset-0 bg-[#1C1D21] overflow-hidden">
      <AdminSidebar />
      {/* CONTENIDO FULL SCREEN - OCUPANDO TODA LA PANTALLA */}
      <div 
        className="absolute inset-0 overflow-y-auto" 
        style={{
          width: windowSize.width + 'px', 
          height: windowSize.height + 'px'
        }}
      >
        
        {/* SECCIÓN 1: Título y Cards - ALTURA REDUCIDA */}
        <section 
          className="flex flex-col justify-start p-0" 
          style={{
            width: windowSize.width + 'px', 
            height: (windowSize.height * 0.6) + 'px'
          }}
        >
          {/* Título - ESPACIADO MÁS REDUCIDO */}
          <div className="w-full pt-12 pb-2 px-8">
            <h1 className="text-8xl lg:text-9xl font-black text-white tracking-tight mb-4 text-center">
              Panel de Control
            </h1>
            <div className="w-64 h-3 bg-gradient-to-r from-[#00BC4F] to-emerald-400 rounded-full mx-auto"></div>
          </div>
          
          {/* Cards - SIMETRICAS Y MÁS COMPACTAS */}
          <div className="flex-1 w-full px-8 pb-4 flex items-center">
            <div className="grid grid-cols-4 gap-6 w-full">
              {/* Card Egresados - MÁS BAJA */}
              <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/10 to-blue-600/20 border border-blue-500/20 backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-4 rounded-2xl bg-blue-500/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                    <Users size={32} className="text-blue-400" />
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-blue-500/20 backdrop-blur-sm">
                    <span className="text-xs font-bold text-blue-300 tracking-wider">ACTIVO</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-200/70 uppercase tracking-wider">Total Egresados</p>
                  <p className="text-5xl font-black text-white">{stats.totalEgresados}</p>
                  <div className="flex items-center gap-2 pt-3">
                    <div className="flex-1 h-2.5 bg-blue-950/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.round((stats.egresadosActivos/stats.totalEgresados)*100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-blue-300">{Math.round((stats.egresadosActivos/stats.totalEgresados)*100)}%</span>
                  </div>
                  <p className="text-xs text-blue-200/50 pt-0.5">{stats.egresadosActivos} activos</p>
                </div>
              </div>
            </div>
            
              {/* Card Membresías - MÁS BAJA */}
              <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 to-purple-600/20 border border-purple-500/20 backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-4 rounded-2xl bg-purple-500/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                    <Award size={32} className="text-purple-400" />
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-purple-500/20 backdrop-blur-sm">
                    <span className="text-xs font-bold text-purple-300 tracking-wider">PREMIUM</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-purple-200/70 uppercase tracking-wider">Membresías</p>
                  <p className="text-5xl font-black text-white">{stats.totalMembresias}</p>
                  <div className="flex items-center gap-2 pt-3">
                    <div className="flex-1 h-2.5 bg-purple-950/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.round((stats.membresiasPremium/stats.totalMembresias)*100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-purple-300">{Math.round((stats.membresiasPremium/stats.totalMembresias)*100)}%</span>
                  </div>
                  <p className="text-xs text-purple-200/50 pt-0.5">{stats.membresiasPremium} premium</p>
                </div>
              </div>
            </div>
            
              {/* Card Noticias - MÁS BAJA */}
              <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 to-amber-600/20 border border-amber-500/20 backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-4 rounded-2xl bg-amber-500/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                    <Newspaper size={32} className="text-amber-400" />
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-sm">
                    <span className="text-xs font-bold text-amber-300 tracking-wider">30 DÍAS</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-amber-200/70 uppercase tracking-wider">Noticias</p>
                  <p className="text-5xl font-black text-white">{stats.totalNoticias}</p>
                  <div className="pt-4 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse delay-75"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse delay-150"></div>
                    </div>
                  </div>
                  <p className="text-xs text-amber-200/50">Últimos 30 días</p>
                </div>
              </div>
            </div>
            
              {/* Card Beneficios - MÁS BAJA */}
              <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 border border-emerald-500/20 backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-4 rounded-2xl bg-emerald-500/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                    <Percent size={32} className="text-emerald-400" />
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-sm">
                    <span className="text-xs font-bold text-emerald-300 tracking-wider">ACTIVO</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-emerald-200/70 uppercase tracking-wider">Beneficios</p>
                  <p className="text-5xl font-black text-white">{stats.totalBeneficios}</p>
                  <div className="pt-4 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-200/50">Disponibles ahora</p>
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>
        
        {/* SECCIÓN 2: Gráficos - FULL SCREEN NORMAL */}
        <section 
          className="flex items-center justify-center p-8 bg-gradient-to-b from-[#1C1D21] to-[#25262B]" 
          style={{
            width: windowSize.width + 'px', 
            height: windowSize.height + 'px'
          }}
        >
          <div className="w-full h-full flex flex-col">
            <div className="grid grid-cols-2 gap-6 flex-1">
              {/* Gráfico de Barras - SIMETRICO */}
              <div className="relative group h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                <div className="relative bg-[#25262B] border border-gray-800 rounded-3xl p-10 backdrop-blur-xl overflow-hidden h-full flex flex-col">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-4xl font-black text-white mb-2">Distribución por Carrera</h2>
                    <p className="text-base text-gray-400">Egresados registrados por programa académico</p>
                  </div>
                  <div className="w-5 h-20 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                </div>
                <div className="flex-1 min-h-0">
                  <Bar 
                    data={carrerasData} 
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
            
              {/* Gráfico de Dona - SIMETRICO */}
              <div className="relative group h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-amber-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                <div className="relative bg-[#25262B] border border-gray-800 rounded-3xl p-10 backdrop-blur-xl overflow-hidden h-full flex flex-col">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-amber-500 to-yellow-500"></div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-4xl font-black text-white mb-2">Tipos de Membresía</h2>
                    <p className="text-base text-gray-400">Distribución de planes activos</p>
                  </div>
                  <div className="w-5 h-20 bg-gradient-to-b from-pink-500 to-amber-500 rounded-full"></div>
                </div>
                <div className="flex-1 min-h-0 flex items-center justify-center">
                  <div style={{ width: '85%', height: '85%' }}>
                    <Doughnut 
                      data={membresiasData} 
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
          </div>
        </section>
        
        {/* SECCIÓN 3: Registros - FULL SCREEN NORMAL */}
        <section 
          className="flex items-center justify-center p-8 bg-gradient-to-b from-[#25262B] to-[#1C1D21]" 
          style={{
            width: windowSize.width + 'px', 
            height: windowSize.height + 'px'
          }}
        >
          <div className="w-full h-full flex flex-col">
            <div className="grid grid-cols-3 gap-6 flex-1">
              {/* Gráfico de Línea - Ocupa 2 columnas - SIMETRICO */}
              <div className="col-span-2 relative group h-full flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <div className="relative bg-[#25262B] border border-gray-800 rounded-3xl p-10 backdrop-blur-xl overflow-hidden h-full flex flex-col">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-4xl font-black text-white mb-2">Registros Mensuales</h2>
                    <p className="text-base text-gray-400">Tendencia de nuevos egresados registrados</p>
                  </div>
                  <div className="w-5 h-20 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                </div>
                <div className="flex-1 min-h-0">
                  <Line 
                    data={registrosMensualesData}
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
            
              {/* Tabla de registros recientes - SIMETRICA */}
              <div className="relative group h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                <div className="relative bg-[#25262B] border border-gray-800 rounded-3xl p-10 backdrop-blur-xl overflow-hidden h-full flex flex-col">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500"></div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-black text-white mb-2">Registros Recientes</h2>
                    <p className="text-sm text-gray-400">Últimos ingresos</p>
                  </div>
                </div>
                <div className="space-y-3 overflow-y-auto flex-1">
                  {recentEgresados.map((egresado, index) => (
                    <div key={egresado.id} className="group/item relative bg-gray-900/50 hover:bg-gray-900/70 border border-gray-800 hover:border-violet-500/50 rounded-xl p-4 transition-all duration-300">
                      <div className="flex items-start gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-black text-white text-base">
                            {egresado.nombre.charAt(0)}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#25262B]"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white text-sm mb-0.5 truncate">{egresado.nombre}</p>
                          <p className="text-xs text-gray-400 mb-1.5 truncate">{egresado.carrera}</p>
                          <div className="flex items-center gap-2">
                            <div className="px-2 py-0.5 rounded-lg bg-violet-500/20 border border-violet-500/30">
                              <span className="text-[10px] font-bold text-violet-300">{new Date(egresado.fecha).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link 
                    to="/admin/egresados" 
                    className="block w-full text-center py-4 px-6 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white text-base font-bold transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Ver todos los egresados →
                  </Link>
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>
        
        {/* FOOTER - VERDE INSTITUCIONAL MÁS COMPACTO */}
        <footer className="bg-[#00BC4F] py-4" style={{width: '100vw'}}>
          <div className="text-center space-y-1">
            <p className="text-lg font-black text-white tracking-wide">
              © 2025 URPex
            </p>
            <p className="text-sm font-extrabold text-white">
              Club de Egresados - Universidad Ricardo Palma
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;