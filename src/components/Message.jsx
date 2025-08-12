import React from 'react';

const Message = ({ message }) => {
  const { text, sender } = message;
  const isUser = sender === 'user';

  return (
    <div className={`d-flex mb-3 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}>
      <div
        className={`p-3 rounded-3 message-bubble ${isUser ? 'bg-primary text-white user-bubble' : 'bg-secondary text-white bot-bubble'}`}
        style={{ maxWidth: '75%' }}
      >
        {text}
      </div>
    </div>
  );
};

export default Message;