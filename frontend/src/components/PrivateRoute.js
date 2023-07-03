import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/authentication'; // Assuming this is where your useAuth hook is located

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  return (
    user ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

export default PrivateRoute;
