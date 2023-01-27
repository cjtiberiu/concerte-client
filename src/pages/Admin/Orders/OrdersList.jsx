import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../context';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Spinner, Table, Button } from 'react-bootstrap';
import Filters from '../../../components/Filters/Filters';

const Events = (props) => {
    const { userData } = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    const [artists, setArtists] = useState([]);
    const [artist, setArtist] = useState(0)
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [loading, setLoading] = useState(false);
    const [states, setStates] = useState([]);
    const [totalAmount, setTotalAmount] = useState(null);
    const [totalTickets, setTotalTickets] = useState(null);

    useEffect(() => {
        getArtists();
        getOrders();
    }, [])

    useEffect(() => {
        getOrders();
    }, [artist, startDate, endDate])

    useEffect(() => {
        console.log(orders)
    }, [orders])

    const getOrders = async () => {
        setLoading(true);

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: JSON.parse(localStorage.getItem('authToken')),
            },
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/getordersdata?artist=${artist}&startDate=${startDate}&endDate=${endDate}&userID=${userData.userType == 'admin' ? 0 : userData.id}`, requestOptions);
        const result = await response.json();

        console.log(result)

        if (result.orders) {
            setOrders(result.orders);
        }

        console.log(result)

        console.log(result.hasOwnProperty('totalAmount'))

        if (result.hasOwnProperty('totalAmount')) {
            setTotalAmount(result.totalAmount);
        }

        if (result.hasOwnProperty('totalTickets')) {
            setTotalTickets(result.totalTickets);
        }

        setLoading(false);
    }

    const getArtists = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: JSON.parse(localStorage.getItem('authToken')),
            },
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/getartists`, requestOptions);
        const result = await response.json();

        if (result.artists) {
            setArtists(result.artists);
        }
    }

    const getStates = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/getstates`, requestOptions);
        const result = await response.json();

        if (result.states) {
            setStates(result.states);
        }
    }

    return (
        <Container>
            <Row>
                <Col>
                    <div className="d-flex align-items-center mt-4 mb-4">
                        <h1 className="mb-0">Lista Comenziilor</h1>
                    </div>
                </Col>
            </Row>
            <Filters artists={artists} artist={artist} setArtist={setArtist} startDate={startDate} endDate={endDate} setDateRange={setDateRange} />
            {loading 
                ? (
                    <Row className="d-flex justify-content-center mt-5">
                        <Col>
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </Col>
                    </Row>
                )
                : (
                    <>
                        <Row>
                            <Col>
                                <Table striped bordered hover>
                                    <thead className="text-center">
                                        <tr>
                                            <th>ID Comanda</th>
                                            <th>Data Ev</th>
                                            <th>Eveniment</th>
                                            <th>Artist</th>
                                            <th>Bilete {userData.userType === 'admin' ? 'Vandute' : 'Cumparate'}</th>
                                            <th>Pret Bilet</th>
                                            <th>Suma Totala</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                    {orders.map(order => {
                                        return (
                                            <tr key={order.id}>
                                                <td>{order.id}</td>
                                                <td>{order.event.displayDate}</td>
                                                <td>{order.event.name}</td>
                                                <td>{order.event.artist.name}</td>
                                                <td>{order.quantity}</td>
                                                <td>{order.event.ticketPrice} RON</td>
                                                <td>{order.totalAmount} RON</td>
                                            </tr>
                                        )
                                    })}
                                        <tr className="fw-bold">
                                            <td>Totaluri</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>{totalTickets}</td>
                                            <td></td>
                                            <td>{totalAmount} RON</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        {/* <Row>
                            <Col>
                                <h3 className="mt-3 mb-4">Suma totala obtinuta de evenimentele care au loc in perioada selectata este de {totalAmount} RON</h3>
                            </Col>
                        </Row> */}
                    </>
                )
            }
        </Container>
    )
};

export default Events;
