import React from 'react';

const Message = ({ message }) => {
  const { text, sender } = message;
  const isUser = sender === 'user';

  return (
    <div className={`d-flex mb-3 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}>
      <div
        className={`message-bubble ${isUser ? 'user-message' : 'bot-message'}`}
      >
        {text}
      </div>
    </div>
  );
};

export default Message;
