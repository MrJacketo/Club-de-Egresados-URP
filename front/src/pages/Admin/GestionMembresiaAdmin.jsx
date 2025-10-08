import React, { useState, useEffect } from 'react';
import { AdminSidebarProvider, useAdminSidebar } from '../../context/adminSidebarContext';
import AdminSidebar from '../../components/AdminSidebar';
import { 
  Search, Users, Calendar, DollarSign, TrendingUp, Eye, Edit3, Trash2, 
  UserX, UserCheck, Download, RefreshCw, AlertTriangle, CheckCircle, Clock, X
} from 'lucide-react';
import { getAllMembresiasRequest, updateMembresiaEstadoRequest, eliminarMembresiaAdmin } from "../../api/membresiaApi";

// Utilidades
const formatDate = (date) => new Date(date).toLocaleDateString();
const calcularDiasRestantes = (fecha) => Math.ceil((new Date(fecha) - new Date()) / (1000 * 3600 * 24));

const estadoConfig = {
  activa: { color: 'bg-green-100 text-green-800', icon: CheckCircle, iconColor: 'text-green-600' },
  vencida: { color: 'bg-red-100 text-red-800', icon: AlertTriangle, iconColor: 'text-red-600' },
  inactiva: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, iconColor: 'text-yellow-600' }
};

