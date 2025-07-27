import "./index.css"; // Tailwind styles
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import { Auth0Provider } from "@auth0/auth0-react";


createRoot(document.getElementById("root")).render(
  
<Auth0Provider
  domain={process.env.VITE_DOMAIN}
  clientId={process.env.VITE_CLIENT}
  authorizationParams={{
    redirect_uri: window.location.origin,
  }}
  cacheLocation="localstorage"  // Use localStorage for persistent session
>
    <App />
</Auth0Provider>
);
