import React, { useEffect, useRef } from "react";
import Message from "./Message";

const ChatWindow = ({ messages = [], isTyping = false }) => {
  const containerRef = useRef(null);

  // Support both array and { messages: [...] } shapes coming from different app copies
  const messageList = Array.isArray(messages)
    ? messages
    : messages && Array.isArray(messages.messages)
    ? messages.messages
    : [];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div
      ref={containerRef}
      className="chat-window"
      role="log"
      aria-live="polite"
      aria-relevant="additions text"
    >
      {messageList.map((msg, idx) => (
        <Message key={idx} message={msg} />
      ))}

      {isTyping && (
        <div className={`message-bubble bot-message`} aria-hidden={false}>
          <em>EuroAssist is typing...
          </em>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
