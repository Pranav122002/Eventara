import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

function HelpBot() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleFetchAnswer = async () => {
    try {
      const response = await axios.post('http://localhost:8000/qa', { query });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error('Error fetching answer:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div className="App">
      <h1>HelpBot</h1>
      <Form>
        <Form.Group controlId="formQuery">
          <Form.Label>Query:</Form.Label>
          <Form.Control type="text" value={query} onChange={handleQueryChange} />
        </Form.Group>
        <Button variant="primary" onClick={handleFetchAnswer}>Get Answer</Button>
      </Form>
      <br />
      <h2>Answer: {answer}</h2>
    </div>
  </div>
  );
}

export default HelpBot;
