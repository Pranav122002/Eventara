import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const CommitteePage = () => {
  const [committees, setCommittees] = useState([]);

  useEffect(() => {
    fetchCommittees();
  }, []);

  const fetchCommittees = async () => {
    try {
      const response = await fetch('/api/all-committees');
      const data = await response.json();
      setCommittees(data);
    } catch (error) {
      console.error('Error fetching committees:', error);
    }
  };

  return (
    <Container>
      <h1>Committees</h1>
      <Row>
        {committees.map(committee => (
          <Col key={committee._id} md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>{committee.committee_name}</Card.Title>
                <Card.Text>{committee.committee_desc}</Card.Text>
                <ul>
                  {committee.tags.map(tag => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CommitteePage;
