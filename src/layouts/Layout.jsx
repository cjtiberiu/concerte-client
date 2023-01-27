import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header/Header';
import Events from '../pages/Events/Events';
import Login from '../pages/Login/Login';
import BuyTickets from '../pages/Events/BuyTickets';
import OrdersList from '../pages/Admin/Orders/OrdersList';

const AccountLayout = (props) => {
    return (
        <>
            <Header />
            <Routes>
                <Route exact path={`/events`} element={<Events />} />
                <Route exact path={`/orders`} element={<OrdersList />} />
                <Route exact path={`/login`} element={<Login />} />
                <Route path={'/buy/:eventID'} element={<BuyTickets />} />
            </Routes>
        </>
    );
};

export default AccountLayout;
