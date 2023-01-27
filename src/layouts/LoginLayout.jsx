import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/Login/Login';

const LoginLayout = (props) => {
    return (
        <>
            <div className="login">
                <Routes>
                    <Route exact path={`/`} element={<LoginPage {...props} />} />
                </Routes>
            </div>
        </>
    );
};

export default LoginLayout;
