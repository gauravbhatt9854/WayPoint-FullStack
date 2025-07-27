import { createContext, useState } from "react";

const ChatContext = createContext(null);

const ChatProvider = ({ children }) => {
  const [isChat, setIsChat] = useState(true);
  return (
    <ChatContext.Provider value={{isChat , setIsChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export { ChatContext, ChatProvider };