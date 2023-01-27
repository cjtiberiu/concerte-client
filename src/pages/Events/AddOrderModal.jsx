import { useState, useEffect } from 'react';
import AppModal from '../../components/Modal/Modal';
import { Row, Col, Form, Button, Alert, Modal, Spinner } from 'react-bootstrap';

const AddEvent = (props) => {
    const [quantity, setQuantity] = useState(0);
    const [loading, setLoading] = useState(false);
    const [resultStatus, setResultStatus] = useState('');
    const { userData, selectedEvent, handleClose, show, getEvents } = props;

    useEffect(() => {
        console.log(selectedEvent)
    }, [selectedEvent])

    const handleSubmit = async () => {
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
                event: selectedEvent
            })
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/addorder`, requestOptions);
        const result = await response.json();

        setLoading(false);
        if (result.orderStatus) {
            setResultStatus(result.orderStatus);
            if (result.orderStatus === "SUCCESS") {
                getEvents();
            }
        }
    }

    const clearModal = () => {
        handleClose();
        setQuantity(0);
        setResultStatus('');
    }

    return (
        <>
            <AppModal show={show} handleClose={clearModal} title="Achizitioneaza Bilete">
                <Row>
                    <Col>
                        {!loading 
                            ? (
                                <Modal.Body>
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
                                        <Form onSubmit={handleSubmit}>
                                            <h2>{selectedEvent.name}</h2>
                                            <p className="mb-1">Artist: {selectedEvent.artist?.name}</p>
                                            <p className="mb-1">Judet: {selectedEvent.state?.name}</p>
                                            <p className="mb-1">Data: {selectedEvent.displayDate}</p>
                                            <p className="mb-1">Pretul unui bilet: {selectedEvent.ticketPrice} RON</p>
                                            <Form.Group className="mb-3 col-4">
                                                <Form.Label htmlFor="quantity">Cantitate</Form.Label>
                                                <Form.Control type="number" name="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)}></Form.Control>
                                            </Form.Group>
                                            <Button type="submit" className="py-2 px-5 mt-3 w-100">
                                                CUMPARA
                                            </Button>
                                        </Form>
                                    )}
                                </Modal.Body>
                            )
                            : (
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            )
                        }
                    </Col>
                </Row>
            </AppModal>
        </>
    )
}

export default AddEvent;