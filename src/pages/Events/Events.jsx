import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import Filters from '../../components/Filters/Filters';
import AddOrderModal from './AddOrderModal';

const Events = () => {
    const { userData } = useContext(UserContext);
    const [events, setEvents] = useState([]);
    const [artists, setArtists] = useState([]);
    const [artist, setArtist] = useState(0)
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [loading, setLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState({});
    const [show, setShow] = useState(false);

    useEffect(() => {
        getArtists();
        getEvents();
    }, [])

    useEffect(() => {
        getEvents();
    }, [artist, startDate, endDate])

    useEffect(() => {
        console.log(selectedEvent)
    }, [selectedEvent])

    const getEvents = async () => {
        setLoading(true);

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/getevents?artist=${artist}&startDate=${startDate}&endDate=${endDate}`, requestOptions);
        const result = await response.json();

        if (result.events) {
            setEvents(result.events);
        }

        setLoading(false);
    }

    const getArtists = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/getartists`, requestOptions);
        const result = await response.json();

        if (result.artists) {
            setArtists(result.artists);
        }
    }

    const selectEventForPurchase = (e, event) => {
        setSelectedEvent(event);
        handleShow(e);
    }

    const handleClose = () => {
        setShow(false);
        setSelectedEvent({});
    }
    const handleShow = (e) => {
        e.preventDefault();
        setShow(true);
    }

    return (
        <Container>
            <h1 className="mt-4 mb-4">Lista Evenimentelor</h1>
            <Filters artists={artists} artist={artist} setArtist={setArtist} startDate={startDate} endDate={endDate} setDateRange={setDateRange} />
            {loading 
                ? (
                    <Row className="d-flex justify-content-center mt-5">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </Row>
                )
                : (
                    <Row>
                        {events.map(event => {
                            return (
                                <Col lg="3" md="4" key={event.id} className="mb-4">
                                    <Card className="h-100 shadow">
                                        <Card.Img variant="top" src={process.env.PUBLIC_URL + event.displayImage} />
                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title className="mb-4">{event.name}</Card.Title>
                                            <Card.Text className="mb-1">Artist: {event.artist.name}</Card.Text>
                                            <Card.Text className="mb-1">Locatie: {event.state.name}</Card.Text>
                                            <Card.Text className="mb-1">Pret bilet: {event.ticketPrice} RON</Card.Text>
                                            <Card.Text className="mb-3">Bilete disponibile: {event.currentStock}</Card.Text>
                                            {!userData
                                                ? <Card.Text className="text-danger mt-4">Pentru a achizitiona un bilet trebuie sa va logati.</Card.Text>
                                                // : <Link to={`/buy/${event.id}`} className="btn btn-primary mt-auto w-100">CUMPARA BILET</Link>
                                                : <Button onClick={(e) => selectEventForPurchase(e, event)} variant="primary" className="mt-auto w-100">CUMPARA BILET</Button>
                                            }
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>
                )
            }
            <AddOrderModal userData={userData} selectedEvent={selectedEvent} show={show} handleClose={handleClose} getEvents={getEvents} />
        </Container>
    )
};

export default Events;
