import { Link, useNavigate, useLocation } from "react-router-dom";

//Contextos
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { toast } from "react-hot-toast";

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
  Gift,
  BriefcaseBusiness,
  
} from "lucide-react";
import logo from "../assets/logoUrpex2.svg";
import fotoPerfil from "../assets/foto_perfil_xdefecto.png";
import { useState, useEffect } from "react";

//Funcion Navbar Principal
export default function Navbar() {
  const location = useLocation();
  const { user, logout, isMembresiaActiva } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userPhoto, setUserPhoto] = useState(fotoPerfil);

  // Obtener ID del usuario actual de manera más robusta
  const getCurrentUserId = () => {
    try {
      // Primero intentar desde el contexto
      if (user && (user.id || user._id)) {
        return user.id || user._id;
      }
      
      // Luego desde localStorage
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        return userData.id || userData._id || 'default-user';
      }
      
      return 'default-user';
    } catch (error) {
      console.error('Error obteniendo ID del usuario:', error);
      return 'default-user';
    }
  };

  // Cargar foto del localStorage - OPTIMIZADO
  useEffect(() => {
    let lastPhotoState = null;
    let hasLoggedInitialLoad = false;
    
    const loadUserPhoto = (forceLog = false) => {
      try {
        const userId = getCurrentUserId();
        
        // Buscar foto específica del usuario
        const userPhotoKey = `userProfilePhoto_${userId}`;
        let savedPhoto = localStorage.getItem(userPhotoKey);
        
        // Si no hay foto específica, usar la general como fallback
        if (!savedPhoto) {
          savedPhoto = localStorage.getItem('userProfilePhoto');
        }

        const newPhotoState = savedPhoto || fotoPerfil;
        
        // Solo actualizar y mostrar logs si hay cambios reales o es la carga inicial
        if (lastPhotoState !== newPhotoState || forceLog) {
          if (!hasLoggedInitialLoad || forceLog) {
            console.log('Cargando foto para usuario ID:', userId);
            hasLoggedInitialLoad = true;
          }
          
          if (lastPhotoState !== newPhotoState) {
            lastPhotoState = newPhotoState;
            setUserPhoto(newPhotoState);
            
            if (newPhotoState !== fotoPerfil) {
              console.log('Foto cargada exitosamente');
            } else {
              console.log('Usando foto por defecto');
            }
          }
        }
      } catch (error) {
        console.error('Error cargando foto:', error);
        setUserPhoto(fotoPerfil);
      }
    };

    // Cargar foto inicial con log
    loadUserPhoto(true);

    // Escuchar cambios en localStorage específicos para fotos de perfil
    const handleStorageChange = (e) => {
      if (e.key && (e.key.includes('userProfilePhoto') || e.key === 'currentUser')) {
        console.log('Cambio detectado en localStorage:', e.key);
        loadUserPhoto(true);
      }
    };

    // Escuchar eventos customizados de actualización
    const handleCustomUpdate = () => {
      loadUserPhoto(true);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleStorageChange);
    window.addEventListener('profileUpdated', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleStorageChange);
      window.removeEventListener('profileUpdated', handleCustomUpdate);
    };
  }, [user]); // Dependencia añadida: user

  

  const handleLogout = async () => {
    try {
      // 1. Guardar la foto actual antes de hacer logout
      const currentPhoto = userPhoto;
      const userId = getCurrentUserId();
      
      // 2. Cerrar dropdown inmediatamente
      setIsDropdownOpen(false);

      // 3. Ejecutar logout
      await logout();

      // 4. Guardar la foto para el próximo inicio de sesión
      if (currentPhoto && currentPhoto !== fotoPerfil) {
        const userPhotoKey = `userProfilePhoto_${userId}`;
        localStorage.setItem(userPhotoKey, currentPhoto);
        localStorage.setItem('userProfilePhoto', currentPhoto);
      }

      // 5. Navegar al login
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
      navigate("/login", { replace: true });
    }
  };

  

  // Handler for disabled links
  const handleDisabledClick = (e) => {
    e.preventDefault();
    toast.error("Necesitas una membresía activa para acceder a esta sección", {
      duration: 3000,
    });
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 shadow-lg"
      style={{ backgroundColor: "#1E1E1E" }}
    >
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
            style={
              location.pathname === "/"
                ? { backgroundColor: "#119e04", borderColor: "#119e04" }
                : { borderColor: "#5DC554", backgroundColor: "transparent" }
            }
            onMouseEnter={(e) => {
              if (location.pathname !== "/") {
                e.target.style.backgroundColor = "#119e04";
                e.target.style.borderColor = "#119e04";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== "/") {
                e.target.style.backgroundColor = "transparent";
                e.target.style.borderColor = "#5DC554";
              }
            }}
          >
            <Home size={20} />
            <span>Inicio</span>
          </Link>

          {user && (
            <>
              <Link
                to={isMembresiaActiva ? "/gestion-oferta" : "#"}
                onClick={!isMembresiaActiva ? handleDisabledClick : undefined}
                className={`border-2 py-3 px-5 rounded-full flex items-center gap-3 font-bold text-sm transition-all duration-300 ${
                  !isMembresiaActiva 
                    ? "opacity-50 cursor-not-allowed"
                    : location.pathname === "/gestion-oferta"
                    ? "text-white shadow-xl"
                    : "text-white hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
                }`}
                style={
                  !isMembresiaActiva
                    ? { borderColor: "#5DC554", backgroundColor: "transparent" }
                    : location.pathname === "/gestion-oferta"
                    ? { backgroundColor: "#119e04", borderColor: "#119e04" }
                    : { borderColor: "#5DC554", backgroundColor: "transparent" }
                }
                onMouseEnter={(e) => {
                  if (isMembresiaActiva && location.pathname !== "/gestion-oferta") {
                    e.target.style.backgroundColor = "#119e04";
                    e.target.style.borderColor = "#119e04";
                  }
                }}
                onMouseLeave={(e) => {
                  if (isMembresiaActiva && location.pathname !== "/gestion-oferta") {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.borderColor = "#5DC554";
                  }
                }}
              >
                <Star size={20} />
                <span>Ofertas</span>
              </Link>

              <Link
                to={isMembresiaActiva ? "/foro-egresados" : "#"}
                onClick={!isMembresiaActiva ? handleDisabledClick : undefined}
                className={`border-2 py-3 px-5 rounded-full flex items-center gap-3 font-bold text-sm transition-all duration-300 ${
                  !isMembresiaActiva
                    ? "opacity-50 cursor-not-allowed"
                    : location.pathname === "/foro-egresados"
                    ? "text-white shadow-xl"
                    : "text-white hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
                }`}
                style={
                  !isMembresiaActiva
                    ? { borderColor: "#5DC554", backgroundColor: "transparent" }
                    : location.pathname === "/foro-egresados"
                    ? { backgroundColor: "#119e04", borderColor: "#119e04" }
                    : { borderColor: "#5DC554", backgroundColor: "transparent" }
                }
                onMouseEnter={(e) => {
                  if (isMembresiaActiva && location.pathname !== "/foro-egresados") {
                    e.target.style.backgroundColor = "#119e04";
                    e.target.style.borderColor = "#119e04";
                  }
                }}
                onMouseLeave={(e) => {
                  if (isMembresiaActiva && location.pathname !== "/foro-egresados") {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.borderColor = "#5DC554";
                  }
                }}
              >
                <MessagesSquare size={20} />
                <span>Foro</span>
              </Link>

              <Link
                to={isMembresiaActiva ? "/noticias" : "#"}
                onClick={!isMembresiaActiva ? handleDisabledClick : undefined}
                className={`border-2 py-3 px-5 rounded-full flex items-center gap-3 font-bold text-sm transition-all duration-300 ${
                  !isMembresiaActiva
                    ? "opacity-50 cursor-not-allowed"
                    : location.pathname.startsWith("/noticias")
                    ? "text-white shadow-xl"
                    : "text-white hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
                }`}
                style={
                  !isMembresiaActiva
                    ? { borderColor: "#5DC554", backgroundColor: "transparent" }
                    : location.pathname.startsWith("/noticias")
                    ? { backgroundColor: "#119e04", borderColor: "#119e04" }
                    : { borderColor: "#5DC554", backgroundColor: "transparent" }
                }
                onMouseEnter={(e) => {
                  if (isMembresiaActiva && !location.pathname.startsWith("/noticias")) {
                    e.target.style.backgroundColor = "#119e04";
                    e.target.style.borderColor = "#119e04";
                  }
                }}
                onMouseLeave={(e) => {
                  if (isMembresiaActiva && !location.pathname.startsWith("/noticias")) {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.borderColor = "#5DC554";
                  }
                }}
              >
                <Newspaper size={20} />
                <span>Noticias</span>
              </Link>

              <Link
                to={isMembresiaActiva ? "/cursos" : "#"}
                onClick={!isMembresiaActiva ? handleDisabledClick : undefined}
                className={`border-2 py-3 px-5 rounded-full flex items-center gap-3 font-bold text-sm transition-all duration-300 ${
                  !isMembresiaActiva
                    ? "opacity-50 cursor-not-allowed"
                    : location.pathname.startsWith("/cursos")
                    ? "text-white shadow-xl"
                    : "text-white hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
                }`}
                style={
                  !isMembresiaActiva
                    ? { borderColor: "#5DC554", backgroundColor: "transparent" }
                    : location.pathname.startsWith("/cursos")
                    ? { backgroundColor: "#119e04", borderColor: "#119e04" }
                    : { borderColor: "#5DC554", backgroundColor: "transparent" }
                }
                onMouseEnter={(e) => {
                  if (isMembresiaActiva && !location.pathname.startsWith("/cursos")) {
                    e.target.style.backgroundColor = "#119e04";
                    e.target.style.borderColor = "#119e04";
                  }
                }}
                onMouseLeave={(e) => {
                  if (isMembresiaActiva && !location.pathname.startsWith("/cursos")) {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.borderColor = "#5DC554";
                  }
                }}
              >
                <Book size={20} />
                <span>Beneficios</span>
              </Link>

              <Link
                to={isMembresiaActiva ? "/conferencias" : "#"}
                onClick={!isMembresiaActiva ? handleDisabledClick : undefined}
                className={`border-2 py-3 px-5 rounded-full flex items-center gap-3 font-bold text-sm transition-all duration-300 ${
                  !isMembresiaActiva
                    ? "opacity-50 cursor-not-allowed"
                    : location.pathname.startsWith("/conferencias")
                    ? "text-white shadow-xl"
                    : "text-white hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
                }`}
                style={
                  !isMembresiaActiva
                    ? { borderColor: "#5DC554", backgroundColor: "transparent" }
                    : location.pathname.startsWith("/conferencias")
                    ? { backgroundColor: "#119e04", borderColor: "#119e04" }
                    : { borderColor: "#5DC554", backgroundColor: "transparent" }
                }
                onMouseEnter={(e) => {
                  if (isMembresiaActiva && !location.pathname.startsWith("/conferencias")) {
                    e.target.style.backgroundColor = "#119e04";
                    e.target.style.borderColor = "#119e04";
                  }
                }}
                onMouseLeave={(e) => {
                  if (isMembresiaActiva && !location.pathname.startsWith("/conferencias")) {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.borderColor = "#5DC554";
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
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                }}
              >
                <img
                  src={userPhoto}
                  alt="Foto de perfil"
                  className="w-10 h-10 rounded-full object-cover ring-2"
                  style={{ ringColor: "#5DC554" }}
                />
                <div className="text-left">
                  <p className="text-white text-sm font-bold">
                    {user.name?.length > 10
                      ? user.name.substring(0, 15) + "..."
                      : user.name}
                  </p>
                  <p
                    className="text-xs font-medium"
                    style={{ color: "#5DC554" }}
                  >
                    {user.email?.length > 10
                      ? user.email.substring(0, 15) + "..."
                      : user.email}
                  </p>
                </div>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  style={{ color: "#5DC554" }}
                />
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-3 w-64 rounded-3xl shadow-2xl overflow-hidden border-2"
                  style={{ backgroundColor: "#1E1E1E", borderColor: "#5DC554" }}
                >
                  <Link
                    to="/perfil-egresado-form"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-white transition-all duration-300 font-medium hover:bg-white hover:bg-opacity-20 hover:text-black"
                  >
                    <User size={20} style={{ color: "#5DC554" }} />
                    <span>Mi Perfil</span>
                  </Link>
                  <Link
                    to="/VerMembresia"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-white transition-all duration-300 font-medium border-t-2 hover:bg-white hover:bg-opacity-20 hover:text-black"
                    style={{ borderColor: "rgba(93, 197, 84, 0.3)" }}
                  >
                    <User size={20} style={{ color: "#5DC554" }} />
                    <span>Mi Membresía</span>
                  </Link>
                  <Link
                    to="/mis-ofertas"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-white transition-all duration-300 font-medium border-t-2 hover:bg-white hover:bg-opacity-20 hover:text-black"
                    style={{ borderColor: "rgba(93, 197, 84, 0.3)" }}
                  >
                    <BriefcaseBusiness size={20} style={{ color: "#5DC554" }} />
                    <span>Mis Ofertas</span>
                  </Link>
                  <Link
                    to="/mis-conferencias"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-white transition-all duration-300 font-medium border-t-2 hover:bg-white hover:bg-opacity-20 hover:text-black"
                    style={{ borderColor: "rgba(93, 197, 84, 0.3)" }}
                  >
                    <Calendar size={20} style={{ color: "#5DC554" }} />
                    <span>Mis Conferencia</span>
                  </Link>
                  <Link
                    to="/mis-beneficios"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-white transition-all duration-300 font-medium border-t-2 hover:bg-white hover:bg-opacity-20 hover:text-black"
                    style={{ borderColor: "rgba(93, 197, 84, 0.3)" }}
                  >
                    <Gift size={20} style={{ color: "#5DC554" }} />
                    <span>Mis Beneficios</span>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-5 py-4 text-white transition-all duration-300 font-medium border-t-2 cursor-pointer"
                    style={{
                      backgroundColor: "#119e04",
                      borderColor: "rgba(93, 197, 84, 0.3)",
                      border: "none",
                      borderTop: "2px solid rgba(93, 197, 84, 0.3)",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#0E7E04";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#119e04";
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
              style={{ backgroundColor: "#119e04" }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#0E7E04";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#119e04";
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