import { createContext, useState } from "react";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = () => {
    localStorage.removeItem("googleToken"); // remove persisted token
    setUser(null); // remove user from context
    
  };
    return (
        <UserContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser , isLoading , setIsLoading , handleLogout }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };