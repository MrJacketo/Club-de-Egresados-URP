import { Navigate } from 'react-router-dom';
import { useUser } from '../context/userContext';

const InspectorLaboralRoute = ({ children }) => {
  const { user } = useUser();

  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Solo permitir acceso a inspectores laborales y admins
  if (user.rol !== 'inspector_laboral' && user.rol !== 'admin') {
    return <Navigate to="/welcome-egresado" />;
  }

  return children;
};

export default InspectorLaboralRoute;
