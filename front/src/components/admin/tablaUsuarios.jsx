import { useState, useEffect } from "react";
import {
  Edit,
  Visibility,
  VisibilityOff,
  ChevronLeft,
  ChevronRight,
  Person,
  Email,
  CalendarToday,
  VerifiedUser,
  Block,
} from "@mui/icons-material";
import { disableUserRequest } from "../../api/userAdminApi";
import ModalMensaje from "../ModalMensaje";
import { toast } from "react-hot-toast";

const TablaUsuarios = ({ users, onEdit, onToggleActive }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const [currentUsers, setCurrentUsers] = useState([]);
  const [userActual, setUserActual] = useState([]);
  const [modalMensajeAbierto, setModalMensaje] = useState(false);

  const handleEdit = (user) => {
    onEdit(user);
  };

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentUsers(users.slice(indexOfFirstItem, indexOfLastItem));
  }, [users, currentPage]);

  const handleDisable = async () => {
    try {
      await disableUserRequest(userActual._id);
      await onToggleActive(); // Ahora es async
      setModalMensaje(false);
      toast.success(`Estado actualizado`);
    } catch (error) {
      toast.error("Error al actualizar el estado");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [users]);

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-green-500 to-teal-500">
                <th className="px-6 py-4 text-left text-white font-bold text-sm">
                  Usuario
                </th>
                <th className="px-6 py-4 text-left text-white font-bold text-sm">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-white font-bold text-sm">
                  Fecha de Registro
                </th>
                <th className="px-6 py-4 text-center text-white font-bold text-sm">
                  Estado
                </th>
                <th className="px-6 py-4 text-center text-white font-bold text-sm">
                  Membresía
                </th>
                <th className="px-6 py-4 text-center text-white font-bold text-sm">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Person style={{ fontSize: 64, color: '#d1d5db' }} />
                      <p className="text-gray-500 font-medium text-lg mb-1">
                        No hay usuarios para mostrar
                      </p>
                      <p className="text-gray-400 text-sm">
                        Intenta ajustar tus filtros o espera a que se registren nuevos usuarios
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`border-b border-gray-100 hover:bg-green-50 transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    {/* Columna de Usuario con avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-base">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-800 text-sm mb-1">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {user._id?.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Columna de Email */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Email style={{ fontSize: 16, color: '#10b981' }} />
                        <span className="text-sm font-medium text-gray-700">
                          {user.email}
                        </span>
                      </div>
                    </td>

                    {/* Columna de Fecha */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CalendarToday style={{ fontSize: 16, color: '#10b981' }} />
                        <span className="text-sm font-medium text-gray-700">
                          {formatearFecha(user.createdAt)}
                        </span>
                      </div>
                    </td>

                    {/* Columna de Estado */}
                    <td className="px-6 py-4 text-center">
                      {user.activo ? (
                        <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-bold">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-xs font-bold">
                          <Block style={{ fontSize: 14 }} />
                          Inactivo
                        </span>
                      )}
                    </td>

                    {/* Columna de Membresía */}
                    <td className="px-6 py-4 text-center">
                      {user.isMember ? (
                        <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-xs font-bold">
                          <VerifiedUser style={{ fontSize: 14 }} />
                          Premium
                        </span>
                      ) : (
                        <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Básico
                        </span>
                      )}
                    </td>

                    {/* Columna de Acciones */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg! transition-all! duration-300! hover:shadow-md! hover:scale-105!"
                          style={{ background: '#10b981', border: 'none' }}
                          title="Editar usuario"
                        >
                          <Edit style={{ fontSize: 16, color: '#fff' }} />
                          <span className="text-white text-xs font-bold">Editar</span>
                        </button>
                        <button
                          onClick={() => {
                            setUserActual(user);
                            setModalMensaje(true);
                          }}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg! transition-all! duration-300! hover:shadow-md! hover:scale-105! ${
                            user.activo
                              ? 'bg-red-500! hover:bg-red-600!'
                              : 'bg-green-500! hover:bg-green-600!'
                          }`}
                          style={{ border: 'none' }}
                          title={user.activo ? "Desactivar usuario" : "Activar usuario"}
                        >
                          {user.activo ? (
                            <>
                              <VisibilityOff style={{ fontSize: 16, color: '#fff' }} />
                              <span className="text-white text-xs font-bold">Desactivar</span>
                            </>
                          ) : (
                            <>
                              <Visibility style={{ fontSize: 16, color: '#fff' }} />
                              <span className="text-white text-xs font-bold">Activar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 py-4 bg-gray-50 border-t-2 border-gray-100">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg! bg-transparent! transition-all! duration-300! ${
                currentPage === 1
                  ? 'text-gray-400! cursor-not-allowed!'
                  : 'text-gray-700! hover:bg-gray-200!'
              }`}
            >
              <ChevronLeft style={{ fontSize: 24 }} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`min-w-[40px] h-10 rounded-lg font-bold text-sm transition-all duration-300 ${
                  currentPage === page
                    ? 'bg-gradient-to-r! from-green-500! to-teal-500! text-white shadow-lg'
                    : 'bg-white! text-gray-700 hover:bg-gray-100! border-2 border-gray-200'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg! bg-transparent! transition-all! duration-300! ${
                currentPage === totalPages
                  ? 'text-gray-400! cursor-not-allowed!'
                  : 'text-gray-700! hover:bg-gray-200!'
              }`}
            >
              <ChevronRight style={{ fontSize: 24 }} />
            </button>
          </div>
        )}
      </div>

      

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