import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header/Header';
import EventsList from '../pages/Admin/Events/EventsList';
import OrdersList from '../pages/Admin/Orders/OrdersList';
import Login from '../pages/Login/Login';
import BuyTickets from '../pages/Events/BuyTickets';

const AdminLayout = (props) => {
    return (
        <>
            <Routes>
                <Route exact path={`/events`} element={<EventsList />} />
                <Route exact path={`/orders`} element={<OrdersList />} />
            </Routes>
        </>
    );
};

export default AdminLayout;
