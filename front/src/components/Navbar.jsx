<<<<<<< HEAD
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
=======
//React
import { Link, useNavigate, useLocation } from "react-router-dom";

//Contextos
import { useContext } from "react";
>>>>>>> main
import { UserContext } from "../context/userContext";
import { Home, Newspaper, ShieldCheck, MessageSquare, Briefcase, LogOut } from 'lucide-react';

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
<<<<<<< HEAD
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setDropdownOpen(false); // Close dropdown on logout
      logout();
      navigate("/login");
=======
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      // Cerrar dropdown inmediatamente
      setIsDropdownOpen(false);
      
      // Ejecutar logout
      await logout();
      
      // Navegar directamente sin pasar por Home usando replace
      navigate("/login", { replace: true });
>>>>>>> main
    } catch (error) {
      console.error("Error during logout:", error);
      // En caso de error, aún navegar al login
      navigate("/login", { replace: true });
    }
  };

<<<<<<< HEAD
  const navItems = [
    { to: "/welcome-egresado", icon: <Home size={16} />, text: "Inicio" },
    { to: "/noticias", icon: <Newspaper size={16} />, text: "Noticias" },
    { to: "/VerMembresia", icon: <ShieldCheck size={16} />, text: "Mi Membresia" },
    { to: "/foro-egresados", icon: <MessageSquare size={16} />, text: "Foro" },
    { to: "/gestion-oferta", icon: <Briefcase size={16} />, text: "Ofertas Laborales" },
  ];

  const displayName = user?.name || "Usuario";
  const displayEmail = user?.email || "correo@ejemplo.com";
  const displayAvatar = user?.avatarUrl || "https://i.imgur.com/WxNkK7J.png";

  return (
    <header className="bg-[#353535] w-full py-3 px-6 shadow-md border-b border-gray-700/50 flex items-center justify-between fixed top-0 left-0 z-50">
      
      <div className="flex items-center gap-3">
        <img src="/newLogo.png" alt="Logo URP" className="w-10 h-10" />
        <Link to="/" className="text-white font-bold text-2xl tracking-wider hidden sm:inline">
        </Link>
=======
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
                    to="/perfil-egresado-form"
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
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevenir cualquier comportamiento por defecto
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-5 py-4 text-white transition-all duration-300 font-medium border-t-2 cursor-pointer"
                    style={{ 
                      backgroundColor: '#119e04', 
                      borderColor: 'rgba(93, 197, 84, 0.3)',
                      border: 'none',
                      borderTop: '2px solid rgba(93, 197, 84, 0.3)'
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
                  </button>
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
>>>>>>> main
      </div>

      {user && (
        <div className="hidden md:flex items-center justify-center gap-x-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex items-center justify-center w-44 gap-2 px-3 py-1.5 rounded-2xl text-sm transition-colors whitespace-nowrap font-semibold ${
                  isActive
                    ? "bg-green-600 text-white border border-green-600"
                    : "text-green-500 border border-green-600 hover:bg-green-600 hover:text-white"
                }`
              }
            >
              {item.icon}
              <span>{item.text}</span>
            </NavLink>
          ))}
        </div>
      )}

      {}
      <div>
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 bg-transparent px-4 py-2 rounded-lg transition-colors"
              style={{backgroundColor: '#353535'}}
            >
              <img
                src={displayAvatar}
                alt="User Avatar"
                className="w-9 h-9 rounded-full object-cover bg-gray-700 border-2 border-gray-600"
              />
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-white text-sm leading-tight tracking-wider">
                  {displayName.toUpperCase()}
                </p>
                <p className="text-xs text-gray-400 leading-tight">
                  {displayEmail}
                </p>
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-[#353535] border border-gray-700 rounded-md shadow-lg py-1 z-50">
                <button
                  style={{backgroundColor: '#353535'}}
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/perfil-egresado-form")
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700/50"
                >
                  Mi Perfil
                </button>
                <button
                  style={{backgroundColor: '#353535'}}
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 focus:outline-none"
                >
                  <LogOut size={16} />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-green-600 text-white font-semibold px-5 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
<<<<<<< HEAD
}
=======
} 
>>>>>>> main
