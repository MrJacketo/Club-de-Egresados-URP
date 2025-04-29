import React from "react";
import { useForm } from "react-hook-form";
import { Stack } from "@mui/material";
import {
  AREAS_LABORALES,
  MODALIDAD,
  REQUISITOS,
  TIPOS_CONTRATO,
} from "../../constants/OfertaLaboral/OfertaLaboral.enum";
import { toast } from "react-hot-toast";

//Esquemas de validacion Zod
import { zodResolver } from "@hookform/resolvers/zod";
import { ofertaLaboralSchema } from "../../constants/OfertaLaboral/OfertaLaboralSchema";
import { useState, useEffect } from "react";

// Elementos del formulario
import InputField from "./inputs/InputField";
import SelectField from "./inputs/SelectField";
import TextArea from "./inputs/TextArea";
import DateField from "./inputs/DateField";
import { useLocation, useNavigate } from "react-router-dom";

//Api
import {
  createOrUpdateOfertaRequest,
  getOfertaRequest,
} from "../../api/ofertaLaboralApi";

function OfertaLaboralForm() {
  //Recibir datos si hay para editar
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {}; // Obtén solo el id
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(ofertaLaboralSchema),
  });

  // Si hay datos, reseteamos el form con ellos
  useEffect(() => {
    const fetchOferta = async () => {
      if (id) {
        setLoading(true);
        try {
          const data = await getOfertaRequest(id);
          // Normalizar los campos que son selects
          const normalizedData = {
            ...data,
            modalidad: data.modalidad || "", // Asegúrate que modalidad exista
            tipoContrato: data.tipoContrato || "",
            requisitos: data.requisitos || "",
            area: data.area || "",
            fechaCierre: data.fechaCierre ? data.fechaCierre.slice(0, 10) : "", // formato de fecha yyyy-MM-dd
          };
          reset(normalizedData); // Llenar el form automáticamente
        } catch (error) {
          console.error(error);
          toast.error("Error al cargar la oferta");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOferta();
  }, [id, reset]);

  //Funcion para guardar la oferta laboral
  const onSubmit = async (data) => {
    try {
      const ofertaData = {
        ...data,
        fechaCierre: new Date(data.fechaCierre),
      };

      if (id) {
        console.log(id)
        ofertaData.id = id; // Asegura que el ID esté en la data para actualizar
      }

      await createOrUpdateOfertaRequest(ofertaData);

      toast.success("Oferta guardada exitosamente");
      reset();
      navigate("/gestion-oferta");
    } catch (error) {
      console.error(error);
      toast.error("Hubo un error al guardar la oferta");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-start mb-5">
        <h2 className="text-green-500 text-4xl font-bold ">
          Guardar Oferta Laboral
        </h2>
      </div>
      <Stack spacing={2}>
        <Stack direction={"row"} spacing={3}>
          <InputField
            name="cargo"
            label="Titulo del empleo"
            register={register}
            errors={errors}
            sx={{ flex: 1 }}
          />
          <InputField
            name="empresa"
            label="Nombre Empresa"
            register={register}
            errors={errors}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Stack direction={"row"} spacing={3}>
          <SelectField
            name="modalidad"
            label="Modalidad de empleo"
            control={control}
            errors={errors}
            options={MODALIDAD}
          />

          <InputField
            name="ubicacion"
            label="Ubicacion del empleo"
            register={register}
            errors={errors}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Stack direction={"row"} spacing={3}>
          <SelectField
            name="tipoContrato"
            label="Tipo de contrato"
            control={control}
            errors={errors}
            options={TIPOS_CONTRATO}
          />

          <SelectField
            name="requisitos"
            label="Tipo de contrato"
            control={control}
            errors={errors}
            options={REQUISITOS}
          />
        </Stack>

        <Stack direction={"row"}>
          <TextArea
            name="descripcion"
            label="Descripción del empleo"
            register={register}
            errors={errors}
            rows={6} // El área de texto será más grande
            sx={{ backgroundColor: "#f7f7f7" }} // Fondo ligeramente gris
          />
        </Stack>

        <Stack direction={"row"} spacing={3}>
          <SelectField
            name="area"
            label="Area de empleo"
            control={control}
            errors={errors}
            options={AREAS_LABORALES}
          />

          <InputField
            name="linkEmpresa"
            label="Sitio/Correo de la empresa"
            register={register}
            errors={errors}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Stack direction={"row"} spacing={3}>
          <InputField
            name="salario"
            label="Salario estimado"
            register={register}
            errors={errors}
            sx={{ flex: 1 }}
          />

          <DateField
            name="fechaCierre"
            label="Fecha cierre de la oferta"
            register={register}
            errors={errors}
          />
        </Stack>
      </Stack>

      <input
        type="submit"
        className="bg-[#3BD480] hover:bg-[#13B89D] hover:cursor-pointer text-xl text-white font-bold py-4 px-12 rounded-2xl mt-8 transition-all duration-300 ease-in-out"
        value={"Guardar Oferta "}
      />
    </form>
  );
}

export default OfertaLaboralForm;
