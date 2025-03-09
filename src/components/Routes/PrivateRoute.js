import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  return isAuthenticated() ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;