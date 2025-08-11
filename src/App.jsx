import React, { useState, useEffect } from "react";
import BootstrapLoader from "./components/BootstrapLoader";
import CustomStyles from "./components/CustomStyles";
import Sidebar from "./components/Sidebar";
import ChatHeader from "./components/ChatHeader";
import ChatArea from "./components/ChatArea";
import ChatInput from "./components/ChatInput";


const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMessages([
      {
        text: "Hello! I'm EuroAssist.ai. I can help you explore public universities across Europe. How can I assist you today?",
        sender: "bot",
      },
    ]);
  }, []);

  const getBotResponse = async (userMessage) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.text, sender: "bot" }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting. Please try again later.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = input;
      setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
      setInput("");
      getBotResponse(userMessage);
    }
  };

  const handlePromptClick = (prompt) => {
    setMessages((prev) => [...prev, { text: prompt, sender: "user" }]);
    getBotResponse(prompt);
  };

  return (
    <>
      <BootstrapLoader />
      <CustomStyles />
      <div data-bs-theme="dark">
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className={`main-content ${isSidebarOpen ? "main-content-expanded" : "main-content-collapsed"}`}>
          <ChatHeader isSidebarOpen={isSidebarOpen} />
          <ChatArea messages={messages} isLoading={isLoading} onPromptClick={handlePromptClick} />
          <ChatInput input={input} setInput={setInput} handleSend={handleSend} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
};

export default App;
