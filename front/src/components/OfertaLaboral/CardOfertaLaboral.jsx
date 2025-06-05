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
  } = props;

  // Estado local para el estado de la oferta laboral
  const [offerStatus, setOfferStatus] = useState(estado);

  const handleEdit = () => {
    navigate(`/guardar-oferta/`, {
      state: {
        id,
      },
    });
  };

  // Función para deshabilitar la oferta
  const handleDisable = async () => {
    try {
      const result = await disableOfertaRequest(id); // Llamada a la API
      if (result) {
        setOfferStatus(result.estado); // Actualizar estado en tiempo real
      }
      toast.success(`Estado actualizado`);
    } catch (error) {
      console.error("Error al deshabilitar la oferta", error);
    }
  };

  return (
    <div className="bg-white w-full transition-all duration-500 hover:scale-102 hover:cursor-pointer text-[#1e1e1e] flex flex-col lg:flex-row justify-between m-auto mt-4 px-6 sm:px-10 lg:px-14 py-6 sm:py-8 rounded-3xl shadow-md gap-4">
      <div className="flex flex-col gap-2 justify-around items-start">
        <h2 className="text-lg font-bold">{cargo}</h2>

        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6">
          <div className="flex flex-row items-center gap-2">
            <Category style={{ fontSize: "20px", color: "#31CD7F" }} />
            <h3 className="font-bold text-[#31CD7F]">{area}</h3>
          </div>

          <div className="flex flex-row items-center gap-2">
            <Business style={{ fontSize: "20px" }} />
            <h3 className="font-medium">{empresa}</h3>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6">
          <div className="flex flex-row items-center gap-2">
            <LocationOn style={{ fontSize: "20px" }} />
            <h3 className="font-medium">{ubicacion}</h3>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Work style={{ fontSize: "20px" }} />
            <h3 className="font-medium">{tipoContrato}</h3>
          </div>
          <div className="flex flex-row items-center gap-2">
            <h3 className="font-medium">{modalidad}</h3>
          </div>
        </div>

        <div className="flex flex-row items-center gap-8">
          <h3 className="font-bold">S/. {salario?.toFixed(2)} (Mensual)</h3>
        </div>
      </div>

      <div className="flex flex-row lg:flex-col items-start lg:items-end gap-4">
        <div
          className="flex flex-row items-center gap-2 hover:underline hover:text-green-600"
          onClick={handleEdit}
        >
          <Edit style={{ fontSize: "20px" }} />
          <h3 className="font-medium">Editar</h3>
        </div>
        <div
          className="flex flex-row items-center gap-2"
          onClick={handleDisable}
        >
          {offerStatus === "Activo" ? (
            <Visibility style={{ fontSize: "20px", color: "#31CD7F" }} />
          ) : (
            <VisibilityOff style={{ fontSize: "20px", color: "#FF4B4B" }} />
          )}
          <h3 className="font-medium">{offerStatus}</h3>
        </div>
      </div>
    </div>
  );
}
