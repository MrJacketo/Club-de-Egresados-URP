import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../src/components/Navbar.jsx';
import Home from '../src/pages/Home.jsx';
import Register from '../src/pages/Register.jsx';
import Login from '../src/pages/Login.jsx';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { UserContextProvider } from './context/userContext.jsx';
import WelcomeEgresado from './pages/WelcomeEgresado.jsx';
import Beneficios from './pages/Beneficios.jsx';
import Membresia from './pages/Membresia.jsx';
import GuardarOferta from './pages/OfertaLaboral/GuardarOferta.jsx';
import GestionOfertas from './pages/OfertaLaboral/GestionOfertas.jsx'
import PerfilEgresadoForm from './components/PerfilEgresadoForm.jsx';
import GestionarMembresia from './pages/GestionarMembresia'; // ajusta la ruta
import MembresiaSucess from './pages/MembresiaSucess.jsx'; // ajusta la ruta
import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/Sidebar.jsx';
import VerBeneficios from './pages/VerBeneficios.jsx'; // ajusta la ruta
import Feedback from "./pages/feedback.jsx";
import NoticiasPage from './pages/Noticiaspage.jsx';
import ForoEgresados from '../src/pages/ForoEgresados';
import PostulantesOferta from './pages/OfertaLaboral/PostulantesOfertas.jsx';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Navbar />
      <Sidebar />
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      {/* Contenedor principal sin margen dinámico */}
      <div className="relative pt-16 transition-all duration-300">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register/>} />
          <Route path='/login' element={<Login />} />
          <Route path='/beneficios' element={<Beneficios/>} />  
          <Route path='/membresia' element={<Membresia/>} /> 
          <Route path='/welcome-egresado' element={<PrivateRoute><WelcomeEgresado/></PrivateRoute>} />
          <Route path='/perfil-egresado-form' element={<PrivateRoute><PerfilEgresadoForm/></PrivateRoute>} />    
          <Route path='/guardar-oferta' element={<PrivateRoute><GuardarOferta/></PrivateRoute>} />
          <Route path='/gestion-oferta' element={<PrivateRoute><GestionOfertas/></PrivateRoute>} />  
          <Route path="/VerMembresia" element={<PrivateRoute><GestionarMembresia/></PrivateRoute>} />
          <Route path='/feedback' element={<PrivateRoute><Feedback /></PrivateRoute>} />
          <Route path='/noticias' element={<PrivateRoute><NoticiasPage /></PrivateRoute>} />
          <Route path='/noticias/:id' element={<PrivateRoute><NoticiasPage /></PrivateRoute>} />
          <Route path="/postulantes-oferta/:id" element={<PrivateRoute><PostulantesOferta/></PrivateRoute>} />
          <Route path="/MembresiaCompletada" element={<MembresiaSucess/>} />
          <Route path="/VerTodosBeneficios" element={<VerBeneficios/>} />
          <Route path="/foro-egresados" element={<ForoEgresados />} />
        </Routes>
      </div>
    </UserContextProvider>
  );
}

export default App;
