import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ButtonGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { toast } from "react-toastify";


import { API_BASE_URL } from '../config';

const CommitteePage = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const [committees, setCommittees] = useState([]);
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);
  
  const handleSubscribe = async (committee_id) => {
    try {
      // Send subscription request
      const res = await fetch(`${API_BASE_URL}/api/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user._id,
          committee_id: committee_id
        })
      });

      if (res.ok) {
        const data = await res.json();
        notifyB("Subscribed!");
      } else {
        const errorData = await res.json();
        notifyA(errorData.message);
      }
    } catch (error) {
      // Notify user of subscription error
      notifyA("An error occurred while subscribing");
      console.error("Subscription error:", error);
    }
  };

  const handleEvents = () => {

  }
  const handleBecomeMember = () => {

  }
  const handleChat = () => {

  }
  useEffect(() => {
    fetchCommittees();
  }, []);

  const fetchCommittees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/all-committees`);
      const data = await response.json();
      setCommittees(data);
    } catch (error) {
      console.error('Error fetching committees:', error);
    }
  };

  return (
    <Container>
      <h1 className="mt-4 mb-4">Committees</h1>
      <Row>
        {committees.map(committee => (
          <Col key={committee._id} md={4}>
            <Card className="mb-4 shadow">
              <Card.Body>
                <Card.Title className="mb-2">{committee?.committee_name}</Card.Title>
                <Card.Text className="mb-3">{committee?.committee_desc}</Card.Text>
                <ul className="list-unstyled mb-0">
                  {committee?.tags?.map((tag, index) => (
                    <li key={index}>{tag}</li>
                  ))}
                </ul>
                <ButtonGroup className="d-flex justify-content-between">
                  <Button onClick={()=>handleSubscribe(committee._id)}>Subscribe</Button>
                  <Button onClick={(()=>handleEvents(committee._id))}>Events</Button>
                  <Button onClick={handleBecomeMember}>Become Member</Button>
                  <Button onClick={handleChat}>Chat</Button>
                </ButtonGroup>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CommitteePage;
