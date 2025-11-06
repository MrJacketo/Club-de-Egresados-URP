import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { getMembresiaRequest } from "../../api/membresiaApi";

const MembresiaSucess = () => {
  const [membresia, setMembresia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarMembresia = async () => {
      try {
        const data = await getMembresiaRequest();
        setMembresia(data);
      } catch (error) {
        console.error("Error al verificar membresía:", error);
      } finally {
        setLoading(false);
      }
    };

    verificarMembresia();
  }, []);

  const formatFecha = (fecha) => {
    if (!fecha) return "No disponible";
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  // Lista de beneficios de la membresía
  const beneficios = [
    "Acceso a Bolsa Laboral Premium",
    "Descuentos en certificaciones profesionales",
    "Networking profesional",
    "Acceso a cursos de especialización",
    "Asesorías personalizadas (CV, LinkedIn)",
  ];

  return (
    <div className="h-screen overflow-y-auto flex justify-center items-start pt-32 px-4 md:px-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-teal-100 p-4 rounded-full">
            <CheckCircle className="w-16 h-16 text-teal-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          ¡Felicidades! Tu membresía ha sido activada
        </h1>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 gap-4 text-left">
            <div>
              <p className="text-sm text-gray-500">Estado de membresía</p>
              <p className="font-semibold text-teal-600 capitalize">
                {membresia?.estado || "Procesando"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha de activación</p>
              <p className="font-semibold text-teal-600">
                {formatFecha(membresia?.fechaActivacion)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Válido hasta</p>
              <p className="font-semibold text-teal-600">
                {formatFecha(membresia?.fechaVencimiento)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3 text-left">
            Beneficios de tu Membresía
          </h2>
          <ul className="space-y-2">
            {beneficios.map((beneficio, index) => (
              <li key={index} className="flex items-start gap-2 text-left">
                <CheckCircle className="h-5 w-5 text-teal-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{beneficio}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-gray-600 mb-8">
          Ahora tienes acceso a todos los beneficios exclusivos para miembros.
          Tu membresía se renovará automáticamente cada año.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/Beneficios"
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
          >
            Ver beneficios
          </Link>
          <Link
            to="/VerMembresia"
            className="border border-teal-600 text-teal-600 hover:bg-teal-50 font-medium py-3 px-6 rounded-lg transition duration-300"
          >
            Ir a mi membresía
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MembresiaSucess;
