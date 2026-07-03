import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Auth/authContext';



interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return<>{children}</>;
}

export default AdminRoute;