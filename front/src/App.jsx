import './App.css'
import {Routes, Route} from 'react-router-dom';
import Navbar from '../src/components/Navbar.jsx';
import Home from '../src/pages/Home.jsx';
import Register from '../src/pages/Register.jsx';
import Login from '../src/pages/Login.jsx';
import axios from 'axios';
import { Toaster } from 'react-hot-toast'
import { UserContextProvider } from '../context/userContext.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Beneficios from './pages/Beneficios.jsx';
import Perfil from './pages/Perfil.jsx';
import Membresia from './pages/Membresia.jsx';
import PerfilEgresado from './pages/PerfilEgresado.jsx';


axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.withCredentials= true;

function App() {

  return (
      <UserContextProvider>
        <Navbar/>
        <Toaster position='bottom-right' toastOptions={{duration: 2000}}/>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register/>} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/perfil' element={<Perfil />} />          {/* nueva ruta */}
          <Route path='/beneficios' element={<Beneficios />} />  {/* nueva ruta */}
          <Route path='/membresia' element={<Membresia />} />  {/* nueva ruta */}
          <Route path='/perfilegresado' element={<PerfilEgresado />} />  {/* nueva ruta */}
        </Routes>
      </UserContextProvider>
  )
}

export default App
