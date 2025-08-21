import React, { useState } from 'react';
import { FormControl, Button } from 'react-bootstrap';
import { FaPaperPlane } from 'react-icons/fa';

const ChatInput = ({ onSend }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-wrapper px-3 py-3">
      <div className="chat-input-inner mx-auto d-flex align-items-center gap-2">
        <FormControl
          as="textarea"
          rows={1}
          placeholder="Type your message..."
          className="chat-input-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button variant="success" className="chat-send-btn" onClick={handleSend}>
          <FaPaperPlane />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
