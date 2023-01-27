import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../context';
import { Link } from 'react-router-dom';
import AddEvent from './AddEvent';
import { Container, Row, Col, Card, Form, Spinner, Table, Button } from 'react-bootstrap';
import Filters from '../../../components/Filters/Filters';

const Events = () => {
    const { userData } = useContext(UserContext);
    const [events, setEvents] = useState([]);
    const [artists, setArtists] = useState([]);
    const [artist, setArtist] = useState(0)
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [loading, setLoading] = useState(false);
    const [states, setStates] = useState([]);

    useEffect(() => {
        getArtists();
        getStates();
        getEvents();
    }, [])

    useEffect(() => {
        getEvents();
    }, [artist, startDate, endDate])

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
            console.log('GET EVENTS', result.events);
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
                        <h1 className="mb-0">Lista Evenimentelor</h1>
                        <AddEvent events={events} setEvents={setEvents} artists={artists} states={states} getEvents={getEvents} />
                    </div>
                </Col>
            </Row>
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
                        <Col>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Eveniment</th>
                                        <th>Artist</th>
                                        <th>Bilete Disponibile</th>
                                        <th>Pret Bilet</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {events.map(event => {
                                    return (
                                        <tr key={event.id}>
                                            <td>{event.displayDate}</td>
                                            <td>{event.name}</td>
                                            <td>{event.artist.name}</td>
                                            <td>{event.currentStock}</td>
                                            <td>{event.ticketPrice} RON</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                )
            }
        </Container>
    )
};

export default Events;
