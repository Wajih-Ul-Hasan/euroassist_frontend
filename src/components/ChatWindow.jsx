import React from 'react';

const ChatWindow = ({ messages }) => {
  return (
    <div className="px-4 py-3 d-flex flex-column gap-3">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`message-bubble ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
        >
          <div className="sender-label mb-1">
            {msg.sender === 'user' ? 'You' : 'Assistant'}
          </div>
          <div>{msg.text}</div>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
