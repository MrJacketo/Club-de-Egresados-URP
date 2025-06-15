import React, { useState } from 'react';
import { 
  Search, Users, Calendar, DollarSign, TrendingUp, Eye, Edit3, Trash2, 
  UserX, UserCheck, Download, RefreshCw, AlertTriangle, CheckCircle, Clock, X
} from 'lucide-react';

// Datos mock
const membresiasMock = [
  {
    id: 1,
    usuario: { nombre: "Juan Carlos Pérez", email: "juan.perez@urp.edu.pe", codigo: "2019110001" },
    estado: "activa", fechaActivacion: "2024-01-15", fechaVencimiento: "2025-01-15",
    precio: 150, beneficiosUsados: 3, totalBeneficios: 5, ultimaActividad: "2024-12-10"
  },
  {
    id: 2,
    usuario: { nombre: "María Elena Rodríguez", email: "maria.rodriguez@urp.edu.pe", codigo: "2020110045" },
    estado: "vencida", fechaActivacion: "2023-06-01", fechaVencimiento: "2024-06-01",
    precio: 150, beneficiosUsados: 5, totalBeneficios: 5, ultimaActividad: "2024-05-28"
  },
  {
    id: 3,
    usuario: { nombre: "Roberto Silva Castro", email: "roberto.silva@urp.edu.pe", codigo: "2018110123" },
    estado: "activa", fechaActivacion: "2024-08-20", fechaVencimiento: "2025-08-20",
    precio: 150, beneficiosUsados: 1, totalBeneficios: 5, ultimaActividad: "2024-12-14"
  },
  {
    id: 4,
    usuario: { nombre: "Ana Sofia Mendoza", email: "ana.mendoza@urp.edu.pe", codigo: "2021110067" },
    estado: "suspendida", fechaActivacion: "2024-03-10", fechaVencimiento: "2025-03-10",
    precio: 150, beneficiosUsados: 2, totalBeneficios: 5, ultimaActividad: "2024-11-30"
  }
];

const estadisticasMock = {
  totalMembresias: 156, membresiasActivas: 89, membresiasVencidas: 45, 
  membresiasSuspendidas: 22, ingresosMensuales: 13350, crecimientoMensual: 12.5
};

// Utilidades
const formatDate = (date) => new Date(date).toLocaleDateString();
const calcularDiasRestantes = (fecha) => Math.ceil((new Date(fecha) - new Date()) / (1000 * 3600 * 24));

const estadoConfig = {
  activa: { color: 'bg-green-100 text-green-800', icon: CheckCircle, iconColor: 'text-green-600' },
  vencida: { color: 'bg-red-100 text-red-800', icon: AlertTriangle, iconColor: 'text-red-600' },
  suspendida: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, iconColor: 'text-yellow-600' }
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

