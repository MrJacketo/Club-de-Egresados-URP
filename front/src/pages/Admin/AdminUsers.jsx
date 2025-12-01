import React, { useState, useEffect, useMemo } from "react";
import {
  Group,
  Person,
  WorkspacePremium,
  Search,
  FilterList,
  FileDownload,
  PersonAdd,
  TrendingUp,
  VerifiedUser,
} from "@mui/icons-material";
import AdminSidebar from "../../components/AdminSidebar";
import {
  AdminSidebarProvider,
  useAdminSidebar,
} from "../../context/adminSidebarContext";
import CardMetric from "../../components/admin/cardMetric";
import TablaUsuarios from "../../components/admin/tablaUsuarios";
import ModalUsuario from "../../components/admin/ModalUsuario";
import { getUsersRequest, createUserRequest, updateUserRequest } from "../../api/userAdminApi";
import { toast } from "react-hot-toast";

const AdminUsers = () => {
  return (
    <AdminSidebarProvider>
      <AdminUsersContent />
    </AdminSidebarProvider>
  );
};

const AdminUsersContent = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [activeMembers, setActiveMembers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  
  // Estados para el modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { collapsed } = useAdminSidebar();

  const handleToggleActive = async () => {
    // Simplemente refrescar la lista completa de usuarios
    await fetchUsers();
  };

  // Funciones del modal
  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setIsEditing(false);
  };

  const handleSaveUser = async (userData, userId = null) => {
    try {
      if (isEditing && userId) {
        await updateUserRequest(userId, userData);
        toast.success('Usuario actualizado exitosamente');
      } else {
        await createUserRequest(userData);
        toast.success('Usuario creado exitosamente');
      }
      
      // Refrescar la lista de usuarios sin mostrar notificaciones adicionales
      await fetchUsers();
      handleCloseModal();
      
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Error al guardar usuario';
      toast.error(message);
      throw new Error(message);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getUsersRequest();
      setUsers(data.users);
      setTotalUsers(data.totalUsers);
      setActiveUsers(data.activeUsers);
      setActiveMembers(data.activeMembers);
    } catch (error) {
      console.error("Error al obtener usuarios:", error.response?.data || error.message);
      toast.error("Error al cargar usuarios");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus ? (filterStatus === "active" ? user.activo : !user.activo) : true;
      const matchRole = filterRole ? user.role === filterRole : true;
      return matchSearch && matchStatus && matchRole;
    });
  }, [users, searchTerm, filterStatus, filterRole]);

  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers];
    switch (sortBy) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "recent":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      default:
        return sorted;
    }
  }, [filteredUsers, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("");
    setFilterRole("");
    setSortBy("recent");
  };

  const exportToCSV = () => {
    console.log("Exportando usuarios a CSV...");
  };

  const growthRate = ((activeUsers / totalUsers) * 100).toFixed(1);
  const membershipRate = ((activeMembers / totalUsers) * 100).toFixed(1);

  return (
    <div className="flex min-h-screen pt-12" style={{ background: 'linear-gradient(to bottom right, #f9fafb, #ffffff)' }}>
      <AdminSidebar />
      <div
        className={`flex-1 transition-all duration-300 px-8 py-8 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl text-start font-bold mb-2">
            <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
              Gestión de Usuarios
            </span>
          </h1>
        </div>

        {/* Métricas mejoradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-xl">
                <Group style={{ fontSize: 32, color: '#fff' }} />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp style={{ fontSize: 20 }} />
                <span className="text-sm font-bold">100%</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Usuarios</p>
            <p className="text-4xl font-bold text-gray-800">{totalUsers}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-4 rounded-xl">
                <Person style={{ fontSize: 32, color: '#16a34a' }} />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp style={{ fontSize: 20 }} />
                <span className="text-sm font-bold">{growthRate}%</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Usuarios Activos</p>
            <p className="text-4xl font-bold text-gray-800">{activeUsers}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-teal-100 p-4 rounded-xl">
                <WorkspacePremium style={{ fontSize: 32, color: '#14b8a6' }} />
              </div>
              <div className="flex items-center gap-1 text-teal-600">
                <TrendingUp style={{ fontSize: 20 }} />
                <span className="text-sm font-bold">{membershipRate}%</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Miembros Activos</p>
            <p className="text-4xl font-bold text-gray-800">{activeMembers}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-4 rounded-xl">
                <VerifiedUser style={{ fontSize: 32, color: '#3b82f6' }} />
              </div>
              <div className="flex items-center gap-1 text-blue-600">
                <TrendingUp style={{ fontSize: 20 }} />
                <span className="text-sm font-bold">95%</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Usuarios Verificados</p>
            <p className="text-4xl font-bold text-gray-800">{totalUsers - 2}</p>
          </div>
        </div>

        {/* Barra de búsqueda y filtros mejorada */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder="Buscar por nombre, email o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 text-gray-800 px-6 py-4 pl-14 rounded-xl transition-all duration-300 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white focus:shadow-lg"
                style={{ outline: 'none' }}
              />
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-green-500 transition-transform duration-300 group-hover:scale-110"
                style={{ fontSize: 24 }}
              />
            </div>

            {/* Filtro por Estado */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-gray-50 text-gray-800 px-6 py-4 pr-12 rounded-xl cursor-pointer transition-all duration-300 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white focus:shadow-lg appearance-none min-w-[180px]"
                style={{ outline: 'none' }}
              >
                <option value="">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>

            {/* Filtro por Rol */}
            <div className="relative">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="bg-gray-50 text-gray-800 px-6 py-4 pr-12 rounded-xl cursor-pointer transition-all duration-300 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white focus:shadow-lg appearance-none min-w-[180px]"
                style={{ outline: 'none' }}
              >
                <option value="">Todos los roles</option>
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
                <option value="member">Miembro</option>
              </select>
            </div>

            {/* Ordenar */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 text-gray-800 px-6 py-4 pr-12 rounded-xl cursor-pointer transition-all duration-300 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white focus:shadow-lg appearance-none min-w-[180px]"
                style={{ outline: 'none' }}
              >
                <option value="recent">Más recientes</option>
                <option value="oldest">Más antiguos</option>
                <option value="name">Por nombre</option>
              </select>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2">
              {(searchTerm || filterStatus || filterRole || sortBy !== "recent") && (
                <button
                  onClick={clearFilters}
                  className="bg-gray-100! hover:bg-gray-200! text-gray-700 px-6 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-lg whitespace-nowrap"
                >
                  Limpiar
                </button>
              )}
              
              <button
                onClick={handleCreateUser}
                className="bg-gradient-to-r! from-green-500! to-teal-500! hover:from-green-600! hover:to-teal-600! text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-2 whitespace-nowrap"
              >
                <PersonAdd style={{ fontSize: 20 }} />
                Crear Usuario
              </button>
              
              <button
                onClick={exportToCSV}
                className="bg-gradient-to-r! from-green-500! to-teal-500! hover:from-green-600! hover:to-teal-600! text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-2 whitespace-nowrap"
              >
                <FileDownload style={{ fontSize: 20 }} />
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <TablaUsuarios
          users={sortedUsers}
          onEdit={handleEditUser}
          onToggleActive={handleToggleActive}
        />

        {/* Modal para crear/editar usuario */}
        <ModalUsuario
          open={modalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
          user={selectedUser}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
};

export default AdminUsers;