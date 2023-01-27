import { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Filters = (props) => {
    const { artists, artist, setArtist, startDate, endDate, setDateRange } = props;
    return (
        <div>
            <Row className="mb-4">
                <Col lg="3">
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="userType" className="visually-hidden">Artist</Form.Label>
                        <Form.Select aria-label="User Types" id="userType" name="userType" value={artist} onChange={(e) => setArtist(e.target.value)}>
                            <option value="0">Filtreaza dupa Artist</option>
                            {artists.map((artist) => {
                                return (
                                    <option value={artist.id} key={artist.id}>
                                        {artist.name}
                                    </option>
                                );
                            })}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col lg="3">
                    <DatePicker
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                            setDateRange(update);
                        }}
                        isClearable={true}
                        withPortal
                        dateFormat={'dd-MM-yyyy'}
                        placeholderText={'Filtreaza dupa Data'}
                        customInput={<Form.Control />}
                    />
                </Col>
            </Row>
        </div>
    )
};

export default Filters;