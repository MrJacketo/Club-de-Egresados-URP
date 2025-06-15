import React, { useEffect, useState } from "react";
import { getOfertasRequest } from "../../../api/ofertaLaboralApi";
import CardOfertaLaboral from "../../../components/OfertaLaboral/CardOfertaLaboral";
import { Link, useNavigate } from "react-router-dom";
import FiltrosOferta from "../../../components/OfertaLaboral/filtrosOferta";
import useFiltrosOferta from "../../../Hooks/useFiltroOfertas";
import { tiempoRelativo, DiasTranscurridos } from "../../../utils/tiempoRelativo";
import toast from "react-hot-toast";

import ModalFormularioPostulacion from "../../../components/OfertaLaboral/ModalFormularioPostulacion";
import ModalMensaje from "../../../components/ModalMensaje";

import {
  postularOfertaRequest,
  getOfertasPostuladasPorUsuario,
  getOfertasCreadasPorUsuario,
} from "../../../api/ofertaLaboralApi";

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
import { useRef } from "react";

export default function OfertaLaboral() {
  //Estado para obtener la oferta seleccionada
  const navigate = useNavigate();
  const [ofertaActual, setOfertaSeleccionada] = useState(null);
  const [yaPostulado, setYaPostulado] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [modalAbierto, setModalAbierto] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ofertas, setOfertas] = useState([]);
  const {
    filtros,
    agregarFiltro,
    quitarFiltro,
    ofertasFiltradas,
    searchTerm,
    setSearchTerm,
  } = useFiltrosOferta(ofertas);
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

      ofertasPostuladas.push(ofertaActual._id);
      toast.success("Postulación enviada correctamente");
    } catch (error) {
      console.log("Error capturado en handlePostulacion:", error);
      toast.error(
        "Error al postular a la oferta: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setIsLoading(false); // termina la carga
    }
  };

  //Estados opcionales
  const [activo, setActivo] = useState(false);
  const toggle = () => setActivo(!activo);
  const [modalMensajeAbierto, setModalMensaje] = useState(false);

  //Datos temporales
  let ofertasTotales = useRef([]);
  let ofertasCreadas = useRef([]);

  //fetch ara obtener las ofertas totales
  const fetchOfertas = async () => {
    try {
      const [ofTotales, ofCreadas] = await Promise.all([
        getOfertasRequest(),
        getOfertasCreadasPorUsuario(user.uid),
      ]);

      //Asignamos las ofertas
      ofertasTotales.current = ofTotales;
      ofertasCreadas.current = ofCreadas;

      //Establecemos las ofertas a mostrar

      setOfertas(ofTotales);
      setOfertaSeleccionada(ofTotales[0] || null); // Selecciona la primera oferta por defectO
    } catch (error) {
      console.error("Error al cargar ofertas:", error);
    }
  };

  //Obtener las ofertas al cargar el componente
  useEffect(() => {
    fetchOfertas();
    if (user?.uid) {
      getOfertasPostuladasPorUsuario(user.uid).then(setOfertasPostuladas);
    }
  }, []);

  useEffect(() => {
    setOfertaSeleccionada(ofertasFiltradas[0] || null);
  }, [ofertasFiltradas]);

  //Maneja la activacion de edición de la página ofertas
  const cambiarVista = async () => {
    setActivo(!activo);
    if (!activo) {
      setOfertas(ofertasCreadas.current);
      setOfertaSeleccionada(ofertasCreadas.current[0] || null);
    } else {
      setOfertas(ofertasTotales.current);
      setOfertaSeleccionada(ofertasTotales.current[0] || null);
      fetchOfertas();
    }
    setModalMensaje(false);
  };

  return (
    <div className="relative mb-16 flex flex-col items-start w-full min-h-screen">
      {/* Título (opcional) */}
      <div className="flex flex-row w-full justify-between items-center">
        <div>
          <h2 className="text-[#ffffff]  text-4xl font-bold mb-5">
            Ofertas Laborales
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <p className="font-semibold text-lg">Modo de edicion</p>
          <div
            onClick={() => setModalMensaje(true)}
            className={`w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 
          ${activo ? "bg-[#008278]" : "bg-gray-400"}`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300
            ${activo ? "translate-x-8" : "translate-x-0"}`}
            ></div>
          </div>
        </div>
      </div>

      <input
        type="text"
        placeholder="Buscar por cargo o empresa"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 mb-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#008278]"
      />

      {/* Filtros fijos */}
      <div className="w-full flex justify-between gap-10 items-start mb-4">
        <FiltrosOferta
          filtros={filtros}
          agregarFiltro={agregarFiltro}
          quitarFiltro={quitarFiltro}
        />
        {/* Botón añadir oferta (opcional) */}
        {activo && (
          <Link
            to="/guardar-oferta"
            className="bg-[#1A1A1A] flex-1/6 hover:bg-[#2d2d2d] hover:text-white hover:cursor-pointer text-[16px] text-white font-semibold py-3  rounded-xl transition-all duration-300 ease-in-out text-center"
          >
            Añadir Oferta
          </Link>
        )}
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
                edicion={activo}
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
                  {activo && (
                    <button
                      onClick={() =>
                        navigate(`/postulantes-oferta/${ofertaActual?._id}`)
                      }
                      className="text-white px-7! py-2! mt-2!  rounded-3xl! outline-none! border-0 bg-[#042d59]!  hover:border-0"
                    >
                      Ver postulantes
                    </button>
                  )}
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
      <ModalMensaje
        closeDefault={() => setModalMensaje(false)}
        isOpen={modalMensajeAbierto}
        onClose={cambiarVista}
        mensaje={
          activo
            ? "¿Deseas salir del modo de edición?"
            : "¿Deseas Activar el modo de edición?"
        }
      />
    </div>
  );
}
