import React, { useEffect, useState } from "react";
import { getOfertasRequest } from "../../api/ofertaLaboralApi";
import CardOfertaLaboral from "../../components/OfertaLaboral/CardOfertaLaboral";
import { Link } from "react-router-dom";
import FiltrosOferta from "../../components/OfertaLaboral/filtrosOferta";
import useFiltrosOferta from "../../Hooks/useFiltroOfertas";

export default function OfertaLaboral() {
  const [ofertas, setOfertas] = useState([]);
  const {
    filtros,
    agregarFiltro,
    quitarFiltro,
    ofertasFiltradas,
  } = useFiltrosOferta(ofertas);

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
    <div className="mb-15 flex flex-col items-start w-[90%] md:w-[60%] m-auto">
      <h2 className="text-[#242424] text-4xl font-bold mb-5">
        Gestionar Ofertas Laborales
      </h2>

      <FiltrosOferta
        filtros={filtros}
        agregarFiltro={agregarFiltro}
        quitarFiltro={quitarFiltro}
      />
      <Link
        to="/guardar-oferta"
        className="bg-[#1A1A1A] w-full md:w-[20%] hover:bg-[#2d2d2d] hover:text-white hover:cursor-pointer text-[16px] text-white font-semibold py-3  rounded-xl transition-all duration-300 ease-in-out text-center mb-1"
      >
        Añadir Oferta
      </Link>


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
        <p className="text-white font-bold text-xl">
          No hay ofertas laborales disponibles.
        </p>
      )}
    </div>
  );
}
