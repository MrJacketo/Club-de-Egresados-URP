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
  const [showPassword, setShowPassword] = useState(false);

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
      const response = await login(formData.email, formData.password);

      if (!response.user.activo) {
        toast.error("Tu cuenta está desactivada. Contacta al administrador.");
        setLoading(false);
        return;
      }

      if (response.user.rol === "admin") {
        navigate("/admin");
        toast.success("Bienvenido, Administrador");
      } else {
        try {
          const profileResponse = await getGraduateProfileRequest();
          if (!profileResponse) {
            navigate("/perfil-egresado-form");
            toast("Por favor, completa tu perfil.");
          } else {
            navigate("/welcome-egresado");
            toast.success("Inicio de sesión exitoso");
          }
        } catch {
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
    <div className="relative w-screen h-screen bg-white flex font-inter">
      {/* Izquierda - Login */}
      <div className="relative w-[644px] h-full bg-[#1C1D21] flex justify-center items-center">
        <div className="w-[562px] h-[711px] bg-[#1C1D21] rounded-[26px] shadow-2xl p-10">
          <h2 className="text-white text-[40px] font-extrabold text-center mb-2">
            Ingresar
          </h2>
          <p className="text-white text-center text-[18px] mb-8">
            Ingresa los datos de tu cuenta
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[#ACACAC] mb-1">Codigo</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-[#ACACAC] text-white py-2 focus:outline-none"
                placeholder="Ingresa tu código"
              />
            </div>

            <div className="relative">
              <label className="block text-[#ACACAC] mb-1">Contraseña</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-[#ACACAC] text-white py-2 focus:outline-none"
                placeholder="••••••••"
              />
              <img
                src="/ojo.png"
                alt="ver"
                className="absolute right-2 bottom-2 lg:bottom-3 w-5 h-5 lg:w-6 lg:h-6 cursor-pointer opacity-50 hover:opacity-80 transition-opacity"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            <div className="text-gray-500 text-xs lg:text-sm cursor-pointer hover:text-[#00BC4F] transition-colors">
              ¿Olvidaste tu contraseña?
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00BC4F] hover:bg-[#00BC4F]/90 text-white py-3 lg:py-4 rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm lg:text-base"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>

            <button
              type="button"
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 lg:py-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm lg:text-base"
            >
              <img src="/GoogleLogo.png" alt="Google" className="w-5 h-5 lg:w-6 lg:h-6" />
              Inicia Sesión con Google
            </button>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-4 lg:mt-6">
              <span className="text-gray-500 text-xs lg:text-sm">¿No tienes cuenta?</span>
              <Link
                to="/register"
                className="bg-[#00BC4F] hover:bg-[#00BC4F]/90 text-white px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-colors"
              >
                Regístrate aquí
              </Link>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-400 text-center">
                <span className="font-bold">Administradores:</span> Usar credenciales institucionales
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Derecha - Bienvenida */}
      <div className="hidden lg:flex relative flex-1 lg:w-1/2 xl:w-3/5 bg-[#00BC4F] justify-center items-center">
        <div className="absolute inset-0">
          <img
            src="/backgroundcollege.jpg"
            alt="background"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative text-center text-white px-6 lg:px-8 xl:px-12">
          <h2 className="text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold leading-tight">
            Bienvenido al
          </h2>
          <h3 className="text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-tight">
            Portal Innova URP
          </h3>
          <p className="mt-4 text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
            Ingresa tu cuenta
          </p>
          <div className="mt-8 lg:mt-10 xl:mt-12">
            <img 
              src="/URPlogoFull.png" 
              alt="URP" 
              className="mx-auto w-40 lg:w-48 xl:w-56 2xl:w-64" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
