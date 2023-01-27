import { useState, useEffect } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const UpdateEmployee = (props) => {
    const [userTypes, setUserTypes] = useState([]);
    const [userRoles, setUserRoles] = useState([]);
    const [displayMessage, setDisplayMessage] = useState('');
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contractStartDate: null,
        contractEndDate: null,
        userType: 0,
    });
    const [selectedUserID, setSelectedUserID] = useState(0);
    const [users, setUsers] = useState([]);
    const [disabledInputs, setDisabledInputs] = useState(true);

    useEffect(() => {
        getUserTypes();
        getUserRoles();
        getUsers();
    }, []);

    useEffect(() => {
        if (selectedUserID != 0) {
            getUser(selectedUserID);
            setDisabledInputs(false);
        } else {
            setUserData({
                firstName: '',
                lastName: '',
                email: '',
                contractStartDate: null,
                contractEndDate: null,
                userType: 0,
                userRole: 0,
            });
            setDisabledInputs(true);
        }
    }, [selectedUserID]);

    useEffect(() => {
        console.log(userData);
    }, [userData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setDisplayMessage('');

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: JSON.parse(localStorage.getItem('authToken')),
            },
            body: JSON.stringify(userData),
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/updateuser`, requestOptions);
        const result = await response.json();

        if (result.message) {
            setDisplayMessage(result.message);
        }
    };

    const getUser = async () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: JSON.parse(localStorage.getItem('authToken')),
            },
            body: JSON.stringify({ userID: selectedUserID }),
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/getuser`, requestOptions);
        const result = await response.json();

        if (result.userData) {
            if (result.userData.contractStartDate) {
                result.userData.contractStartDate = new Date(result.userData.contractStartDate);
            }
            console.log('userDate', result.userData.contractStartDate);
            setUserData(result.userData);
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

    return (
        <div>
            <h1>Update Employee</h1>
            <Row>
                <Col lg={{ span: 4 }}>
                    <Form.Group className="mb-3 mt-3 pb-3 border-bottom">
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
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="firstName">First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                disabled={disabledInputs}
                                value={userData.firstName}
                                onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="lastName">Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                disabled={disabledInputs}
                                value={userData.lastName}
                                onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="email">Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                disabled={disabledInputs}
                                value={userData.email}
                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="contractStartDate">Contract Start Date</Form.Label>
                            <DatePicker
                                dateFormat={'dd-MM-yyyy'}
                                id="contractStartDate"
                                name="contractStartDate"
                                selected={userData.contractStartDate}
                                onChange={(date) => setUserData({ ...userData, contractStartDate: date })}
                                disabled={disabledInputs}
                                customInput={<Form.Control />}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="contractEndDate">Contract End Date</Form.Label>
                            <DatePicker
                                dateFormat={'dd-MM-yyyy'}
                                id="contractEndDate"
                                name="contractEndDate"
                                selected={userData.contractEndDate}
                                onChange={(date) => setUserData({ ...userData, contractEndDate: date })}
                                disabled={disabledInputs}
                                customInput={<Form.Control />}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="userType">User Role</Form.Label>
                            <Form.Select
                                aria-label="User Roles"
                                id="userRole"
                                name="userRole"
                                disabled={disabledInputs}
                                value={userData.userRole}
                                onChange={(e) => setUserData({ ...userData, userRole: e.target.value })}
                            >
                                <option value="0">Select User Type</option>
                                {userRoles.map((userRole) => {
                                    return (
                                        <option value={userRole.id} key={userRole.id}>
                                            {userRole.role.charAt(0).toUpperCase() + userRole.role.slice(1)}
                                        </option>
                                    );
                                })}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="userType">User Type</Form.Label>
                            <Form.Select
                                aria-label="User Types"
                                id="userType"
                                name="userType"
                                disabled={disabledInputs}
                                value={userData.userType}
                                onChange={(e) => setUserData({ ...userData, userType: e.target.value })}
                            >
                                <option value="0">Select User Type</option>
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
                            Update
                        </Button>
                    </Form>
                    <p>{displayMessage}</p>
                </Col>
            </Row>
        </div>
    );
};

export default UpdateEmployee;
