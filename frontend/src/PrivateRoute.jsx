import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, roles }) => {
  const { user, role, isLoading } = useSelector((state) => state.auth);



  // Show loading while auth is being validated
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user || !user.id) {
  
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (roles && roles.length > 0) {
    const userRole = role || user.role;
    
    if (!userRole || !roles.includes(userRole)) {
  
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default PrivateRoute;