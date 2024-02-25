import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { toast } from "react-toastify";
import Form from "react-bootstrap/Form";
import { Container, Modal, Row, Col, Card, Button } from "react-bootstrap";

const CommitteeForm = () => {
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);
  const [myCommittees, setMyCommittees] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    committee_name: "",
    committee_image: getRandomImageURL(),
    committee_desc: "",
    committee_head: user._id,
    frequency: "",
    time: "",
    location: "",
    tags: [],
    budget: "",
    email: "",
    phone_number: "",
    office_location: "",
  });
  const [admins, setAdmins] = useState();

  const fetchAdmin = async () => {
    try {
      var res = await fetch(`${API_BASE_URL}/api/admins`);
      res = await res.json();
      setAdmins(res);
    } catch (err) {}
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
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
      setSelectedAdmins(selectedAdmins.filter((id) => id !== adminId));
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalSubmit = async (e) => {
    try {
      console.log(formData);
      console.log("Selected admins:", selectedAdmins);
      e.preventDefault();
      const res = await fetch(`${API_BASE_URL}/api/create-committee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          selectedAdmins,
        }),
      });
      console.log(formData);
      setShowModal(false);
      if (res.status === "ok") {
        // Success toast
      }
    } catch (err) {
      //failure toast
    }
  };
  const fetchMyCommittees = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/my-committees/${user._id}`);
      const data = await res.json();
      console.log(data);
      setMyCommittees(data);
    } catch (err) {
      console.error(err);
    }
  };

  const [events, setEvents] = useState();
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventMode, setEventMode] = useState("");

  const isAdmin = user.role === "admin";

  const handleAddEvent = () => {
    const newEvent = {
      id: events.length + 1,
      name: eventName,
      date: eventDate,
      time: eventTime,
      venue: eventVenue,
      mode: eventMode,
    };
    setEvents([...events, newEvent]);
    setShowAddEventModal(false);
  };

  const handleDeleteEvent = (id) => {
    const updatedEvents = events.filter((event) => event.id !== id);
    setEvents(updatedEvents);
  };

  const handleCreateEvent = () => {
    setShowAddEventModal(true);
  };
  useEffect(() => {
    fetchAdmin();
    fetchMyCommittees();
    console.log(myCommittees);
  }, []);
  return (
    <>
      <div className="ml-[23rem]">
        <Container>
          <h1 className="text-2xl text-left mt-10">Create Committee</h1>
          <Form>
            <Form.Group controlId="committeeName">
              <Form.Label className="text-left w-full">Committee Name</Form.Label>
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
              <Form.Label className="text-left w-full mt-4">Committee Description</Form.Label>
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
              className="mt-3 bg-green-500"
            >
              Create
            </Button>
          </Form>
          <Modal show={showModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Select Admins for Approval</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {admins?.map((admin) => (
                <Form.Check
                  key={admin._id}
                  type="checkbox"
                  id={`admin-${admin._id}`}
                  label={admin.name}
                  checked={selectedAdmins.includes(admin._id)}
                  onChange={(e) =>
                    handleAdminCheckboxChange(admin._id, e.target.checked)
                  }
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
          <Container className="mt-3">
            <h2 className="text-left text-2xl">My Committees</h2>
            <Row xs={1} md={2} lg={3} className="g-4">
              {myCommittees?.map((committee, index) => (
                <Col key={committee._id}>
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>{committee.committee_name}</Card.Title>
                      <Card.Text>Status: {committee.approval_status}</Card.Text>
                      {committee.approval_status === "accepted" && (
                        <>
                          <Button
                            onClick={() => handleCreateEvent(committee._id)}
                          >
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
                                    placeholder="Enter event name"
                                    onChange={(e) =>
                                      setEventName(e.target.value)
                                    }
                                  />
                                </Form.Group>
                                <Form.Group controlId="eventDate">
                                  <Form.Label>Event Date</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter event date"
                                    onChange={(e) =>
                                      setEventDate(e.target.value)
                                    }
                                  />
                                </Form.Group>
                                <Form.Group controlId="eventTime">
                                  <Form.Label>Event Time</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter event time"
                                    onChange={(e) =>
                                      setEventTime(e.target.value)
                                    }
                                  />
                                </Form.Group>
                                <Form.Group controlId="eventVenue">
                                  <Form.Label>Event Venue</Form.Label>
                                  <Form.Control
                                    as="select"
                                    onChange={(e) =>
                                      setEventVenue(e.target.value)
                                    }
                                  >
                                    <option value="">Select Venue</option>

                                    <option value="Room 101">Room 101</option>
                                    <option value="Room 103">Room 103</option>
                                    <option value="Room 104">Room 104</option>
                                    <option value="Room 105">Room 105</option>
                                    <option value="Room 201">Room 201</option>
                                    <option value="Room 205">Room 205</option>
                                    <option value="Room 304">Room 304</option>
                                    <option value="Room 305">Room 305</option>
                                    <option value="Room 401">Room 401</option>
                                    <option value="Room 403">Room 403</option>
                                    <option value="Room 404">Room 404</option>
                                    <option value="Room 405">Room 405</option>
                                  </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="eventMode">
                                  <Form.Label>Event Mode</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter event mode"
                                    onChange={(e) =>
                                      setEventMode(e.target.value)
                                    }
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
                              <Button
                                variant="primary"
                                onClick={handleAddEvent}
                              >
                                Add Event
                              </Button>
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
      </div>
    </>
  );
};

export default CommitteeForm;
