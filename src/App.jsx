import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import ChatHeader from './components/ChatHeader'; // ✅ Import your header
import './index.css';

function App() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! How can I help you today?' }
  ]);

  const handleSendMessage = (userMessage) => {
    if (!userMessage.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot', text: "I'm a dummy assistant 🤖" }]);
    }, 800);
  };

  return (
    <div className="app-container d-flex bg-black text-white">
      <div className="sidebar-container">
        <Sidebar />
      </div>

      <div className="chat-container d-flex flex-column">
        <ChatHeader /> {/* ✅ Place your header here */}

        <div className="chat-window flex-grow-1 overflow-auto">
          <ChatWindow messages={messages} />
        </div>

        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}

export default App;
