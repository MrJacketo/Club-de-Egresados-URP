import { useContext } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { UserContext } from "../context/userContext";
import { getGraduateProfileRequest } from "../api/perfilEgresadoApi";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  // Login with Google using Firebase
  const handleGoogleLogin = async () => {
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user); // Update user context with Firebase user

      // Wait for the Firebase ID token
      const token = await auth.currentUser.getIdToken(true); // Force refresh the token

      // Check if the user's profile exists
      const profileResponse = await getGraduateProfileRequest(token); // Pass the token to the API request

      if (!profileResponse) {
        // If the profile doesn't exist, navigate to the profile creation form
        navigate("/perfil-egresado-form");
        toast("Por favor, completa tu perfil.");
      } else {
        // If the profile exists, navigate to the welcome page
        navigate("/welcome-egresado");
        toast.success("Inicio de sesión exitoso");
      }
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);

      // Handle specific errors
      if (error.code === "auth/unauthorized-domain") {
        toast.error("El dominio no está autorizado. Contacta al administrador.");
      } else if (error.message.includes("Failed to fetch profile")) {
        toast.error("No se pudo obtener el perfil. Intenta nuevamente.");
      } else {
        toast.error("Error al iniciar sesión con Google.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-[90%] md:w-[80%] max-w-6xl flex flex-col md:flex-row rounded-3xl shadow-2xl overflow-hidden bg-white z-10 relative h-[350px] md:h-[450px]">
        {/* Left Column: Google Login */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Bienvenido
            </h2>
            <p className="text-gray-500">
              Inicia sesión con tu cuenta de Google para continuar
            </p>
          </div>

          <div className="mt-8">
            <button
              onClick={handleGoogleLogin}
              className="w-full py-4 text-lg font-semibold text-white rounded-lg hover:bg-emerald-700 active:bg-emerald-800 transition-all duration-300 flex items-center justify-center"
              style={{ backgroundColor: "#008f4c" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Iniciar sesión con Google
            </button>
          </div>
        </div>

        {/* Right Column: Welcome Message */}
        <div
          className="w-full md:w-1/2 text-white flex flex-col justify-center items-center p-10 relative overflow-hidden"
          style={{ backgroundColor: "#008f4c" }}
        >
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <pattern
                id="pattern-circles"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
                patternContentUnits="userSpaceOnUse"
              >
                <circle
                  id="pattern-circle"
                  cx="10"
                  cy="10"
                  r="1.6"
                  fill="#fff"
                ></circle>
              </pattern>
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="url(#pattern-circles)"
              ></rect>
            </svg>
          </div>

          <div className="relative z-10 max-w-md text-center space-y-4 mt-[-50px]">
            {/* Icon */}
            <div className="inline-block p-4 rounded-full bg-white/10 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>

            <h2 className="text-4xl font-bold mb-4">¡Hola de nuevo!</h2>
            <p className="text-lg">
              Estamos felices de verte nuevamente. Inicia sesión para continuar
              con tu experiencia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}