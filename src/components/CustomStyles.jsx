import React from "react";

const CustomStyles = () => {
  return (
    <style>{`
      /* --- Base & Theming --- */
      :root {
        --bg-dark-primary: #121212;
        --bg-dark-secondary: #1e1e1e;
        --bg-dark-tertiary: #2a2a2a;
        --text-primary: #e9ecef;
        --text-secondary: #adb5bd;
        --accent-green: #10b981;
        --accent-green-hover: #059669;
        --accent-blue: #3b82f6;
        --border-color: #374151;
      }

      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        background-color: var(--bg-dark-primary);
        color: var(--text-primary);
        overflow: hidden;
      }

      /* --- Main Layout --- */
      .app-layout {
        display: flex;
        height: 100vh;
      }

      .sidebar {
        background-color: var(--bg-dark-secondary);
        height: 100%;
        display: flex;
        flex-direction: column;
        transition: width 0.3s ease;
        border-right: 1px solid var(--border-color);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
      }
      
      .sidebar-expanded { width: 280px; }
      .sidebar-collapsed { width: 80px; }
      
      .main-content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        height: 100vh;
        transition: margin-left 0.3s ease;
      }

      .main-content-expanded { margin-left: 280px; }
      .main-content-collapsed { margin-left: 80px; }

      /* --- Sidebar Components --- */
      .sidebar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        border-bottom: 1px solid var(--border-color);
      }
      .sidebar-brand {
        font-size: 1.25rem;
        font-weight: bold;
        color: var(--accent-green);
        white-space: nowrap;
        overflow: hidden;
      }
      .sidebar-toggle-btn {
        background: none;
        border: none;
        color: var(--text-secondary);
        padding: 0.5rem;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      .sidebar-toggle-btn:hover { background-color: var(--bg-dark-tertiary); }
      
      .sidebar-body {
        padding: 1rem;
        overflow-y: auto;
        flex-grow: 1;
      }
      .sidebar-search {
        position: relative;
        margin-bottom: 1rem;
      }
      .sidebar-search .icon {
        position: absolute;
        left: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-secondary);
      }
      .sidebar-search input {
        width: 100%;
        background-color: var(--bg-dark-tertiary);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        border-radius: 0.375rem;
        padding: 0.5rem 0.75rem 0.5rem 2.5rem;
        box-sizing: border-box;
      }
      .sidebar-search input:focus {
        outline: none;
        border-color: var(--accent-green);
        box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.5);
      }
      
      .sidebar-nav-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .sidebar-nav-header {
        font-size: 0.75rem;
        color: var(--text-secondary);
        text-transform: uppercase;
        padding: 0.5rem 0.75rem;
        font-weight: 600;
      }
      .sidebar-nav-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: background-color 0.2s;
        white-space: nowrap;
        overflow: hidden;
      }
      .sidebar-nav-item:hover { background-color: var(--bg-dark-tertiary); }

      .sidebar-footer {
        padding: 1rem;
        border-top: 1px solid var(--border-color);
      }
      .new-chat-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem;
        background-color: var(--accent-green);
        color: white;
        border: none;
        border-radius: 0.375rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      .new-chat-btn:hover { background-color: var(--accent-green-hover); }

      /* --- Chat Area --- */
      .chat-header {
        padding: 1rem 1.5rem;
        background-color: var(--bg-dark-secondary);
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .chat-header h2 { margin: 0; font-size: 1.125rem; }
      .chat-header-icons { display: flex; gap: 1rem; }
      .chat-header-icons button { background: none; border: none; color: var(--text-secondary); cursor: pointer; }
      
      .chat-area {
        flex-grow: 1;
        overflow-y: auto;
        padding: 1.5rem;
      }
      .chat-container {
        max-width: 1100px;
        margin: 0 auto;
      }
      
      /* --- Messages & Prompts --- */
      .welcome-screen { text-align: center; }
      .welcome-screen h1 { font-size: 2.5rem; font-weight: bold; }
      .welcome-screen p { color: var(--text-secondary); margin: 1rem 0 3rem; }
      .prompt-suggestions {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
      }
      .prompt-card {
        background-color: var(--bg-dark-secondary);
        padding: 1.5rem;
        border-radius: 0.5rem;
        border: 1px solid var(--border-color);
        cursor: pointer;
        transition: background-color 0.2s, border-color 0.2s;
      }
      .prompt-card:hover { background-color: var(--bg-dark-tertiary); border-color: var(--accent-green); }
      .prompt-card .icon { color: var(--accent-green); margin-bottom: 0.5rem; }
      .prompt-card h3 { margin: 0 0 0.25rem; font-size: 1rem; }
      .prompt-card p { margin: 0; font-size: 0.875rem; color: var(--text-secondary); }

      .message {
        display: flex;
        align-items: start;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .message.user { flex-direction: row-reverse; }
      .message-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .message-avatar.bot { background-color: var(--accent-green); }
      .message-avatar.user { background-color: var(--accent-blue); }
      .message-content {
        background-color: var(--bg-dark-secondary);
        padding: 1rem;
        border-radius: 0.5rem;
        max-width: 70%;
      }
      .message-content p { margin: 0; }
      .message.user .message-content { background-color: var(--accent-blue); }

      .loading-indicator {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .loading-indicator .icon { animation: spin 1s linear infinite; }
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

      /* --- Chat Input --- */
      .chat-input-area {
        padding: 1.5rem;
        background-color: var(--bg-dark-secondary);
        border-top: 1px solid var(--border-color);
      }
      .chat-input-wrapper {
        max-width: 1100px;
        margin: 0 auto;
        position: relative;
      }
      .chat-input {
        width: 100%;
        background-color: var(--bg-dark-tertiary);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        border-radius: 9999px;
        padding: 0.75rem 3.5rem 0.75rem 1.5rem;
        box-sizing: border-box;
        font-size: 1rem;
      }
      .chat-input:focus {
        outline: none;
        border-color: var(--accent-green);
        box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.5);
      }
      .chat-send-btn {
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        background-color: var(--accent-green);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      .chat-send-btn:hover { background-color: var(--accent-green-hover); }
      .chat-send-btn:disabled { background-color: #555; cursor: not-allowed; }
      .input-footer-text {
        font-size: 0.75rem;
        color: var(--text-secondary);
        text-align: center;
        margin-top: 0.5rem;
      }
    `}</style>
  );
};

export default CustomStyles;
