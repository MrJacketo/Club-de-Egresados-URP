import { useState } from "react";
import axios from 'axios'
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export default function Register() {
  const navigate = useNavigate()
  const [data, setData] = useState({
    nombre: '',
    email: '',
    contraseña: '',
  })

  const registerUser = async (e) => {
    e.preventDefault()
    const {nombre, email, contraseña} = data
    try {
      const {data} = await axios.post('/register', {
        nombre, email, contraseña
      })
      if(data.error){
        toast.error((data.error))
      }
      else {
        setData({})
        toast.success('Login Exitoso. Bienvenido!')
        navigate('/login')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <form onSubmit={registerUser}>
        <label>Nombre</label>
        <input type="text" placeholder='Ingrese nombre...' value={data.nombre} onChange={(e) => setData({...data,nombre: e.target.value})} />
        <label>Email</label>
        <input type="email" placeholder='Ingrese email...' value={data.email} onChange={(e) => setData({...data,email: e.target.value})}/>
        <label>Contraseña</label>
        <input type="password" placeholder='Ingrese contraseña...' value={data.contraseña} onChange={(e) => setData({...data,contraseña: e.target.value})}/>
        <button type='submit'>Registrar</button>
      </form>
    </div>
  )
}
