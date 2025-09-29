import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import { ThemeContext } from "../context/ThemeContext";
import { Home, Star, User, Shield, Newspaper, MessagesSquare, Search, Moon, Sun } from "lucide-react";
import logo from '../assets/logoUrpex2.svg';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useContext(UserContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

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
    console.log('Buscando:', searchTerm);
    // Aquí va tu lógica de búsqueda
  };

  return (
    <nav className="bg-theme-primary fixed top-0 left-0 w-full z-50 shadow-lg transition-theme">
      <div className="bg-theme-primary text-theme-primary flex justify-between items-center p-4 transition-theme">
        
        {/* Logo */}
        <div>
          <img className="h-8" src={logo} alt="Logo URP" />
        </div>

        {/* Barra de búsqueda */}
        <div className="flex-1 max-w-2xl mx-8">
          <form onSubmit={handleSearch} className="relative">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-secondary" 
              size={20}
            />
            
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar ofertas, noticias, eventos..."
              className="w-full bg-theme-primary text-theme-primary placeholder:text-theme-secondary pl-10 pr-4 py-2.5 rounded-lg outline-1 outline-[#ffffff39] focus:outline-[#04e68482] focus:outline-2 transition-all"
            />
          </form>
        </div>

        {/* Botón de tema y usuario */}
        <div className="flex items-center gap-4">
          {/* Botón cambiar tema */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg bg-theme-secondary hover:opacity-80 transition-all duration-300"
            aria-label="Cambiar tema"
            title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
          >
            {theme === 'light' ? (
              <Moon size={20} className="text-theme-primary" />
            ) : (
              <Sun size={20} className="text-yellow-400" />
            )}
          </button>

          {user ? (
            <>
              <span className="text-sm font-medium text-theme-primary">
                {user.nombre}
              </span>
              <button
                onClick={handleLogout}
                className="bg-theme-accent hover:opacity-90 text-white px-4 py-2 rounded-lg transition-all font-medium"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-theme-accent hover:opacity-90 text-white px-4 py-2 rounded-lg transition-all font-medium"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}