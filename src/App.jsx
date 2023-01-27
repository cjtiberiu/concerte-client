import { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import decodeToken from 'jwt-decode';
import { UserContext } from './context';
import Layout from './layouts/Layout';
import LoginLayout from './layouts/LoginLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedUserRoute from './routes/ProtectedUserRoute/ProtectedUserRoute';
import ProtectedAuthRoute from './routes/ProtectedAuthRoute/ProtectedAuthRoute';
import ProtectedAdminRoute from './routes/ProtectedAdminRoute/ProtectedAdminRoute';
import './custom-bootstrap.scss';

function App() {
    const [userData, setUserData] = useState(() => {
        if (localStorage.getItem('authToken')) {
            let token = JSON.parse(localStorage.getItem('authToken'));
            let decodedToken = decodeToken(token);
            const date = Date.now();

            if (decodedToken.exp * 1000 < date) {
                localStorage.removeItem('authToken');
                return null;
            }

            return decodedToken;
        }

        return null;
    });

    useEffect(() => {
        console.log('LOGGED USER DATA', userData);
    }, [userData]);

    const dispatchUserEvent = (actionType, payload) => {
        switch (actionType) {
            case 'SET_USER':
                setUserData(payload);
                return;
            case 'REMOVE_USER':
                setUserData(null);
                return;
            default:
                return;
        }
    };

    return (
        <UserContext.Provider value={{ userData, dispatchUserEvent }}>
            <BrowserRouter>
                <Routes>
                    <Route
                        exact
                        path="/*"
                        element={<Layout />}
                    />
                </Routes>
                <Routes>
                    <Route
                        exact
                        path="/admin/*"
                        element={
                            <ProtectedAdminRoute>
                                <AdminLayout />
                            </ProtectedAdminRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </UserContext.Provider>
    );
};

export default App;
