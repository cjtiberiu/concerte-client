import { useState, useEffect } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddEmployee = (props) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [contractStartDate, setContractStartDate] = useState(null);
    const [contractEndDate, setContractEndDate] = useState(null);
    const [userType, setUserType] = useState(2);
    const [userTypes, setUserTypes] = useState([]);
    const [userRole, setUserRole] = useState(0);
    const [userRoles, setUserRoles] = useState([]);
    const [displayMessage, setDisplayMessage] = useState('');

    useEffect(() => {
        getUserTypes();
        getUserRoles();
    }, []);

    useEffect(() => {
        //console.log(userType);
    }, [userType, contractStartDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setDisplayMessage('');

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: JSON.parse(localStorage.getItem('authToken')),
            },
            body: JSON.stringify({ firstName, lastName, email, contractStartDate, contractEndDate, userType }),
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, requestOptions);
        const result = await response.json();

        if (result.message) {
            setDisplayMessage(result.message);
        }
    };

    // TODO: rethink getUserTypes and getUserRoles to follow DRY principle
    // try to reduce the number of requests by storing the data on app init

    const getUserTypes = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: JSON.parse(localStorage.getItem('authToken')),
            },
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/getusertypes`, requestOptions);
        const result = await response.json();

        if (result.userTypes) {
            setUserTypes(result.userTypes);
        }
    };

    const getUserRoles = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: JSON.parse(localStorage.getItem('authToken')),
            },
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/getuserroles`, requestOptions);
        const result = await response.json();

        if (result.userRoles) {
            setUserRoles(result.userRoles);
        }
    };

    return (
        <div>
            <h1>Add Employee</h1>
            <Row>
                <Col lg={{ span: 4 }}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="firstName">First Name</Form.Label>
                            <Form.Control type="text" name="firstName" onChange={(e) => setFirstName(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="lastName">Last Name</Form.Label>
                            <Form.Control type="text" name="lastName" onChange={(e) => setLastName(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="email">Email</Form.Label>
                            <Form.Control type="email" name="email" onChange={(e) => setEmail(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="contractStartDate">Contract Start Date</Form.Label>
                            <DatePicker
                                dateFormat={'dd-MM-yyyy'}
                                id="contractStartDate"
                                name="contractStartDate"
                                selected={contractStartDate}
                                onChange={(date) => setContractStartDate(date)}
                                customInput={<Form.Control />}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="contractEndDate">Contract End Date</Form.Label>
                            <DatePicker
                                dateFormat={'dd-MM-yyyy'}
                                id="contractEndDate"
                                name="contractEndDate"
                                selected={contractEndDate}
                                onChange={(date) => setContractEndDate(date)}
                                customInput={<Form.Control />}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="userType">User Role</Form.Label>
                            <Form.Select aria-label="User Roles" id="userRole" name="userRole" value={userRole} onChange={(e) => setUserRole(e.target.value)}>
                                <option value="0">Select a role</option>
                                {userRoles.map((role) => {
                                    return (
                                        <option value={role.id} key={role.id}>
                                            {role.role.charAt(0).toUpperCase() + role.role.slice(1)}
                                        </option>
                                    );
                                })}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="userType">User Type</Form.Label>
                            <Form.Select aria-label="User Types" id="userType" name="userType" value={userType} onChange={(e) => setUserType(e.target.value)}>
                                {userTypes.map((userType) => {
                                    return (
                                        <option value={userType.id} key={userType.id}>
                                            {userType.type.charAt(0).toUpperCase() + userType.type.slice(1)}
                                        </option>
                                    );
                                })}
                            </Form.Select>
                        </Form.Group>
                        <Button type="submit" className="w-100 mt-3">
                            Add
                        </Button>
                    </Form>
                    <p>{displayMessage}</p>
                </Col>
            </Row>
        </div>
    );
};

export default AddEmployee;
