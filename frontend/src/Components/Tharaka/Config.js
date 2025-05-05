import { createChatBotMessage } from "react-chatbot-kit";
import CustomMessage from "./CustomMessage";

const config = {
  botName: "SiteBot",
  initialMessages: [
    createChatBotMessage("Hi! Ask me anything about our website."),
  ],
  customComponents: {
    botMessage: (props) => React.createElement(CustomMessage, props),
  }
,  
  customStyles: {
    botMessageBox: {
      backgroundColor: "#3B82F6",
    },
    chatButton: {
      backgroundColor: "#3B82F6",
    },
  },
};

export default config;
