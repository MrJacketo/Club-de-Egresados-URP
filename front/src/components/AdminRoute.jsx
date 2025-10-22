import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center  items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Check if user is authenticated and is admin
  if (!user || user.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;