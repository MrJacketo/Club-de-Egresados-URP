import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BarChart,
  FileText,
  CreditCard,
  Calendar,
  RefreshCw,
  Download,
  Sparkles,
} from "lucide-react";
import { getMembresiaRequest } from "../../api/membresiaApi";

export default function SubscriptionBillingForm() {
  const [activeTab, setActiveTab] = useState("Información");
  const [membresia, setMembresia] = useState({
    estado: "inactiva",
    fechaActivacion: null,
    fechaVencimiento: null,
  });
  const [loadingMembresia, setLoadingMembresia] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const membresiaData = await getMembresiaRequest();
        if (membresiaData) setMembresia(membresiaData);
      } catch (err) {
        setError("Error al cargar la información");
        console.error(err);
      } finally {
        setLoadingMembresia(false);
      }
    };
    fetchData();
  }, []);
  const { diasRestantes, porcentajeUsado } = React.useMemo(() => {
    if (!membresia.fechaVencimiento)
      return { diasRestantes: 0, porcentajeUsado: 0 };

    const hoy = new Date();
    const vencimiento = new Date(membresia.fechaVencimiento);
    const unDia = 1000 * 60 * 60 * 24;
    const diasRestantes = Math.max(
      0,
      Math.ceil((vencimiento.getTime() - hoy.getTime()) / unDia)
    );
    const diasTotales = 365;
    const diasPasados = diasTotales - diasRestantes;
    const porcentajeUsado = Math.max(
      0,
      Math.min(100, Math.round((diasPasados / diasTotales) * 100))
    );

    return { diasRestantes, porcentajeUsado };
  }, [membresia.fechaVencimiento]);

  const billingHistory = React.useMemo(
    () => [
      {
        invoice: "INV-2024-001",
        date: "Ago 15, 2025",
        description: "Membresia - Anual",
        amount: "S/ 150.00",
        status: "Pagado",
      },
      {
        invoice: "INV-2024-002",
        date: "Ago 15, 2024",
        description: "Membresia - Anual",
        amount: "S/ 150.00",
        status: "Pagado",
      },
      {
        invoice: "INV-2024-003",
        date: "Ago 15, 2023",
        description: "Membresia - Anual",
        amount: "S/ 150.00",
        status: "Cancelado",
      },
    ],
    []
  );

  if (loadingMembresia) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center text-gray-400">
        <RefreshCw size={32} className="animate-spin mb-4 text-blue-500" />
        <p>Cargando información de su subscripción...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  const usageData = [
    {
      icon: <Sparkles className="text-gray-400" size={20} />,
      name: "Beneficios Redimidos",
      usage: "3",
    },
    {
      icon: <Calendar className="text-gray-400" size={20} />,
      name: "Tiempo de Membresía",
      usage: `${diasRestantes} días restantes`,
      progress: porcentajeUsado,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Información":
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                    Suscripción Actual
                    {membresia.estado === "activa" ? (
                      <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Activa
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Inactiva
                      </span>
                    )}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {membresia.estado === "activa"
                      ? "Actualmente está suscrito al plan Pro"
                      : "No cuentas con una membresía"}
                  </p>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  S/ 150{" "}
                  <span className="text-base font-medium text-gray-600">
                    anual
                  </span>
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <Calendar size={16} />
                    Próxima fecha de facturación
                  </div>
                  <p className="mt-1 font-semibold text-gray-900">
                    {membresia.fechaVencimiento
                      ? new Date(membresia.fechaVencimiento).toLocaleDateString(
                          "es-ES",
                          { year: "numeric", month: "long", day: "numeric" }
                        )
                      : "N/A"}
                  </p>
                </div>
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <CreditCard size={16} />
                    Método de pago
                  </div>
                  <p className="mt-1 font-semibold text-gray-900 tracking-wider">
                    •••• •••• •••• 4242
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Resumen General
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Realice un seguimiento de su uso actual de su membresía
              </p>
              <div className="mt-6 space-y-5">
                {usageData.map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span className="font-medium text-gray-900">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-mono text-gray-600">
                        {item.usage}
                      </span>
                    </div>
                    {item.progress !== undefined && (
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "Beneficios":
        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Beneficios Redimidos
            </h2>
            <div className="space-y-6">
              {[
                {
                  id: 1,
                  nombre: "Curso de Desarrollo Web Full Stack",
                  descripcion:
                    "Curso completo de desarrollo web con certificación",
                  fecha: "15 de Agosto, 2025",
                  empresa: "URP Tech Academy",
                },
                {
                  id: 2,
                  nombre: "Descuento en Certificación AWS",
                  descripcion:
                    "50% de descuento en certificación AWS Cloud Practitioner",
                  fecha: "10 de Julio, 2025",
                  empresa: "Amazon Web Services",
                },
                {
                  id: 3,
                  nombre: "Asesoría de CV Premium",
                  descripcion:
                    "Sesión personalizada de optimización de CV y LinkedIn",
                  fecha: "5 de Junio, 2025",
                  empresa: "URP Career Center",
                },
              ].map((beneficio) => (
                <div
                  key={beneficio.id}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="flex-shrink-0">
                    <Sparkles className="text-green-500" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900">
                        {beneficio.nombre}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {beneficio.empresa}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {beneficio.descripcion}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Redimido el: {beneficio.fecha}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "Facturación":
        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-left">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Historial de Facturación
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Vea y descargue sus facturas pasadas
                </p>
              </div>
              <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 border border-green-600 rounded-lg shadow-sm text-sm focus:outline-none transition-colors">
                <Download size={16} />
                Exportar Todo
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-600 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Factura
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Fecha
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Descripción
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Monto
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((item) => (
                    <tr
                      key={item.invoice}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {item.invoice}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{item.date}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 text-gray-900">{item.amount}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            item.status === "Pagado"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-green-600 hover:text-green-700 focus:outline-none transition-colors">
                          <Download size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 font-sans">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Suscripción y Facturación
          </h1>
          <p className="mt-1 text-gray-600">
            Administre su suscripción, información de facturación y métodos de
            pago
          </p>
        </div>

        <div className="mt-8 border-b border-gray-200">
          <nav className="flex space-x-2 bg-transparent p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("Información")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium focus:outline-none transition-colors ${
                activeTab === "Información"
                  ? "font-semibold text-green-600 border-green-600"
                  : "font-medium text-white border-transparent hover:text-green-600 hover:border-green-600"
              }`}
            >
              <LayoutDashboard size={16} />
              Información
            </button>
            <button
              onClick={() => setActiveTab("Beneficios")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium focus:outline-none transition-colors ${
                activeTab === "Beneficios"
                  ? "font-semibold text-green-600 border-green-600"
                  : "font-medium text-white border-transparent hover:text-green-600 hover:border-green-600"
              }`}
            >
              <BarChart size={16} />
              Beneficios
            </button>
            <button
              onClick={() => setActiveTab("Facturación")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium focus:outline-none transition-colors ${
                activeTab === "Facturación"
                  ? "font-semibold text-green-600 border-green-600"
                  : "font-medium text-white border-transparent hover:text-green-600 hover:border-green-600"
              }`}
            >
              <FileText size={16} />
              Facturación
            </button>
          </nav>
        </div>

        <div className="mt-10">{renderContent()}</div>
      </main>
    </div>
  );
}
