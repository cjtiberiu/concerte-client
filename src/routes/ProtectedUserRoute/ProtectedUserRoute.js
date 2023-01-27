import { useContext } from 'react';
import { UserContext } from '../../context';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedUserRoute = ({ children }) => {
    const { userData } = useContext(UserContext);
    let location = useLocation();

    if (!userData) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedUserRoute;
