import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { API_BASE_URL } from '../config';

const CommitteePage = () => {
  const [committees, setCommittees] = useState([]);

  const handleSubscribe = ()=>{

  }
  const handleEvents = ()=>{
    
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
                <Button onClick={handleSubscribe}>Subscribe</Button>
                <Button onClick={handleEvents}>Events</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CommitteePage;
