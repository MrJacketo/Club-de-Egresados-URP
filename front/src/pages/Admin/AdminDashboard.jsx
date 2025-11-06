import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import { Users, Award, Newspaper, Percent } from "lucide-react";
import apiClient from '../../api/apiClient';
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
    membresiasActivas: 0,
    totalNoticias: 0,
    totalBeneficios: 0
  });
  
  const [membresiasPorEstado, setMembresiasPorEstado] = useState({
    activas: 0,
    inactivas: 0,
    vencidas: 0,
    pendientes: 0,
    sinMembresia: 0
  });
  
  const [registrosPorMes, setRegistrosPorMes] = useState([0,0,0,0,0,0,0,0,0,0,0,0]);
  
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
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        console.log('🔄 Iniciando carga de datos del dashboard...');
        
        // 1. OBTENER DATOS DE USUARIOS
        console.log('📊 Petición 1: GET /api/admin/users');
        const usersResponse = await apiClient.get('/api/admin/users');
        console.log('✅ Respuesta usuarios:', usersResponse.data);
        
        const totalUsers = usersResponse.data.totalUsers || 0;
        const activeUsers = usersResponse.data.activeUsers || 0;
        const activeMembers = usersResponse.data.activeMembers || 0;
        const todosLosUsuarios = usersResponse.data.users || [];
        
        // 2. OBTENER DATOS DE MEMBRESÍAS
        console.log('📊 Petición 2: GET /api/membresia/getAll');
        const membresiasResponse = await apiClient.get('/api/membresia/getAll');
        console.log('✅ Respuesta membresías:', membresiasResponse.data);
        
        const todasLasMembresias = membresiasResponse.data || [];
        const totalMembresias = todasLasMembresias.length;
        
        // Contar membresías por estado
        const conteoEstados = {
          activas: 0,
          inactivas: 0,
          vencidas: 0,
          pendientes: 0
        };
        
        todasLasMembresias.forEach(membresia => {
          const estado = (membresia.estado || '').toLowerCase();
          if (estado === 'activa') conteoEstados.activas++;
          else if (estado === 'inactiva') conteoEstados.inactivas++;
          else if (estado === 'vencida') conteoEstados.vencidas++;
          else if (estado === 'pendiente') conteoEstados.pendientes++;
        });
        
        const sinMembresia = totalUsers - totalMembresias;
        
        console.log('📈 Membresías por estado:', conteoEstados);
        console.log('📉 Sin membresía:', sinMembresia);
        
        setMembresiasPorEstado({
          activas: conteoEstados.activas,
          inactivas: conteoEstados.inactivas,
          vencidas: conteoEstados.vencidas,
          pendientes: conteoEstados.pendientes,
          sinMembresia: sinMembresia > 0 ? sinMembresia : 0
        });
        
        // 3. OBTENER DATOS DE NOTICIAS
        console.log('📊 Petición 3: GET /api/noticias');
        const noticiasResponse = await apiClient.get('/api/noticias');
        console.log('✅ Respuesta noticias:', noticiasResponse.data);
        
        const totalNoticias = noticiasResponse.data.pagination?.totalItems || 0;
        
        // 4. OBTENER DATOS DE BENEFICIOS
        console.log('📊 Petición 4: GET /api/beneficios/ver-beneficios');
        const beneficiosResponse = await apiClient.get('/api/beneficios/ver-beneficios');
        console.log('✅ Respuesta beneficios:', beneficiosResponse.data);
        
        const todosBeneficios = beneficiosResponse.data || [];
        const totalBeneficios = Array.isArray(todosBeneficios) ? todosBeneficios.length : 0;
        
        // 5. ACTUALIZAR STATS DE LAS CARDS
        setStats({
          totalEgresados: totalUsers,
          egresadosActivos: activeUsers,
          totalMembresias: totalMembresias,
          membresiasActivas: conteoEstados.activas,
          totalNoticias: totalNoticias,
          totalBeneficios: totalBeneficios
        });
        
        console.log('📊 Stats actualizadas:', {
          totalEgresados: totalUsers,
          egresadosActivos: activeUsers,
          totalMembresias: totalMembresias,
          membresiasActivas: conteoEstados.activas,
          totalNoticias: totalNoticias,
          totalBeneficios: totalBeneficios
        });
        
        // 6. PROCESAR REGISTROS POR MES (GRÁFICO DE LÍNEA)
        const añoActual = new Date().getFullYear();
        const registrosPorMesArray = [0,0,0,0,0,0,0,0,0,0,0,0];
        
        todosLosUsuarios.forEach(usuario => {
          if (usuario.createdAt) {
            const fechaCreacion = new Date(usuario.createdAt);
            const añoCreacion = fechaCreacion.getFullYear();
            
            if (añoCreacion === añoActual) {
              const mes = fechaCreacion.getMonth();
              registrosPorMesArray[mes]++;
            }
          }
        });
        
        console.log('📅 Registros por mes (2025):', registrosPorMesArray);
        setRegistrosPorMes(registrosPorMesArray);
        
        // 7. PROCESAR REGISTROS RECIENTES (TABLA)
        const usuariosOrdenados = todosLosUsuarios
          .filter(usuario => usuario.createdAt) // Solo usuarios con fecha
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        
        const registrosRecientesFormateados = usuariosOrdenados.map(usuario => ({
          id: usuario._id,
          nombre: usuario.name || 'Sin nombre',
          carrera: usuario.carrera || 'Sin carrera',
          fecha: usuario.createdAt
        }));
        
        console.log('📋 Registros recientes:', registrosRecientesFormateados);
        setRecentEgresados(registrosRecientesFormateados);
        
        console.log('✅ ¡Datos del dashboard cargados exitosamente!');
        setLoading(false);
        
      } catch (error) {
        console.error('❌ Error al cargar datos del dashboard:', error);
        console.error('Detalles del error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
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
    labels: ['Activa', 'Inactiva', 'Vencida', 'Pendiente', 'Sin Membresía'],
    datasets: [
      {
        data: [
          membresiasPorEstado.activas,
          membresiasPorEstado.inactivas,
          membresiasPorEstado.vencidas,
          membresiasPorEstado.pendientes,
          membresiasPorEstado.sinMembresia
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.6)',   // Verde - Activa
          'rgba(156, 163, 175, 0.5)', // Gris - Inactiva
          'rgba(239, 68, 68, 0.5)',   // Rojo - Vencida
          'rgba(251, 191, 36, 0.5)',  // Amarillo - Pendiente
          'rgba(59, 130, 246, 0.5)',  // Azul - Sin membresía
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Datos para gráfica de línea - Registros mensuales
  const registrosMensualesData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [
      {
        label: 'Nuevos registros',
        data: registrosPorMes,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
      },
    ],
  };
  if (loading) {
    return (
      <div className="bg-white">
        <AdminSidebar />
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-96 bg-gray-800 rounded-3xl"></div>
                <div className="h-96 bg-gray-800 rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <AdminSidebar />
      <div className={`transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        
        {/* SECCIÓN 1: Título y Cards */}
        <section className="pt-16 p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Título */}
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-6xl font-black bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent tracking-tight mb-4">
                Panel de Control
              </h1>
              <div className="w-32 h-2 bg-gradient-to-r from-[#00BC4F] to-emerald-400 rounded-full mx-auto"></div>
            </div>
            
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card Egresados */}
              <div className="relative group overflow-hidden rounded-3xl bg-white border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
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
                  <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">Total Egresados</p>
                  <p className="text-5xl font-black text-gray-900">{stats.totalEgresados}</p>
                  <div className="flex items-center gap-2 pt-3">
                    <div className="flex-1 h-2.5 bg-blue-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.round((stats.egresadosActivos/stats.totalEgresados)*100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-blue-600">{Math.round((stats.egresadosActivos/stats.totalEgresados)*100)}%</span>
                  </div>
                  <p className="text-xs text-gray-600 pt-0.5">{stats.egresadosActivos} activos</p>
                </div>
                </div>
              </div>
              
              {/* Card Membresías */}
              <div className="relative group overflow-hidden rounded-3xl bg-white border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-4 rounded-2xl bg-purple-500/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                    <Award size={32} className="text-purple-400" />
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-purple-500/20 backdrop-blur-sm">
                    <span className="text-xs font-bold text-purple-300 tracking-wider">ACTIVAS</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-purple-600 uppercase tracking-wider">Membresías</p>
                  <p className="text-5xl font-black text-gray-900">{stats.totalMembresias}</p>
                  <div className="flex items-center gap-2 pt-3">
                    <div className="flex-1 h-2.5 bg-purple-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full transition-all duration-1000"
                        style={{ width: `${stats.totalMembresias > 0 ? Math.round((stats.membresiasActivas/stats.totalMembresias)*100) : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-purple-600">{stats.totalMembresias > 0 ? Math.round((stats.membresiasActivas/stats.totalMembresias)*100) : 0}%</span>
                  </div>
                  <p className="text-xs text-gray-600 pt-0.5">{stats.membresiasActivas} activas</p>
                </div>
                </div>
              </div>
              
              {/* Card Noticias */}
              <div className="relative group overflow-hidden rounded-3xl bg-white border border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
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
                  <p className="text-sm font-medium text-amber-600 uppercase tracking-wider">Noticias</p>
                  <p className="text-5xl font-black text-gray-900">{stats.totalNoticias}</p>
                  <div className="pt-4 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse delay-75"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse delay-150"></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">Últimos 30 días</p>
                </div>
                </div>
              </div>
              
              {/* Card Beneficios */}
              <div className="relative group overflow-hidden rounded-3xl bg-white border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
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
                  <p className="text-sm font-medium text-emerald-600 uppercase tracking-wider">Beneficios</p>
                  <p className="text-5xl font-black text-gray-900">{stats.totalBeneficios}</p>
                  <div className="pt-4 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">Disponibles ahora</p>
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
              {/* Gráfico de Barras */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                <div className="relative bg-white border border-gray-200 rounded-3xl p-8 shadow-lg overflow-hidden h-96">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 mb-2">Distribución por Carrera</h2>
                      <p className="text-sm text-gray-600">Egresados registrados por programa académico</p>
                    </div>
                    <div className="w-3 h-12 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                  </div>
                  <div className="h-64">
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
              
              {/* Gráfico de Dona */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-amber-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                <div className="relative bg-white border border-gray-200 rounded-3xl p-8 shadow-lg overflow-hidden h-96">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-amber-500 to-yellow-500"></div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 mb-2">Tipos de Membresía</h2>
                      <p className="text-sm text-gray-600">Distribución de planes activos</p>
                    </div>
                    <div className="w-3 h-12 bg-gradient-to-b from-pink-500 to-amber-500 rounded-full"></div>
                  </div>
                  <div className="h-64 flex items-center justify-center">
                    <div className="w-full h-full max-w-xs">
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
        
        {/* SECCIÓN 3: Registros */}
        <section className="p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Gráfico de Línea - Ocupa 2 columnas */}
              <div className="col-span-1 lg:col-span-2 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                <div className="relative bg-white border border-gray-200 rounded-3xl p-8 shadow-lg overflow-hidden h-96">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 mb-2">Registros Mensuales</h2>
                      <p className="text-sm text-gray-600">Tendencia de nuevos egresados registrados</p>
                    </div>
                    <div className="w-3 h-12 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                  </div>
                  <div className="h-64">
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
              
              {/* Tabla de registros recientes */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                <div className="relative bg-white border border-gray-200 rounded-3xl p-8 shadow-lg overflow-hidden h-96 flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500"></div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-black text-gray-900 mb-2">Registros Recientes</h2>
                      <p className="text-xs text-gray-600">Últimos ingresos</p>
                    </div>
                  </div>
                  <div className="space-y-3 overflow-y-auto flex-1">
                  {recentEgresados.map((egresado, index) => (
                    <div key={egresado.id} className="group/item relative bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-violet-300 rounded-xl p-4 transition-all duration-300">
                      <div className="flex items-start gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-black text-white text-base">
                            {egresado.nombre.charAt(0)}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 text-sm mb-0.5 truncate">{egresado.nombre}</p>
                          <p className="text-xs text-gray-600 mb-1.5 truncate">{egresado.carrera}</p>
                          <div className="flex items-center gap-2">
                            <div className="px-2 py-0.5 rounded-lg bg-violet-100 border border-violet-200">
                              <span className="text-[10px] font-bold text-violet-700">{new Date(egresado.fecha).toLocaleDateString()}</span>
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
      </div>
    </div>
  );
};

export default AdminDashboard;