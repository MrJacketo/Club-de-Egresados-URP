import { useState, useEffect, use } from "react";
import {
  Edit,
  Visibility,
  VisibilityOff,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { disableUserRequest } from "../../api/userAdminApi";
import ModalMensaje from "../ModalMensaje";
import { toast } from "react-hot-toast";

const TablaUsuarios = ({ users, onEdit, onToggleActive }) => {
  //Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [currentUsers, setCurrentUsers] = useState([]);
  const [userActual, setUserActual] = useState([]);
  //Estado para el modal mensaje
  const [modalMensajeAbierto, setModalMensaje] = useState(false);

  //Funciones
  //Función para eitar
  const handleEdit = (user) => {
    onEdit(user);
  };
  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentUsers(users.slice(indexOfFirstItem, indexOfLastItem));
  }, [users, currentPage]);

  //Función para desactivar un usuario
  const handleDisable = async () => {
    try {
      const updatedUser = await disableUserRequest(userActual._id);
      onToggleActive();
      setModalMensaje(false);

      toast.success(`Estado actualizado`);
    } catch (error) {}
  };

  // Reset a página 1 si cambia la lista
  useEffect(() => {
    setCurrentPage(1);
  }, [users]);

  return (
    <div className="w-full mb-8">
      {/*Tabla */}
      <div className="overflow-x-auto rounded-xl pb-4 shadow border border-gray-200 bg-white">
        <table className="min-w-full items-center text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Registro</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  No hay usuarios para mostrar.
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-t  hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 text-[#222] py-3 font-medium">
                    {user.name}
                  </td>
                  <td className="px-4 text-[#222] py-3">{user.email}</td>
                  <td className="px-4 text-[#222] py-3">
                    {user.createdAt.slice(0, 10)}
                  </td>
                  <td className="px-4 py-3">
                    {user.activo ? (
                      <span className="inline-block px-2 py-[2px] text-xs bg-green-100 text-green-700 rounded-full">
                        Activo
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-[2px] text-xs bg-red-100 text-red-700 rounded-full">
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex items-center text-center space-x-6">
                    <div
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                    >
                      <Edit style={{ fontSize: "20px", color: "#13B89F" }} />
                    </div>

                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setUserActual(user);
                        setModalMensaje(true);
                      }}
                    >
                      {user.activo === true ? (
                        <Visibility
                          style={{ fontSize: "20px", color: "#13B89F" }}
                        />
                      ) : (
                        <VisibilityOff
                          style={{ fontSize: "20px", color: "#13B89F" }}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/*Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="text-[#1A1A1A]! font-normal! bg-white! text-2xl! p-0! border-0! outline-0!"
            >
              <ChevronLeft />
            </button>

            {/* Números de página */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={` bg-white! text-lg! p-0! border-0! outline-0! transition-colors duration-200
      ${
        currentPage === page ? "text-[#13B89F] font-semibold" : "text-[#4A5565]"
      }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="text-[#1A1A1A]! font-normal! bg-white! text-2xl! p-0! border-0! outline-0!"
            >
              {<ChevronRight />}
            </button>
          </div>
        )}
      </div>
      {/* Modal Mensaje */}
      <ModalMensaje
        closeDefault={() => setModalMensaje(false)}
        isOpen={modalMensajeAbierto}
        onClose={() => handleDisable()}
        mensaje={
          userActual.activo
            ? "¿Deseas desactivar el usuario?"
            : "¿Deseas activar el usuario?"
        }
      />
    </div>
  );
};

export default TablaUsuarios;
