import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card } from "react-bootstrap";

import { API_BASE_URL } from "../config";

const initialEvents = [
  {
    id: 1,
    name: "Ice-Breaker",
    desc: "this is national event",
    date: "March 15, 2024",
    time: "10:00 AM - 4:00 PM",
    venue: "Auditorium",
    mode: "Offline",
    imageSrc: "./event-1.jpg",
  },
  {
    id: 2,
    name: "Cultural Night",
    date: "April 5, 2024",
    time: "6:00 PM - 10:00 PM",
    venue: "Open Air Theatre",
    mode: "Offline",
    imageSrc: "./event-2.jpg",
  },
  {
    id: 3,
    name: "Webinar on AI",
    date: "April 20, 2024",
    time: "2:00 PM - 3:00 PM",
    venue: "Online",
    mode: "Online",
    imageSrc: "./event-3.jpg",
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
  const [eventImage, setEventImage] = useState(null);
  const [eventDesc, setEventDesc] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const isAdmin = user.role === "admin";
  const [committees, setCommittees] = useState([]);
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [expandedComments, setExpandedComments] = useState([]);
  const [eventComments, setEventComments] = useState({});
  const handleCommentImageClick = (id) => {
    setExpandedComments((prevExpandedComments) =>
      prevExpandedComments.includes(id)
        ? prevExpandedComments.filter((commentId) => commentId !== id)
        : [...prevExpandedComments, id]
    );

    // Initialize empty array if comments don't exist for the event
    if (!eventComments[id]) {
      setEventComments({ ...eventComments, [id]: [] });
    }
  };
  const handleReadMoreClick = (id) => {
    setExpandedEventId(id === expandedEventId ? null : id);
  };

  const handleAddEvent = () => {
    const newEvent = {
      id: events.length + 1,
      name: eventName,
      date: eventDate,
      time: eventTime,
      venue: eventVenue,
      mode: eventMode,
      imageSrc: eventImage ? URL.createObjectURL(eventImage) : null,
      desc: eventDesc,
    };
    setEvents([...events, newEvent]);
    setShowAddEventModal(false);
  };
  useEffect(() => {
    fetchCommittees();
  }, []);

  const fetchCommittees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/all-committees`);
      const data = await response.json();
      setCommittees(data);
    } catch (error) {
      console.error("Error fetching committees:", error);
    }
  };

  const handleDeleteEvent = (id) => {
    const updatedEvents = events.filter((event) => event.id !== id);
    setEvents(updatedEvents);
  };
  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  function CommentSection({ eventId, comments, onAddComment }) {
    const [newComment, setNewComment] = useState("");

    const handleAddComment = () => {
      if (newComment.trim() !== "") {
        const updatedComments = [...comments, newComment];
        onAddComment(eventId, updatedComments);
        setNewComment("");
      }
    };

    return (
      <div>
        {comments.map((comment, index) => (
          <div key={index}>{comment}</div>
        ))}
        <div>
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleAddComment}>Add Comment</button>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="containe border-0 m-0 mt-4">
        <div className="ml-[30rem]">
          <div className="w-full">
            <Form.Group className="w-4/6  mb-4" controlId="searchEvent">
              <Form.Control
                type="text"
                placeholder="Search by event name"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form.Group>
            <div className="flex justify-around ">
              <div className="w-3/6 ">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="car mb-3">
                    <div className="card-body">
                      <img
                        src={event.imageSrc}
                        className="card-i w-5/6 mx-auto"
                        alt={event.name}
                      />
                      <div className="flex ml-16 mt-2">
                        <img className="w-8" src="./send.png" alt="" />
                        <img className="w-8 ml-5 " onClick={() => handleCommentImageClick(event.id)} src="./comment.png" alt="" />
                      </div>
                      {expandedComments.includes(event.id) && (
                        <CommentSection
                          eventId={event.id}
                          comments={eventComments[event.id] || []}
                          onAddComment={(eventId, updatedComments) => {
                            setEventComments({
                              ...eventComments,
                              [eventId]: updatedComments,
                            });
                          }}
                        />
                      )}
                      <div>
                        <h2 className="text-xl text-left text-gray-600  ml-16 mt-3">
                          {event.name}
                        </h2>
                        {/* Conditionally render description, date, time, venue, and mode */}
                        {expandedEventId === event.id ? (
                          <div className="text-left ml-16">
                            <p className="c">{event.desc}</p>
                            <p className="c">Date: {event.date}</p>
                            <p className="c">Time: {event.time}</p>
                            <p className="c">Venue: {event.venue}</p>
                            <p className="c">Mode: {event.mode}</p>
                          </div>
                        ) : null}
                        <button
                          className="w-full ml-16  text-gray-500 text-left"
                          onClick={() => handleReadMoreClick(event.id)}
                        >
                          {expandedEventId === event.id
                            ? "Read Less..."
                            : "Read More..."}
                        </button>
                      </div>
                      {/* Conditionally render "Read More" button */}

                      {isAdmin && (
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                    <hr className="w-5/6 mx-auto" />  
                  </div>
                  
                ))}
              </div>
              <div className="border-l-2 mr-40 pl-10 w-60 ">
                <h1 className="text-xl font-Danc mb-10">
                  Trending committees{" "}
                </h1>
                {committees.slice(-5).map((committee) => (
                  <Col key={committee._id} md={4}>
                    <div className="mb-4">
                      <div className="flex w-[20rem]">
                        <div className="w-16">
                          <img
                            src="./images.jpg"
                            className="rounded-full"
                            alt=""
                          />
                        </div>
                        <div className="pt-3 ml-5">
                          <h1 className="text-xl">
                            {committee?.committee_name}
                          </h1>
                        </div>
                        {/* <div className="mb-3">{committee?.committee_desc}</div> */}
                        {/* <ul className="list-unstyled mb-0">
                          {committee?.tags?.map((tag, index) => (
                            <li key={index}>{tag}</li>
                          ))}
                        </ul> */}
                      </div>
                    </div>
                  </Col>
                ))}
              </div>
            </div>
          </div>
        </div>
        {isAdmin && (
          <div>
            <Button
              variant="primary"
              onClick={() => setShowAddEventModal(true)}
            >
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
              <Form.Group controlId="eventImage">
                <Form.Label>Event Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEventImage(e.target.files[0])}
                />
              </Form.Group>
              <Form.Group controlId="eventDesc">
                <Form.Label>Event Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter event Description"
                  onChange={(e) => setEventDesc(e.target.value)}
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
    </>
  );
}

export default EventList;
