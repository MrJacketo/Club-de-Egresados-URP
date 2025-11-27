import { Link, useLocation } from "react-router-dom";
import { 
  ShieldCheck,
  Shield,
  ChevronLeft,
  ChevronRight,
  Users,
  LayoutDashboard,
  Tag,
  AlertTriangle
} from "lucide-react";
import { useContext } from "react";
import { UserContext } from "../../../context/userContext";
import { useModeradorSidebar } from "../../../context/moderadorSidebarContext";

export default function ModeradorSidebar() {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const { collapsed, toggleSidebar } = useModeradorSidebar();

  const handleLogout = () => {
    // Implementar lógica de logout
    console.log('Cerrando sesión');
  };
  
  return (
    <div>
      {/* Sidebar */}
      <aside
        className={`group fixed top-[64px] left-0 h-[calc(100vh-64px)] 
        shadow-xl p-4 z-40 pt-8  bg-gradient-to-b from-green-500 to-teal-500
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
          {/* Dashboard */}
          <Link
            to="/moderador"
            className={`p-3! rounded-xl! flex! items-center! gap-3! transition-all! duration-300! ${
              location.pathname === "/moderador"
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

          {/* Gestión de Ofertas */}
          <Link
            to="/moderador/ofertas"
            className={`p-3! rounded-xl! flex! items-center! gap-3! transition-all! duration-300! ${
              location.pathname === "/moderador/ofertas"
                ? "bg-white! text-green-600! shadow-lg!"
                : "text-white! hover:bg-white/20!"
            }`}
            style={{ border: 'none' }}
          >
            <Tag size={24} />
            <span className={`${collapsed ? 'hidden' : ''} text-sm! font-bold!`}>
              Gestión Ofertas
            </span>
          </Link>

          {/* Gestionar Foro */}
          <Link
            to="/moderador/foro"
            className={`p-3! rounded-xl! flex! items-center! gap-3! transition-all! duration-300! ${
              location.pathname === "/moderador/foro"
                ? "bg-white! text-green-600! shadow-lg!"
                : "text-white! hover:bg-white/20!"
            }`}
            style={{ border: 'none' }}
          >
            <Shield size={24} />
            <span className={`${collapsed ? 'hidden' : ''} text-sm! font-bold!`}>
              Gestionar Foro
            </span>
          </Link>

          {/* Usuarios */}
          <Link
            to="/moderador/usuarios"
            className={`p-3! rounded-xl! flex! items-center! gap-3! transition-all! duration-300! ${
              location.pathname === "/moderador/usuarios"
                ? "bg-white! text-green-600! shadow-lg!"
                : "text-white! hover:bg-white/20!"
            }`}
            style={{ border: 'none' }}
          >
            <Users size={24} />
            <span className={`${collapsed ? 'hidden' : ''} text-sm! font-bold!`}>
              Usuarios
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