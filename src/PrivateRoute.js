import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({component: Component, ...rest}) => {
  const { currentUser } = useAuth();

  const admin = 'eldarkarahmetovic0@gmail.com'

  return currentUser.email === admin ? (
    <Component {...rest}/>
  ) : (
    <Navigate to="/" />
  );

};

export default PrivateRoute;