import React, { useEffect, useState } from "react";
import { getOfertasRequest } from "../../api/ofertaLaboralApi";
import CardOfertaLaboral from "../../components/OfertaLaboral/CardOfertaLaboral";
import {
  AREAS_LABORALES,
  MODALIDAD,
} from "../../constants/OfertaLaboral/OfertaLaboral.enum";
import { Link } from "react-router-dom";

export default function OfertaLaboral() {
  const [ofertas, setOfertas] = useState([]);
  const [areaSeleccionada, setAreaSeleccionada] = useState("");
  const [modalidadSeleccionada, setModalidadSeleccionada] = useState("");

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

  //Aplicar filtros
  const ofertasFiltradas = ofertas.filter((oferta) => {
    const cumpleArea = areaSeleccionada
      ? oferta.area === areaSeleccionada
      : true;
    const cumpleModalidad = modalidadSeleccionada
      ? oferta.modalidad === modalidadSeleccionada
      : true;
    return cumpleArea && cumpleModalidad;
  });

  return (
    <div className="mt-16 mb-21 flex flex-col items-start w-[60%] m-auto">
      <h2 className="text-[#242424] text-4xl font-bold mb-5">
        Gestionar Ofertas Laborales
      </h2>

      <div className="w-full flex flex-row items-center justify-between gap-6 mb-8">
        <select
          name="area"
          value={areaSeleccionada}
          onChange={(e) => setAreaSeleccionada(e.target.value)}
          className="w-full p-3 font-semibold border-none rounded-lg bg-white text-gray-700"
        >
          <option value="">Todas las áreas</option>
          {AREAS_LABORALES.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>

        <select
          name="modalidad"
          value={modalidadSeleccionada}
          onChange={(e) => setModalidadSeleccionada(e.target.value)}
          className="w-full p-3 font-semibold border-none rounded-lg bg-white text-gray-700"
        >
          <option value="">Todas las modalidades</option>
          {MODALIDAD.map((modo) => (
            <option key={modo} value={modo}>
              {modo}
            </option>
          ))}
        </select>

        <Link
          to="/guardar-oferta"
          className="bg-[#1A1A1A] w-[60%] hover:bg-[#2d2d2d] hover:cursor-pointer text-[16px] text-white font-semibold py-4 px-5 rounded-xl transition-all duration-300 ease-in-out"
        >
          Añadir Oferta
        </Link>
      </div>

      {ofertasFiltradas.length > 0 ? (
        ofertasFiltradas.map((oferta) => (
          <CardOfertaLaboral
            key={oferta._id}
            id={oferta._id}
            cargo={oferta.cargo}
            empresa={oferta.empresa}
            area={oferta.area}
            modalidad={oferta.modalidad}
            ubicacion={oferta.ubicacion}
            tipoContrato={oferta.tipoContrato}
            salario={oferta.salario}
            estado={oferta.estado}
          />
        ))
      ) : (
        <p className="text-white font-bold text-xl">No hay ofertas laborales disponibles.</p>
      )}
    </div>
  );
}
