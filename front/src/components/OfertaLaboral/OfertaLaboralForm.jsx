import React from "react";
import { useForm } from "react-hook-form";
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
import Editor from "./inputs/Editor";

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

  const [editorContent, setEditorContent] = React.useState(
    "<p><strong>Hello World,</strong></p><p>This Is a Demo Use of The Editor</p><p></p><p>Try Your Self like<u> UnderLine</u></p><p>or <s>Strike</s></p><p><strong>Bold is Gold</strong></p><p><em>Italic Is Elite</em></p><p><em><mark>Or You Want To Highlight</mark></em></p><p>Did I told You About Justify</p><p style='text-align: right'>Left</p><p>right</p><p style='text-align: center'>or even center</p><p>try The Link &amp; visit <a target='_blank' rel='noopener noreferrer nofollow' class='link link' href='https://github.com/mahmoud-bebars'>My GitHub</a></p><p style='text-align: center'></p>"
  );

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
        console.log(id);
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
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-start mb-5">
          <h2 className="text-green-500 text-4xl font-bold ">
            Guardar Oferta Laboral
          </h2>
        </div>

        <div className="space-y-6">
          <div className="flex gap-6">
            <InputField
              name="cargo"
              label="Titulo del empleo"
              register={register}
              errors={errors}
              type="text"
            />
            <InputField
              name="empresa"
              label="Nombre Empresa"
              register={register}
              errors={errors}
            />
          </div>

          <div className="flex gap-6">
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
            />
          </div>

          <div className="flex gap-6">
            <SelectField
              name="tipoContrato"
              label="Tipo de contrato"
              control={control}
              errors={errors}
              options={TIPOS_CONTRATO}
            />
            <SelectField
              name="requisitos"
              label="Experiencia laboral"
              control={control}
              errors={errors}
              options={REQUISITOS}
            />
          </div>

          <div>
            <div>
              <Editor name="descripcion" control={control} />
              {errors.descripcion && (
                <span className="text-red-500 text-sm">
                  {errors.descripcion.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-6">
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
            />
          </div>

          <div className="flex gap-6">
            <InputField
              name="salario"
              label="Salario estimado"
              register={register}
              errors={errors}
            />
            <DateField
              name="fechaCierre"
              label="Fecha cierre de la oferta"
              register={register}
              errors={errors}
            />
          </div>
        </div>

        <input
          type="submit"
          className="bg-[#3BD480] hover:bg-[#13B89D] hover:cursor-pointer text-xl text-white font-bold py-4 px-12 rounded-2xl mt-8 transition-all duration-300 ease-in-out"
          value={"Guardar Oferta "}
        />
      </form>
    </>
  );
}

export default OfertaLaboralForm;
