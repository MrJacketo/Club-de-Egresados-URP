import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Newspaper, 
  Badge, 
  Percent, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Workflow
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
        shadow-xl p-4 z-40 pt-8  bg-[#00BC4F]
        transition-all duration-300 flex flex-col justify-between
        ${collapsed ? 'w-20' : 'w-64'}`}
      >
        
        {/* Botón para contraer/expandir */}
        <div className="flex justify-end mb-2 pt-2">
          <button
            onClick={toggleSidebar}
            className="p-2! rounded-lg! bg-transparent! hover:bg-white/20! text-white! text-2xl! font-black! hover:text-white! transition-all! duration-300!"
            style={{ border: 'none' }}
            title={collapsed ? "Expandir sidebar" : "Contraer sidebar"}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex flex-col space-y-4 mt-4">
          <Link
            to="/admin"
            className={`p-3! rounded-xl! flex! items-center! gap-3! transition-all! duration-300! ${
              location.pathname === "/admin"
                ? "bg-white! text-green-600! shadow-lg!"
                : "text-white! hover:bg-white/20!"
            }`}
            style={{ border: 'none' }}
          >
            <LayoutDashboard size={24} />
            <span className={`${collapsed ? 'hidden' : ''} text-sm! font-bold!`}>
              Dashboard
            </span>
          </Link>

          <Link
            to="/admin/egresados"
            className={`p-3! rounded-xl! flex! items-center! gap-3! transition-all! duration-300! ${
              location.pathname === "/admin/egresados"
                ? "bg-white! text-green-600! shadow-lg!"
                : "text-white! hover:bg-white/20!"
            }`}
            style={{ border: 'none' }}
          >
            <Users size={24} />
            <span className={`${collapsed ? 'hidden' : ''} text-sm! font-bold!`}>
              Egresados
            </span>
          </Link>

          <Link
            to="/admin/gestion-noticias"
            className={`p-3! rounded-xl! flex! items-center! gap-3! transition-all! duration-300! ${
              location.pathname === "/admin/gestion-noticias"
                ? "bg-white! text-green-600! shadow-lg!"
                : "text-white! hover:bg-white/20!"
            }`}
            style={{ border: 'none' }}
          >
            <Newspaper size={24} />
            <span className={`${collapsed ? 'hidden' : ''} text-sm! font-bold!`}>
              Noticias
            </span>
          </Link>

          <Link
            to="/admin/membresias"
            className={`p-3! rounded-xl! flex! items-center! gap-3! transition-all! duration-300! ${
              location.pathname === "/admin/membresias"
                ? "bg-white! text-green-600! shadow-lg!"
                : "text-white! hover:bg-white/20!"
            }`}
            style={{ border: 'none' }}
          >
            <Badge size={24} />
            <span className={`${collapsed ? 'hidden' : ''} text-sm! font-bold!`}>
              Membresías
            </span>
          </Link>

          <Link
            to="/admin/beneficios"
            className={`p-3! rounded-xl! flex! items-center! gap-3! transition-all! duration-300! ${
              location.pathname === "/admin/beneficios"
                ? "bg-white! text-green-600! shadow-lg!"
                : "text-white! hover:bg-white/20!"
            }`}
            style={{ border: 'none' }}
          >
            <Percent size={24} />
            <span className={`${collapsed ? 'hidden' : ''} text-sm! font-bold!`}>
              Beneficios
            </span>
          </Link>
                  
                  <Link
            to="/admin/gestion-ofertas"
            className={`p-3! rounded-xl! flex! items-center! gap-3! transition-all! duration-300! ${
              location.pathname === "/admin/gestion-ofertas"
                ? "bg-white! text-green-600! shadow-lg!"
                : "text-white! hover:bg-white/20!"
            }`}
            style={{ border: 'none' }}
          >
            <Workflow size={24} />
            <span className={`${collapsed ? 'hidden' : ''} text-sm! font-bold!`}>
              Ofertas Laborales
            </span>
          </Link>

          
        </nav>

        <div className="mt-auto">
          
        </div>
      </aside>

      {/* No incluimos el main aquí ya que este componente es solo la barra lateral */}
    </div>
  );
}