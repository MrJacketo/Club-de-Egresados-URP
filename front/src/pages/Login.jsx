import { useState } from "react"
import axios from 'axios'
import {toast} from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [data, setData] = useState({
    email: '',
    contraseña: '',
  })

  const loginUser = async (e) => {
    e.preventDefault()
    const{email, contraseña} = data
    try {
      const {data} = await axios.post('/login', {
        email,
        contraseña
      });
      if(data.error) {
        toast.error(data.error)
      } else {
        setData({})
        navigate('/Dashboard')
      }
    } catch (error) {
      
    }
  }

  return (
    <div>
      <form onSubmit={loginUser}>
        <label>Email</label>
        <input type="email" placeholder='Ingrese email...' value={data.email} onChange={(e) => setData({...data,email: e.target.value})} />
        <label>Contraseña</label>
        <input type="password" placeholder='Ingrese contraseña...' value={data.contraseña} onChange={(e) => setData({...data,contraseña: e.target.value})}/>
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}
