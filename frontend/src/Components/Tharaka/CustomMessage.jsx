import React from "react";

const CustomMessage = ({ message }) => {
  return (
    <div style={{ margin: "10px 0", textAlign: "left" }}>
      <div
        style={{
          backgroundColor: "#3B82F6",
          color: "white",
          padding: "10px",
          borderRadius: "8px",
          display: "inline-block",
        }}
      >
        {message.message}
      </div>
    </div>
  );
};

export default CustomMessage;
