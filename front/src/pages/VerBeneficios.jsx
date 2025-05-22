import { useState } from 'react';
import { Gift, ExternalLink, Ticket, BookOpen, ShoppingBag, CheckCircle, AlertCircle } from 'lucide-react';

export default function BeneficiosVista() {
  // Datos de ejemplo de beneficios
  const [beneficios, setBeneficios] = useState([
    {
      id: 1,
      nombre: "Descuento 20% en Coursera",
      detalle: "Accede a más de 4,000 cursos online con 20% de descuento durante 6 meses",
      tipo: "descuento",
      stock: 15,
      codigo: "URP2024COURSERA",
      reclamado: false
    },
    {
      id: 2,
      nombre: "Curso Gratuito de Python",
      detalle: "Curso completo de Python para principiantes, 40 horas académicas",
      tipo: "curso",
      stock: 8,
      link: "https://ejemplo.com/curso-python",
      reclamado: false
    },
    {
      id: 3,
      nombre: "Consultoría Gratuita CV",
      detalle: "Sesión personalizada de 1 hora para optimizar tu currículum vitae",
      tipo: "servicio",
      stock: 5,
      link: "https://ejemplo.com/consultoria-cv",
      reclamado: false
    },
    {
      id: 4,
      nombre: "Descuento 15% en Libros Técnicos",
      detalle: "Descuento especial en la librería universitaria para libros de especialización",
      tipo: "descuento",
      stock: 0,
      codigo: "LIBROS15URP",
      reclamado: false
    },
    {
      id: 5,
      nombre: "Conferencia Ciberseguridad",
      detalle: "Conferencia magistral sobre las nuevas tendencias del mercado laboral peruano",
      tipo: "evento",
      stock: 25,
      link: "https://ejemplo.com/webinar-tendencias",
      reclamado: false
    }
  ]);

  const [beneficiosReclamados, setBeneficiosReclamados] = useState([]);

  const getIconByType = (tipo) => {
    switch (tipo) {
      case 'descuento':
        return <Ticket className="w-6 h-6" />;
      case 'curso':
        return <BookOpen className="w-6 h-6" />;
      case 'servicio':
        return <Gift className="w-6 h-6" />;
      case 'evento':
        return <ExternalLink className="w-6 h-6" />;
      default:
        return <ShoppingBag className="w-6 h-6" />;
    }
  };

  const getTypeColor = (tipo) => {
    switch (tipo) {
      case 'descuento':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'curso':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'servicio':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'evento':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const reclamarBeneficio = (id) => {
    const beneficio = beneficios.find(b => b.id === id);
    if (beneficio && beneficio.stock > 0) {
      // Actualizar stock y marcar como reclamado
      setBeneficios(prev => 
        prev.map(b => 
          b.id === id 
            ? { ...b, stock: b.stock - 1, reclamado: true }
            : b
        )
      );
      
      // Agregar a beneficios reclamados
      setBeneficiosReclamados(prev => [...prev, { ...beneficio, fechaReclamo: new Date() }]);
    }
  };

  const BeneficioCard = ({ beneficio }) => {
    const sinStock = beneficio.stock === 0;
    const yaReclamado = beneficio.reclamado;

    return (
        <div className={`bg-white rounded-3xl shadow-md border transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1 ${
        sinStock ? 'opacity-80' : ''
      }`}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getTypeColor(beneficio.tipo)}`}>
                {getIconByType(beneficio.tipo)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{beneficio.nombre}</h3>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(beneficio.tipo)}`}>
                  {beneficio.tipo.charAt(0).toUpperCase() + beneficio.tipo.slice(1)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${sinStock ? 'text-red-600' : 'text-gray-600'}`}>
                Stock: {beneficio.stock}
              </div>
              {sinStock && (
                <div className="flex items-center text-red-600 text-xs mt-1">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Agotado
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {beneficio.detalle}
          </p>

          <div className="flex justify-between items-center">
            {yaReclamado ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Reclamado</span>
              </div>
            ) : (
              <button
                onClick={() => reclamarBeneficio(beneficio.id)}
                disabled={sinStock}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  sinStock
                  
                    
                   
                }`}
              >
                {sinStock ? 'Sin Stock' : 'Reclamar Beneficio'}
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
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h4 className="font-medium text-green-900">{beneficio.nombre}</h4>
              <p className="text-sm text-green-700">
                Reclamado el {beneficio.fechaReclamo.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
        {beneficio.tipo === 'descuento' && beneficio.codigo && (
          <div className="mt-3 p-3 bg-white border border-green-200 rounded-3xl">
            <p className="text-sm text-gray-600 mb-1">Tu código de descuento:</p>
            <p className="font-mono font-bold text-lg text-green-800">{beneficio.codigo}</p>
          </div>
        )}
        
        {(beneficio.tipo === 'curso' || beneficio.tipo === 'servicio' || beneficio.tipo === 'evento') && beneficio.link && (
          <div className="mt-3">
            <a
              href={beneficio.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-6">
            Beneficios del Mes - Programa de Egresados URP
          </h1>
        
        </div>

        {/* Beneficios Reclamados */}
        {beneficiosReclamados.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tus Beneficios Reclamados</h2>
            <div className="space-y-4">
              {beneficiosReclamados.map((beneficio) => (
                <BeneficioReclamado key={`reclamado-${beneficio.id}`} beneficio={beneficio} />
              ))}
            </div>
          </div>
        )}

        {/* Beneficios Disponibles */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Beneficios Disponibles ({beneficios.filter(b => !b.reclamado).length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {beneficios
              .filter(beneficio => !beneficio.reclamado)
              .map((beneficio) => (
                <BeneficioCard key={beneficio.id} beneficio={beneficio} />
              ))
            }
          </div>
        </div>

        {/* Mensaje cuando no hay beneficios disponibles */}
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