import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BarChart,
  FileText,
  CreditCard,
  Calendar,
  RefreshCw,
  Download,
  Video,
  Code,
  Sparkles,
} from "lucide-react";

const getMembresiaRequest = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        estado: "activa",
        fechaVencimiento: new Date(2026, 2, 28),
      });
    }, 1500);
  });
};

const billingHistory = [
  {
    id: 1, invoice: "INV-2024-001", date: "Ago 15, 2025", description: "Membresia - Anual", amount: "S/ 150.00", status: "Pagado",
  },
  {
    id: 2, invoice: "INV-2024-002", date: "Ago 15, 2024", description: "Membresia - Anual", amount: "S/ 150.00", status: "Pagado",
  },
  {
    id: 3, invoice: "INV-2024-003", date: "Ago 15, 2023", description: "Membresia - Anual", amount: "S/ 150.00", status: "Cancelado",
  },
];

const benefitsData = [
  {
    id: 1, icon: <Video className="text-green-500" size={24} />, title: "Conferencia Virtual", description: "Acceso exclusivo a nuestra conferencia anual sobre las últimas tendencias en tecnología y desarrollo.",
  },
  {
    id: 2, icon: <Code className="text-green-500" size={24} />, title: "Curso de Python", description: "Curso completo de Python desde cero hasta un nivel avanzado, impartido por expertos de la industria.",
  },
  {
    id: 3, icon: <Sparkles className="text-green-500" size={24} />, title: "Descuento en Coursera", description: "Obtén un 30% de descuento en cualquier curso o especialización de la plataforma Coursera.",
  },
];

export default function SubscriptionBillingForm() {
  const [activeTab, setActiveTab] = useState("Información");
  const [membresia, setMembresia] = useState({
    estado: "inactiva",
    fechaVencimiento: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembresia = async () => {
      try {
        const data = await getMembresiaRequest();
        if (data) setMembresia(data);
      } catch (err) {
        setError("Error al cargar la membresía");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembresia();
  }, []);

  if (loading) {
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

  let diasRestantes = 0;
  let porcentajeUsado = 0;
  if (membresia.fechaVencimiento) {
    const hoy = new Date();
    const vencimiento = new Date(membresia.fechaVencimiento);
    const unDia = 1000 * 60 * 60 * 24;
    diasRestantes = Math.max(0, Math.ceil((vencimiento.getTime() - hoy.getTime()) / unDia));
    const diasTotales = 365;
    const diasPasados = diasTotales - diasRestantes;
    porcentajeUsado = Math.max(0, Math.round((diasPasados / diasTotales) * 100));
  }

  const usageData = [
    {
      id: 1, icon: <Sparkles className="text-gray-400" size={20} />, name: "Beneficios Redimidos", usage: "3",
    },
    {
      id: 2, icon: <Calendar className="text-gray-400" size={20} />, name: "Tiempo de Membresía", usage: `${diasRestantes} días restantes`, progress: porcentajeUsado,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Información":
        return (
          <div className="space-y-8">
            <div className="bg-[#222222] rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-white flex items-center gap-3">
                    Suscripción Actual
                    {membresia.estado === "activa" ? (
                      <span className="bg-green-500/20 text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Activa
                      </span>
                    ) : (
                      <span className="bg-red-500/20 text-red-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Inactiva
                      </span>
                    )}
                  </h2>
                  <p className="mt-1 text-sm text-gray-400">
                    Actualmente está suscrito al plan Pro
                  </p>
                </div>
                <p className="text-2xl font-bold text-white">
                  S/ 150{" "}
                  <span className="text-base font-medium text-gray-500">
                    anual
                  </span>
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                    <Calendar size={16} />
                    Próxima fecha de facturación
                  </div>
                  <p className="mt-1 font-semibold text-gray-200">
                    {membresia.fechaVencimiento
                      ? new Date(membresia.fechaVencimiento).toLocaleDateString(
                          "es-ES",
                          { year: "numeric", month: "long", day: "numeric" }
                        )
                      : "N/A"}
                  </p>
                </div>
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                    <CreditCard size={16} />
                    Método de pago
                  </div>
                  <p className="mt-1 font-semibold text-gray-200 tracking-wider">
                    •••• •••• •••• 4242
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#222222] rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-white">
                Resumen General
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Realice un seguimiento de su uso actual de su membresía
              </p>
              <div className="mt-6 space-y-5">
                {usageData.map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span className="font-medium text-gray-200">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-mono text-gray-400">
                        {item.usage}
                      </span>
                    </div>
                    {item.progress !== undefined && (
                      <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
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
          <div className="bg-[#222222] rounded-xl shadow-sm p-8 text-white text-left">
            <h2 className="text-lg font-semibold mb-6">
              Beneficios de la Membresía
            </h2>
            <div className="space-y-6">
              {benefitsData.map((benefit) => (
                <div
                  key={benefit.id}
                  className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg"
                >
                  <div className="flex-shrink-0">{benefit.icon}</div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "Facturación":
        return (
          <div className="bg-[#222222] rounded-xl shadow-sm p-8 text-white text-left">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold">
                  Historial de Facturación
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  Vea y descargue sus facturas pasadas
                </p>
              </div>
              <button className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 border border-gray-600 rounded-lg shadow-sm text-sm focus:outline-none">
                <Download size={16} />
                Exportar Todo
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase bg-transparent">
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
                      key={item.id}
                      className="border-b border-gray-700 hover:bg-gray-800/50"
                    >
                      <td className="px-6 py-4 font-medium text-white">
                        {item.invoice}
                      </td>
                      <td className="px-6 py-4 text-gray-300">{item.date}</td>
                      <td className="px-6 py-4 text-gray-300">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 text-gray-300">{item.amount}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            item.status === "Pagado"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-red-500/20 text-red-300"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-green-500 focus:outline-none">
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
    <div className="min-h-screen w-full bg-transparent text-gray-300 font-sans">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Suscripción y Facturación
          </h1>
          <p className="mt-1 text-gray-400">
            Administre su suscripción, información de facturación y métodos de
            pago
          </p>
        </div>

        <div className="mt-8 border-b border-gray-700">
          <nav className="flex space-x-2 bg-transparent p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("Información")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium focus:outline-none transition-colors ${
                activeTab === "Información"
                  ? "font-semibold text-green-500 border-green-500"
                  : "font-medium text-gray-300 border-transparent hover:text-green-500 hover:border-green-500"
              }`}
            >
              <LayoutDashboard size={16} />
              Información
            </button>
            <button
              onClick={() => setActiveTab("Beneficios")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium focus:outline-none transition-colors ${
                activeTab === "Beneficios"
                  ? "font-semibold text-green-500 border-green-500"
                  : "font-medium text-gray-300 border-transparent hover:text-green-500 hover:border-green-500"
              }`}
            >
              <BarChart size={16} />
              Beneficios
            </button>
            <button
              onClick={() => setActiveTab("Facturación")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium focus:outline-none transition-colors ${
                activeTab === "Facturación"
                  ? "font-semibold text-green-500 border-green-500"
                  : "font-medium text-gray-300 border-transparent hover:text-green-500 hover:border-green-500"
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