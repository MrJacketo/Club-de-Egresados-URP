import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Newspaper, 
  Badge, 
  Percent, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { useAdminSidebar } from "../context/adminSidebarContext";

export default function AdminSidebar() {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const { collapsed, toggleSidebar } = useAdminSidebar();

  const handleLogout = () => {
    // Implementar lógica de logout
    console.log('Cerrando sesión');
  };
  return (
    <div>
      {/* Sidebar */}
      <aside
        className={`group fixed top-[64px] left-0 h-[calc(100vh-64px)] 
        backdrop-blur-sm bg-blue-500/10 p-4 z-40 
        transition-all duration-300 flex flex-col justify-between
        ${collapsed ? 'w-20' : 'w-64'}`}
      >
        
        {/* Botón para contraer/expandir */}        <div className="flex justify-end mb-2 pt-2">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-blue-500/20 text-gray-700 hover:text-blue-700 transition-colors"
            title={collapsed ? "Expandir sidebar" : "Contraer sidebar"}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex flex-col space-y-4 mt-4">
          <Link
            to="/admin"
            className={`p-3 rounded-lg flex items-center gap-3 text-gray-700 ${
              location.pathname === "/admin"
                ? "bg-blue-600/80 text-white shadow-lg"
                : "hover:bg-blue-500/20 hover:text-blue-700 transition"
            }`}
          >            <LayoutDashboard size={24} />            <span className={`${collapsed ? 'hidden' : ''} text-sm font-medium`}>
              Dashboard
            </span>
          </Link>

          <Link
            to="/admin/egresados"
            className={`p-3 rounded-lg flex items-center gap-3 text-gray-700 ${
              location.pathname === "/admin/egresados"
                ? "bg-blue-600/80 text-white shadow-lg"
                : "hover:bg-blue-500/20 hover:text-blue-700 transition"
            }`}
          >            <Users size={24} />            <span className={`${collapsed ? 'hidden' : ''} text-sm font-medium`}>
              Egresados
            </span>
          </Link>

          <Link
            to="/admin/gestion-noticias"
            className={`p-3 rounded-lg flex items-center gap-3 text-gray-700 ${
              location.pathname === "/admin/gestion-noticias"
                ? "bg-blue-600/80 text-white shadow-lg"
                : "hover:bg-blue-500/20 hover:text-blue-700 transition"
            }`}
          >            <Newspaper size={24} />            <span className={`${collapsed ? 'hidden' : ''} text-sm font-medium`}>
              Noticias
            </span>
          </Link>

          <Link
            to="/admin/membresias"
            className={`p-3 rounded-lg flex items-center gap-3 text-gray-700 ${
              location.pathname === "/admin/membresias"
                ? "bg-blue-600/80 text-white shadow-lg"
                : "hover:bg-blue-500/20 hover:text-blue-700 transition"
            }`}
          >            <Badge size={24} />            <span className={`${collapsed ? 'hidden' : ''} text-sm font-medium`}>
              Membresías
            </span>
          </Link>

          <Link
            to="/admin/beneficios"
            className={`p-3 rounded-lg flex items-center gap-3 text-gray-700 ${
              location.pathname === "/admin/beneficios"
                ? "bg-blue-600/80 text-white shadow-lg"
                : "hover:bg-blue-500/20 hover:text-blue-700 transition"
            }`}
          >            <Percent size={24} />            <span className={`${collapsed ? 'hidden' : ''} text-sm font-medium`}>
              Beneficios
            </span>
          </Link>
        </nav>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full p-3 rounded-lg flex items-center gap-3 text-white hover:bg-red-500/20 hover:text-red-700 transition"
          >            <LogOut size={24} />            <span className={`${collapsed ? 'hidden' : ''} text-sm font-medium`}>
              Cerrar Sesión
            </span>
          </button>
        </div>
      </aside>

      {/* No incluimos el main aquí ya que este componente es solo la barra lateral */}
    </div>
  );
}