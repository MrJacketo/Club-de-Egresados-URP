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
import { useInspectorSidebar } from "../context/inspectorSidebarContext";

export default function InspectorSidebar() {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const { collapsed, toggleSidebar } = useInspectorSidebar();

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
            to="/inspector-laboral"
            className={`p-3! rounded-xl! flex! items-center! gap-3! transition-all! duration-300! ${
              location.pathname === "/inspector-laboral"
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
            to="/inspector/ofertas"
            className={`p-3! rounded-xl! flex! items-center! gap-3! transition-all! duration-300! ${
              location.pathname === "/inspector/ofertas"
                ? "bg-white! text-green-600! shadow-lg!"
                : "text-white! hover:bg-white/20!"
            }`}
            style={{ border: 'none' }}
          >
            <Newspaper size={24} />
            <span className={`${collapsed ? 'hidden' : ''} text-sm! font-bold!`}>
              Auditar Ofertas
            </span>
          </Link>

          <Link
            to="/inspector/incidencias" 
            className={`p-3! rounded-xl! flex! items-center! gap-3! transition-all! duration-300! ${
              location.pathname === "/inspector/incidencias"
                ? "bg-white! text-green-600! shadow-lg!"
                : "text-white! hover:bg-white/20!"
            }`}
            style={{ border: 'none' }}
          >
            <Badge size={24} />
            <span className={`${collapsed ? 'hidden' : ''} text-sm! font-bold!`}>
              Reporte Incidencias
            </span>
          </Link>

          <Link
            to="/inspector/suspensiones"
            className={`p-3! rounded-xl! flex! items-center! gap-3! transition-all! duration-300! ${
              location.pathname === "/inspector/suspensiones"
                ? "bg-white! text-green-600! shadow-lg!"
                : "text-white! hover:bg-white/20!"
            }`}
            style={{ border: 'none' }}
          >
            <Percent size={24} />
            <span className={`${collapsed ? 'hidden' : ''} text-sm! font-bold!`}>
              Bloqueo / Suspensión Empresa
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