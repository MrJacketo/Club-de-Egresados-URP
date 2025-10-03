import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { Home, Newspaper, ShieldCheck, MessageSquare, Briefcase, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
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
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

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
}