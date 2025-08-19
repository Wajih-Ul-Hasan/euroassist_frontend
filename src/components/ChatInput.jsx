import React, { useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

const ChatInput = ({ onSend }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chat-input p-3 border-top bg-dark">
      <InputGroup>
        <FormControl
          placeholder="Type your message..."
          className="bg-dark text-white border-secondary"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button variant="success" onClick={handleSend}>→</Button>
      </InputGroup>
    </div>
  );
};

export default ChatInput;
