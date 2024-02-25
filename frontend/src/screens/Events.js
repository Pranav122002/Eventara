import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const initialEvents = [
  {
    id: 1,
    name: "Technical Symposium",
    date: "March 15, 2024",
    time: "10:00 AM - 4:00 PM",
    venue: "Auditorium",
    mode: "Offline",
  },
  {
    id: 2,
    name: "Cultural Night",
    date: "April 5, 2024",
    time: "6:00 PM - 10:00 PM",
    venue: "Open Air Theatre",
    mode: "Offline",
  },
  {
    id: 3,
    name: "Webinar on AI",
    date: "April 20, 2024",
    time: "2:00 PM - 3:00 PM",
    venue: "Online",
    mode: "Online",
  },
];

function EventList() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [events, setEvents] = useState(initialEvents);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventMode, setEventMode] = useState("");

  const isAdmin = user.role === "user";

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

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Upcoming Events</h1>
      {events.map((event) => (
        <div key={event.id} className="card mb-3">
          <div className="card-body">
            <h2 className="card-title">{event.name}</h2>
            <p className="card-text">Date: {event.date}</p>
            <p className="card-text">Time: {event.time}</p>
            <p className="card-text">Venue: {event.venue}</p>
            <p className="card-text">Mode: {event.mode}</p>
            {isAdmin && (
              <Button
                variant="danger"
                onClick={() => handleDeleteEvent(event.id)}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      ))}
      {isAdmin && (
        <div>
          <Button variant="primary" onClick={() => setShowAddEventModal(true)}>
            Add Event
          </Button>
        </div>
      )}
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
                onChange={(e) => setEventName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="eventDate">
              <Form.Label>Event Date</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event date"
                onChange={(e) => setEventDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="eventTime">
              <Form.Label>Event Time</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event time"
                onChange={(e) => setEventTime(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="eventVenue">
              <Form.Label>Event Venue</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => setEventVenue(e.target.value)}
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
                onChange={(e) => setEventMode(e.target.value)}
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
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EventList;
