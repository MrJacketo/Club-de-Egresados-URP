import { useEffect, useState } from 'react';
import { Gift, ExternalLink, Ticket, BookOpen, ShoppingBag, CheckCircle, Calendar, Building2, Tag, Eye, Clock } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { getBeneficiosRequest, getBeneficiosRedimidosRequest } from '../../api/gestionarBeneficiosApi';
import { useUser } from '../../context/userContext';


export default function BeneficiosVista() {
  const [beneficios, setBeneficios] = useState([]);
  const [beneficiosReclamados, setBeneficiosReclamados] = useState([]);
  const { user } = useUser();

  const fetchDatos = async () => {
    try {
      if (!user) return;

      const [beneficiosAll, redimidos] = await Promise.all([
        getBeneficiosRequest(),
        getBeneficiosRedimidosRequest()
      ]);

      const idsReclamados = (redimidos?.beneficiosRedimidos || []).map((b) => b.beneficioId._id);

      const beneficiosFormateados = (beneficiosAll || [])
        .filter(b => b.estado === 'activo') // Solo mostrar beneficios activos
        .map((b) => ({
          id: b._id,
          nombre: b.titulo,
          detalle: b.descripcion,
          tipo: b.tipo_beneficio, // Mapear correctamente desde el backend
          empresa: b.empresa_asociada,
          fechaInicio: b.fecha_inicio,
          fechaFin: b.fecha_fin,
          urlDetalle: b.url_detalle,
          imagen: b.imagen_beneficio,
          estado: b.estado,
          reclamado: idsReclamados.includes(b._id)
        }));

      const beneficiosReclamadosFormateados = (redimidos?.beneficiosRedimidos || []).map((item) => ({
        id: item.beneficioId._id,
        nombre: item.beneficioId.titulo,
        tipo: item.beneficioId.tipo_beneficio, // Mapear correctamente desde el backend
        link: item.link,
        fechaReclamo: new Date(item.fecha_redencion)
      }));

      setBeneficios(beneficiosFormateados);
      setBeneficiosReclamados(beneficiosReclamadosFormateados);
    } catch (error) {
      console.error("Error cargando beneficios o redimidos:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDatos();
    }
  }, [user]);

  const getIconByType = (tipo) => {
    switch (tipo) {
      case 'academico':
        return <BookOpen className="w-6 h-6" />;
      case 'laboral':
        return <Building2 className="w-6 h-6" />;
      case 'salud':
        return <Ticket className="w-6 h-6" />;
      case 'cultural':
        return <Gift className="w-6 h-6" />;
      case 'convenio':
        return <ShoppingBag className="w-6 h-6" />;
      default:
        return <Tag className="w-6 h-6" />;
    }
  };

  const getTypeColor = (tipo) => {
    switch (tipo) {
      case 'academico':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'laboral':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'salud':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cultural':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'convenio':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (tipo) => {
    switch (tipo) {
      case 'academico':
        return 'Académico';
      case 'laboral':
        return 'Laboral';
      case 'salud':
        return 'Salud';
      case 'cultural':
        return 'Cultural';
      case 'convenio':
        return 'Convenio';
      default:
        return 'Beneficio';
    }
  };

  const reclamarBeneficio = async (beneficioId) => {
    try {
      if (!user) {
        alert("Debes iniciar sesión para reclamar un beneficio.");
        return;
      }

      // JWT authentication handled by apiClient
      const response = await apiClient.post("/api/beneficios/redimir", { beneficioId });

      if (response.data.success) {
        await fetchDatos();
      } else {
        console.error("Error en backend:", response.data);
        alert("Error al reclamar el beneficio.");
      }

    } catch (error) {
      console.error("Error al reclamar beneficio:", error);
      alert("No se pudo reclamar el beneficio.");
    }
  };

  const BeneficioCard = ({ beneficio }) => {
    const yaReclamado = beneficio.reclamado;
    const fechaFin = beneficio.fechaFin ? new Date(beneficio.fechaFin) : null;
    const hoy = new Date();
    const vigente = !fechaFin || fechaFin >= hoy;

    return (
      <div className="bg-white rounded-3xl shadow-md border transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1 h-full">
        <div className="p-6 h-full grid grid-rows-[auto_auto_auto_1fr_auto_auto] gap-4">
          {/* Header con icono y título */}
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg flex-shrink-0 ${getTypeColor(beneficio.tipo)}`}>
              {getIconByType(beneficio.tipo)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">{beneficio.nombre}</h3>
            </div>
          </div>

          {/* Badge de categoría */}
          <div className="flex justify-center">
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(beneficio.tipo)}`}>
              {getTypeLabel(beneficio.tipo)}
            </span>
          </div>

          {/* Información adicional */}
          <div className="space-y-2 text-xs text-gray-600">
            {beneficio.empresa && (
              <div className="flex items-center space-x-1">
                <Building2 className="w-3 h-3" />
                <span>{beneficio.empresa}</span>
              </div>
            )}
            {fechaFin && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Válido hasta: {fechaFin.toLocaleDateString()}</span>
              </div>
            )}
            {!vigente && (
              <div className="flex items-center space-x-1 text-red-600">
                <Clock className="w-3 h-3" />
                <span className="font-medium">Expirado</span>
              </div>
            )}
          </div>

          {/* Descripción */}
          <div className="flex items-start">
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
              {beneficio.detalle}
            </p>
          </div>

          {/* URL de detalle si existe */}
          {beneficio.urlDetalle && (
            <div className="flex justify-center">
              <a
                href={beneficio.urlDetalle}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 text-sm hover:text-blue-800 transition-colors"
              >
                <Eye className="w-4 h-4 mr-1" />
                Ver más detalles
              </a>
            </div>
          )}

          {/* Botón */}
          <div className="flex justify-center items-end">
            {!vigente ? (
              <div className="flex items-center text-red-600 justify-center w-full">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Expirado</span>
              </div>
            ) : yaReclamado ? (
              <div className="flex items-center text-green-600 justify-center w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Reclamado</span>
              </div>
            ) : (
              <button
                onClick={() => reclamarBeneficio(beneficio.id)}
                className="px-6 py-2 rounded-lg font-medium text-sm transition-colors bg-blue-600 text-white hover:bg-blue-700 w-full max-w-xs"
              >
                Reclamar Beneficio
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const BeneficioReclamado = ({ beneficio }) => {
    return (
      <div className="bg-green-50 border border-green-200 rounded-3xl p-4 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-green-900 break-words">{beneficio.nombre}</h4>
              <p className="text-sm text-green-700">
                Tipo: {getTypeLabel(beneficio.tipo)} | Reclamado el {beneficio.fechaReclamo?.toLocaleDateString?.() || 'Fecha no disponible'}
              </p>
            </div>
          </div>
        </div>

        {beneficio.link && (
          <div className="mt-3 flex justify-center">
            <a
              href={beneficio.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Acceder
            </a>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen overflow-y-auto flex justify-center items-start pt-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-6">
            Beneficios del Mes - Programa de Egresados URP
          </h1>
        </div>

        {beneficiosReclamados.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 ">Tus Beneficios Reclamados</h2>
            <div className="space-y-4">
              {beneficiosReclamados.map((beneficio) => (
                <BeneficioReclamado key={`reclamado-${beneficio.id}`} beneficio={beneficio} />
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Beneficios Disponibles ({beneficios.filter(b => !b.reclamado).length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {beneficios
              .filter(beneficio => !beneficio.reclamado)
              .map((beneficio) => (
                <BeneficioCard key={beneficio.id} beneficio={beneficio} />
              ))}
          </div>
        </div>

        {beneficios.every(b => b.reclamado) && (
          <div className="text-center py-12">
            <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ¡Has reclamado todos los beneficios disponibles!
            </h3>
            <p className="text-gray-600">
              Mantente atento a nuevos beneficios el próximo mes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}