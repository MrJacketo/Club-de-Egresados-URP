import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import { useModeradorSidebar } from "../context/moderadorSidebarContext";
import apiClient from "../api/apiClient";

export default function ModeradorSidebar() {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const { collapsed, toggleSidebar } = useModeradorSidebar();
  const [pendientesCount, setPendientesCount] = useState(0);

  useEffect(() => {
    const fetchPendientes = async () => {
      try {
        const response = await apiClient.get('/api/moderador/ofertas');
        const pendientes = response.data.filter(
          oferta => oferta.estado === 'Pendiente' && oferta.aprobado === false
        );
        setPendientesCount(pendientes.length);
      } catch (error) {
        console.error('Error obteniendo solicitudes pendientes:', error);
      }
    };

    fetchPendientes();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchPendientes, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Sidebar */}
      <aside
        className={`group fixed top-[64px] left-0 h-[calc(100vh-64px)] 
        shadow-xl p-4 z-40 pt-8 bg-gradient-to-b from-blue-600 to-blue-800
        transition-all duration-300 flex flex-col justify-between
        ${collapsed ? 'w-20' : 'w-64'}`}
      >
        
        {/* Botón para contraer/expandir */}
        <div className="flex justify-end mb-2 pt-2">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-transparent hover:bg-white/20 text-white text-2xl font-black hover:text-white transition-all duration-300"
            style={{ border: 'none' }}
            title={collapsed ? "Expandir sidebar" : "Contraer sidebar"}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex flex-col space-y-4 mt-4">
          <Link
            to="/moderador"
            className={`p-3 rounded-xl flex items-center gap-3 transition-all duration-300 ${
              location.pathname === "/moderador"
                ? "bg-white text-blue-600 shadow-lg"
                : "text-white hover:bg-white/20"
            }`}
            style={{ border: 'none' }}
          >
            <LayoutDashboard size={24} />
            <span className={`${collapsed ? 'hidden' : ''} text-sm font-bold`}>
              Dashboard
            </span>
          </Link>

          <Link
            to="/moderador/ofertas"
            className={`p-3 rounded-xl flex items-center gap-3 transition-all duration-300 relative ${
              location.pathname === "/moderador/ofertas"
                ? "bg-white text-blue-600 shadow-lg"
                : "text-white hover:bg-white/20"
            }`}
            style={{ border: 'none' }}
          >
            <Briefcase size={24} />
            <span className={`${collapsed ? 'hidden' : ''} text-sm font-bold`}>
              Ofertas Laborales
            </span>
            {pendientesCount > 0 && (
              <span className={`${collapsed ? 'absolute -top-1 -right-1' : ''} ml-auto px-2 py-1 rounded-full bg-amber-500 text-white text-xs font-bold animate-pulse`}>
                {pendientesCount}
              </span>
            )}
          </Link>
        </nav>

        <div className="mt-auto">
          <div className={`${collapsed ? 'hidden' : ''} p-4 rounded-xl bg-white/10 text-white`}>
            <p className="text-xs font-semibold mb-1">Conectado como:</p>
            <p className="text-sm font-bold truncate">{user?.name}</p>
            <p className="text-xs text-white/80 mt-1">Moderador</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
