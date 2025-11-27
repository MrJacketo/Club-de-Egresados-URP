import { Link, useLocation } from "react-router-dom";
import { 
  ShieldCheck,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { useAdminSidebar } from "../context/adminSidebarContext";

export default function ModeradorSidebar() {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const { collapsed, toggleSidebar } = useAdminSidebar();

  const handleLogout = () => {
    console.log('Cerrando sesión');
  };
  
  return (
    <div>
      {/* Sidebar */}
      <aside
        className={`group fixed top-[64px] left-0 h-[calc(100vh-64px)] 
        shadow-xl p-4 z-40 pt-8 bg-[#00BC4F]
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
            to="/moderador/usuarios"
            className={`p-3! rounded-xl! flex! items-center! gap-3! transition-all! duration-300! ${
              location.pathname === "/moderador/usuarios"
                ? "bg-white! text-green-600! shadow-lg!"
                : "text-white! hover:bg-white/20!"
            }`}
            style={{ border: 'none' }}
          >
            <ShieldCheck size={24} />
            <span className={`${collapsed ? 'hidden' : ''} text-sm! font-bold!`}>
              Moderación
            </span>
          </Link>

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
    </div>
  );
}
