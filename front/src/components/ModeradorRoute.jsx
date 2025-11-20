import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

const ModeradorRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated and is moderador or admin
  // Admin también puede acceder a rutas de moderador
  if (!user || (user.rol !== 'moderador' && user.rol !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ModeradorRoute;