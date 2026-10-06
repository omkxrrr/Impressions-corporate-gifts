import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { token } = useAuth();

  // If no token, redirect to login page
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Otherwise, render the child routes (Admin Layout)
  return <Outlet />;
};

export default AdminRoute;
