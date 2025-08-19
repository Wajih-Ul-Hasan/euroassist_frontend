import React, { useState } from 'react';
import { Button, ListGroup, InputGroup, FormControl } from 'react-bootstrap';
import { FaPlus, FaCommentDots, FaSearch } from 'react-icons/fa';

const Sidebar = () => {
  const [chats] = useState([
    'My Chat #1',
    'Project Ideas',
    'Daily Tasks',
    'Meeting Notes',
    'Travel Plans',
    'Shopping List'
  ]);

  const [activeChat, setActiveChat] = useState('My Chat #1');

  return (
    <div className="bg-dark text-white p-3 d-flex flex-column h-100">
      {/* New Chat Button */}
      <Button variant="success" className="w-100 mb-3 d-flex align-items-center justify-content-center">
        <FaPlus className="me-2" />
        New Chat
      </Button>

      {/* Search Input */}
      <InputGroup className="mb-3">
        <InputGroup.Text className="bg-secondary text-white border-0">
          <FaSearch />
        </InputGroup.Text>
        <FormControl
          placeholder="Search chats"
          className="bg-dark text-white border-0"
        />
      </InputGroup>

      {/* Chat List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <ListGroup variant="flush">
          {chats.map((chat, index) => (
            <ListGroup.Item
              key={index}
              className={`bg-dark text-white border-0 d-flex align-items-center chat-item ${
                activeChat === chat ? 'active-chat' : ''
              }`}
              onClick={() => setActiveChat(chat)}
              style={{ cursor: 'pointer' }}
            >
              <FaCommentDots className="me-2 text-secondary" />
              {chat}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default Sidebar;
