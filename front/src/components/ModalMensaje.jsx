import React from "react";
import { Dialog } from "@headlessui/react";
import CloseIcon from "@mui/icons-material/Close";

function ModalMensaje({ isOpen, onClose, closeDefault, mensaje = "Mensaje por defecto" }) {
  return (
    <Dialog
      open={isOpen}
      onClose={closeDefault}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex text-black items-center justify-center min-h-screen bg-black/30 px-4">
        <Dialog.Panel className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
          {/* Título y botón de cerrar */}
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-bold">
              Notificación
            </Dialog.Title>
            <div
              onClick={closeDefault}
              className="rounded-full p-[6px] hover:cursor-pointer hover:bg-gray-200"
            >
              <CloseIcon style={{ fontSize: "25px" }} />
            </div>
          </div>

          {/* Mensaje central */}
          <p className="text-gray-700 text-base">{mensaje}</p>

          {/* Botón de aceptar */}
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="bg-[#008278] text-white px-6 py-2 rounded-3xl hover:bg-[#00665f]"
            >
              Aceptar
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default ModalMensaje;
