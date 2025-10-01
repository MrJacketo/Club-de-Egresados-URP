import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../src/components/Navbar.jsx';
import Home from '../src/pages/Egresado/Home.jsx';
import Register from '../src/pages/Egresado/Register.jsx';
import Login from '../src/pages/Egresado/Login.jsx';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { UserContextProvider } from './context/userContext.jsx';
import WelcomeEgresado from './pages/Egresado/WelcomeEgresado.jsx';
import Beneficios from './pages/Egresado/Beneficios.jsx';
import Membresia from './pages/Egresado/Membresia.jsx';
import GuardarOferta from './pages/Egresado/OfertaLaboral/GuardarOferta.jsx';
import GestionOfertas from './pages/Egresado/OfertaLaboral/GestionOfertas.jsx'
import PerfilEgresadoForm from './components/PerfilEgresadoForm.jsx';
import GestionarMembresia from './pages/Egresado/GestionarMembresia'; // ajusta la ruta
import MembresiaSucess from './pages/Egresado/MembresiaSucess.jsx'; // ajusta la ruta
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Sidebar from './components/Sidebar.jsx';
import VerBeneficios from './pages/Egresado/VerBeneficios.jsx'; // ajusta la ruta
import Feedback from "./pages/Egresado/feedback.jsx";
import NoticiasPage from './pages/Egresado/Noticiaspage.jsx';
import ForoEgresados from '../src/pages/Egresado/ForoEgresados';
import PostulantesOferta from './pages/Egresado/OfertaLaboral/PostulantesOfertas.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import AdminUsers from './pages/Admin/AdminUsers.jsx';
import GestionMembresiaAdmin from './pages/Admin/GestionMembresiaAdmin.jsx';
import GestionNoticias from './pages/Admin/GestionNoticias.jsx';
import Cursos from './pages/Egresado/Cursos.jsx';
import Conferencias from './pages/Egresado/Conferencias.jsx';
import Footer from './components/footer.jsx';
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Navbar />
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


          <Route path="/cursos" element={<PrivateRoute><Cursos /></PrivateRoute>} />
          <Route path="/conferencias" element={<PrivateRoute><Conferencias /></PrivateRoute>} />
          {/* Rutas de administrador */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path='/admin/egresados' element={<AdminRoute><AdminUsers/></AdminRoute>} />        
          <Route path="/admin/membresias" element={<AdminRoute><GestionMembresiaAdmin/></AdminRoute>} />
          <Route path='/admin/gestion-noticias' element={<AdminRoute><GestionNoticias/></AdminRoute>} />
          
        </Routes>
        <Footer/>
      </div>
    </UserContextProvider>
  );
}

export default App;
