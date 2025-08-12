// src/App.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ChatHeader from './components/ChatHeader';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import './index.css';

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        text: 'Hello! How can I help you with European universities today?',
        sender: 'bot'
      }
    ]);
  }, []);

  const handleSendMessage = (text) => {
    const newUserMessage = { text, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);

    setTimeout(() => {
      const botResponse = {
        text: `You asked about "${text}". I am searching for information...`,
        sender: 'bot'
      };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    }, 1000);
  };

  return (
    <div className="app-wrapper">
      <ChatHeader />
      <Container fluid className="main-content">
        <Row className="h-100">
          {/* Sidebar Column */}
          <Col md={4} lg={3} className="d-none d-md-block p-0">
            <Sidebar />
          </Col>

          {/* Chat Column */}
          <Col md={8} lg={9} className="p-0 d-flex flex-column chat-container">
            <ChatWindow messages={messages} />
            <ChatInput onSendMessage={handleSendMessage} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;