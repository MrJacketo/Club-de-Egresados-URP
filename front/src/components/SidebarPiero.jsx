import { Link, useLocation } from "react-router-dom";
import { Home, Star, User, Shield, Newspaper } from "lucide-react";

export default function SidebarPiero() {
  const location = useLocation();

  return (
    <div>
      {/* Sidebar */}
      <aside
        className={`group fixed top-[64px] left-0 h-[calc(100vh-64px)] 
        backdrop-blur-sm bg-emerald-500/10 p-4 z-40 
        transition-all duration-300 flex flex-col justify-between`}
      >
        <nav className="flex flex-col space-y-4 mt-4">
          <Link
            to="/"
            className={`p-3 rounded-lg flex items-center gap-3 text-gray-200 ${
              location.pathname === "/"
                ? "bg-teal-600/80 text-white shadow-lg"
                : "hover:bg-teal-500/20 hover:text-teal-300 transition"
            }`}
          >
            <Home size={24} />
            <span className="hidden group-hover:inline group-focus-within:inline text-sm font-medium">
              Inicio
            </span>
          </Link>
          <Link
            to="/beneficios"
            className={`p-3 rounded-lg flex items-center gap-3 text-gray-200 ${
              location.pathname === "/beneficios"
                ? "bg-teal-600/80 text-white shadow-lg"
                : "hover:bg-teal-500/20 hover:text-teal-300 transition"
            }`}
          >
            <Star size={24} />
            <span className="hidden group-hover:inline group-focus-within:inline text-sm font-medium">
              Beneficios
            </span>
          </Link>
          <Link
            to="/membresia"
            className={`p-3 rounded-lg flex items-center gap-3 text-gray-200 ${
              location.pathname === "/membresia"
                ? "bg-teal-600/80 text-white shadow-lg"
                : "hover:bg-teal-500/20 hover:text-teal-300 transition"
            }`}
          >
            <User size={24} />
            <span className="hidden group-hover:inline group-focus-within:inline text-sm font-medium">
              Membresía
            </span>
          </Link>
          <Link
            to="/noticias"
            className={`p-3 rounded-lg flex items-center gap-3 text-gray-200 ${
              location.pathname.startsWith("/noticias")
                ? "bg-teal-600/80 text-white shadow-lg"
                : "hover:bg-teal-500/20 hover:text-teal-300 transition"
            }`}
          >
            <Newspaper size={24} />
            <span className="hidden group-hover:inline group-focus-within:inline text-sm font-medium">
              Noticias
            </span>
          </Link>
          <Link
            to="/welcome-egresado"
            className={`p-3 rounded-lg flex items-center gap-3 text-gray-200 ${
              location.pathname === "/welcome-egresado"
                ? "bg-teal-600/80 text-white shadow-lg"
                : "hover:bg-teal-500/20 hover:text-teal-300 transition"
            }`}
          >
            <Shield size={24} />
            <span className="hidden group-hover:inline group-focus-within:inline text-sm font-medium">
              Bienvenido
            </span>
          </Link>
        </nav>

        {/* Botón visual con tres puntitos */}
        <div className="w-10 h-10 bg-black/85 rounded-full flex items-center justify-center self-end mb-2">
          <span className="text-white text-xl leading-none">...</span>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="relative w-full px-4 pt-4">
        {/* Aquí van tus rutas (vistas) renderizadas por React Router */}
      </main>
    </div>
  );
}