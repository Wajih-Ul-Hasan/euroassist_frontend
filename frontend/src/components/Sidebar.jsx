import React, { useState } from "react";
import {
  FaEdit,
  FaComment,
} from "react-icons/fa";

import { GoSidebarExpand, GoSidebarCollapse } from "react-icons/go";

const Sidebar = ({ chats, activeChat, setActiveChat, onNewChat, summaries = {} }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Collapse/Expand Button */}
      <button
        className="collapse-btn"
        onClick={() => setCollapsed((prev) => !prev)}
      >
        {collapsed ? <GoSidebarCollapse className="collapse-icon" /> : <GoSidebarExpand className="collapse-icon" />}
      </button>

      {/* New Chat Button */}
      <button
        className="new-chat-btn d-flex align-items-center"
        onClick={onNewChat}
      >
        <FaEdit className={!collapsed ? "icon-with-text" : ""} />
        {!collapsed && "New Chat"}
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
            title={summaries[chat] || chat}
          >
            {!collapsed && (summaries[chat] || chat)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
