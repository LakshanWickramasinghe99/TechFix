import React, { useState } from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import config from "./Config";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Basic Emoji Chat Icon */}
      <button
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#3B82F6",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          zIndex: 1000,
          cursor: "pointer",
        }}
      >
        💬
      </button>

      {isOpen && (
  <div
    style={{
      position: "fixed",
      bottom: "90px",
      right: "20px",
      width: "350px", // ✅ Set proper width
      maxHeight: "500px",
      boxShadow: "0 0 15px rgba(0,0,0,0.3)",
      borderRadius: "8px",
      overflow: "hidden",
      zIndex: 1000,
    }}
  >
    <Chatbot
      config={config}
      messageParser={MessageParser}
      actionProvider={ActionProvider}
    />
  </div>
)}
    </div>
  );
};

export default ChatWidget;
