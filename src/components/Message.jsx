import React from "react";
import { User, Bot } from "lucide-react";

const Message = ({ text, sender }) => {
  const isUser = sender === "user";
  return (
    <div
      className={`d-flex mb-3 ${
        isUser ? "justify-content-end" : "justify-content-start"
      }`}
    >
      <div
        className={`d-flex align-items-center ${
          isUser ? "bg-primary text-white" : "bg-light text-dark"
        } p-2 rounded`}
        style={{ maxWidth: "70%" }}
      >
        {isUser ? (
          <User size={20} className="me-2" />
        ) : (
          <Bot size={20} className="me-2" />
        )}
        <span>{text}</span>
      </div>
    </div>
  );
};

export default Message;
