import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

const ChatInput = ({ onSend, disabled = false }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
  if (disabled) return;
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
          disabled={disabled}
          onKeyDown={handleKeyDown}
        />
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={disabled}
          aria-label="Send message"
        >
          {disabled ? (
            <svg className="send-spinner" viewBox="0 0 50 50" width="18" height="18" aria-hidden="true">
              <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
            </svg>
          ) : (
            <FaPaperPlane />
          )}
        </button>
      </div>

      {/* Disclaimer text */}
      <p className="chat-input-disclaimer">EuroAssist.ai can make mistakes.</p>
    </div>
  );
};

export default ChatInput;
