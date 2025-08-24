import React from 'react';

const Message = ({ message }) => {
  const { text, sender } = message;
  const isUser = sender === "user";

  return (
    <div
      className={`d-flex mb-3 ${isUser ? "justify-content-end" : "justify-content-start"}`}
    >
      <div
        className={`message-bubble ${isUser ? "user-message" : "bot-message"}`}
        role="article"
        aria-label={`${isUser ? 'You' : 'Assistant'} message`}
      >
        {typeof text === 'object' && text !== null ? (
          <>
            <strong>{text.name || 'University'}</strong>
            <div style={{ fontSize: '0.9rem', marginTop: 6 }}>{text.country || ''} — {text.ranking || ''}</div>
            <div style={{ marginTop: 6 }}>{text.description || ''}</div>
          </>
        ) : (
          text
        )}
      </div>
    </div>
  );
};

export default Message;
