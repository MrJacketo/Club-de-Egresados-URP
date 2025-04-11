import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-black/50 backdrop-blur-sm p-4 shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-full mx-auto flex justify-between items-center">
        {/* Contenedor para el logo a la izquierda y el texto URPex a la derecha */}
        <div className="flex items-center">
          {/* Logo URPex a la izquierda */}
          <img src="/logo.png" alt="Logo URP" className="w-12 h-12 mr-2" />

          {/* Enlace URPex a la derecha del logo */}
          <Link to="/" className="text-white font-bold text-xl hover:text-teal-300 transition">
            URPex
          </Link>
        </div>

        {/* Enlaces a registro e inicio de sesión */}
        <div className="space-x-6">
          <Link to="/register" className="text-gray-200 hover:text-teal-300 transition">
            Register
          </Link>
          <Link to="/login" className="text-gray-200 hover:text-teal-300 transition">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
