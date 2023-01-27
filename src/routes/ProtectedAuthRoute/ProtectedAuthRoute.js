import { useContext } from 'react';
import { UserContext } from '../../context';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedAuthRoute = ({ children }) => {
    const { userData } = useContext(UserContext);
    let location = useLocation();

    if (userData) {
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }
    
    return children;
};

export default ProtectedAuthRoute;
