import React, { useEffect, useState } from "react";
import { getOfertasRequest } from "../../api/ofertaLaboralApi";
import CardOfertaLaboral from "../../components/OfertaLaboral/CardOfertaLaboral";
import { Link, useNavigate } from "react-router-dom";
import FiltrosOferta from "../../components/OfertaLaboral/filtrosOferta";
import useFiltrosOferta from "../../Hooks/useFiltroOfertas";
import { tiempoRelativo, DiasTranscurridos } from "../../utils/tiempoRelativo";
import toast from "react-hot-toast";

import ModalFormularioPostulacion from "../../components/OfertaLaboral/ModalFormularioPostulacion";

import {
  postularOfertaRequest,
  getOfertasPostuladasPorUsuario,
} from "../../api/ofertaLaboralApi";

//Improtacion para obtener diferencia de tiempos
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale"; // idioma español

import {
  Business,
  LocationOn,
  Category,
  Edit,
  Visibility,
  VisibilityOff,
  Work,
} from "@mui/icons-material";

export default function OfertaLaboral() {
  //Estado para obtener la oferta seleccionada
  const navigate = useNavigate();
  const [ofertaActual, setOfertaSeleccionada] = useState(null);

  const [yaPostulado, setYaPostulado] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const [modalAbierto, setModalAbierto] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [ofertas, setOfertas] = useState([]);
  const { filtros, agregarFiltro, quitarFiltro, ofertasFiltradas } =
    useFiltrosOferta(ofertas);
  const [ofertasPostuladas, setOfertasPostuladas] = useState([]);

  const handlePostulacion = async (data) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const file = data.cv?.[0] || null;

    setIsLoading(true); // empieza la carga

    try {
      await postularOfertaRequest({
        idOferta: ofertaActual._id,
        correo: data.correo,
        numero: data.telefono,
        uid: user.uid,
        cvFile: file,
      });
    } catch (error) {
      console.log("Error capturado en handlePostulacion:", error);
      toast.error(
        "❌ Error al postular a la oferta: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setIsLoading(false); // termina la carga
    }
  };

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const data = await getOfertasRequest();
        setOfertas(data);
        setOfertaSeleccionada(data[0] || null); // Selecciona la primera oferta por defectO
      } catch (error) {
        console.error("Error al cargar ofertas:", error);
      }
    };
    fetchOfertas();
  }, []);

  useEffect(() => {
    if (user?.uid) {
      getOfertasPostuladasPorUsuario(user.uid).then(setOfertasPostuladas);
    }
  }, []);

  return (
    <div className="relative mb-16 flex flex-col items-start w-full min-h-screen">
      {/* Título (opcional) */}
      {/*
  <h2 className="text-[#242424] text-4xl font-bold mb-5">
    Gestionar Ofertas Laborales
  </h2>
  */}

      {/* Filtros fijos */}
      <div className="w-full">
        <FiltrosOferta
          filtros={filtros}
          agregarFiltro={agregarFiltro}
          quitarFiltro={quitarFiltro}
        />
        {/* Botón añadir oferta (opcional) */}
        {/*
    <Link
      to="/guardar-oferta"
      className="bg-[#1A1A1A] w-full md:w-[20%] hover:bg-[#2d2d2d] hover:text-white hover:cursor-pointer text-[16px] text-white font-semibold py-3  rounded-xl transition-all duration-300 ease-in-out text-center mb-1"
    >
      Añadir Oferta
    </Link>
    */}
      </div>

      {/* Contenido principal */}
      <div className="flex flex-row w-full gap-5">
        {/* Lista de ofertas */}
        <div className="flex flex-col w-[40%] gap-4">
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
                // Añadir la función para seleccionar la oferta
                onSeleccionOferta={() => setOfertaSeleccionada(oferta)}
                // Variable para indicar si la oferta está seleccionada
                seleccionado={ofertaActual?._id === oferta._id}
              />
            ))
          ) : (
            <p className="text-white font-bold m-0 mt-5 text-xl">
              No hay ofertas laborales disponibles.
            </p>
          )}
        </div>

        {/* Detalle de la oferta */}
        <div className="sticky top-[100px] items-start flex flex-col py-6 px-8 flex-1 max-h-[83vh] min-h-[83vh] rounded-3xl shadow-md bg-white text-[#1e1e1e] h-fit">
          {ofertaActual ? (
            <>
              <div className="sticky flex flex-col items-start justify-start">
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
                    className={`
                  ${
                    DiasTranscurridos(ofertaActual.fechaPublicacion) == 0
                      ? "text-[#006effc6] font-bold"
                      : "text-[#555]"
                  }`}
                  >
                    {" "}
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
                  <button
                    onClick={() => setModalAbierto(true)}
                    disabled={ofertasPostuladas.includes(ofertaActual._id)}
                    className={`text-white px-7! py-2! mt-2!  rounded-3xl! outline-none! border-0! ${
                      ofertasPostuladas.includes(ofertaActual._id)
                        ? "bg-gray-400! cursor-not-allowed"
                        : "bg-[#008278]!  hover:border-0"
                    }`}
                  >
                    {ofertasPostuladas.includes(ofertaActual._id)
                      ? "Postulado"
                      : "Solicitar"}
                  </button>

                  <button
                    className="text-[#008278] mt-2 bg-white! px-6! py-2!
                rounded-3xl! outline-2! border-0! outline-[#008278]!
                hover:border-0! hover:text-[#3b918a] hover:outline-3! hover:outline-[#008277a9]! hover:bg-[#0082770d]!"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/postulantes-oferta/${ofertaActual?._id}`)
                    }
                    className="bg-[#1A1A1A] w-full md:w-[20%] hover:bg-[#2d2d2d] hover:text-white hover:cursor-pointer text-[16px] text-white font-semibold py-3  rounded-xl transition-all duration-300 ease-in-out text-center mb-1"
                  >
                    Ver postulantes
                  </button>
                </div>
              </div>

              <div className="overflow-auto flex flex-col items-start ">
                <h2 className="mb-3 my-2   font-semibold text-lg">
                  Acerca del Empleo
                </h2>

                <div>
                  <div
                    className="text-[#444] text-sm"
                    dangerouslySetInnerHTML={{
                      __html: ofertaActual.descripcion,
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500">
              Selecciona una oferta para ver sus detalles
            </p>
          )}
        </div>
      </div>

      <ModalFormularioPostulacion
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSubmitPostulacion={handlePostulacion}
        oferta={ofertaActual}
      />
    </div>
  );
}
