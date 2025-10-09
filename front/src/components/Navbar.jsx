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
  Videotape,
  Calendar,
  Gift
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
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Buscando:", searchTerm);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white! shadow-sm ">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <img className="h-10" src={logo} alt="Logo URP" />
        </div>

        {/* Navegación */}
        <div className="flex flex-row items-center gap-6">
          <Link
            to="/"
            className={`border-2 py-3 px-5 rounded-full flex items-center gap-3 font-bold text-sm transition-all duration-300 ${
              location.pathname === "/"
                ? "bg-gradient-to-r! from-green-600! to-teal-600! border-transparent! text-white shadow-xl"
                : "border-green-600 text-green-600 hover:bg-gradient-to-r! hover:from-green-600! hover:to-teal-600! hover:border-transparent! hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
            }`}
          >
            <Home size={20} />
            <span>Inicio</span>
          </Link>

          {user && (
            <>
              <Link
                to="/gestion-oferta"
                className={`border-2 py-3 px-5 rounded-full flex items-center gap-3 font-bold text-sm transition-all duration-300 ${
                  location.pathname === "/gestion-oferta"
                    ? "bg-gradient-to-r! from-green-600! to-teal-600! border-transparent! text-white shadow-xl"
                    : "border-green-600 text-green-600 hover:bg-gradient-to-r! hover:from-green-600! hover:to-teal-600! hover:border-transparent! hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
                }`}
              >
                <Star size={20} />
                <span>Ofertas</span>
              </Link>

              <Link
                to="/foro-egresados"
                className={`border-2 py-3 px-5 rounded-full flex items-center gap-3 font-bold text-sm transition-all duration-300 ${
                  location.pathname === "/foro-egresados"
                    ? "bg-gradient-to-r! from-green-600! to-teal-600! border-transparent! text-white shadow-xl"
                    : "border-green-600 text-green-600 hover:bg-gradient-to-r! hover:from-green-600! hover:to-teal-600! hover:border-transparent! hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
                }`}
              >
                <MessagesSquare size={20} />
                <span>Foro</span>
              </Link>

              <Link
                to="/noticias"
                className={`border-2 py-3 px-5 rounded-full flex items-center gap-3 font-bold text-sm transition-all duration-300 ${
                  location.pathname.startsWith("/noticias")
                    ? "bg-gradient-to-r! from-green-600! to-teal-600! border-transparent! text-white shadow-xl"
                    : "border-green-600 text-green-600 hover:bg-gradient-to-r! hover:from-green-600! hover:to-teal-600! hover:border-transparent! hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
                }`}
              >
                <Newspaper size={20} />
                <span>Noticias</span>
              </Link>

              <Link
                to="/cursos"
                className={`border-2 py-3 px-5 rounded-full flex items-center gap-3 font-bold text-sm transition-all duration-300 ${
                  location.pathname.startsWith("/cursos")
                    ? "bg-gradient-to-r! from-green-600! to-teal-600! border-transparent! text-white shadow-xl"
                    : "border-green-600 text-green-600 hover:bg-gradient-to-r! hover:from-green-600! hover:to-teal-600! hover:border-transparent! hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
                }`}
              >
                <Book size={20} />
                <span>Beneficios</span>
              </Link>

              <Link
                to="/conferencias"
                className={`border-2 py-3 px-5 rounded-full flex items-center gap-3 font-bold text-sm transition-all duration-300 ${
                  location.pathname.startsWith("/conferencias")
                    ? "bg-gradient-to-r! from-green-600! to-teal-600! border-transparent! text-white shadow-xl"
                    : "border-green-600 text-green-600 hover:bg-gradient-to-r! hover:from-green-600! hover:to-teal-600! hover:border-transparent! hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
                }`}
              >
                <Videotape size={20} />
                <span>Conferencias</span>
              </Link>
            </>
          )}
        </div>

        {/* Menú de usuario o login */}
        <div className="relative">
          {user ? (
            <div>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3  bg-white! hover:bg-gray-50! px-5 py-3 rounded-xl transition-all duration-300  borde-none! outline-none! focus:outline-none! hover:border-none!"
              >
                <img 
                  src={fotoPerfil} 
                  alt="Foto de perfil" 
                  className="w-10 h-10 rounded-full object-cover ring ring-green-500"
                />
                <div className="text-left">
                  <p className="text-gray-800 text-sm font-bold">
                    {user.name?.length > 10 ? user.name.substring(0, 15) + '...' : user.name}
                  </p>
                  <p className="text-gray-500 text-xs font-medium">
                    {user.email?.length > 10 ? user.email.substring(0, 15) + '...' : user.email}
                  </p>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-green-500 transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl overflow-hidden border-2! border-gray-200!">
                  <Link
                    to="/perfil"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-gray-50! transition-all duration-300 font-medium"
                  >
                    <User size={20} className="text-green-500" />
                    <span>Mi Perfil</span>
                  </Link>
                  <Link
                    to="/VerMembresia"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-gray-50! transition-all duration-300 font-medium border-t-2! border-gray-100!"
                  >
                    <User size={20} className="text-green-500" />
                    <span>Mi Membresía</span>
                  </Link>
                  <Link
                    to="/mis-conferencias"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-gray-50! transition-all duration-300 font-medium border-t-2! border-gray-100!"
                  >
                    <Calendar size={20} className="text-green-500" />
                    <span>Mis Conferencias</span>
                  </Link>
                  <Link
                    to="/mis-beneficios"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-gray-50! transition-all duration-300 font-medium border-t-2! border-gray-100!"
                  >
                    <Gift size={20} className="text-green-500" />
                    <span>Mis Beneficios</span>
                  </Link>
                  <Link
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full! flex items-center gap-3 px-5 py-4 bg-gradient-to-r! from-green-600! to-teal-600! hover:from-green-700! hover:to-teal-700! text-white transition-all duration-300 font-medium border-t-2! border-gray-100!"
                  >
                    <LogOut size={20} className="text-white" />
                    <span>Cerrar Sesión</span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r! from-green-600! to-teal-600! hover:from-green-700! hover:to-teal-700! text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 