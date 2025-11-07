import React, { useEffect, useState, useContext } from "react";
import { getOfertasRequest } from "../../../api/ofertaLaboralApi";
import CardOfertaLaboral from "../../../components/OfertaLaboral/CardOfertaLaboral";
import { Link, useNavigate } from "react-router-dom";
import FiltrosOferta from "../../../components/OfertaLaboral/filtrosOferta";
import useFiltrosOferta from "../../../Hooks/useFiltroOfertas";
import { tiempoRelativo, DiasTranscurridos } from "../../../utils/tiempoRelativo";
import toast from "react-hot-toast";
import { UserContext } from "../../../context/userContext";

import ModalFormularioPostulacion from "../../../components/OfertaLaboral/ModalFormularioPostulacion";
import ModalMensaje from "../../../components/ModalMensaje";

import {
  postularOfertaRequest,
  getOfertasPostuladasPorUsuario,
  getOfertasCreadasPorUsuario,
} from "../../../api/ofertaLaboralApi";

import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

import {
  Business,
  LocationOn,
  Category,
  Edit,
  Visibility,
  VisibilityOff,
  Work,
  Bookmark,
} from "@mui/icons-material";
import { useRef } from "react";

export default function OfertaLaboral() {
  const navigate = useNavigate();
  const [ofertaActual, setOfertaSeleccionada] = useState(null);
  const [yaPostulado, setYaPostulado] = useState(false);
  const { user } = useContext(UserContext);
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
    const file = data.cv?.[0] || null;

    setIsLoading(true);

    try {
      await postularOfertaRequest({
        idOferta: ofertaActual._id,
        correo: data.correo,
        numero: data.telefono,
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
      setIsLoading(false);
    }
  };

  const [activo, setActivo] = useState(false);
  const toggle = () => setActivo(!activo);
  const [modalMensajeAbierto, setModalMensaje] = useState(false);

  let ofertasTotales = useRef([]);
  let ofertasCreadas = useRef([]);

  const fetchOfertas = async () => {
    try {
      console.log('fetchOfertas - user:', user);
      console.log('fetchOfertas - user.id:', user?.id);
      
      if (!user?.id) {
        console.log('Usuario no está disponible aún, saltando fetchOfertas');
        return;
      }

      const [ofTotales, ofCreadas] = await Promise.all([
        getOfertasRequest(),
        getOfertasCreadasPorUsuario(user.id),
      ]);

      ofertasTotales.current = ofTotales;
      ofertasCreadas.current = ofCreadas;

      setOfertas(ofTotales);
      setOfertaSeleccionada(ofTotales[0] || null);
    } catch (error) {
      console.error("Error al cargar ofertas:", error);
    }
  };

  useEffect(() => {
    console.log('useEffect ejecutado - user:', user);
    if (user?.id) {
      console.log('Usuario disponible, ejecutando fetchOfertas');
      fetchOfertas();
      getOfertasPostuladasPorUsuario(user.id).then(setOfertasPostuladas);
    } else {
      console.log('Usuario no disponible aún');
    }
  }, [user]);

  useEffect(() => {
    setOfertaSeleccionada(ofertasFiltradas[0] || null);
  }, [ofertasFiltradas]);

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
    <div 
      className="min-h-screen pt-20 pb-10"
      style={{ background: "linear-gradient(to bottom right, #f9fafb, #ffffff)" }}
    >
      <div className="max-w-[95%] mx-auto px-4">
        {/* Header */}
        <div className="pb-8 text-start">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-6xl font-bold text-gray-900 mb-2">
                <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                  Ofertas Laborales
                </span>
              </h1>
              <p className="text-xl text-gray-500">
                Encuentra oportunidades laborales que impulsen tu carrera profesional
              </p>
            </div>
            
            {/* Toggle Modo Edición */}
            <div className="flex items-center gap-4">
              <p className="font-semibold text-lg text-gray-700">Modo de edición</p>
              <div
                onClick={() => setModalMensaje(true)}
                className={`w-16 h-8 flex items-center rounded-full! p-1 cursor-pointer transition-all! duration-300! ${
                  activo ? "bg-gradient-to-r! from-green-500! to-teal-500!" : "bg-gray-400!"
                }`}
              >
                <div
                  className={`bg-white! w-6! h-6! rounded-full! shadow-md! transform! transition-transform! duration-300! ${
                    activo ? "translate-x-8!" : "translate-x-0!"
                  }`}
                ></div>
              </div>
            </div>
          </div>

          {/* Barra de búsqueda */}
          <div className="relative group mb-6">
            <input
              type="text"
              placeholder="Buscar por cargo o empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white text-gray-800 px-6 py-4 pl-6 rounded-xl! transition-all! duration-300! border-2! border-gray-200! hover:border-green-300! focus:border-green-500! focus:bg-white! focus:shadow-lg!"
              style={{ outline: "none" }}
            />
          </div>

          {/* Filtros y botón añadir */}
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <FiltrosOferta
                filtros={filtros}
                agregarFiltro={agregarFiltro}
                quitarFiltro={quitarFiltro}
              />
            </div>
            {activo && (
              <Link
                to="/guardar-oferta"
                className="bg-gradient-to-r! from-green-500! to-teal-500! hover:from-green-600! hover:to-teal-600! text-white! font-bold! px-8! py-3! rounded-xl! transition-all! duration-300! hover:shadow-2xl! whitespace-nowrap! block!"
              >
                Añadir Oferta
              </Link>
            )}
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex gap-6">
          {/* Lista de ofertas - scrolleable */}
          <div className="w-[42%] flex flex-col gap-4 max-h-[73vh] overflow-y-auto p-4 scrollbar-custom">
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
                  onSeleccionOferta={() => setOfertaSeleccionada(oferta)}
                  seleccionado={ofertaActual?._id === oferta._id}
                  edicion={activo}
                />
              ))
            ) : (
              <div className="bg-white! rounded-2xl! shadow-lg! p-20! text-center!">
                <Work className="text-gray-400! mx-auto! mb-4!" style={{ fontSize: '64px' }} />
                <h3 className="text-lg! font-medium! text-gray-900! mb-2!">
                  No hay ofertas laborales disponibles
                </h3>
                <p className="text-gray-600!">
                  Vuelve pronto para encontrar nuevas oportunidades
                </p>
              </div>
            )}
          </div>

          {/* Detalle de la oferta - sticky */}
          <div className="flex-1 sticky top-24 h-fit max-h-[73vh]">
            <div className="bg-white! rounded-2xl! shadow-xl! p-8! overflow-y-auto! max-h-[73vh]! scrollbar-custom!">
              {ofertaActual ? (
                <>
                  {/* Header de la oferta */}
                  <div className="border-b! border-gray-200! pb-6! mb-6!">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-gradient-to-r! from-green-500! to-teal-500! p-3! rounded-xl! shadow-lg!">
                        <Business style={{ fontSize: "28px", color: "#ffffff" }} />
                      </div>
                      <h3 className="font-bold! text-xl! text-gray-800!">{ofertaActual.empresa}</h3>
                    </div>
                    
                    <h2 className="text-4xl! font-bold! mb-4! bg-gradient-to-r! from-green-500! to-teal-500! bg-clip-text! text-transparent!">
                      {ofertaActual.cargo}
                    </h2>

                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-5">
                      <div className="flex items-center gap-2 bg-gray-100! px-3! py-2! rounded-lg!">
                        <LocationOn style={{ fontSize: "18px", color: "#5DC554" }} />
                        <span className="font-medium!">{ofertaActual.ubicacion}</span>
                      </div>
                      <span className="text-gray-400!">·</span>
                      <div className={`flex items-center gap-2 px-3! py-2! rounded-lg! ${
                        DiasTranscurridos(ofertaActual.fechaPublicacion) == 0
                          ? "bg-green-100! text-green-600! font-bold!"
                          : "bg-gray-100! text-gray-600!"
                      }`}>
                        <span>{tiempoRelativo(ofertaActual.fechaPublicacion)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                      <div className="flex items-center gap-2 bg-gradient-to-r! from-green-50! to-teal-50! px-4! py-2! rounded-lg! border! border-green-200!">
                        <Work style={{ fontSize: "18px", color: "#5DC554" }} />
                        <span className="text-sm! font-semibold! text-gray-700!">
                          {ofertaActual.modalidad}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-gradient-to-r! from-green-50! to-teal-50! px-4! py-2! rounded-lg! border! border-green-200!">
                        <Category style={{ fontSize: "18px", color: "#5DC554" }} />
                        <span className="text-sm! font-semibold! text-green-600!">
                          {ofertaActual.tipoContrato}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 bg-gradient-to-r! from-teal-50! to-green-50! px-4! py-2! rounded-lg! border! border-teal-200!">
                        <span className="text-sm! font-semibold! text-teal-600!">
                          {ofertaActual.area}
                        </span>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() => setModalAbierto(true)}
                        disabled={ofertasPostuladas.includes(ofertaActual._id)}
                        className={`px-8! py-3! rounded-full! font-bold! transition-all! duration-300! ${
                          ofertasPostuladas.includes(ofertaActual._id)
                            ? "bg-gray-400! text-white! cursor-not-allowed! opacity-70!"
                            : "bg-gradient-to-r! from-green-500! to-teal-500! hover:from-green-600! hover:to-teal-600! text-white! hover:shadow-2xl! hover:scale-105! transform!"
                        }`}
                      >
                        {ofertasPostuladas.includes(ofertaActual._id)
                          ? "✓ Postulado"
                          : "Solicitar Empleo"}
                      </button>

                      <button
                        className="px-8! py-3! bg-white! rounded-full! font-bold! transition-all! duration-300! border-2! border-green-500! text-green-600! hover:bg-green-50! hover:shadow-lg! hover:scale-105! transform! flex! items-center! gap-2!"
                      >
                        <Bookmark style={{ fontSize: "18px" }} />
                        Guardar
                      </button>
                      
                      {activo && (
                        <button
                          onClick={() =>
                            navigate(`/postulantes-oferta/${ofertaActual?._id}`)
                          }
                          className="px-8! py-3! rounded-full! font-bold! transition-all! duration-300! bg-gray-800! hover:bg-gray-900! text-white! hover:shadow-2xl! hover:scale-105! transform!"
                        >
                          Ver Postulantes
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <h2 className="text-2xl! font-bold! text-gray-900! mb-5! flex! items-center! gap-2!">
                      <div className="w-1! h-8! bg-gradient-to-b! from-green-500! to-teal-500! rounded-full!"></div>
                      Acerca del Empleo
                    </h2>
                    <div
                      className="text-gray-700! text-base! leading-relaxed! prose! prose-sm! max-w-none!"
                      dangerouslySetInnerHTML={{
                        __html: ofertaActual.descripcion,
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="text-center! py-20!">
                  <div className="bg-gradient-to-r! from-green-100! to-teal-100! p-8! rounded-2xl! inline-block! mb-6!">
                    <Work className="text-green-600!" style={{ fontSize: '64px' }} />
                  </div>
                  <h3 className="text-xl! font-bold! text-gray-900! mb-2!">
                    Selecciona una oferta
                  </h3>
                  <p className="text-gray-500! text-lg!">
                    Elige una oferta de la lista para ver sus detalles completos
                  </p>
                </div>
              )}
            </div>
          </div>
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