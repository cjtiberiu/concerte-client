import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';

const UserOrders = () => {
    const { userData } = useContext(UserContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        getOrders();
    }, [])

    useEffect(() => {
        console.log(orders)
    }, [orders])

    const getOrders = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/getevents`, requestOptions);
        const result = await response.json();
    }

    return (
        <Container>
            <h1 className="mt-4 mb-3">Lista Comenzilor</h1>
            <Row>
                {orders.map(event => {
                    return (
                        <Col lg="3" md="4" key={event.id}>
                            <Card>
                                <Card.Body>
                                    <Card.Title className="mb-4">{event.name}</Card.Title>
                                    <Card.Text className="mb-1">Artist: {event.artist.name}</Card.Text>
                                    <Card.Text className="mb-1">Locatie: {event.state.name}</Card.Text>
                                    <Card.Text className="mb-1">Pret bilet: {event.ticketPrice} RON</Card.Text>
                                    <Card.Text className="mb-1">Bilete disponibile: {event.stock}</Card.Text>
                                    {!userData
                                        ? <Card.Text className="text-danger mt-4">Pentru a achizitiona un bilet trebuie sa va logati.</Card.Text>
                                        : <Link to={`/buy/${event.id}`} className="btn btn-primary mt-4">CUMPARA BILET</Link>
                                    }
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                })}
            </Row>
        </Container>
    )
};

export default UserOrders;
