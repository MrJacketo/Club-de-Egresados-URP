import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { getGraduateProfileRequest } from "../../api/perfilEgresadoApi";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      toast.error("Por favor completa todos los campos");
      setLoading(false);
      return;
    }

    try {
      // Login with JWT
      const response = await login(formData.email, formData.password);
      
      // Check if user is active
      if (!response.user.activo) {
        toast.error("Tu cuenta está desactivada. Contacta al administrador.");
        setLoading(false);
        return;
      }

      // Check user role and redirect accordingly
      if (response.user.rol === 'admin') {
        // Redirect admin users to admin panel
        navigate("/admin");
        toast.success("Bienvenido, Administrador");
      } else {
        // For egresado users, check if profile exists
        try {
          const profileResponse = await getGraduateProfileRequest();
          
          if (!profileResponse) {
            // If the profile doesn't exist, navigate to the profile creation form
            navigate("/perfil-egresado-form");
            toast("Por favor, completa tu perfil.");
          } else {
            // If the profile exists, navigate to the welcome page
            navigate("/welcome-egresado");
            toast.success("Inicio de sesión exitoso");
          }
        } catch (profileError) {
          // Profile doesn't exist, redirect to profile form
          navigate("/perfil-egresado-form");
          toast("Por favor, completa tu perfil.");
        }
      }

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      toast.error(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center pt-35">
      <div className="w-[90%] md:w-[80%] max-w-6xl flex flex-col md:flex-row rounded-3xl shadow-2xl overflow-hidden bg-white z-10 relative h-[500px] md:h-[450px]">
        {/* Left Column: Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-gray-500">
              Ingresa tu email y contraseña para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-lg font-semibold text-white rounded-lg hover:bg-emerald-700 active:bg-emerald-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#008f4c" }}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>

            <div className="text-center mt-4 space-y-2">
              <p className="text-gray-600">
                ¿No tienes cuenta?{" "}
                <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Regístrate aquí
                </Link>
              </p>
              <div className="border-t pt-2">
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Administradores:</span> Usar credenciales institucionales
                </p>
              </div>
            </div>
          </form>
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
