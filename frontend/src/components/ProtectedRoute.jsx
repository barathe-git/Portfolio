import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * ProtectedRoute - Wrapper component to protect admin routes
 * Redirects to login if user is not authenticated
 */
function ProtectedRoute({ children }) {
  const authContext = useContext(AuthContext);

  // Check if token exists in localStorage as a fallback
  const storedToken = localStorage.getItem('auth_token');
  
  if (!authContext.isAuthenticated && !storedToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
