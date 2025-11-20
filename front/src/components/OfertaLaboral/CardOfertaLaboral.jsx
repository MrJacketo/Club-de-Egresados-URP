import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Business,
  LocationOn,
  Category,
  Edit,
  Visibility,
  VisibilityOff,
  Work,
  AttachMoney,
} from "@mui/icons-material";
import { disableOfertaRequest } from "../../api/ofertaLaboralApi";
import { toast } from "react-hot-toast";

export default function CardOfertaLaboral(props) {
  const navigate = useNavigate();

  const {
    id,
    cargo,
    empresa,
    area,
    ubicacion,
    tipoContrato,
    modalidad,
    salario,
    estado,
    onSeleccionOferta,
    seleccionado,
    edicion
  } = props;

  // Estado local para el estado de la oferta laboral
  const [offerStatus, setOfferStatus] = useState(estado);
  const [seleccionada, setSeleccionada] = useState(false);

  // Función para manejar la selección de la oferta
  const handleSeleccionarOferta = () => {
    onSeleccionOferta();
  }

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/guardar-oferta/`, {
      state: {
        id,
      },
    });
  };

  // Función para deshabilitar la oferta
  const handleDisable = async (e) => {
    e.stopPropagation();
    try {
      const result = await disableOfertaRequest(id);
      if (result) {
        setOfferStatus(result.estado);
      }
      toast.success(`Estado actualizado`);
    } catch (error) {
      console.error("Error al deshabilitar la oferta", error);
    }
  };

  return (
    <div 
      onClick={handleSeleccionarOferta} 
      className={`flex flex-col py-6 px-6 w-full rounded-2xl shadow-lg 
      bg-white transition-all duration-500 hover:cursor-pointer text-[#1e1e1e]
      hover:-translate-y-2 hover:shadow-2xl 
      ${seleccionado 
        ? "border-[3px] border-green-500 shadow-green-200 scale-[1.02] bg-gradient-to-br from-green-50 to-white" 
        : "border-2 border-gray-200 hover:border-green-300"
      }`}
    >
      <div className="flex flex-col gap-4 w-full justify-around items-start">
        {/* Cargo - Título principal */}
        <h2 className={`text-xl text-start font-bold transition-colors duration-300 ${
          seleccionado 
            ? "bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent" 
            : "text-gray-900"
        }`}>
          {cargo}
        </h2>

        {/* Empresa y Área */}
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 w-full">
          <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-teal-50 px-3 py-2 rounded-lg border border-green-200">
            <Category style={{ fontSize: "18px", color: "#5DC554" }} />
            <h3 className="font-bold text-green-600 text-sm">{area}</h3>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
            <Business style={{ fontSize: "18px", color: "#5DC554" }} />
            <h3 className="font-semibold text-gray-700 text-sm">{empresa}</h3>
          </div>
        </div>

        {/* Detalles de ubicación y contrato */}
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 w-full">
          <div className="flex items-center gap-2 text-gray-600">
            <LocationOn style={{ fontSize: "18px", color: "#5DC554" }} />
            <h3 className="font-medium text-sm">{ubicacion}</h3>
          </div>
          
          <span className="hidden sm:block text-gray-300">·</span>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Work style={{ fontSize: "18px", color: "#5DC554" }} />
            <h3 className="font-medium text-sm">{tipoContrato}</h3>
          </div>
          
          <span className="hidden sm:block text-gray-300">·</span>
          
          <div className="flex items-center gap-2 bg-gradient-to-r from-teal-50 to-green-50 px-3 py-1 rounded-lg border border-teal-200">
            <h3 className="font-semibold text-teal-600 text-sm">{modalidad}</h3>
          </div>
        </div>

        {/* Salario */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 px-4 py-2 rounded-xl shadow-md">
          <AttachMoney style={{ fontSize: "20px", color: "#ffffff" }} />
          <h3 className="font-bold text-white text-base">
            S/. {salario?.toFixed(2)} <span className="font-normal text-sm opacity-90">(Mensual)</span>
          </h3>
        </div>
      </div>

      {/* Botones de edición */}
      {edicion && ( 
        <div className="flex flex-row mt-4 pt-4 border-t border-gray-200 items-center gap-4">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300 hover:shadow-md group"
            onClick={handleEdit}
          >
            <Edit style={{ fontSize: "18px" }} className="text-gray-600 group-hover:text-green-600 transition-colors" />
            <h3 className="font-semibold text-sm text-gray-600 group-hover:text-green-600 transition-colors">Editar</h3>
          </button>
          
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-md ${
              offerStatus === "Activo" 
                ? "bg-green-100 hover:bg-green-200" 
                : "bg-red-100 hover:bg-red-200"
            }`}
            onClick={handleDisable}
          >
            {offerStatus === "Activo" ? (
              <>
                <Visibility style={{ fontSize: "18px", color: "#22c55e" }} />
                <h3 className="font-semibold text-sm text-green-600">{offerStatus}</h3>
              </>
            ) : (
              <>
                <VisibilityOff style={{ fontSize: "18px", color: "#ef4444" }} />
                <h3 className="font-semibold text-sm text-red-600">{offerStatus}</h3>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}