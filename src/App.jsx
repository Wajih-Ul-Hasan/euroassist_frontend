import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import ChatHeader from "./components/ChatHeader";
import "./index.css";

function App() {
  // Store chats as an object: { chatName: [messages] }
  const [chats, setChats] = useState({
    "Chat 1": [{ sender: "bot", text: "Hi! How can I help you today?" }],
  });

  const [activeChat, setActiveChat] = useState("Chat 1");

  // Handle sending messages inside active chat
  const handleSendMessage = (userMessage) => {
    if (!userMessage.trim()) return;

    setChats((prevChats) => {
      const updatedChat = [
        ...prevChats[activeChat],
        { sender: "user", text: userMessage },
      ];

      return { ...prevChats, [activeChat]: updatedChat };
    });

    // Dummy bot reply
    setTimeout(() => {
      setChats((prevChats) => {
        const updatedChat = [
          ...prevChats[activeChat],
          { sender: "bot", text: "I'm a dummy assistant 🤖" },
        ];
        return { ...prevChats, [activeChat]: updatedChat };
      });
    }, 800);
  };

  // Create new chat with dummy data
  const handleNewChat = () => {
    const newChatName = `Chat ${Object.keys(chats).length + 1}`;
    setChats({
      ...chats,
      [newChatName]: [
        { sender: "bot", text: "This is a new dummy chat 📝" },
        { sender: "user", text: "Hello new chat!" },
      ],
    });
    setActiveChat(newChatName);
  };

  return (
    <div className="app-container d-flex text-white">
      <div className="sidebar-container">
      <Sidebar
            chats={Object.keys(chats)}
            activeChat={activeChat}
            setActiveChat={setActiveChat}
            onNewChat={handleNewChat}
          />
      </div>

      <div className="chat-container d-flex flex-column">
        <ChatHeader title={activeChat} />

        <div className="chat-window flex-grow-1 overflow-auto">
          <ChatWindow messages={chats[activeChat]} />
        </div>

        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}

export default App;
