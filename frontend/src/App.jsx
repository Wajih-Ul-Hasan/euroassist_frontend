import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import ChatHeader from "./components/ChatHeader";
import "./index.css";

function App() {
  // Store chats as an object: { chatName: { messages: [...], meta: {...} } }
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const fetchedRef = useRef(false);
  const [chats, setChats] = useState(() => {
    try {
      const raw = localStorage.getItem('euroassist_chats');
      return raw ? JSON.parse(raw) : { "Chat 1": { messages: [{ sender: "bot", text: "Hi! How can I help you today?" }], meta: {} } };
    } catch {
      return { "Chat 1": { messages: [{ sender: "bot", text: "Hi! How can I help you today?" }], meta: {} } };
    }
  });

  const [activeChat, setActiveChat] = useState(Object.keys(chats)[0]);
  const [isTyping, setIsTyping] = useState(false);
  // synchronous guard to avoid double-submits from rapid events
  const sendingRef = useRef(false);

  // Handle sending messages inside active chat
  const handleSendMessage = (userMessage) => {
  if (!userMessage.trim()) return;
  if (sendingRef.current) return; // already sending
  sendingRef.current = true;

    setChats((prevChats) => {
      const copy = { ...prevChats };
      copy[activeChat] = copy[activeChat] || { messages: [], meta: {} };
      copy[activeChat].messages = [
        ...copy[activeChat].messages,
        { sender: "user", text: userMessage },
      ];
      return copy;
    });

  // Send query to backend
  setIsTyping(true);
  fetch(`${API_BASE}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage, chat_id: activeChat }),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error(`Server error ${res.status}`);
          return res.json();
        })
        .then((data) => {
          // expect data.result to be the university object
          const result = data.result;
          const text = result
            ? `${result.name}  ${result.country}\n${result.description}`
            : "No information available.";

          setChats((prevChats) => {
            const copy = { ...prevChats };
            copy[activeChat] = copy[activeChat] || { messages: [], meta: {} };
            copy[activeChat].messages = [
              ...copy[activeChat].messages,
              { sender: "bot", text },
            ];
            // optionally set title from server response
            if (data?.title) copy[activeChat].meta = { ...(copy[activeChat].meta || {}), title: data.title };
            return copy;
          });
        })
        .catch((err) => {
          // fallback dummy reply
          console.error("Backend failed:", err);
          setChats((prevChats) => {
            const copy = { ...prevChats };
            copy[activeChat] = copy[activeChat] || { messages: [], meta: {} };
            copy[activeChat].messages = [
              ...copy[activeChat].messages,
              { sender: "bot", text: "I'm a dummy assistant \ud83e\udd16" },
            ];
            return copy;
          });
        })
        .finally(() => {
          sendingRef.current = false;
          setIsTyping(false);
        });
  };

  // Create new chat with dummy data
  const handleNewChat = () => {
    const newChatName = `Chat ${Object.keys(chats).length + 1}`;
    setChats((prev) => ({
      ...prev,
      [newChatName]: { messages: [
        { sender: "bot", text: "This is a new dummy chat \ud83d\udcdd" },
        { sender: "user", text: "Hello new chat!" },
      ], meta: {} }
    }));
    setActiveChat(newChatName);
  };

  // compute summaries for sidebar: prefer persisted meta.title, otherwise preview from messages
  const chatSummaries = Object.fromEntries(
    Object.entries(chats).map(([chatId, entry]) => {
      let summary = chatId;
      const meta = entry?.meta || {};
      if (meta.title) {
        summary = meta.title;
      } else if (Array.isArray(entry?.messages) && entry.messages.length > 0) {
        const userMsg = entry.messages.find((m) => m.sender === 'user');
        const pick = userMsg || entry.messages[0];
        if (pick && pick.text) {
          const t = String(pick.text).replace(/\s+/g, ' ').trim();
          summary = t.length > 40 ? t.slice(0, 37) + '...' : t;
        }
      }
      return [chatId, summary];
    })
  );

  // persist chats to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('euroassist_chats', JSON.stringify(chats));
    } catch (e) {
      console.error('Failed to persist chats', e);
    }
  }, [chats]);

  // fetch server-side titles on mount and merge into local chats meta
  useEffect(() => {
  if (fetchedRef.current) return; // skip second call in StrictMode
  fetchedRef.current = true;

  fetch(`${API_BASE}/api/chats`)
    .then((r) => r.json())
    .then((data) => {
      setChats((prev) => {
        const copy = { ...prev };
        Object.entries(data || {}).forEach(([cid, title]) => {
          if (!copy[cid]) copy[cid] = { messages: [], meta: {} };
          if (title) copy[cid].meta = { ...(copy[cid].meta || {}), title };
        });
        return copy;
      });
    })
    .catch(() => {});
}, []);

  return (
    <div className="app-container d-flex text-white">
      <div className="sidebar-container">
      <Sidebar
            chats={Object.keys(chats)}
            activeChat={activeChat}
            setActiveChat={setActiveChat}
            onNewChat={handleNewChat}
            summaries={chatSummaries}
          />
      </div>

      <div className="chat-container d-flex flex-column">
        <ChatHeader title={activeChat} />

        <div className="chat-window flex-grow-1 overflow-auto">
          <ChatWindow messages={chats[activeChat]} isTyping={isTyping} />
        </div>

        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}

export default App;
