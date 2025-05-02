import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UserContext } from "../../context/userContext";
import axios from "axios";  // Importamos axios directamente

export default function Feedback() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);  // Obtener usuario desde el contexto

  // Estado para manejar el formulario de feedback
  const [feedback, setFeedback] = useState({
    beneficioDeseado: "",
    comentariosAdicionales: "",
    prioridad: "media",
    nombreUsuario: user?.displayName || "",
    emailUsuario: user?.email || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones para asegurar que los campos no estén vacíos o nulos
    if (!user) {
      toast.error("Por favor, inicia sesión para enviar tu feedback.");
      return;
    }

    if (!feedback.beneficioDeseado || feedback.beneficioDeseado.trim() === "") {
      toast.error("El beneficio deseado es obligatorio.");
      return;
    }

    if (feedback.comentariosAdicionales && feedback.comentariosAdicionales.length > 300) {
      toast.error("Los comentarios no pueden exceder los 300 caracteres.");
      return;
    }

    if (!feedback.nombreUsuario || !feedback.emailUsuario) {
      toast.error("Por favor, ingresa tu nombre y email.");
      return;
    }

    try {
      // Usamos axios directamente para hacer la solicitud al backend
      const response = await axios.post(
        "http://localhost:8000/api/feedback/feedback-beneficios",  // URL completa
        {
          userId: user.uid, // Usamos el userId de Firebase
          ...feedback,
        }
      );

      toast.success(response.data.mensaje); // Muestra el mensaje de éxito
      setFeedback({
        beneficioDeseado: "",
        comentariosAdicionales: "",
        prioridad: "media",
        nombreUsuario: "",
        emailUsuario: "",
      });  // Limpiar el formulario
      navigate("/feedback"); // Redirige al usuario después de enviar el feedback

    } catch (error) {
      toast.error(error.response?.data?.mensaje || "Hubo un error al enviar el feedback.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center py-12 bg-gradient-to-r from-teal-100 to-green-100">
      <div className="bg-white w-full max-w-4xl p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Feedback de Beneficios Deseados
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Comparte tus sugerencias para los beneficios que te gustaría que estén disponibles para los egresados.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Beneficio Deseado */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Beneficio Deseado</label>
            <input
              type="text"
              name="beneficioDeseado"
              value={feedback.beneficioDeseado}
              onChange={handleChange}
              placeholder="Escribe el beneficio que te gustaría"
              className="w-full mt-1 p-2 border rounded bg-white text-gray-700"
              required
            />
          </div>

          {/* Comentarios Adicionales */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Comentarios Adicionales</label>
            <textarea
              name="comentariosAdicionales"
              value={feedback.comentariosAdicionales}
              onChange={handleChange}
              rows="4"
              placeholder="Escribe cualquier comentario adicional (opcional)"
              className="w-full mt-1 p-2 border rounded bg-white text-gray-700"
            />
          </div>

          {/* Prioridad */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Prioridad</label>
            <select
              name="prioridad"
              value={feedback.prioridad}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded bg-white text-gray-700"
              required
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombreUsuario"
              value={feedback.nombreUsuario}
              onChange={handleChange}
              placeholder="Tu nombre"
              className="w-full mt-1 p-2 border rounded bg-white text-gray-700"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="emailUsuario"
              value={feedback.emailUsuario}
              onChange={handleChange}
              placeholder="Tu email"
              className="w-full mt-1 p-2 border rounded bg-white text-gray-700"
            />
          </div>

          {/* Botón de Enviar */}
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-full transition duration-300"
          >
            Enviar Feedback
          </button>
        </form>
      </div>
    </div>
  );
}
