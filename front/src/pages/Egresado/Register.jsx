import { useState } from "react";
import axios from 'axios';
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    nombre: '',
    email: '',
    contraseña: '',
  });

  const registerUser = async (e) => {
    e.preventDefault();
    const { nombre, email, contraseña } = data;
    try {
      const { data } = await axios.post('/register', { nombre, email, contraseña });
      if (data.error) {
        toast.error(data.error);
      } else {
        setData({ nombre: '', email: '', contraseña: '' });
        toast.success('Registro exitoso. Bienvenido!');
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r">
      <form onSubmit={registerUser} className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Registro de Usuario</h2>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Nombre</label>
          <input
            type="text"
            placeholder="Ingrese nombre..."
            value={data.nombre}
            onChange={(e) => setData({ ...data, nombre: e.target.value })}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            type="email"
            placeholder="Ingrese email..."
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Contraseña</label>
          <input
            type="password"
            placeholder="Ingrese contraseña..."
            value={data.contraseña}
            onChange={(e) => setData({ ...data, contraseña: e.target.value })}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-full transition duration-300"
        >
          Registrar
        </button>
      </form>
    </div>
  );
}
