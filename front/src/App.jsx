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
import Beneficios from './pages/Egresado/MisBeneficios.jsx';
import Membresia from './pages/Egresado/Membresia.jsx';
import GuardarOferta from './pages/Egresado/OfertaLaboral/GuardarOferta.jsx';
import GestionOfertas from './pages/Egresado/OfertaLaboral/GestionOfertas.jsx';
import PerfilEgresadoForm from './components/PerfilEgresadoForm.jsx';
import GestionarMembresia from './pages/Egresado/GestionarMembresia';
import MembresiaSucess from './pages/Egresado/MembresiaSucess.jsx';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import VerBeneficios from './pages/Egresado/VerBeneficios.jsx'; // ajusta la ruta
import Feedback from "./pages/Egresado/feedback.jsx";
import NoticiasPage from "./pages/Egresado/Noticiaspage.jsx";
import ForoEgresados from "../src/pages/Egresado/ForoEgresados";
import PostulantesOferta from "./pages/Egresado/OfertaLaboral/PostulantesOfertas.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import AdminUsers from "./pages/Admin/AdminUsers.jsx";
import GestionMembresiaAdmin from "./pages/Admin/GestionMembresiaAdmin.jsx";
import GestionNoticias from "./pages/Admin/GestionNoticias.jsx";
import GestionBeneficiosAdmin from "./pages/Admin/GestionBeneficiosAdmin.jsx";
import Cursos from "./pages/Egresado/Cursos.jsx";
import Conferencias from "./pages/Egresado/Conferencias.jsx";
import Footer from "./components/footer.jsx";
import NoticiaDetalle from "./pages/Egresado/DetalleNoticia.jsx";
import InspeccionLaboral from './pages/InspectorLaboral/InspeccionOfertas.jsx';
import MisConferencias from './pages/Egresado/MisConferencias.jsx';
import MisBeneficios from './pages/Egresado/MisBeneficios.jsx';
import ModeracionUsuarios from './pages/Moderador/ModeracionUsuarios.jsx';
import GestionForo from './pages/Admin/GestionForo.jsx';
import ModeradorRoute from './components/ModeradorRoute';
import ModeradorDashboard from './pages/Moderador/ModeradorDashboard.jsx';
import GestionOfertasModerador from './pages/Moderador/GestionOfertasModerador.jsx';
import AdminOfertas from './pages/Admin/AdminOfertas.jsx';
import IncidentDashboard from "./pages/InspectorLaboral/IncidentDashboard.jsx";
import MisOfertas from './pages/Egresado/MisOfertas.jsx';
import InspectorLaboralRoute from './components/InspectorLaboralRoute';
import SuspensionEmpresas from './pages/InspectorLaboral/SuspensionEmpresas.jsx';
import InspectorLaboralDashboard from './pages/InspectorLaboral/InspectorLaboralDashboard.jsx';

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Navbar />
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />

      {/* Contenedor principal ocupa toda la vista */}
      <div className="relative pt-16 transition-all duration-300 min-h-screen w-full bg-gray-130">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/beneficios' element={<Beneficios />} />
          <Route path='/membresia' element={<Membresia />} />
          <Route path='/welcome-egresado' element={<PrivateRoute><WelcomeEgresado /></PrivateRoute>} />
          <Route path='/perfil-egresado-form' element={<PrivateRoute><PerfilEgresadoForm /></PrivateRoute>} />
          <Route path='/guardar-oferta' element={<PrivateRoute><GuardarOferta /></PrivateRoute>} />
          <Route path='/gestion-oferta' element={<PrivateRoute><GestionOfertas /></PrivateRoute>} />
          <Route path="/VerMembresia" element={<PrivateRoute><GestionarMembresia /></PrivateRoute>} />
          <Route path='/feedback' element={<PrivateRoute><Feedback /></PrivateRoute>} />
          <Route path='/noticias' element={<PrivateRoute><NoticiasPage /></PrivateRoute>} />
          <Route path='/noticias/:id' element={<PrivateRoute><NoticiaDetalle /></PrivateRoute>} />
          <Route path="/postulantes-oferta/:id" element={<PrivateRoute><PostulantesOferta /></PrivateRoute>} />
          <Route path="/MembresiaCompletada" element={<MembresiaSucess />} />

          {/* RUTA DEL FORO CON ESTILOS ESPECIALES */}
          <Route
            path="/foro-egresados"
            element={
              <div
                style={{
                  margin: 0,
                  padding: 0,
                  width: "100%",
                  marginTop: "-0rem",
                }}
              >
                <ForoEgresados />
              </div>
            }
          />

          <Route
            path="/cursos"
            element={
              <PrivateRoute>
                <Cursos />
              </PrivateRoute>
            }
          />
          <Route
            path="/conferencias"
            element={
              <PrivateRoute>
                <Conferencias />
              </PrivateRoute>
            }
          />

          <Route path="/mis-conferencias" element={<PrivateRoute><MisConferencias /></PrivateRoute>} />
          <Route path="/mis-beneficios" element={<PrivateRoute><MisBeneficios /></PrivateRoute>} />
          <Route path="/beneficios" element={<PrivateRoute><Cursos /></PrivateRoute>} />
          <Route path="/ver-beneficios" element={<PrivateRoute><Cursos /></PrivateRoute>} />
          <Route path="/mis-ofertas" element={<PrivateRoute><MisOfertas /></PrivateRoute>} />
          
          <Route path="/mis-ofertas" element={<PrivateRoute><MisOfertas /></PrivateRoute>} />
          



          {/* Rutas de administrador */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path='/admin/egresados' element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/membresias" element={<AdminRoute><GestionMembresiaAdmin /></AdminRoute>} />
          <Route path="/admin/beneficios" element={<AdminRoute><GestionBeneficiosAdmin /></AdminRoute>} />
          <Route path='/admin/gestion-noticias' element={<AdminRoute><GestionNoticias /></AdminRoute>} />
          <Route path="/admin/gestion-ofertas" element={<AdminRoute><AdminOfertas /></AdminRoute>} />

          {/* Rutas de moderador */}
          <Route path="/moderador/usuarios" element={<ModeradorRoute><ModeracionUsuarios /></ModeradorRoute>} />
          <Route path="/moderador" element={<ModeradorRoute><ModeradorDashboard /></ModeradorRoute>} />
          <Route path="/moderador/ofertas" element={<ModeradorRoute><GestionOfertasModerador /></ModeradorRoute>} />
          <Route path="/moderador/foro" element={<ModeradorRoute><GestionForo /></ModeradorRoute>} />
          <Route path="/inspeccion/ofertas" element={<InspeccionLaboral />} />

          {/* Rutas de inspector laboral */}
          <Route path="/inspector-laboral" element={<InspectorLaboralRoute><InspectorLaboralDashboard /></InspectorLaboralRoute>} />
          <Route path="/inspector/ofertas" element={<InspectorLaboralRoute><InspeccionLaboral /></InspectorLaboralRoute>} />
          <Route path="/inspector/incidencias" element={<InspectorLaboralRoute><IncidentDashboard /></InspectorLaboralRoute>} />
          <Route path="/inspector/suspensiones" element={<InspectorLaboralRoute><SuspensionEmpresas /></InspectorLaboralRoute>} />

        </Routes>
        <Footer />
      </div>
    </UserContextProvider>
  );
}

export default App;
