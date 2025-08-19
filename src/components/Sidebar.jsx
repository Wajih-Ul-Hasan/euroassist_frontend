import React, { useState } from 'react';
import { Button, ListGroup, InputGroup, FormControl } from 'react-bootstrap';
import { FaPlus, FaCommentDots, FaSearch } from 'react-icons/fa';

const Sidebar = () => {
  const [chats] = useState([
    'Project Ideas',
    'Daily Tasks',
    'Meeting Notes',
    'Travel Plans',
    'Shopping List'
  ]);

  const [activeChat, setActiveChat] = useState('My Chat #1');

  return (
    <div className="sidebar bg-dark text-white d-flex flex-column h-100 p-3">
      {/* New Chat Button */}
      <Button variant="outline-light" className="new-chat-btn mb-3 d-flex align-items-center justify-content-center">
        <FaPlus className="me-2" />
        New Chat
      </Button>
      {/* Chat List */}
      <div className="flex-grow-1 overflow-auto">
        <ListGroup variant="flush">
          {chats.map((chat, index) => (
            <ListGroup.Item
              key={index}
              className={`chat-list-item d-flex align-items-center ${
                activeChat === chat ? 'active-chat' : ''
              }`}
              onClick={() => setActiveChat(chat)}
            >
              <FaCommentDots className="me-2 text-secondary" />
              <span className="text-truncate">{chat}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default Sidebar;
