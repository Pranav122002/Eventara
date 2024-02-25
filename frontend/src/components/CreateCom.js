import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import { toast } from "react-toastify";
import Form from 'react-bootstrap/Form';
import { Container, Modal, Row, Col, Card, Button } from 'react-bootstrap';




const CommitteeForm = () => {
    const notifyA = (msg) => toast.error(msg);
    const notifyB = (msg) => toast.success(msg);
    const [myCommittees, setMyCommittees] = useState([]);

    const user = JSON.parse(localStorage.getItem('user'))
    const [formData, setFormData] = useState({
        committee_name: '',
        committee_image: getRandomImageURL(),
        committee_desc: '',
        committee_head: user._id,
        frequency: '',
        time: '',
        location: '',
        tags: [],
        budget: '',
        email: '',
        phone_number: '',
        office_location: ''
    });
    const [admins, setAdmins] = useState()

    const fetchAdmin = async () => {
        try {
            var res = await fetch(`${API_BASE_URL}/api/admins`)
            res = await res.json()
            setAdmins(res)
        } catch (err) {

        }
    }
    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        // Handle form submission (e.g., send data to backend)
        console.log(formData);
    };
    function getRandomImageURL() {
        const randomImageNumber = Math.floor(Math.random() * 1000); // Adjust as needed
        return `https://picsum.photos/200/300?random=${randomImageNumber}`;
    }

    const [showModal, setShowModal] = useState(false);
    const [selectedAdmins, setSelectedAdmins] = useState([]);

    const handleAdminCheckboxChange = (adminId, isChecked) => {
        if (isChecked) {
            setSelectedAdmins([...selectedAdmins, adminId]);
        } else {
            setSelectedAdmins(selectedAdmins.filter(id => id !== adminId));
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleModalOpen = () => {
        setShowModal(true)
    }

    const handleModalSubmit = async (e) => {
        try {
            console.log(formData)
            console.log('Selected admins:', selectedAdmins);
            e.preventDefault();
            const res = await fetch(`${API_BASE_URL}/api/create-committee`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    formData,
                    selectedAdmins
                }),
            })
            console.log(formData);
            setShowModal(false);
            if (res.status === "ok") {
                notifyB("Committee formation Request Sent")
            }
        } catch (err) {
            //failure toast
        }


    };
    const fetchMyCommittees = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/my-committees/${user._id}`)
            const data = await res.json()
            console.log(data)
            setMyCommittees(data);
        } catch (err) {
            console.error(err)
        }
    };

    const [events, setEvents] = useState();
    const [showAddEventModal, setShowAddEventModal] = useState(false);
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventTime, setEventTime] = useState("");
    const [eventVenue, setEventVenue] = useState("");
    const [eventMode, setEventMode] = useState("");
    const [allRooms, setAllRooms] = useState([])
    const [eventFormData, setEventFormData] = useState({
        event_name: '',
        event_date: '',
        event_time: '',
        event_venue: '',
        event_mode: ''
    });

    const handleEventChange = e => {
        const { name, value } = e.target;
        setEventFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        console.log(eventFormData)
    }, [eventFormData])
    const fetchAllRooms = async () => {
        try {
            var res = await fetch(`${API_BASE_URL}/api/rooms`)
            res = await res.json()
            console.log(res)
            setAllRooms(res)
        } catch (error) {
            console.log(error)
        }
    }
    const isAdmin = user.role === "admin";

    const handleAddEvent = () => {
        setShowModal(true)
        // setEvents([...events, newEvent]);
        // setShowAddEventModal(false);

    };

    const handleEventSubmit = async(e) =>{
        try {
            console.log(eventFormData)
            console.log('Selected admins:', selectedAdmins);
            e.preventDefault();
            const res = await fetch(`${API_BASE_URL}/api/create-event`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    eventFormData,
                    selectedAdmins
                }),
            })
            // console.log(eventFormData);
            setShowModal(false);
            if (res.status === "ok") {
                notifyB("Event approval Request Sent")
            }
        } catch (err) {
            //failure toast
        }

    }

    const handleDeleteEvent = (id) => {
        const updatedEvents = events.filter((event) => event.id !== id);
        setEvents(updatedEvents);
    };


    const handleCreateEvent = () => {
        setShowAddEventModal(true)
    }
    useEffect(() => {
        fetchAdmin()
        fetchMyCommittees()
        console.log(myCommittees)
    }, [])

    useEffect(() => {
        fetchAllRooms()
        console.log(allRooms)
    }, [])
    return (
        <Container>
            <h1>Create Committee</h1>
            <Form>
                <Form.Group controlId="committeeName">
                    <Form.Label>Committee Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter committee name"
                        name="committee_name"
                        value={formData.committee_name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="committeeDesc">
                    <Form.Label>Committee Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter committee description"
                        name="committee_desc"
                        value={formData.committee_desc}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                {/* Add other form fields as per your model */}

                <Button
                    variant="primary"
                    onClick={handleModalOpen}
                    className="mt-3 bg-green-500">
                    Next
                </Button>
            </Form>
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Admins for Approval</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {admins?.map(admin => (
                        <Form.Check
                            key={admin._id}
                            type="checkbox"
                            id={`admin-${admin._id}`}
                            label={admin.name}
                            checked={selectedAdmins.includes(admin._id)}
                            onChange={e => handleAdminCheckboxChange(admin._id, e.target.checked)}
                        />
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleModalSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* separate section to get all the committes that the user created */}
            <Container className='mt-3'>
                <h2  className="text-left text-2xl">My Committees</h2>
                <Row xs={1} md={2} lg={3} className="g-4">
                    {myCommittees?.map((committee, index) => (
                        <Col key={committee._id}>
                            <Card className="h-100">
                                <Card.Body>
                                    <Card.Title>{committee.committee_name}</Card.Title>
                                    <Card.Text>Status: {committee.approval_status}</Card.Text>
                                    {committee.approval_status === 'accepted' && (
                                        <><Button
                                            onClick={() => handleCreateEvent(committee._id)}>
                                            Create Event
                                        </Button>
                                            <Modal
                                                show={showAddEventModal}
                                                onHide={() => setShowAddEventModal(false)}
                                                dialogClassName="modal-dialog-centered mx-auto"
                                            >
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Add Event</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <Form>
                                                        <Form.Group controlId="eventName">
                                                            <Form.Label>Event Name</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name="event_name"
                                                                placeholder="Enter event name"
                                                                onChange={handleEventChange}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group controlId="eventDate">
                                                            <Form.Label>Event Date</Form.Label>
                                                            <Form.Control
                                                                type="date"
                                                                name='event_date'
                                                                onChange={handleEventChange}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group controlId="eventTime">
                                                            <Form.Label>Event Time</Form.Label>
                                                            <Form.Control
                                                                type="time"
                                                                name='event_time'
                                                                onChange={handleEventChange}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group controlId="eventVenue">
                                                            <Form.Label>Event Venue</Form.Label>
                                                            <Form.Control
                                                                as="select"
                                                                onChange={handleEventChange}
                                                                name='event_venue'
                                                            >
                                                                <option value="">Select Venue</option>
                                                                {allRooms.map(room => (
                                                                    <option key={room._id} value={room.room_no} >{room.room_no}</option>
                                                                ))}
                                                            </Form.Control>
                                                        </Form.Group>

                                                        <Form.Group controlId="eventMode">
                                                            <Form.Label>Event Mode</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Enter event mode"
                                                                name='event_mode'
                                                                onChange={handleEventChange}
                                                            />
                                                        </Form.Group>
                                                    </Form>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => setShowAddEventModal(false)}
                                                    >
                                                        Close
                                                    </Button>
                                                    <Button variant="primary" onClick={handleAddEvent}>
                                                        Add Event
                                                    </Button>
                                                    <Modal show={showModal} onHide={handleModalClose}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>Select Admins for Approval</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                            {admins?.map(admin => (
                                                                <Form.Check
                                                                    key={admin._id}
                                                                    type="checkbox"
                                                                    id={`admin-${admin._id}`}
                                                                    label={admin.name}
                                                                    checked={selectedAdmins.includes(admin._id)}
                                                                    onChange={e => handleAdminCheckboxChange(admin._id, e.target.checked)}
                                                                />
                                                            ))}
                                                        </Modal.Body>
                                                        <Modal.Footer>
                                                            <Button variant="secondary" onClick={handleModalClose}>
                                                                Close
                                                            </Button>
                                                            <Button variant="primary" onClick={handleEventSubmit}>
                                                                Submit
                                                            </Button>
                                                        </Modal.Footer>
                                                    </Modal>
                                                </Modal.Footer>
                                            </Modal>
                                        </>

                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </Container>
    );
};

export default CommitteeForm;
