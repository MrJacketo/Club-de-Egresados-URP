import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

export default function Navbar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      logout(); // Clear user context and JWT token
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav className="bg-black/50 backdrop-blur-sm p-4 shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-full mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo URP" className="w-12 h-12 mr-2" />
          <Link
            to="/"
            className="text-white font-bold text-xl hover:text-teal-300 transition"
          >
            URPex
          </Link>
        </div>

        <div className="space-x-6">
          {user ? (
            <>
              <span className="text-gray-200">
                Hola, {user.name?.split(' ')[0] || "Usuario"} !
              </span>
              <button
                onClick={() => navigate("/welcome-egresado")}
                className="text-gray-200 hover:text-teal-300 transition"
              >
                Inicio
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-200 hover:text-teal-300 transition"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              {/* 
              <Link to="/register" className="text-gray-200 hover:text-teal-300 transition">
                Register
              </Link> 
              */}

              <button
                onClick={() => navigate("/login")}
                className="text-gray-200 hover:text-teal-300 transition"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
