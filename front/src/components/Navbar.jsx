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
    <nav className="fixed top-0 left-0 w-full z-50 shadow-lg" style={{ backgroundColor: '#1E1E1E' }}>
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
                ? "text-white shadow-xl"
                : "text-white hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
            }`}
            style={location.pathname === "/" 
              ? { backgroundColor: '#119e04', borderColor: '#119e04' }
              : { borderColor: '#5DC554', backgroundColor: 'transparent' }
            }
            onMouseEnter={(e) => {
              if (location.pathname !== "/") {
                e.target.style.backgroundColor = '#119e04';
                e.target.style.borderColor = '#119e04';
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== "/") {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = '#5DC554';
              }
            }}
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
                    ? "text-white shadow-xl"
                    : "text-white hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
                }`}
                style={location.pathname === "/gestion-oferta" 
                  ? { backgroundColor: '#119e04', borderColor: '#119e04' }
                  : { borderColor: '#5DC554', backgroundColor: 'transparent' }
                }
                onMouseEnter={(e) => {
                  if (location.pathname !== "/gestion-oferta") {
                    e.target.style.backgroundColor = '#119e04';
                    e.target.style.borderColor = '#119e04';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== "/gestion-oferta") {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.borderColor = '#5DC554';
                  }
                }}
              >
                <Star size={20} />
                <span>Ofertas</span>
              </Link>

              <Link
                to="/foro-egresados"
                className={`border-2 py-3 px-5 rounded-full flex items-center gap-3 font-bold text-sm transition-all duration-300 ${
                  location.pathname === "/foro-egresados"
                    ? "text-white shadow-xl"
                    : "text-white hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
                }`}
                style={location.pathname === "/foro-egresados" 
                  ? { backgroundColor: '#119e04', borderColor: '#119e04' }
                  : { borderColor: '#5DC554', backgroundColor: 'transparent' }
                }
                onMouseEnter={(e) => {
                  if (location.pathname !== "/foro-egresados") {
                    e.target.style.backgroundColor = '#119e04';
                    e.target.style.borderColor = '#119e04';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== "/foro-egresados") {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.borderColor = '#5DC554';
                  }
                }}
              >
                <MessagesSquare size={20} />
                <span>Foro</span>
              </Link>

              <Link
                to="/noticias"
                className={`border-2 py-3 px-5 rounded-full flex items-center gap-3 font-bold text-sm transition-all duration-300 ${
                  location.pathname.startsWith("/noticias")
                    ? "text-white shadow-xl"
                    : "text-white hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
                }`}
                style={location.pathname.startsWith("/noticias") 
                  ? { backgroundColor: '#119e04', borderColor: '#119e04' }
                  : { borderColor: '#5DC554', backgroundColor: 'transparent' }
                }
                onMouseEnter={(e) => {
                  if (!location.pathname.startsWith("/noticias")) {
                    e.target.style.backgroundColor = '#119e04';
                    e.target.style.borderColor = '#119e04';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!location.pathname.startsWith("/noticias")) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.borderColor = '#5DC554';
                  }
                }}
              >
                <Newspaper size={20} />
                <span>Noticias</span>
              </Link>

              <Link
                to="/cursos"
                className={`border-2 py-3 px-5 rounded-full flex items-center gap-3 font-bold text-sm transition-all duration-300 ${
                  location.pathname.startsWith("/cursos")
                    ? "text-white shadow-xl"
                    : "text-white hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
                }`}
                style={location.pathname.startsWith("/cursos") 
                  ? { backgroundColor: '#119e04', borderColor: '#119e04' }
                  : { borderColor: '#5DC554', backgroundColor: 'transparent' }
                }
                onMouseEnter={(e) => {
                  if (!location.pathname.startsWith("/cursos")) {
                    e.target.style.backgroundColor = '#119e04';
                    e.target.style.borderColor = '#119e04';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!location.pathname.startsWith("/cursos")) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.borderColor = '#5DC554';
                  }
                }}
              >
                <Book size={20} />
                <span>Beneficios</span>
              </Link>

              <Link
                to="/conferencias"
                className={`border-2 py-3 px-5 rounded-full flex items-center gap-3 font-bold text-sm transition-all duration-300 ${
                  location.pathname.startsWith("/conferencias")
                    ? "text-white shadow-xl"
                    : "text-white hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
                }`}
                style={location.pathname.startsWith("/conferencias") 
                  ? { backgroundColor: '#119e04', borderColor: '#119e04' }
                  : { borderColor: '#5DC554', backgroundColor: 'transparent' }
                }
                onMouseEnter={(e) => {
                  if (!location.pathname.startsWith("/conferencias")) {
                    e.target.style.backgroundColor = '#119e04';
                    e.target.style.borderColor = '#119e04';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!location.pathname.startsWith("/conferencias")) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.borderColor = '#5DC554';
                  }
                }}
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
                className="flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 outline-none focus:outline-none"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <img 
                  src={fotoPerfil} 
                  alt="Foto de perfil" 
                  className="w-10 h-10 rounded-full object-cover ring-2"
                  style={{ ringColor: '#5DC554' }}
                />
                <div className="text-left">
                  <p className="text-white text-sm font-bold">
                    {user.name?.length > 10 ? user.name.substring(0, 15) + '...' : user.name}
                  </p>
                  <p className="text-xs font-medium" style={{ color: '#5DC554' }}>
                    {user.email?.length > 10 ? user.email.substring(0, 15) + '...' : user.email}
                  </p>
                </div>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  style={{ color: '#5DC554' }}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-3xl shadow-2xl overflow-hidden border-2" style={{ backgroundColor: '#1E1E1E', borderColor: '#5DC554' }}>
                  <Link
                    to="/perfil"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-white transition-all duration-300 font-medium hover:bg-white hover:bg-opacity-20 hover:text-black"
                  >
                    <User size={20} style={{ color: '#5DC554' }} />
                    <span>Mi Perfil</span>
                  </Link>
                  <Link
                    to="/VerMembresia"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-white transition-all duration-300 font-medium border-t-2 hover:bg-white hover:bg-opacity-20 hover:text-black"
                    style={{ borderColor: 'rgba(93, 197, 84, 0.3)' }}
                  >
                    <User size={20} style={{ color: '#5DC554' }} />
                    <span>Mi Membresía</span>
                  </Link>
                  <Link
                    to="/mis-conferencias"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-white transition-all duration-300 font-medium border-t-2 hover:bg-white hover:bg-opacity-20 hover:text-black"
                    style={{ borderColor: 'rgba(93, 197, 84, 0.3)' }}
                  >
                    <Calendar size={20} style={{ color: '#5DC554' }} />
                    <span>Mis Conferencias</span>
                  </Link>
                  <Link
                    to="/mis-beneficios"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-white transition-all duration-300 font-medium border-t-2 hover:bg-white hover:bg-opacity-20 hover:text-black"
                    style={{ borderColor: 'rgba(93, 197, 84, 0.3)' }}
                  >
                    <Gift size={20} style={{ color: '#5DC554' }} />
                    <span>Mis Beneficios</span>
                  </Link>
                  <Link
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-5 py-4 text-white transition-all duration-300 font-medium border-t-2"
                    style={{ 
                      backgroundColor: '#119e04', 
                      borderColor: 'rgba(93, 197, 84, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#0E7E04';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#119e04';
                    }}
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
              className="text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-xl hover:scale-105"
              style={{ backgroundColor: '#119e04' }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#0E7E04';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#119e04';
              }}
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 