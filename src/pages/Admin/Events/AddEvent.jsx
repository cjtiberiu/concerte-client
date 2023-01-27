import { useState, useEffect } from 'react';
import AppModal from '../../../components/Modal/Modal';
import { Row, Col, Form, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { getMouseEventOptions } from '@testing-library/user-event/dist/utils';

const AddEvent = (props) => {
    const [event, setEvent] = useState({
        name: '',
        displayDate: new Date(),
        eventDate: new Date(),
        ticketPrice: 50,
        stock: 1000,
        artistID: 0,
        stateID: 0
    })
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [resultStatus, setResultStatus] = useState(''); 

    const handleChange = (e) => {
        setEvent({ ...(event), [e.target.name]: e.target.value })
    }

    useEffect(() => {
        console.log(event)
    }, [event])

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: JSON.parse(localStorage.getItem('authToken')),
            },
            body: JSON.stringify(event)
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/addevent`, requestOptions);
        const result = await response.json();

        if (result.resultStatus) {
            setResultStatus(result.resultStatus);
        }

        setLoading(false);
    }

    const handleClose = () => {
        props.getEvents();
        setResultStatus('');
        setEvent({
            name: '',
            displayDate: new Date(),
            eventDate: new Date(),
            ticketPrice: 50,
            stock: 1000,
            artistID: 0,
            stateID: 0
        });
        setShow(false);
    } 
    const handleShow = (e) => {
        e.preventDefault();
        setShow(true);
    }

    return (
        <>
            <Button variant="primary" className="ms-3" onClick={handleShow}>Adauga Eveniment</Button>
            <AppModal show={show} handleClose={handleClose} title="Adauga Eveniment">
                <Modal.Body>
                    <Row>
                        <Col>
                            {!loading
                                ? (
                                    <>
                                        {(resultStatus == "SUCCESS") && (
                                            <Alert variant="success">
                                                Eveniment adaugat cu success!
                                            </Alert>
                                        )}
                                        {(resultStatus == "ERROR") && (
                                            <Alert variant="danger">
                                                A aparut o eroare, te rugam sa reincerci!
                                            </Alert>
                                        )}
                                        {(resultStatus == "") && (
                                            <Form onSubmit={handleSubmit}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label htmlFor="name">Name</Form.Label>
                                                    <Form.Control type="text" name="name" value={event.name} onChange={handleChange}></Form.Control>
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label htmlFor="ticketPrice">Ticket Price</Form.Label>
                                                    <Form.Control type="number" name="ticketPrice" value={event.ticketPrice} onChange={handleChange}></Form.Control>
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label htmlFor="stock">Number of Tickets</Form.Label>
                                                    <Form.Control type="number" name="stock" value={event.stock} onChange={handleChange}></Form.Control>
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label htmlFor="eventDate">Event Date</Form.Label>
                                                    <DatePicker
                                                        dateFormat={'dd-MM-yyyy'}
                                                        id="eventDate"
                                                        name="eventDate"
                                                        selected={event.displayDate}
                                                        onChange={(date) => setEvent({ ...event, eventDate: date.toISOString(), displayDate: date })}
                                                        customInput={<Form.Control />}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label htmlFor="eventArtist">Artist</Form.Label>
                                                    <Form.Select aria-label="Artist" id="artistID" name="artistID" value={event.artistID} onChange={handleChange}>
                                                        <option value="0">Selecteaza Artist</option>
                                                        {props.artists.map((artist) => {
                                                            return (
                                                                <option value={artist.id} key={artist.id}>
                                                                    {artist.name}
                                                                </option>
                                                            );
                                                        })}
                                                    </Form.Select>
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label htmlFor="eventState">Selecteaza un judet</Form.Label>
                                                    <Form.Select aria-label="State" id="stateID" name="stateID" value={event.stateID} onChange={handleChange}>
                                                        <option value="0">Selecteaza Judet</option>
                                                        {props.states.map((state) => {
                                                            return (
                                                                <option value={state.id} key={state.id}>
                                                                    {state.name}
                                                                </option>
                                                            );
                                                        })}
                                                    </Form.Select>
                                                </Form.Group>
                                                <Button type="submit" className="w-100 mt-3">
                                                    Add
                                                </Button>
                                            </Form>
                                        )}
                                    </>
                                )
                                : (
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                )
                            }
                        </Col>
                    </Row>
                </Modal.Body>
            </AppModal>
        </>
    )
}

export default AddEvent;