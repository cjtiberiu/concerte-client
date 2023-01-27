import { useState, useEffect } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

const RemoveEmployee = (props) => {
    const [users, setUsers] = useState([]);
    const [selectedUserID, setSelectedUserID] = useState(0);
    const [displayMessage, setDisplayMessage] = useState('');

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        console.log(selectedUserID);
    }, [selectedUserID]);

    const getUsers = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: JSON.parse(localStorage.getItem('authToken')),
            },
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/getusers`, requestOptions);
        const result = await response.json();

        if (result.users) {
            setUsers(result.users);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setDisplayMessage('');

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: JSON.parse(localStorage.getItem('authToken')),
            },
            body: JSON.stringify({ userID: selectedUserID }),
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/removeuser`, requestOptions);
        const result = await response.json();

        if (result.message) {
            setDisplayMessage(result.message);
        }

        getUsers();
    };

    return (
        <div>
            <h1>Remove Employee</h1>
            <Row>
                <Col lg={{ span: 4 }}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3 mt-3">
                            <Form.Select className="mb-3" aria-label="User Types" id="users" name="users" value={selectedUserID} onChange={(e) => setSelectedUserID(e.target.value)}>
                                <option value="0">Select User</option>
                                {users.map((user) => {
                                    return (
                                        <option value={user.id} key={user.id}>
                                            {`${user.firstName} ${user.lastName} (${user.email})`}
                                        </option>
                                    );
                                })}
                            </Form.Select>
                        </Form.Group>
                        <Button type="submit" variant="danger" className="w-100 mt-3">
                            Remove
                        </Button>
                    </Form>
                    <p>{displayMessage}</p>
                </Col>
            </Row>
        </div>
    );
};

export default RemoveEmployee;
