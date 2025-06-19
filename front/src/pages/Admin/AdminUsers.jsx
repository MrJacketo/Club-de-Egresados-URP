import React, { useState, useEffect, useMemo } from "react";

//Importaciones de componentes
import AdminSidebar from "../../components/AdminSidebar";
import {
  AdminSidebarProvider,
  useAdminSidebar,
} from "../../context/adminSidebarContext";
import CardMetric from "../../components/admin/cardMetric";
import TablaUsuarios from "../../components/admin/tablaUsuarios";

//Importaciones de librerías
import { Group, Person, WorkspacePremium, Search } from "@mui/icons-material";

//Importaciones de request
import { getUsersRequest } from "../../api/userAdminApi";

const AdminUsers = () => {
  return (
    <AdminSidebarProvider>
      <AmdinUsersContent />
    </AdminSidebarProvider>
  );
};

//Contenido del componente AdminUsers
const AmdinUsersContent = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [activeMembers, setActiveMembers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const { collapsed } = useAdminSidebar();

  const handleToggleActive = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === updatedUser._id ? { ...user, ...updatedUser } : user
      )
    );

    // Actualizar contadores
    setActiveUsers((prevActiveUsers) =>
      updatedUser.activo ? prevActiveUsers + 1 : prevActiveUsers - 1
    );

    // Si tienes una propiedad como `isMember` o algo que determine si es miembro
    // reemplaza `updatedUser.isMember` por la que uses
    setActiveMembers((prevActiveMembers) =>
      updatedUser.activo && updatedUser.isMember
        ? prevActiveMembers + 1
        : !updatedUser.activo && updatedUser.isMember
        ? prevActiveMembers - 1
        : prevActiveMembers
    );
  };

  // API para obtener usuarios
  const fetchUsers = async () => {
    try {
      const data = await getUsersRequest();
      setUsers(data.users);
      setTotalUsers(data.totalUsers);
      setActiveUsers(data.activeUsers);
      setActiveMembers(data.activeMembers);
    } catch (error) {
      console.error(
        "Error al obtener usuarios:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);


  return (
    <div className="flex">
      <AdminSidebar />
      <div
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/*Header*/}
        <div className="flex justify-between mb-5">
          <h1 className="text-4xl font-bold">Usuarios</h1>
          <button>Añadir Usuario</button>
        </div>

        {/*Contenido*/}
        <main>
          <div className="flex text-[#000] justify-start gap-8 mb-4">
            <CardMetric
              title="Usuarios Totales"
              value={totalUsers}
              percent="100%"
              icon={<Group style={{ fontSize: 30, color: "#31CD7F" }} />}
            />
            <CardMetric
              title="Usuarios Activos"
              value={activeUsers}
              percent="80%"
              icon={<Person style={{ fontSize: 30, color: "#31CD7F" }} />}
            />
            <CardMetric
              title="Miembros Activos"
              value={activeMembers}
              percent="100%"
              icon={
                <WorkspacePremium style={{ fontSize: 30, color: "#31CD7F" }} />
              }
            />
          </div>

          {/* Búsqueda */}
          <div className="w-full flex justify-between mb-4">
            <div className="flex flex-col items-start">
              <h3 className="font-bold text-xl">Usuarios ({totalUsers})</h3>
              <p className="text-md">Todos los usuarios registrados</p>
            </div>

            <div className="text-[#222] w-[30%]">
              <div className="flex items-center w-full bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm">
                <Search style={{ fontSize: 22, color: "#222" }} />
                <input
                  type="text"
                  placeholder="Buscar usuario..."
                  className="w-full ml-2 text-sm focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/*Tabla*/}
          <TablaUsuarios
            users={filteredUsers}
            onEdit={(user) => console.log("Editar:", user)}
            onToggleActive={fetchUsers}
          />
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;
