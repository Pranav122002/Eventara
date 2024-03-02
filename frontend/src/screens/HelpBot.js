import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

function HelpBot() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [showComponent, setShowComponent] = useState(false);
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
  const handleToggleComponent = () => {
    setShowComponent(!showComponent);
  };

  return (
    <>
      <img src="./chatbot.png  " onClick={handleToggleComponent} className="z-200 w-20 h-20  fixed p-2 rounded-full shadow-md   bottom-5 right-5" alt="" />
      {showComponent && (
        <div className='fixed right-10 shadow-lg w-96 z-40 rounded-md bg-gray-300 bottom-32' style={{ display: 'flex'  , height: '70vh' }}>
          <div className="App">
            <h1 className='text-lg mt-4 ml-4'>HelpBot</h1>
            <h2 className='bg-white  ml-4 p-2 rounded-md text-lg'> {answer}</h2>
            <Form>
              <div className='flex absolute bottom-4 left-4 bg-white p-2 rounded-md'>
              <Form.Group controlId="formQuery">
               
                <Form.Control type="text" value={query} onChange={handleQueryChange} />
              </Form.Group>
              
              <img src="./send2.png  " onClick={handleFetchAnswer}className="w-10 ml-20" alt="" />
              </div>
            </Form>
            <br />
            
          </div>
        </div>
      )}
    </>


  );
}

export default HelpBot;
