import React, { useState } from "react";
import { Send } from "lucide-react";

const ChatInput = ({ onSend }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="d-flex border-top p-2 bg-white"
    >
      <input
        type="text"
        className="form-control me-2"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="btn btn-primary" type="submit">
        <Send size={20} />
      </button>
    </form>
  );
};

export default ChatInput;
