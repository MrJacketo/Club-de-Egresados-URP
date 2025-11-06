import React, { useState, useEffect } from 'react';
import ModeradorSidebar from '../../components/ModeradorSidebar';
import { Eye, Search, Filter } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { ModeradorSidebarProvider, useModeradorSidebar } from '../../context/moderadorSidebarContext';
import toast from 'react-hot-toast';

const GestionOfertasModerador = () => {
  return (
    <ModeradorSidebarProvider>
      <GestionOfertasModeradorContent />
    </ModeradorSidebarProvider>
  );
};

const GestionOfertasModeradorContent = () => {
  const { collapsed } = useModeradorSidebar();
  const [ofertas, setOfertas] = useState([]);
  const [filteredOfertas, setFilteredOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todas');
  const [filterAprobado, setFilterAprobado] = useState('todas');
  const [activeTab, setActiveTab] = useState('todas'); // Nueva pestaña activa
  const [selectedOferta, setSelectedOferta] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOfertas();
  }, []);

  useEffect(() => {
    filterOfertas();
  }, [ofertas, searchTerm, filterEstado, filterAprobado, activeTab]);

  const fetchOfertas = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/moderador/ofertas');
      console.log('Ofertas obtenidas:', response.data);
      setOfertas(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener ofertas:', error);
      toast.error('Error al cargar las ofertas');
      setLoading(false);
    }
  };

  const filterOfertas = () => {
    let filtered = [...ofertas];

    // Filtrar por pestaña activa
    if (activeTab === 'pendientes') {
      filtered = filtered.filter(oferta => oferta.estado === 'Pendiente' && oferta.aprobado === false);
    } else if (activeTab === 'aprobadas') {
      filtered = filtered.filter(oferta => oferta.aprobado === true);
    } else if (activeTab === 'activas') {
      filtered = filtered.filter(oferta => oferta.estado === 'Activo' && oferta.aprobado === true);
    }
    // 'todas' no filtra nada adicional

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(oferta =>
        oferta.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        oferta.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        oferta.creador?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado (solo si no estamos en una pestaña específica)
    if (filterEstado !== 'todas' && activeTab === 'todas') {
      filtered = filtered.filter(oferta => oferta.estado === filterEstado);
    }

    // Filtrar por aprobación (solo si no estamos en una pestaña específica)
    if (filterAprobado === 'aprobadas' && activeTab === 'todas') {
      filtered = filtered.filter(oferta => oferta.aprobado === true);
    } else if (filterAprobado === 'pendientes' && activeTab === 'todas') {
      filtered = filtered.filter(oferta => oferta.aprobado === false);
    }

    setFilteredOfertas(filtered);
  };

  const handleAprobar = async (id) => {
    try {
      const response = await apiClient.patch(`/api/moderador/oferta/${id}/aprobar`);
      toast.success('Oferta aprobada exitosamente');
      fetchOfertas();
    } catch (error) {
      console.error('Error al aprobar oferta:', error);
      toast.error('Error al aprobar la oferta');
    }
  };

  const handleDesaprobar = async (id) => {
    try {
      const response = await apiClient.patch(`/api/moderador/oferta/${id}/desaprobar`);
      toast.success('Oferta rechazada exitosamente');
      fetchOfertas();
    } catch (error) {
      console.error('Error al rechazar oferta:', error);
      toast.error('Error al rechazar la oferta');
    }
  };

  const handleVerDetalles = (oferta) => {
    setSelectedOferta(oferta);
    setShowModal(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterEstado('todas');
    setFilterAprobado('todas');
    setActiveTab('todas');
  };

  if (loading) {
    return (
      <div className="bg-white">
        <ModeradorSidebar />
        <div className={`transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="pt-20 p-16">
            <div className="animate-pulse flex flex-col gap-8">
              <div className="h-20 bg-gray-800 rounded-3xl"></div>
              <div className="h-96 bg-gray-800 rounded-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <ModeradorSidebar />
      <div className={`transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        
        {/* Header */}
        <div className="pt-16 p-8 bg-white shadow-md">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Gestión de Ofertas Laborales
            </h1>
            <p className="text-gray-600 font-medium mb-6">
              Revisa, aprueba y gestiona las ofertas laborales publicadas
            </p>

            {/* Pestañas de navegación */}
            <div className="flex gap-2 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('todas')}
                className={`px-6 py-3 font-bold text-sm transition-all duration-300 border-b-2 ${
                  activeTab === 'todas'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Todas las Ofertas
                <span className="ml-2 px-2 py-1 rounded-full bg-gray-100 text-xs">
                  {ofertas.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('pendientes')}
                className={`px-6 py-3 font-bold text-sm transition-all duration-300 border-b-2 ${
                  activeTab === 'pendientes'
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📋 Solicitudes Pendientes
                <span className="ml-2 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                  {ofertas.filter(o => o.estado === 'Pendiente' && !o.aprobado).length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('aprobadas')}
                className={`px-6 py-3 font-bold text-sm transition-all duration-300 border-b-2 ${
                  activeTab === 'aprobadas'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                ✓ Aprobadas
                <span className="ml-2 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                  {ofertas.filter(o => o.aprobado).length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('activas')}
                className={`px-6 py-3 font-bold text-sm transition-all duration-300 border-b-2 ${
                  activeTab === 'activas'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🚀 Activas
                <span className="ml-2 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                  {ofertas.filter(o => o.estado === 'Activo' && o.aprobado).length}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Búsqueda */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Buscar por cargo, empresa o creador..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Filtro Estado */}
                <div>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    value={filterEstado}
                    onChange={(e) => setFilterEstado(e.target.value)}
                  >
                    <option value="todas">Todos los estados</option>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>

                {/* Filtro Aprobación */}
                <div>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    value={filterAprobado}
                    onChange={(e) => setFilterAprobado(e.target.value)}
                  >
                    <option value="todas">Todas las ofertas</option>
                    <option value="aprobadas">Aprobadas</option>
                    <option value="pendientes">Pendientes</option>
                  </select>
                </div>
              </div>

              {/* Botón limpiar filtros */}
              {(searchTerm || filterEstado !== 'todas' || filterAprobado !== 'todas') && (
                <div className="mt-4">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>

            {/* Contador de resultados */}
            <div className="mb-4">
              <p className="text-gray-600 font-semibold">
                Mostrando {filteredOfertas.length} de {ofertas.length} ofertas
              </p>
            </div>

            {/* Tabla de ofertas */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold">Cargo</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Empresa</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Creador</th>
                      <th className="px-6 py-4 text-center text-sm font-bold">Estado</th>
                      <th className="px-6 py-4 text-center text-sm font-bold">Aprobado</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Fecha</th>
                      <th className="px-6 py-4 text-center text-sm font-bold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOfertas.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                          No se encontraron ofertas con los filtros aplicados
                        </td>
                      </tr>
                    ) : (
                      filteredOfertas.map((oferta) => (
                        <tr key={oferta._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900">{oferta.cargo}</p>
                            <p className="text-sm text-gray-500">{oferta.area}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-700">{oferta.empresa}</p>
                            <p className="text-sm text-gray-500">{oferta.modalidad}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-700">{oferta.creador?.nombre || 'N/A'}</p>
                            <p className="text-sm text-gray-500">{oferta.creador?.email || 'N/A'}</p>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              oferta.estado === 'Activo' 
                                ? 'bg-green-100 text-green-700' 
                                : oferta.estado === 'Pendiente'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {oferta.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {oferta.aprobado ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                <span>✓</span>
                                <span>Aprobado</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                                <span>⏱</span>
                                <span>Pendiente</span>
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(oferta.fechaPublicacion).toLocaleDateString('es-ES')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {/* Ver detalles */}
                              <button
                                onClick={() => handleVerDetalles(oferta)}
                                className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                                title="Ver detalles"
                              >
                                <Eye size={18} />
                              </button>
                              
                              {/* Aprobar/Desaprobar */}
                              {oferta.aprobado ? (
                                <button
                                  onClick={() => handleDesaprobar(oferta._id)}
                                  className="flex items-center justify-center gap-1.5 w-28 h-10 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors font-bold text-xs"
                                  title="Rechazar oferta"
                                >
                                  <span>✕</span>
                                  <span>Rechazar</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleAprobar(oferta._id)}
                                  className="flex items-center justify-center gap-1.5 w-28 h-10 bg-emerald-100 hover:bg-emerald-200 text-emerald-600 rounded-lg transition-colors font-bold text-xs"
                                  title="Aprobar y publicar"
                                >
                                  <span>✓</span>
                                  <span>Aprobar</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de detalles */}
      {showModal && selectedOferta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-3xl">
              <h2 className="text-2xl font-black">Detalles de la Oferta</h2>
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{selectedOferta.cargo}</h3>
                <p className="text-blue-600 font-semibold">{selectedOferta.empresa}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-bold text-gray-600">Modalidad</p>
                  <p className="text-gray-900">{selectedOferta.modalidad}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-600">Ubicación</p>
                  <p className="text-gray-900">{selectedOferta.ubicacion}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-600">Tipo de Contrato</p>
                  <p className="text-gray-900">{selectedOferta.tipoContrato}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-600">Requisitos</p>
                  <p className="text-gray-900">{selectedOferta.requisitos}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-600">Descripción</p>
                <p className="text-gray-900">{selectedOferta.descripcion}</p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-600">Área</p>
                <p className="text-gray-900">{selectedOferta.area}</p>
              </div>

              {selectedOferta.salario > 0 && (
                <div>
                  <p className="text-sm font-bold text-gray-600">Salario</p>
                  <p className="text-gray-900">S/. {selectedOferta.salario}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-bold text-gray-600">Creado por</p>
                <p className="text-gray-900">{selectedOferta.creador?.nombre}</p>
                <p className="text-sm text-gray-500">{selectedOferta.creador?.email}</p>
              </div>

              <div className="flex gap-4">
                <div>
                  <p className="text-sm font-bold text-gray-600">Estado</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    selectedOferta.estado === 'Activo' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedOferta.estado}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-600">Aprobación</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    selectedOferta.aprobado 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedOferta.aprobado ? '✓ Aprobado' : '⏱ Pendiente'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-b-3xl flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl font-bold transition-colors"
              >
                Cerrar
              </button>
              {!selectedOferta.aprobado ? (
                <button
                  onClick={() => {
                    handleAprobar(selectedOferta._id);
                    setShowModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors"
                >
                  Aprobar Oferta
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleDesaprobar(selectedOferta._id);
                    setShowModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors"
                >
                  Desaprobar Oferta
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionOfertasModerador;
