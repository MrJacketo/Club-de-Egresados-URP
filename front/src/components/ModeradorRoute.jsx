import { Navigate } from 'react-router-dom';
import { useUser } from '../context/userContext';

const ModeradorRoute = ({ children }) => {
  const { user } = useUser();

  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Solo permitir acceso a moderadores y admins
  if (user.rol !== 'moderador' && user.rol !== 'admin') {
    return <Navigate to="/welcome-egresado" />;
  }

  return children;
};

export default ModeradorRoute;
