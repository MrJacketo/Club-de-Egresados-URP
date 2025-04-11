import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-gradient-to-br flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-6 md:p-8 flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8">
        
        {/* Imagen de bienvenida */}
        <div className="w-full md:w-1/2">
          <img
            src="/entradaurp.jpg"
            alt="Bienvenida URPex"
            className="w-full h-auto rounded-2xl shadow-md object-cover"
          />
        </div>

        {/* Contenido de bienvenida */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            ¡Bienvenido{user?.name ? `, ${user.name}` : ""}!
          </h1>
          <p className="text-base text-gray-600 mb-5">
            Este es tu espacio como egresado URP. Accede a beneficios, conecta con otros profesionales,
            descubre oportunidades y mantente actualizado.
          </p>

          <div className="flex flex-col sm:flex-row sm:justify-start items-center gap-3">
            <Link
              to="/beneficios"
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full font-medium transition duration-300"
            >
              Ver beneficios
            </Link>
            <Link
              to="/perfil"
              className="bg-white border border-green-500 text-green-600 hover:bg-green-100 px-5 py-2 rounded-full font-medium transition duration-300"
            >
              Ver mi perfil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
