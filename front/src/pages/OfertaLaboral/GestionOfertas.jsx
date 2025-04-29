import React, { useEffect, useState } from "react";
import { getOfertasRequest } from "../../api/ofertaLaboralApi";
import CardOfertaLaboral from "../../components/OfertaLaboral/CardOfertaLaboral";
import SelectField from "../../components/OfertaLaboral/inputs/SelectField";
import {
  AREAS_LABORALES,
  MODALIDAD,
} from "../../constants/OfertaLaboral/OfertaLaboral.enum";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function OfertaLaboral() {
  const [ofertas, setOfertas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const data = await getOfertasRequest();
        setOfertas(data);
      } catch (error) {
        console.error("Error al cargar ofertas:", error);
      }
    };

    fetchOfertas();
  }, []);

  return (
    <div className="mt-16 mb-21 flex flex-col items-start w-[60%] m-auto">
      <h2 className="text-[#242424] text-4xl font-bold mb-5">
        Gestionar Ofertas Laborales
      </h2>
      <div className="w-full flex flex-row items-center justify-between gap-6 ">
        <select
          name="area"
          className="w-full p-3 active:outline-none font-semibold border-none rounded-lg bg-white text-gray-700"
          required
        >
          <option value="">Seleccione un area</option>
          {AREAS_LABORALES.map((carrera) => (
            <option key={carrera} value={carrera}>
              {carrera}
            </option>
          ))}
        </select>
        <select
          name="modalidad"
          className="w-full  p-3 active:outline-none font-semibold border-none rounded-lg bg-white text-gray-700"
          required
        >
          <option value="">Seleccione un modalidad</option>
          {MODALIDAD.map((carrera) => (
            <option key={carrera} value={carrera}>
              {carrera}
            </option>
          ))}
        </select>

        <Link
          to="/guardar-oferta"
          className=" bg-[#1A1A1A] w-[60%] hover:bg-[#2d2d2d] hover:cursor-pointer text-[16px] text-white font-semibold py-4 px-5 rounded-xl transition-all duration-300 ease-in-out"
        >
          Añadir Oferta
        </Link>
      </div>
      {ofertas.length > 0 ? (
        ofertas.map((oferta) => (
          <CardOfertaLaboral
            key={oferta._id}
            id={oferta._id}
            cargo={oferta.cargo}
            empresa={oferta.empresa}
            area={oferta.area}
            ubicacion={oferta.ubicacion}
            tipoContrato={oferta.tipoContrato}
            salario={oferta.salario}
            estado={oferta.estado}
          />
        ))
      ) : (
        <p className="text-gray-500">No hay ofertas laborales disponibles.</p>
      )}
    </div>
  );
}
