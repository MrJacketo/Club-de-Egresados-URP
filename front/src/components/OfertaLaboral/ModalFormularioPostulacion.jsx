import React, { useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "./inputs/InputField";
import { Dialog } from "@headlessui/react";
import { toast } from "react-hot-toast";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2"; // Ícono moderno
import CloseIcon from "@mui/icons-material/Close";

function ModalFormularioPostulacion({
  isOpen,
  onClose,
  onSubmitPostulacion,
  oferta,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [fileName, setFileName] = useState("");

  const onSubmit = (data) => {
    onSubmitPostulacion(data);
    toast.success("Postulación enviada correctamente");
    reset();
    setFileName(""); // Limpiar nombre del archivo
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex text-black items-center justify-center min-h-screen bg-black/30 px-4">
        <Dialog.Panel className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
          <div className="p-0 mb-6 font-bold flex justify-between items-center">
            <Dialog.Title className="text-xl font-bold">
              Solicitud de empleo en {oferta?.empresa}
            </Dialog.Title>

            <div onClick={onClose}
              className="rounded-[50%] items-center text-center px-[5px] py-[3px] hover:cursor-pointer hover:bg-[#d7d7d794]">
              <CloseIcon style={{ fontSize: "25px" }} />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Número de teléfono */}
            <InputField
              name="telefono"
              label="Número de teléfono"
              register={register}
              errors={errors}
              type="tel"
              validation={{ required: "Este campo es obligatorio" }}
            />

            {/* Correo */}
            <InputField
              name="correo"
              label="Correo de contacto"
              register={register}
              errors={errors}
              type="email"
              validation={{ required: "Este campo es obligatorio" }}
            />

            {/* Subir CV */}
            <div className="space-y-1">
              <label className="block font-semibold text-gray-700">
                Subir CV (opcional)
              </label>

              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  {...register("cv")}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setFileName(file.name);
                  }}
                  className="block text-white w-full text-sm border border-gray-300 rounded-md p-2 file:hidden"
                />
                <div className="absolute inset-y-0 left-0 text-gray-400 pl-3 flex items-center pointer-events-none">
                  <HiOutlineDocumentArrowUp className="text-gray-400 text-xl" />
                  Cargar currículum
                </div>
              </div>

              {fileName && (
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  <HiOutlineDocumentArrowUp className="text-green-500" />
                  <span>{fileName}</span>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="submit"
                className="text-white px-7! py-2! mt-2!  rounded-3xl! outline-none! border-0! bg-[#008278]!  hover:border-0"
              >
                Postular
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default ModalFormularioPostulacion;
