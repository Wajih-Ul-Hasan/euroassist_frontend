import React, { useRef, useEffect } from 'react';
import Message from './Message';

const ChatWindow = ({ messages }) => {
  const endOfMessagesRef = useRef(null);

  // Automatically scroll to the latest message
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-window flex-grow-1 p-3" style={{ overflowY: 'auto' }}>
      {messages.map((msg, index) => (
        <Message key={index} message={msg} />
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatWindow;