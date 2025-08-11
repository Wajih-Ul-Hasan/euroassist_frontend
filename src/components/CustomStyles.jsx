import React from "react";

const CustomStyles = () => {
  return (
    <style>{`
      body {
        background-color: #f8f9fa;
      }
      .chat-container {
        height: 80vh;
        overflow-y: auto;
        padding: 1rem;
      }
      .spin {
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        100% {
          transform: rotate(360deg);
        }
    `}</style>
  );
};

export default CustomStyles;
