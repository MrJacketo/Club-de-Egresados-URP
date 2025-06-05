import React, { useRef, useState, useEffect } from "react";
import { Business, Work, Category } from "@mui/icons-material";
import { DiasTranscurridos, tiempoRelativo } from "../../utils/tiempoRelativo"; // Asegúrate de tener esto en tu proyecto

const OfertaDetalle = ({ ofertaActual }) => {
  const acercaRef = useRef(null);
  const [mostrarSticky, setMostrarSticky] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setMostrarSticky(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (acercaRef.current) {
      observer.observe(acercaRef.current);
    }

    return () => {
      if (acercaRef.current) {
        observer.unobserve(acercaRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      {mostrarSticky && ofertaActual && (
        <div className="fixed top-0 left-0 w-full bg-white border-b shadow z-50 px-4 py-2 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold truncate max-w-[200px]">
              {ofertaActual.cargo}
            </h4>
            <p className="text-xs text-gray-600 truncate max-w-[200px]">
              {ofertaActual.empresa}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="text-white bg-[#008278] px-3 py-1 text-xs rounded-full">
              Solicitar
            </button>
            <button className="text-[#008278] border border-[#008278] px-3 py-1 text-xs rounded-full">
              Guardar
            </button>
          </div>
        </div>
      )}

      <div className="sticky overflow-auto top-[100px] items-start flex flex-col py-6 px-8 flex-1 max-h-[83vh] min-h-[83vh] rounded-3xl shadow-md bg-white text-[#1e1e1e] h-fit">
        {ofertaActual ? (
          <>
            <div className="flex flex-row items-center gap-2">
              <Business style={{ fontSize: "28px" }} />
              <h3 className="font-bold">{ofertaActual.empresa}</h3>
            </div>
            <h2 className="text-2xl font-bold mt-2 mb-1">
              {ofertaActual.cargo}
            </h2>

            <div className="flex flex-row items-center gap-2 font-medium text-sm text-[#555]">
              <h3>{ofertaActual.ubicacion}</h3> ·
              <h3
                className={`${
                  DiasTranscurridos(ofertaActual.fechaPublicacion) == 0
                    ? "text-[#006effc6] font-bold"
                    : "text-[#555]"
                }`}
              >
                {tiempoRelativo(ofertaActual.fechaPublicacion)}
              </h3>
            </div>

            <div className="flex flex-row items-center gap-2 mt-1">
              <Work style={{ fontSize: "18px" }} />
              <h3 className="text-sm font-medium">
                {ofertaActual.modalidad} · {ofertaActual.tipoContrato}
              </h3>

              <div className="ml-2 flex flex-row items-center gap-2">
                <Category style={{ fontSize: "18px", color: "#31CD7F" }} />
                <h3 className="text-sm font-medium text-[#31CD7F]">
                  {ofertaActual.area}
                </h3>
              </div>
            </div>

            <div className="flex flex-row justify-start gap-2 my-2">
              <button className="text-white mt-2 bg-[#008278] px-6 py-2 rounded-3xl">
                Solicitar
              </button>

              <button className="text-[#008278] mt-2 bg-white px-6 py-2 rounded-3xl border border-[#008278] hover:text-[#3b918a] hover:border-[#008277a9] hover:bg-[#0082770d]">
                Guardar
              </button>
            </div>

            <h2
              ref={acercaRef}
              className="mb-3 my-2 font-semibold text-lg"
            >
              Acerca del Empleo
            </h2>

            <div className="text-[#444] text-sm">
              <div
                dangerouslySetInnerHTML={{
                  __html: ofertaActual.descripcion,
                }}
              />
            </div>
          </>
        ) : (
          <p className="text-gray-500">
            Selecciona una oferta para ver sus detalles
          </p>
        )}
      </div>
    </div>
  );
};

export default OfertaDetalle;
