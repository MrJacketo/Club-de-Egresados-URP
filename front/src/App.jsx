import './App.css'
import {Routes, Route} from 'react-router-dom';
import Navbar from '../src/components/Navbar.jsx';
import Home from '../src/pages/Home.jsx';
import Register from '../src/pages/Register.jsx';
import Login from '../src/pages/Login.jsx';
import axios from 'axios';
import { Toaster } from 'react-hot-toast'
import { UserContextProvider } from './context/userContext.jsx';
import WelcomeEgresado from './pages/WelcomeEgresado.jsx';
import Beneficios from './pages/Beneficios.jsx';
import Membresia from './pages/Membresia.jsx';
import PerfilEgresadoForm from './components/PerfilEgresadoForm.jsx';
import PrivateRoute from "./components/PrivateRoute";

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
          <Route path='/beneficios' element={<Beneficios/>} />  
          <Route path='/membresia' element={<Membresia/>} />  
          <Route path='/welcome-egresado' element={<PrivateRoute><WelcomeEgresado/></PrivateRoute>} />
          <Route path='/perfil-egresado-form' element={<PrivateRoute><PerfilEgresadoForm/></PrivateRoute>} />             
        </Routes>
      </UserContextProvider>
  )
}

export default App
