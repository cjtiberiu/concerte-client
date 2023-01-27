import { useContext } from 'react';
import { UserContext } from '../../context';
import { Link, useNavigate } from 'react-router-dom';
//import './Header.scss';

const Header = (props) => {
    const { userData, dispatchUserEvent } = useContext(UserContext)
    const navigate = useNavigate();

    const signOut = () => {
        dispatchUserEvent('REMOVE_USER');
        localStorage.removeItem('authToken');
        navigate('/');
    };

    return (
        <header className="header">
            <nav className="nav">
                <Link to={userData && userData.userType === 'admin' ? '/admin/events' : '/events'} className="nav-item">
                    Evenimente
                </Link>
                {userData && (
                    <Link to={userData && userData.userType === 'admin' ? '/admin/orders' : '/orders'} className="nav-item">
                        Comenzi
                    </Link>
                )}
                {userData
                    ? (
                        <button className="nav-item link-btn" onClick={signOut}>
                            Delogare
                        </button>
                    )
                    : (
                        <Link to="/login" className="nav-item link-btn">
                            Logare
                        </Link>
                    )
                }
            </nav>
        </header>
    );
};

export default Header;
