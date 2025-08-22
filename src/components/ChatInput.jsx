import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

const ChatInput = ({ onSend }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-wrapper">
      <div className="chat-input-inner">
        <textarea
          rows={1}
          placeholder="Send a message..."
          className="chat-input-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="chat-send-btn"
          onClick={handleSend}
          aria-label="Send message"
        >
          <FaPaperPlane />
        </button>
      </div>

      {/* Disclaimer text */}
      <p className="chat-input-disclaimer">EuroAssist.ai can make mistakes.</p>
    </div>
  );
};

export default ChatInput;
