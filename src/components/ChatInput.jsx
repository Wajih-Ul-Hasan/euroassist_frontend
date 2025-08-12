// src/components/UserInput.js
import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';

const ChatInput = ({ onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="p-3 bg-dark">
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Ask about universities, fees, scholarships..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-dark text-white border-secondary"
            style={{'::placeholder': { color: '#6c757d' }}}
          />
          <Button variant="primary" type="submit">
            Send
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default ChatInput;