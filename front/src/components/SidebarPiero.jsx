import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Home, Star, User, Shield } from "lucide-react";

export default function SidebarPiero() {
  const location = useLocation();

  return (
    <div className="flex">
      <aside
        className={`group focus-within:w-64 hover:w-64 w-16 
        fixed top-[64px] left-0 h-[calc(100vh-64px)] 
        backdrop-blur-sm bg-emerald-500/10 p-4 z-40 
        transition-all duration-300 flex flex-col justify-between overflow-hidden`}
      >
        <nav className="flex flex-col space-y-2 mt-4">
          <Link
            to="/"
            className={`p-2 rounded flex items-center gap-2 text-gray-200 ${
              location.pathname === "/"
                ? "bg-black/80 text-white"
                : "hover:text-teal-300 transition"
            }`}
          >
            <Home size={20} />
            <span className="hidden group-hover:inline group-focus-within:inline">Inicio</span>
          </Link>
          <Link
            to="/beneficios"
            className={`p-2 rounded flex items-center gap-2 text-gray-200 ${
              location.pathname === "/beneficios"
                ? "bg-black/80 text-white"
                : "hover:text-teal-300 transition"
            }`}
          >
            <Star size={20} />
            <span className="hidden group-hover:inline group-focus-within:inline">Beneficios</span>
          </Link>
          <Link
            to="/membresia"
            className={`p-2 rounded flex items-center gap-2 text-gray-200 ${
              location.pathname === "/membresia"
                ? "bg-black/80 text-white"
                : "hover:text-teal-300 transition"
            }`}
          >
            <User size={20} />
            <span className="hidden group-hover:inline group-focus-within:inline">Membresía</span>
          </Link>
          <Link
            to="/welcome-egresado"
            className={`p-2 rounded flex items-center gap-2 text-gray-200 ${
              location.pathname === "/welcome-egresado"
                ? "bg-black/80 text-white"
                : "hover:text-teal-300 transition"
            }`}
          >
            <Shield size={20} />
            <span className="hidden group-hover:inline group-focus-within:inline">Bienvenido</span>
          </Link>
        </nav>

        {/* Botón visual con tres puntitos */}
        <div className="w-8 h-8 bg-black/85 rounded-xl flex items-center justify-center self-end mb-2">
          <span className="text-white text-xl leading-none">...</span>
        </div>
      </aside>

      {/* Contenido principal ajustado al ancho del sidebar */}
      <main className="ml-16 group-hover:ml-64 group-focus-within:ml-64 transition-all duration-300 w-full px-4 pt-4">
        {/* Aquí van tus rutas (vistas) renderizadas por React Router */}
      </main>
    </div>
  );
}
