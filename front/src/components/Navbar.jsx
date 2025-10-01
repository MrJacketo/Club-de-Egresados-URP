//React
import { Link, useNavigate, useLocation } from "react-router-dom";

//Contextos
import { useContext } from "react";
import { UserContext } from "../context/userContext";

//Logos
import {
  Home,
  Star,
  User,
  Shield,
  Newspaper,
  MessagesSquare,
  Search,
  ChevronDown,
  LogOut,
  Book,
  Videotape
} from "lucide-react";
import logo from "../assets/logoUrpex2.svg";
import fotoPerfil from "../assets/foto.jpeg";
import { useState } from "react";

//Funcion Navbar Principal
export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      logout(); // Clear user context and JWT token
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Buscando:", searchTerm);
    // Aquí tu lógica de búsqueda
  };

  return (
    //Nuevo SideBar
    <nav className="bg-black/50 fixed top-0 left-0 w-full z-50">
      <div className="bg-[#1C1D21] text-[#1C1D21] flex justify-between items-center p-4">
        {/* Logo */}
        <div>
          <img className="h-8" src={logo} alt="Logo URP" />
        </div>

        {/* Navegación */}
        <div className="flex  flex-row space-between items-center gap-5">
          <Link
            to="/"
            className={`py-2 px-6  rounded-4xl outline-3 flex items-center gap-3 text-[#00BC4F] ${
              location.pathname === "/"
                ? "bg-teal-600/80 text-white shadow-lg"
                : "hover:bg-[#00bc4e3c] hover:text-white transition"
            }`}
          >
            <Home size={20} />
            <span className="text-[12px] font-medium">Inicio</span>
          </Link>

          {/* Mostrar las demás opciones solo si el usuario está autenticado */}
          {user && (
            <>
              <Link
                to="/gestion-oferta"
                className={`py-2 px-6 rounded-4xl outline-3 flex items-center gap-3 text-[#00BC4F] ${
                  location.pathname === "/gestion-oferta"
                    ? "bg-[#00BC4F] text-white shadow-lg outline-[#00BC4F]"
                    : "hover:bg-[#00bc4e3c] outline-[#00BC4F] hover:text-white transition"
                }`}
              >
                <Star size={20} />
                <span className="  group-hover:inline group-focus-within:inline text-[12px] font-medium">
                  Ofertas Laborales
                </span>
              </Link>

              <Link
                to="/foro-egresados"
                className={`py-2 px-6 rounded-4xl flex outline-3 items-center gap-3 text-[#00BC4F] ${
                  location.pathname === "/foro-egresados"
                    ? "bg-[#00BC4F] outline-[#00BC4F] text-white shadow-lg"
                    : "hover:bg-[#00bc4e3c] outline-[#00BC4F] hover:text-white  transition"
                }`}
              >
                <MessagesSquare size={20} />
                <span className=" group-hover:inline group-focus-within:inline text-[12px] font-medium">
                  Foro Egresados
                </span>
              </Link>

              <Link
                to="/noticias"
                className={`py-2 px-6 rounded-4xl flex outline-3 items-center gap-3 text-[#00BC4F] ${
                  location.pathname.startsWith("/noticias")
                    ? "bg-[#00BC4F] outline-[#00BC4F] text-white shadow-lg"
                    : "hover:bg-[#00bc4e3c] outline-[#00BC4F] hover:text-white transition"
                }`}
              >
                <Newspaper size={20} />
                <span className=" group-hover:inline group-focus-within:inline text-[12px] font-medium">
                  Noticias
                </span>
              </Link>

              <Link
                to="/cursos"
                className={`py-2 px-6 rounded-4xl flex outline-3 items-center gap-3 text-[#00BC4F] ${
                  location.pathname.startsWith("/cursos")
                    ? "bg-[#00BC4F] outline-[#00BC4F] text-white shadow-lg"
                    : "hover:bg-[#00bc4e3c] outline-[#00BC4F] hover:text-white transition"
                }`}
              >
                <Book size={20} />
                <span className=" group-hover:inline group-focus-within:inline text-[12px] font-medium">
                  Beneficios
                </span>
              </Link>

              <Link
                to="/conferencias"
                className={`py-2 px-6 rounded-4xl flex outline-3 items-center gap-3 text-[#00BC4F] ${
                  location.pathname.startsWith("/conferencias")
                    ? "bg-[#00BC4F] outline-[#00BC4F] text-white shadow-lg"
                    : "hover:bg-[#00bc4e3c] outline-[#00BC4F] hover:text-white transition"
                }`}
              >
                <Videotape size={20} />
                <span className=" group-hover:inline group-focus-within:inline text-[12px] font-medium">
                  Conferencias
                </span>
              </Link>
              
            </>
          )}
        </div>

        {/* Menú de usuario o login */}
        <div className="relative">
          {user ? (
            <div>
              {/* Botón de usuario */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 bg-[#1C1D21]! hover:bg-[#1C1D21] hover:border-none! focus:outline-none! border-none! px-4 py-2 rounded-lg transition"
              >
                <img 
                  src={fotoPerfil} 
                  alt="Foto de perfil" 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="text-white text-sm font-medium">
                    {user.name?.length > 10 ? user.name.substring(0, 15) + '...' : user.name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {user.email?.length > 10 ? user.email.substring(0, 15) + '...' : user.email}
                  </p>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Menú desplegable */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#2A2B2F] rounded-lg shadow-lg overflow-hidden">
                  <Link
                    to="/VerMembresia"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-[#35363B] transition"
                  >
                    <User size={18} />
                    <span className="text-sm">Mi Membresía</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-[#35363B] transition"
                  >
                    <LogOut size={18} />
                    <span className="text-sm">Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition font-medium"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}