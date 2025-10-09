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
      <div className="flex px-12 py-2">
        <AdminSidebar />
        <div className="ml-20  lg:ml-64 flex-1">
          <h1 className="text-2xl font-bold mb-6">Cargando dashboard...</h1>
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="h-80 bg-gray-200 rounded"></div>
              <div className="h-80 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }  return (
    <div className="flex px-12 py-2">
      <AdminSidebar />
      <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        <h1 className="text-2xl font-bold mb-6">Panel de Control</h1>
        
        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                <Users size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Egresados</p>
                <p className="text-xl text-gray-500 font-semibold">{stats.totalEgresados}</p>
                <p className="text-xs text-gray-500">{Math.round((stats.egresadosActivos/stats.totalEgresados)*100)}% activos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-500">
                <Award size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Membresías</p>
                <p className="text-xl text-gray-500 font-semibold">{stats.totalMembresias}</p>
                <p className="text-xs text-gray-500">{Math.round((stats.membresiasPremium/stats.totalMembresias)*100)}% premium</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
                <Newspaper size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Noticias</p>
                <p className="text-xl text-gray-500 font-semibold">{stats.totalNoticias}</p>
                <p className="text-xs text-gray-500">Últimos 30 días</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-500">
                <Percent size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Beneficios</p>
                <p className="text-xl text-gray-500 font-semibold">{stats.totalBeneficios}</p>
                <p className="text-xs text-gray-500">Disponibles actualmente</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg text-gray-500 font-semibold mb-4">Distribución por Carrera</h2>
            <div className="h-75">
              <Bar 
                data={carrerasData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg text-gray-500 font-semibold mb-4">Tipos de Membresía</h2>
            <div className="flex justify-center items-center">
              <div style={{ width: '70%', height: '70%' }}>
                <Doughnut 
                  data={membresiasData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg text-gray-500 font-semibold mb-4">Registros Mensuales</h2>
            <div className="h-80">
              <Line 
                data={registrosMensualesData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }} 
              />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg text-gray-500 font-semibold mb-4">Registros Recientes</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-gray-50">
                  <tr>
                    <th className="text-gray-500 px-6 py-3">Nombre</th>
                    <th className="text-gray-500 px-6 py-3">Carrera</th>
                    <th className="text-gray-500 px-6 py-3">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEgresados.map(egresado => (
                    <tr key={egresado.id} className="border-b">
                      <td className="text-gray-500 px-6 py-4">{egresado.nombre}</td>
                      <td className="text-gray-500 px-6 py-4">{egresado.carrera}</td>
                      <td className="text-gray-500 px-6 py-4">{new Date(egresado.fecha).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 text-center">
                <Link to="/admin/egresados" className="text-blue-600 hover:underline">Ver todos los egresados →</Link>
              </div>
            </div>
          </div>          <div className = "pt-8">
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;