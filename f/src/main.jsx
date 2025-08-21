import "./index.css"; // Tailwind styles
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import { UserProvider } from "../providers/UserProvider.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";


const clientId = process.env.VITE_GOOGLE_AUTH2_CLIENT_ID
createRoot(document.getElementById("root")).render(

  <GoogleOAuthProvider clientId={clientId}>
    <UserProvider>
      <App />
    </UserProvider>
  </GoogleOAuthProvider>

);