import React, { useState, useEffect } from 'react';
import InspectorSidebar from '../../components/InspectorSidebar';
import { Eye, Search, Users, Briefcase, CheckCircle, XCircle, Mail, Phone, FileText, TrendingUp } from 'lucide-react';
import { getOfertasRequest, getPostulantesDeOfertaRequest, updateEstadoPostulante, downloadCVRequest } from '../../api/ofertaLaboralApi';
import { InspectorSidebarProvider, useInspectorSidebar } from '../../context/inspectorSidebarContext';
import toast from 'react-hot-toast';

const GestionPostulantes = () => {
    return (
        <InspectorSidebarProvider>
            <GestionPostulantesContent />
        </InspectorSidebarProvider>
    );
};

const GestionPostulantesContent = () => {
    const { collapsed } = useInspectorSidebar();
    const [ofertas, setOfertas] = useState([]);
    const [filteredOfertas, setFilteredOfertas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOferta, setSelectedOferta] = useState(null);
    const [postulantes, setPostulantes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loadingPostulantes, setLoadingPostulantes] = useState(false);

    useEffect(() => {
        fetchOfertas();
    }, []);

    useEffect(() => {
        filterOfertas();
    }, [ofertas, searchTerm]);

    const fetchOfertas = async () => {
        try {
            setLoading(true);
            const data = await getOfertasRequest();

            // Obtener el conteo de postulantes para cada oferta
            const ofertasConPostulantes = await Promise.all(
                data.map(async (oferta) => {
                    try {
                        const postulantes = await getPostulantesDeOfertaRequest(oferta._id);
                        return {
                            ...oferta,
                            totalPostulantes: postulantes.length
                        };
                    } catch (error) {
                        return {
                            ...oferta,
                            totalPostulantes: 0
                        };
                    }
                })
            );

            setOfertas(ofertasConPostulantes);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener ofertas:', error);
            toast.error('Error al cargar las ofertas');
            setLoading(false);
        }
    };

    const filterOfertas = () => {
        let filtered = [...ofertas];

        if (searchTerm) {
            filtered = filtered.filter(oferta =>
                oferta.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                oferta.empresa.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredOfertas(filtered);
    };

    const handleVerPostulantes = async (oferta) => {
        setSelectedOferta(oferta);
        setShowModal(true);
        setPostulantes([]); // Limpiar postulantes anteriores
        setLoadingPostulantes(true);

        try {
            const data = await getPostulantesDeOfertaRequest(oferta._id);
            setPostulantes(data);
            setLoadingPostulantes(false);
        } catch (error) {
            setPostulantes([]); // Limpiar en caso de error también
            setLoadingPostulantes(false);
        }
    };

    const handleToggleApto = async (idPostulacion, currentApto) => {
        try {
            await updateEstadoPostulante(idPostulacion, !currentApto);
            toast.success(`Postulante marcado como ${!currentApto ? 'apto' : 'no apto'}`);

            // Recargar postulantes
            const data = await getPostulantesDeOfertaRequest(selectedOferta._id);
            setPostulantes(data);
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            toast.error('Error al actualizar estado del postulante');
        }
    };

    const handleDownloadCV = async (postulante) => {
        try {
            // Si tiene URL directa de Supabase, úsala
            if (postulante.cvUrl) {
                window.open(postulante.cvUrl, '_blank');
                return;
            }

            // Si no, usar el endpoint de descarga
            if (postulante.cvFilePath) {
                toast.loading('Generando enlace de descarga...');
                const response = await downloadCVRequest(postulante.idPostulacion);
                toast.dismiss();
                
                if (response.downloadUrl) {
                    window.open(response.downloadUrl, '_blank');
                    toast.success('CV descargado exitosamente');
                } else {
                    toast.error('Error al generar enlace de descarga');
                }
            } else {
                toast.error('CV no disponible');
            }
        } catch (error) {
            toast.dismiss();
            console.error('Error al descargar CV:', error);
            toast.error('Error al descargar el CV');
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
    };

    // Calcular métricas
    const totalOfertas = ofertas.length;
    const ofertasActivas = ofertas.filter(o => o.estado === 'Activo').length;
    const totalPostulantes = ofertas.reduce((sum, oferta) => sum + (oferta.totalPostulantes || 0), 0);

    if (loading) {
        return (
            <div className="bg-white">
                <InspectorSidebar />
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
        <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #f0f9ff, #ffffff)' }}>
            <InspectorSidebar />
            <div className={`transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>

                {/* Header */}
                <div className="pt-16 p-8 bg-white shadow-md">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-5xl text-start font-bold mb-2">
                            <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                                Inspección de Oferta Laboral
                            </span>
                        </h1>
                        <p className="text-gray-600 font-medium text-lg mb-6">
                            Revisa y gestiona los postulantes de tus ofertas laborales
                        </p>
                    </div>
                </div>

                {/* Métricas */}
                <div className="p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                                <p className="text-4xl font-bold text-gray-800">{totalOfertas}</p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="bg-green-100 p-4 rounded-xl">
                                        <CheckCircle className="text-green-600" size={32} />
                                    </div>
                                    <div className="flex items-center gap-1 text-green-600">
                                        <TrendingUp size={20} />
                                        <span className="text-sm font-bold">{totalOfertas > 0 ? ((ofertasActivas / totalOfertas) * 100).toFixed(0) : 0}%</span>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm font-medium mb-1">Ofertas Activas</p>
                                <p className="text-4xl font-bold text-gray-800">{ofertasActivas}</p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="bg-blue-100 p-4 rounded-xl">
                                        <Users className="text-blue-600" size={32} />
                                    </div>
                                    <div className="flex items-center gap-1 text-blue-600">
                                        <TrendingUp size={20} />
                                        <span className="text-sm font-bold">+{totalPostulantes}</span>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm font-medium mb-1">Total Postulantes</p>
                                <p className="text-4xl font-bold text-gray-800">{totalPostulantes}</p>
                            </div>
                        </div>

                        {/* Búsqueda */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="flex-1 relative group">
                                    <input
                                        type="text"
                                        placeholder="Buscar por cargo o empresa..."
                                        className="w-full! bg-gray-50! text-gray-800! px-6! py-4! pl-14! rounded-xl! transition-all duration-300 border-2! border-gray-200! hover:border-green-300! focus:border-green-500! focus:bg-white! focus:shadow-lg! outline-none!"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Search
                                        className="absolute left-5 top-1/2 -translate-y-1/2 text-green-500 transition-transform duration-300 group-hover:scale-110"
                                        size={24}
                                    />
                                </div>

                                {searchTerm && (
                                    <button
                                        onClick={clearFilters}
                                        className="bg-gray-100! hover:bg-gray-200! text-gray-700! px-6! py-4! rounded-xl! font-bold! transition-all duration-300 hover:shadow-lg! whitespace-nowrap"
                                    >
                                        Limpiar
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Contador de resultados */}
                        <div className="mb-4">
                            <p className="text-gray-600 font-semibold text-lg">
                                Mostrando {filteredOfertas.length} de {ofertas.length} ofertas
                            </p>
                        </div>

                        {/* Tabla de ofertas */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-bold">Cargo</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold">Empresa</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold">Modalidad</th>
                                            <th className="px-6 py-4 text-center text-sm font-bold">Estado</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold">Fecha</th>
                                            <th className="px-6 py-4 text-center text-sm font-bold">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredOfertas.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                    No se encontraron ofertas con los filtros aplicados
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredOfertas.map((oferta) => (
                                                <tr key={oferta._id} className="hover:bg-green-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <p className="font-bold text-gray-900">{oferta.cargo}</p>
                                                        <p className="text-sm text-gray-500">{oferta.area}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="font-semibold text-gray-700">{oferta.empresa}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-gray-700">{oferta.modalidad}</p>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${oferta.estado === 'Activo'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {oferta.estado}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {new Date(oferta.fechaPublicacion).toLocaleDateString('es-ES')}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center">
                                                            <button
                                                                onClick={() => handleVerPostulantes(oferta)}
                                                                className="flex items-center gap-2 px-4! py-2! bg-blue-100! hover:bg-blue-200! text-blue-600! rounded-lg! transition-colors! font-bold! text-sm!"
                                                            >
                                                                <Eye size={18} />
                                                                Ver Postulantes
                                                            </button>
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

            {/* Modal de postulantes */}
            {showModal && selectedOferta && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-t-3xl z-10">
                            <h2 className="text-2xl font-black">Postulantes - {selectedOferta.cargo}</h2>
                            <p className="text-green-100 mt-1">{selectedOferta.empresa}</p>
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-6 right-6 text-white hover:bg-white/20! rounded-full! p-2! transition-colors!"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6">
                            {loadingPostulantes ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                                </div>
                            ) : postulantes.length === 0 ? (
                                <div className="text-center py-12">
                                    <Users size={64} className="mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500 text-lg font-semibold">
                                        Aún no hay postulantes para esta oferta
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-100 border-b-2 border-gray-200">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Nombre</th>
                                                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Contacto</th>
                                                <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">CV</th>
                                                <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">Estado</th>
                                                <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {postulantes.map((postulante) => (
                                                <tr key={postulante.idPostulacion} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-4">
                                                        <p className="font-bold text-gray-900">{postulante.nombreCompleto}</p>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Mail size={14} />
                                                                <span>{postulante.correo}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Phone size={14} />
                                                                <span>{postulante.numero}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        {(postulante.cv || postulante.cvUrl || postulante.cvFilePath) ? (
                                                            <a
                                                                href="#"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleDownloadCV(postulante);
                                                                }}
                                                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                                                            >
                                                                <FileText size={16} />
                                                                Ver CV
                                                            </a>
                                                        ) : (
                                                            <span className="text-gray-400 text-sm">No disponible</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${postulante.apto
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {postulante.apto ? (
                                                                <>
                                                                    <CheckCircle size={14} />
                                                                    Apto
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <XCircle size={14} />
                                                                    No Apto
                                                                </>
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <button
                                                            onClick={() => handleToggleApto(postulante.idPostulacion, postulante.apto)}
                                                            className={`px-4! py-2! rounded-lg! font-bold! text-sm! transition-colors! ${postulante.apto
                                                                ? 'bg-red-100! hover:bg-red-200! text-red-700!'
                                                                : 'bg-green-100! hover:bg-green-200! text-green-700!'
                                                                }`}
                                                        >
                                                            {postulante.apto ? 'Marcar No Apto' : 'Marcar Apto'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-gray-50 rounded-b-3xl border-t border-gray-200">
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full px-6! py-3! bg-gray-300! hover:bg-gray-400! text-gray-800! rounded-xl! font-bold! transition-colors!"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionPostulantes;