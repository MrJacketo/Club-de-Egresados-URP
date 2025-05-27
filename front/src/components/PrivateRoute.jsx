import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner while checking authentication
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;