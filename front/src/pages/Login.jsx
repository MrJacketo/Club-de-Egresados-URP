import { useState } from "react";
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    contraseña: '',
  });

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, contraseña } = data;
    try {
      const { data } = await axios.post('/login', {
        email,
        contraseña
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setData({ email: '', contraseña: '' });
        navigate('/Dashboard');
      }
    } catch (error) {
      toast.error('Ocurrió un error. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen pt-20 flex justify-center items-center"> {/* Aquí se eliminó el fondo verde */}
      <form onSubmit={loginUser} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Iniciar sesión</h2>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            type="email"
            placeholder="Ingrese email..."
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 border-none rounded-lg focus:outline-none focus:ring-0"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Contraseña</label>
          <input
            type="password"
            placeholder="Ingrese contraseña..."
            value={data.contraseña}
            onChange={(e) => setData({ ...data, contraseña: e.target.value })}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 border-none rounded-lg focus:outline-none focus:ring-0"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition duration-300"
        >
          Iniciar sesión
        </button>
      </form>
      
    </div>
    
  );
}
