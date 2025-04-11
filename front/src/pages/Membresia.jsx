import React from "react";

export default function Membresia() {
  const membresias = [
    {
      duracion: "1 Mes",
      precio: "S/ 15",
      descripcion: "Ideal para probar los beneficios de URPex por un corto tiempo.",
      bgColor: "bg-white",
    },
    {
      duracion: "3 Meses",
      precio: "S/ 40",
      descuento: "Ahorra S/5",
      descripcion: "Perfecta si deseas mantenerte conectado con tus beneficios.",
      bgColor: "bg-green-50",
    },
    {
      duracion: "1 Año",
      precio: "S/ 150",
      descuento: "Ahorra S/30",
      descripcion: "Mejor relación costo-beneficio. Disfruta todo el año sin preocupaciones.",
      bgColor: "bg-green-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br flex flex-col items-center py-25 px-4">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-20 text-center">
        Planes de Membresía URPex
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-11 w-full max-w-6xl">
        {membresias.map((plan, idx) => (
          <div
            key={idx}
            className={`rounded-3xl p-8 shadow-xl transform transition duration-300 hover:scale-105 ${plan.bgColor}`}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{plan.duracion}</h2>
            <p className="text-3xl font-extrabold text-green-600 mb-4">{plan.precio}</p>
            {plan.descuento && (
              <p className="text-sm text-green-700 font-medium mb-2">{plan.descuento}</p>
            )}
            <p className="text-gray-600 mb-6">{plan.descripcion}</p>
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition duration-300">
              Obtener Membresía
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
