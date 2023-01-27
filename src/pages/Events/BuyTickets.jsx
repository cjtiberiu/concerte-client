import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Modal, Spinner, Alert } from 'react-bootstrap';
import AppModal from '../../components/Modal/Modal';

const Events = () => {
    const { userData } = useContext(UserContext);
    const [event, setEvent] = useState({});
    const [quantity, setQuantity] = useState(0);
    const { eventID } = useParams();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultStatus, setResultStatus] = useState('');

    useEffect(() => {
        getEvent();
    }, [])

    useEffect(() => {
        console.log(event)
    }, [event])

    const handleClose = () => setShow(false);
    const handleShow = (e) => {
        e.preventDefault();
        setShow(true);
    }

    const getEvent = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/getevent?eventID=${eventID}`, requestOptions);
        const result = await response.json();

        if (result.eventData) {
            setEvent(result.eventData);
        }
    }

    const buyTicket = async () => {
        setLoading(true);
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: JSON.parse(localStorage.getItem('authToken')),
            },
            body: JSON.stringify({
                quantity: quantity,
                user: userData,
                event: event
            })
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/addorder`, requestOptions);
        const result = await response.json();

        setLoading(false);
        if (result.orderStatus) {
            setResultStatus(result.orderStatus);
        }
    }

    return (
        <Container>
            <h1 className="mt-4 mb-3">Cumpara Bilet</h1>
            <Row>
                <Col>
                    {event && (
                        <Form>
                            <h2>{event.name}</h2>
                            <p>Artist: {event.artist?.name}</p>
                            <p>Judet: {event.state?.name}</p>
                            <p>Data: {event.eventDate}</p>
                            <p>Pretul unui bilet: {event.ticketPrice} RON</p>
                            <Form.Group className="mb-3 col-1">
                                <Form.Label htmlFor="quantity">Cantitate</Form.Label>
                                <Form.Control type="number" name="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Button type="submit" className="py-2 px-5 mt-3" onClick={handleShow}>
                                CUMPARA
                            </Button>
                        </Form>
                    )}
                </Col>
            </Row>
            <AppModal show={show} handleClose={handleClose} title="Achizitionare Bilet">
                {!loading 
                    ? (
                        <>
                            {(resultStatus == "SUCCESS") && (
                                <Alert variant="success">
                                    Biletele au fost achizionate cu success!
                                </Alert>
                            )}
                            {(resultStatus == "ERROR") && (
                                <Alert variant="danger">
                                    A aparut o eroare, te rugam sa reincerci!
                                </Alert>
                            )}
                            {(resultStatus == "") && (
                                <>
                                    <Modal.Body>
                                        <p>Doriti sa achizitionati <strong>{quantity} bilete</strong> la pretul total de <strong>{event.ticketPrice * quantity} RON</strong>?</p>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="primary" onClick={buyTicket}>Da</Button>
                                        <Button variant="danger">Renunta</Button>
                                    </Modal.Footer>
                                </>
                            )}
                        </>
                    )
                    : (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    )
                }
            </AppModal>
        </Container>
    )
};

export default Events;
