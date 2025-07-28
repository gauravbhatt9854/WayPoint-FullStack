import {
  useState,
  createContext,
  useEffect,
  useCallback,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import socket from "./socketInstance";

const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const { user } = useAuth0();
  const [clients, setClients] = useState([]);
  const [currentLocation, setCurrentLocation] = useState([0, 0]);

  const shareLocation = useCallback(() => {
    if (!navigator.geolocation || !socket) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCurrentLocation(() => [lat, lng]);
        socket.emit("locationUpdate", { lat, lng });
        console.log("Geolocation : :", currentLocation);
      },
      (err) => {
        console.error("Geolocation error in socket page:", err);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);


  useEffect(() => {
    if (!socket) return;

    if (!socket.connected) {
      socket.connect();
    }

    const registerUser = () => {
      console.log("✅ Registering user...");
      socket.emit("register", {
        username: user.name || "Anonymous",
        profileUrl: user.picture || "",
        lat: currentLocation[0] || 0,
        lng: currentLocation[1] || 0,
      });
    };

    // 🔁 Lifecycle event logging
    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket.id);
      registerUser(); // Register on reconnect too
    });

    socket.on("disconnect", (reason) => {
      console.warn("❌ Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("❗ Connection error:", err.message);
    });

    socket.on("reconnect_attempt", (attempt) => {
      console.log(`🔄 Reconnect attempt #${attempt}`);
    });

    socket.on("reconnect", (attempt) => {
      console.log(`✅ Reconnected after ${attempt} tries`);
    });

    socket.on("reconnect_failed", () => {
      console.error("❌ Reconnect failed");
    });

    const handleAllLocations = (data) => {
      setClients(() => data);
    };

    socket.on("allLocations", handleAllLocations);

    const fetchClients = async () => {
      try {
        const res = await fetch(`/clients`);
        const data = await res.json();
        setClients(() => data);
      } catch (err) {
        console.error("Error fetching client list:", err);
      }
    };

    setTimeout(fetchClients, 3000);
    setTimeout(shareLocation , 1000);


    const interval = setInterval(() => {
      if (user) shareLocation();
    }, 30 * 1000);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("reconnect_attempt");
      socket.off("reconnect");
      socket.off("reconnect_failed");
      socket.off("allLocations", handleAllLocations);
      clearInterval(interval);
    };
  }, []);



  return (
    <SocketContext.Provider value={{ clients }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };