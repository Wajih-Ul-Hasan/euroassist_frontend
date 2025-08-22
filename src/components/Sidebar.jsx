import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

const Sidebar = () => {
  const [chats] = useState([
    "Project Ideas",
    "Daily Tasks",
    "Meeting Notes",
    "Travel Plans",
    "Shopping List",
  ]);

  const [activeChat, setActiveChat] = useState("Project Ideas");

  return (
    <div className="sidebar">
      {/* New Chat Button */}
      <button className="new-chat-btn d-flex align-items-center">
        <FaPlus className="me-2" />
        New Chat
      </button>

      {/* Chat List */}
      <div className="chat-list mt-2">
        {chats.map((chat, index) => (
          <button
            key={index}
            className={`chat-list-item ${
              activeChat === chat ? "active-chat" : ""
            }`}
            onClick={() => setActiveChat(chat)}
          >
            {chat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
