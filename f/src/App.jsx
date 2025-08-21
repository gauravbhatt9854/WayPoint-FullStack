import { lazy, useContext, useEffect, useState } from "react";
import "./App.css";
import './index.css';
import { UserContext } from "../providers/UserProvider.jsx";
import { jwtDecode } from "jwt-decode";


const Home = lazy(() => import("../components/Home"));
const LoginPage = lazy(() => import("../components/LoginPage"));

function App() { 
  const { user, setUser } = useContext(UserContext);

  // Check localStorage for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem("googleToken");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (err) {
        console.log("Invalid token, clearing localStorage");
        localStorage.removeItem("googleToken");
      }
    }
  }, []);

  if (!user) {
    return (
      <div>
        <LoginPage />
      </div>
    );
  }

  return (
    <div>
      <Home />
    </div>
  );
}

export { App };