const BarraProgreso = ({ usado, total }) => {
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

const FilaMembresia = ({ membresia, onVerDetalles }) => {
  const diasRestantes = calcularDiasRestantes(membresia.fechaVencimiento);
  
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">{membresia.usuario.nombre}</div>
          <div className="text-sm text-gray-500">{membresia.usuario.email}</div>
          <div className="text-xs text-gray-400">Código: {membresia.usuario.codigo}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <EstadoBadge estado={membresia.estado} />
        {membresia.estado === 'activa' && diasRestantes < 30 && (
          <div className="text-xs text-orange-600 mt-1">Vence en {diasRestantes} días</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="flex items-center text-green-600">
          <Calendar size={14} className="mr-1" />
          {formatDate(membresia.fechaActivacion)}
        </div>
        <div className="flex items-center text-red-600 mt-1">
          <Calendar size={14} className="mr-1" />
          {formatDate(membresia.fechaVencimiento)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <BarraProgreso usado={membresia.beneficiosUsados} total={membresia.totalBeneficios} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        S/ {membresia.precio}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          <button onClick={() => onVerDetalles(membresia)} className="text-teal-600 hover:text-teal-900">
            <Eye size={16} />
          </button>
          <button className="text-blue-600 hover:text-blue-900">
            <Edit3 size={16} />
          </button>
          <button className="text-red-600 hover:text-red-900">
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const ModalDetalles = ({ membresia, onClose, onCambiarEstado, loading }) => {
  if (!membresia) return null;
  
  const diasRestantes = calcularDiasRestantes(membresia.fechaVencimiento);
  const porcentajeBeneficios = Math.round((membresia.beneficiosUsados / membresia.totalBeneficios) * 100);
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Detalles de Membresía</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <p className="text-sm font-medium text-gray-900">{membresia.usuario.nombre}</p>
              <p className="text-xs text-gray-500">{membresia.usuario.email}</p>
              <p className="text-xs text-gray-400">Código: {membresia.usuario.codigo}</p>
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
              <p className="text-sm font-medium text-gray-900">S/ {membresia.precio}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Última Actividad</label>
              <p className="text-sm font-medium text-gray-900">{formatDate(membresia.ultimaActividad)}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Beneficios</label>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{membresia.beneficiosUsados} de {membresia.totalBeneficios} utilizados</span>
                <span className="font-semibold">{porcentajeBeneficios}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-teal-600 h-3 rounded-full" style={{ width: `${porcentajeBeneficios}%` }}></div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            {membresia.estado === 'activa' && (
              <button
                onClick={() => onCambiarEstado(membresia.id, 'suspendida')}
                className="flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-md hover:bg-yellow-700"
                disabled={loading}
              >
                <UserX size={16} className="mr-2" />
                Suspender
              </button>
            )}
            
            {membresia.estado === 'suspendida' && (
              <button
                onClick={() => onCambiarEstado(membresia.id, 'activa')}
                className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                disabled={loading}
              >
                <UserCheck size={16} className="mr-2" />
                Reactivar
              </button>
            )}
            
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-100 text-sm font-medium rounded-md hover:bg-gray-400"
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

export default function GestionMembresiasAdmin() {
  const [membresias, setMembresias] = useState(membresiasMock);
  const [filtros, setFiltros] = useState({ busqueda: '', estado: 'todos' });
  const [paginaActual, setPaginaActual] = useState(1);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [membresiaSeleccionada, setMembresiaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);

  const itemsPorPagina = 10;

  // Filtrar membresías
  const membresiasFiltradas = membresias.filter(membresia => {
    const { busqueda, estado } = filtros;
    const { usuario } = membresia;
    
    const cumpleBusqueda = !busqueda || 
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.codigo.includes(busqueda);
    
    const cumpleEstado = estado === 'todos' || membresia.estado === estado;
    
    return cumpleBusqueda && cumpleEstado;
  });

  const totalPaginas = Math.ceil(membresiasFiltradas.length / itemsPorPagina);
  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const membresiasActuales = membresiasFiltradas.slice(indiceInicio, indiceInicio + itemsPorPagina);

  const handleCambiarEstado = async (id, nuevoEstado) => {
    setLoading(true);
    try {
      setMembresias(prev => prev.map(m => m.id === id ? { ...m, estado: nuevoEstado } : m));
      handleCerrarModal();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalles = (membresia) => {
    setMembresiaSeleccionada(membresia);
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setMembresiaSeleccionada(null);
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden admin-panel rounded-2xl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Membresías</h1>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <EstadisticaCard
            titulo="Total Membresías"
            valor={estadisticasMock.totalMembresias}
            icon={Users}
            color="gray"
          />
          <EstadisticaCard
            titulo="Activas"
            valor={estadisticasMock.membresiasActivas}
            icon={CheckCircle}
            color="green"
          />
          <EstadisticaCard
            titulo="Vencidas"
            valor={estadisticasMock.membresiasVencidas}
            icon={AlertTriangle}
            color="red"
          />
          <EstadisticaCard
            titulo="Ingresos Mensuales"
            valor={`S/ ${estadisticasMock.ingresosMensuales.toLocaleString()}`}
            icon={DollarSign}
            color="green"
            extra={
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp size={14} className="mr-1" />
                +{estadisticasMock.crecimientoMensual}%
              </p>
            }
          />
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o código..."
                value={filtros.busqueda}
                onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>

            <select
              value={filtros.estado}
              onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="todos">Todos los estados</option>
              <option value="activa">Activas</option>
              <option value="vencida">Vencidas</option>
              <option value="suspendida">Suspendidas</option>
            </select>

            <div className="flex gap-2">
              <button className="flex items-center px-4 py-2 text-gray-100 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Download size={16} className="mr-2" />
                Exportar
              </button>
              <button className="flex items-center px-4 py-2 text-gray-100 bg-gray-100 rounded-lg hover:bg-gray-200">
                <RefreshCw size={16} className="mr-2" />
                Actualizar
              </button>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fechas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beneficios</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {membresiasActuales.map((membresia) => (
                  <FilaMembresia
                    key={membresia.id}
                    membresia={membresia}
                    onVerDetalles={handleVerDetalles}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            onCambioPagina={setPaginaActual}
            totalItems={membresiasFiltradas.length}
            itemsPorPagina={itemsPorPagina}
          />
        </div>
      </div>

      <ModalDetalles
        membresia={membresiaSeleccionada}
        onClose={handleCerrarModal}
        onCambiarEstado={handleCambiarEstado}
        loading={loading}
      />
    </div>
  );
}