const handleEliminar = async (firebaseUid) => {
  if (confirm("¿Estás seguro de que deseas eliminar esta membresía?")) {
    try {
      await eliminarMembresiaAdmin(firebaseUid);
      alert("Membresía eliminada correctamente.");
      await cargarMembresias(); // vuelve a cargar la lista actualizada
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al eliminar la membresía.");
    }
  }
};
// Componentes
const EstadisticaCard = ({ titulo, valor, icon: Icon, color = "blue", extra }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{titulo}</p>
        <p className={`text-2xl font-bold text-${color}-600`}>{valor}</p>
        {extra}
      </div>
      <div className={`p-3 bg-${color}-100 rounded-full`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
    </div>
  </div>
);

const EstadoBadge = ({ estado }) => {
  const config = estadoConfig[estado];
  const Icon = config.icon;
  return (
    <div className="flex items-center">
      <Icon size={16} className={config.iconColor} />
      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    </div>
  );
};

const BarraProgreso = ({ usado = 0, total = 5 }) => {
  const porcentaje = (usado / total) * 100;
  return (
    <div>
      <div className="text-sm text-gray-900">{usado} / {total}</div>
      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
        <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${porcentaje}%` }}></div>
      </div>
    </div>
  );
};

const FilaMembresia = ({ membresia, onVerDetalles, onEditarDetalles }) => {
  const diasRestantes = calcularDiasRestantes(membresia.fechaVencimiento);
  
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-4 whitespace-nowrap max-w-[200px]">
        <div className="truncate">
          <div className="text-sm font-medium text-gray-900 truncate">{membresia.usuario?.nombre}</div>
          <div className="text-xs text-gray-500 truncate">{membresia.usuario?.email}</div>
          <div className="text-xs text-gray-400">#{membresia.usuario?.codigo}</div>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <EstadoBadge estado={membresia.estado} />
        {membresia.estado === 'activa' && diasRestantes < 30 && diasRestantes > 0 && (
          <div className="text-xs text-orange-600 mt-1">Vence en {diasRestantes}d</div>
        )}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="flex items-center text-green-600 text-xs">
          <Calendar size={12} className="mr-1" />
          {formatDate(membresia.fechaActivacion)}
        </div>
        <div className="flex items-center text-red-600 mt-1 text-xs">
          <Calendar size={12} className="mr-1" />
          {formatDate(membresia.fechaVencimiento)}
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <BarraProgreso usado={membresia.beneficiosUsados || 0} total={membresia.totalBeneficios || 5} />
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        S/ {membresia.precio || 0}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onVerDetalles(membresia)} 
            className="text-teal-600 hover:text-teal-900 p-1"
            title="Ver detalles"
          >
            <Eye size={14} />
          </button>
          <button 
            onClick={() => onEditarDetalles(membresia)} 
            className="text-blue-600 hover:text-blue-900 p-1"
            title="Editar"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={() => handleEliminar(membresia.usuario.codigo)}
            className="text-red-600 hover:text-red-900 p-1"
            title="Eliminar"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const ModalDetalles = ({ membresia, onClose, onCambiarEstado, loading, modoEdicion }) => {
  if (!membresia) return null;
  
  const diasRestantes = calcularDiasRestantes(membresia.fechaVencimiento);
  const porcentajeBeneficios = Math.round(((membresia.beneficiosUsados || 0) / (membresia.totalBeneficios || 5) * 100));
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Detalles de Membresía</h3>
          <button onClick={onClose} className="text-white hover:text-gray-600 p-1">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <p className="text-sm font-medium text-gray-900">{membresia.usuario?.nombre}</p>
              <p className="text-xs text-gray-500">{membresia.usuario?.email}</p>
              <p className="text-xs text-gray-400">Código: {membresia.usuario?.codigo}</p>
            </div>
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <div className="flex justify-center">
                <EstadoBadge estado={membresia.estado} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Activación</label>
              <p className="text-sm font-medium text-gray-900">{formatDate(membresia.fechaActivacion)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vencimiento</label>
              <p className="text-sm font-medium text-gray-900">{formatDate(membresia.fechaVencimiento)}</p>
              <p className="text-xs text-gray-500">{diasRestantes} días restantes</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
              <p className="text-sm font-medium text-gray-900">S/ {membresia.precio || 0}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Última Actividad</label>
              <p className="text-sm font-medium text-gray-900">
                {membresia.ultimaActividad ? formatDate(membresia.ultimaActividad) : 'N/A'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Beneficios</label>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{(membresia.beneficiosUsados || 0)} de {(membresia.totalBeneficios || 5)} utilizados</span>
                <span className="font-semibold">{porcentajeBeneficios}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-teal-600 h-3 rounded-full" style={{ width: `${porcentajeBeneficios}%` }}></div>
              </div>
            </div>
          </div>

         <div className="flex gap-2 pt-4">
            {modoEdicion && membresia.estado === 'activa' && (
              <button
                onClick={() => onCambiarEstado(membresia, 'inactiva')}
                className="flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-md hover:bg-yellow-700"
                disabled={loading}
              >
                <UserX size={16} className="mr-2" />
                Suspender
              </button>
            )}

            {modoEdicion && membresia.estado === 'inactiva' && (
              <button
                onClick={() => onCambiarEstado(membresia, 'activa')}
                className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                disabled={loading}
              >
                <UserCheck size={16} className="mr-2" />
                Reactivar
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-white text-sm font-medium rounded-md hover:bg-gray-400"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Paginacion = ({ paginaActual, totalPaginas, onCambioPagina, totalItems, itemsPorPagina }) => {
  const inicio = (paginaActual - 1) * itemsPorPagina + 1;
  const fin = Math.min(paginaActual * itemsPorPagina, totalItems);
  
  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <p className="text-sm text-gray-700">
          Mostrando <span className="font-medium">{inicio}</span> a{' '}
          <span className="font-medium">{fin}</span> de{' '}
          <span className="font-medium">{totalItems}</span> resultados
        </p>
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
            <button
              key={pagina}
              onClick={() => onCambioPagina(pagina)}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                pagina === paginaActual
                  ? 'z-10 bg-teal-50 border-teal-500 text-teal-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {pagina}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

const GestionMembresiaAdmin = () => {
  const [membresias, setMembresias] = useState([]);
  const [filtros, setFiltros] = useState({ busqueda: '', estado: 'todos' });
  const [paginaActual, setPaginaActual] = useState(1);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [membresiaSeleccionada, setMembresiaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDatos, setLoadingDatos] = useState(true);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [estadisticas, setEstadisticas] = useState({
    totalMembresias: 0,
    membresiasActivas: 0,
    membresiasInactivas: 0,
    membresiasSuspendidas: 0,
    ingresosMensuales: 0,
    crecimientoMensual: 0
  });

  const itemsPorPagina = 10;
  const { collapsed } = useAdminSidebar();
  
  useEffect(() => {
    const fetchMembresias = async () => {
      setLoadingDatos(true);
      try {
        const data = await getAllMembresiasRequest();
        setMembresias(data);
        setEstadisticas(calcularEstadisticas(data));
      } catch (error) {
        console.error("Error al obtener membresías:", error);
      } finally {
        setLoadingDatos(false);
      }
    };
    fetchMembresias();
  }, []);

  // Filtrar membresías
  const membresiasFiltradas = membresias.filter(membresia => {
    const { busqueda, estado } = filtros;
    const { usuario } = membresia;
    
    const cumpleBusqueda = !busqueda || 
      (usuario?.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || 
       usuario?.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
       usuario?.codigo?.includes(busqueda));
    
    const cumpleEstado = estado === 'todos' || membresia.estado === estado;
    
    return cumpleBusqueda && cumpleEstado;
  });

  const totalPaginas = Math.ceil(membresiasFiltradas.length / itemsPorPagina);
  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const membresiasActuales = membresiasFiltradas.slice(indiceInicio, indiceInicio + itemsPorPagina);

  const handleCambiarEstado = async (membresia, nuevoEstado) => {
    setLoading(true);
    try {
      await updateMembresiaEstadoRequest(membresia.usuario.codigo, nuevoEstado);
      await handleActualizarDatos();
      handleCerrarModal();  
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalles = (membresia) => {
    setModoEdicion(false);
    setMembresiaSeleccionada(membresia);
    setMostrarModal(true);
  };

  const handleEditar = (membresia) => {
    setModoEdicion(true);
    setMembresiaSeleccionada(membresia);
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setMembresiaSeleccionada(null);
  };
  const calcularEstadisticas = (data) => {
    const total = data.length;
    const activas = data.filter(m => m.estado === 'activa').length;
    const inactivas = data.filter(m => m.estado === 'inactiva').length;
    const suspendidas = data.filter(m => m.estado === 'suspendida').length;
    const ingresos = activas * 150;

    return {
      totalMembresias: total,
      membresiasActivas: activas,
      membresiasInactivas: inactivas,
      membresiasSuspendidas: suspendidas,
      ingresosMensuales: ingresos
    };
  };

  const handleActualizarDatos = async () => {
    setLoadingDatos(true);
    try {
      const data = await getAllMembresiasRequest();
      setMembresias(data);
      setEstadisticas(calcularEstadisticas(data));
    } catch (error) {
      console.error("Error al actualizar membresías:", error);
    } finally {
      setLoadingDatos(false);
    }
  };
  // 1. AGREGAR EL ESTADO - Agrega esto con los otros estados del componente GestionMembresiaAdmin
const [loadingExport, setLoadingExport] = useState(false);

// 2. FUNCIONES DE EXPORTACIÓN - Agrega estas funciones antes del return del componente
const generarCSV = (datos) => {
  const headers = [
    'Nombre Usuario',
    'Email', 
    'Código',
    'Estado',
    'Fecha Activación',
    'Fecha Vencimiento',
    'Beneficios Usados',
    'Total Beneficios',
    'Precio'
  ];

  const filas = datos.map(membresia => [
    membresia.usuario?.nombre || 'N/A',
    membresia.usuario?.email || 'N/A', 
    membresia.usuario?.codigo || 'N/A',
    membresia.estado,
    formatDate(membresia.fechaActivacion),
    formatDate(membresia.fechaVencimiento),
    membresia.beneficiosUsados || 0,
    membresia.totalBeneficios || 5,
    `S/ ${membresia.precio || 0}`
  ]);

  const csvContent = [
    headers.join(','),
    ...filas.map(fila => fila.map(campo => `"${campo}"`).join(','))
  ].join('\n');

  return csvContent;
};

const descargarCSV = (csvContent, nombreArchivo = 'membresias_export.csv') => {
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', nombreArchivo);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const handleExportar = () => {
  try {
    setLoadingExport(true);
    
    // Usar los datos filtrados actuales
    const datosParaExportar = membresiasFiltradas;
    
    if (datosParaExportar.length === 0) {
      alert('No hay datos para exportar');
      return;
    }
    
    const csvContent = generarCSV(datosParaExportar);
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `membresias_${fecha}.csv`;
    
    descargarCSV(csvContent, nombreArchivo);
    
    // Mostrar mensaje de éxito
    alert(`${datosParaExportar.length} membresías exportadas exitosamente`);
    
  } catch (error) {
    console.error('Error al exportar:', error);
    alert('Error al exportar los datos');
  } finally {
    setLoadingExport(false);
  }
};

  if (loadingDatos) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'} flex items-center justify-center`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando membresías...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#1C1D21] min-h-screen text-white">
      <AdminSidebar />
      <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'} overflow-auto h-screen`}>
        <div className="max-w-[1644px] mx-auto px-8 py-10 relative">
          {/* Header */}
<div className="mb-8">
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-4xl font-extrabold text-[#00BC4F] tracking-wide">Mis Membresías</h1>
    <div className="flex gap-4">
      <button 
        onClick={handleExportar}
        disabled={loadingExport || loadingDatos}
        className="flex items-center px-4 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] justify-center"
        title={`Exportar ${membresiasFiltradas.length} registros`}
      >
        {loadingExport ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            Exportando
          </>
        ) : (
          <>
            <Download size={20} className="mr-2" />
            Exportar
          </>
        )}
      </button>
      <button
        onClick={handleActualizarDatos}
        disabled={loadingDatos}
        className="flex items-center px-6 py-3 border-2 border-[#00BC4F] text-[#00BC4F] font-semibold rounded-2xl hover:bg-[#00BC4F]/10"
      >
        <RefreshCw size={20} className={`mr-2 ${loadingDatos ? 'animate-spin' : ''}`} />
        Actualizar
      </button>
    </div>
  </div>
</div>

          {/* Estadísticas */}
<div className="grid grid-cols-4 gap-6 mb-12">
  <div className="bg-[#101012] rounded-xl p-6 text-center shadow-lg flex flex-col h-full">
    <h3 className="text-2xl font-black text-[#00BC4F]/50 mb-2">Total Membresías</h3>
    
    <p className="text-6xl font-black text-white drop-shadow-[0_0_30px_rgba(0,188,79,0.65)] mt-auto">
      {estadisticas.totalMembresias || 0}
    </p>
  </div>

  <div className="bg-[#101012] rounded-xl p-6 text-center shadow-lg flex flex-col h-full">
    <h3 className="text-2xl font-black text-[#00BC4F]/50 mb-2">Activas</h3>
    <p className="text-6xl font-black text-white drop-shadow-[0_0_30px_rgba(0,188,79,0.65)] mt-auto">
      {estadisticas.membresiasActivas || 0}
    </p>
  </div>

  <div className="bg-[#101012] rounded-xl p-6 text-center shadow-lg flex flex-col h-full">
    <h3 className="text-2xl font-black text-[#00BC4F]/50 mb-2">Vencidas / Inactivas</h3>
    <p className="text-6xl font-black text-white drop-shadow-[0_0_30px_rgba(0,188,79,0.65)] mt-auto">
      {estadisticas.membresiasInactivas || 0}
    </p>
  </div>

  <div className="bg-[#101012] rounded-xl p-6 text-center shadow-lg flex flex-col h-full">
    <h3 className="text-2xl font-black text-[#00BC4F]/50 mb-2">Ingresos Mensuales</h3>
    <p className="text-3xl font-black text-white drop-shadow-[0_0_30px_rgba(0,188,79,0.65)] mt-auto">
      S/. {estadisticas.ingresosMensuales.toLocaleString()}
    </p>
  </div>
</div>


         {/* Filtros */}
<div className="bg-[#101012] rounded-lg p-6 shadow-sm ">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
    <div className="relative w-[400px]">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <input
        type="text"
        placeholder="Buscar por nombre, email o código..."
        value={filtros.busqueda}
        onChange={(e) => {
          setFiltros(prev => ({ ...prev, busqueda: e.target.value }));
          setPaginaActual(1);
        }}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
      />
    </div>
<div className="ml-[-20px]"></div>
    <select
      value={filtros.estado}
      onChange={(e) => {
        setFiltros(prev => ({ ...prev, estado: e.target.value }));
        setPaginaActual(1);
      }}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
    >
      <option value="todos">Todos los estados</option>
      <option value="activa">Activas</option>
      <option value="inactiva">Inactivas</option>
    </select>

    <div className="flex gap-2 justify-end">

    </div>
  </div>
</div>

          {/* Tabla */}
          <div className="bg-[#013617] rounded-lg shadow-sm overflow-hidden">
<div className="bg-[#101012] rounded-2xl overflow-hidden shadow-lg border border-[#00BC4F]/20">
  <table className="w-full text-white">
    <thead className="bg-[#00BC4F]/10 text-[#00BC4F] uppercase text-xs font-bold tracking-wider">
      <tr>
        <th className="px-6 py-4 text-left">Usuario</th>
        <th className="px-6 py-4 text-left">Estado</th>
        <th className="px-6 py-4 text-left">Fechas</th>
        <th className="px-6 py-4 text-left">Beneficios</th>
        <th className="px-6 py-4 text-left">Precio</th>
        <th className="px-6 py-4 text-left">Acciones</th>
      </tr>
    </thead>
                <tbody className="divide-y divide-[#00BC4F]/10">
                  {membresiasActuales.length > 0 ? (
                    membresiasActuales.map((membresia) => (
                      <FilaMembresia
                        key={membresia.id}
                        membresia={membresia}
                        onVerDetalles={handleVerDetalles}
                        onEditarDetalles={handleEditar}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No se encontraron membresías que coincidan con los filtros
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {membresiasFiltradas.length > 0 && (
              <Paginacion
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onCambioPagina={setPaginaActual}
                totalItems={membresiasFiltradas.length}
                itemsPorPagina={itemsPorPagina}
              />
            )}
          </div>
        </div>

        <ModalDetalles
          membresia={membresiaSeleccionada}
          onClose={handleCerrarModal}
          onCambiarEstado={handleCambiarEstado}
          loading={loading}
          modoEdicion={modoEdicion}
        />
      </div>
    </div>
  );
};

const GestionMembresiasAdminWrapper = () => {
  return (
    <AdminSidebarProvider>
      <GestionMembresiaAdmin />
    </AdminSidebarProvider>
  );
};

export default GestionMembresiasAdminWrapper;