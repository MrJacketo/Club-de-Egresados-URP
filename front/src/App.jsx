import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../src/components/Navbar.jsx';
import Home from '../src/pages/Home.jsx';
import Register from '../src/pages/Register.jsx';
import Login from '../src/pages/Login.jsx';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { UserContextProvider } from '../context/userContext.jsx';
import WelcomeEgresado from './pages/WelcomeEgresado.jsx';
import Beneficios from './pages/Beneficios.jsx';
import Perfil from './pages/Perfil.jsx';
import Membresia from './pages/Membresia.jsx';
import PerfilEgresado from './pages/PerfilEgresado.jsx';
import PrivateRoute from "./components/PrivateRoute";
import Feedback from "./pages/feedback.jsx";
import NoticiasPage from './pages/Noticiaspage.jsx';
import SidebarPiero from './components/SidebarPiero.jsx';
import GestionNoticias from './pages/GestionNoticias.jsx'


axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Navbar />
      <SidebarPiero />
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      {/* Contenedor principal sin margen dinámico */}
      <div className="relative pt-16 transition-all duration-300">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/beneficios" element={<Beneficios />} />
          <Route path="/membresia" element={<Membresia />} />
          <Route
            path="/welcome-egresado"
            element={
              <PrivateRoute>
                <WelcomeEgresado />
              </PrivateRoute>
            }
          />
          
          <Route path='/feedback' element={<PrivateRoute><Feedback /></PrivateRoute>} />
          <Route path='/noticias' element={<PrivateRoute><NoticiasPage /></PrivateRoute>} />
          <Route path='/noticias/:id' element={<PrivateRoute><NoticiasPage /></PrivateRoute>} />
          <Route path='/gestion-noticias' element={<PrivateRoute><GestionNoticias /></PrivateRoute>} />

        </Routes>
      </div>
    </UserContextProvider>
  );
}

export default App;
