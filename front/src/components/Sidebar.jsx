import { Link, useLocation } from "react-router-dom";
import { Home, Star, User, Shield } from "lucide-react";
import { useContext, useState } from "react";
import { UserContext } from "../context/userContext";

export default function Sidebar() {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen ">
      {/* Sidebar */}
      {user &&
        <aside
          className={`fixed top-0 left-0 h-full ${open ? "w-64" : "w-20"}
        bg-gradient-to-b bg-black/50 backdrop-blur-sm  text-white
        p-4 z-40 transition-all duration-300 overflow-hidden`}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {/* Perfil */}

          <div className="flex flex-col items-center text-center">
            {/* Inicial del nombre */}
            {!open && (
              <div className="w-15 h-15 bg-white text-emerald-700 rounded-full flex items-center justify-center font-bold text-lg">
                {(user.displayName?.[0] || "U").toUpperCase()}
              </div>
            )}

            {/* Foto de perfil */}
            {open && (
              <>
                <div
                  className="w-25 h-25 text-7xl rounded-full text-emerald-700 bg-white border-4 border-white shadow-md mb-2 transition duration-300"
                >
                  {(user.displayName?.[0] || "U").toUpperCase()}
                </div>
                <p className="mt-3 text-sm font-bold leading-tight ">{user.displayName || "Usuario"}</p>
                <p className="mt-3 text-sm text-white/80">{user.email || "correo"}</p>
              </>
            )}
          </div>

          {/* Navegación */}
          <nav className="flex flex-col space-y-5 mt-10">
            <Link
              to="/"
              className={`p-3 rounded-lg flex items-center gap-3 text-gray-200 ${location.pathname === "/"
                ? "bg-teal-600/80 text-white shadow-lg"
                : "hover:bg-teal-500/20 hover:text-teal-300 transition"
                }`}
            >
              <Home size={24} />
              {open && <span className="text-sm font-medium">Inicio</span>}
            </Link>

            {user && (
              <>
                <Link
                  to="/gestion-oferta"
                  className={`p-3 rounded-lg flex items-center gap-3 text-gray-200 ${location.pathname === "/gestion-oferta"
                    ? "bg-teal-600/80 text-white shadow-lg"
                    : "hover:bg-teal-500/20 hover:text-teal-300 transition"
                    }`}
                >
                  <Star size={24} />
                  {open && <span className="text-sm font-medium">Ofertas Laborales</span>}
                </Link>

                <Link
                  to="/VerMembresia"
                  className={`p-3 rounded-lg flex items-center gap-3 text-gray-200 ${location.pathname === "/VerMembresia"
                    ? "bg-teal-600/80 text-white shadow-lg"
                    : "hover:bg-teal-500/20 hover:text-teal-300 transition"
                    }`}
                >
                  <User size={24} />
                  {open && <span className="text-sm font-medium">Mi Membresía</span>}
                </Link>

                <Link
                  to="/welcome-egresado"
                  className={`p-3 rounded-lg flex items-center gap-3 text-gray-200 ${location.pathname === "/welcome-egresado"
                    ? "bg-teal-600/80 text-white shadow-lg"
                    : "hover:bg-teal-500/20 hover:text-teal-300 transition"
                    }`}
                >
                  <Shield size={24} />
                  {open && <span className="text-sm font-medium">Bienvenido</span>}
                </Link>
              </>
            )}
          </nav>
          {/* Botón visual con tres puntitos 
        <div className="w-10 h-10 bg-black/85 rounded-full flex items-center justify-center self-end mb-2">
          <span className="text-white text-xl leading-none">...</span>
        </div>*/}
        </aside>
      }
      {/* Contenido principal */}
      <main className="relative"  >
        {/* Aquí van tus rutas (vistas) renderizadas por React Router */}
      </main>
    </div >
  );
}
