import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/userContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useContext(UserContext);
  const [data, setData] = useState({
    nombre: '',
    email: '',
    contraseña: '',
    confirmarContraseña: ''
  });
  const [loading, setLoading] = useState(false);

  const registerUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { nombre, email, contraseña, confirmarContraseña } = data;

    // Validation
    if (!nombre || !email || !contraseña || !confirmarContraseña) {
      toast.error("Por favor completa todos los campos");
      setLoading(false);
      return;
    }

    if (contraseña !== confirmarContraseña) {
      toast.error("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (contraseña.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      // Register with JWT
      await register(nombre, email, contraseña);
      
      setData({ nombre: '', email: '', contraseña: '', confirmarContraseña: '' });
      toast.success('Registro exitoso! Por favor completa tu perfil.');
      navigate('/perfil-egresado-form');
    } catch (error) {
      console.error("Error al registrarse:", error);
      toast.error(error.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center pt-35">
      <div className="w-[90%] md:w-[80%] max-w-6xl flex flex-col md:flex-row rounded-3xl shadow-2xl overflow-hidden bg-white z-10 relative h-[600px] md:h-[550px]">
        {/* Left Column: Registration Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Crear Cuenta
            </h2>
            <p className="text-gray-500">
              Únete a la comunidad de egresados URP
            </p>
          </div>

          <form onSubmit={registerUser} className="w-full max-w-sm space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                id="nombre"
                placeholder="Tu nombre completo"
                value={data.nombre}
                onChange={(e) => setData({ ...data, nombre: e.target.value })}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="tu@email.com"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                id="contraseña"
                placeholder="••••••••"
                value={data.contraseña}
                onChange={(e) => setData({ ...data, contraseña: e.target.value })}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmarContraseña" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirmarContraseña"
                placeholder="••••••••"
                value={data.confirmarContraseña}
                onChange={(e) => setData({ ...data, confirmarContraseña: e.target.value })}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-lg font-semibold text-white rounded-lg hover:bg-emerald-700 active:bg-emerald-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#008f4c" }}
            >
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </button>

            <div className="text-center mt-4">
              <p className="text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Inicia sesión aquí
                </Link>
              </p>
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>

            <h2 className="text-4xl font-bold mb-4">¡Bienvenido!</h2>
            <p className="text-lg">
              Únete a nuestra comunidad de egresados y accede a beneficios exclusivos,
              oportunidades laborales y mantente conectado con tu alma mater.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
