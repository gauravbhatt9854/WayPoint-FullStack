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

  // 🔁 Share location live via watchPosition
  useEffect(() => {
    let watchId;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentLocation([latitude, longitude]);
          socket.emit("locationUpdate", { lat: latitude, lng: longitude });
          console.log("📡 Live position:", latitude, longitude);
        },
        (err) => {
          console.error("❌ Geolocation error:", err.code, err.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
      );
    } else {
      console.error("❌ Geolocation is not supported");
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // 🔁 Main socket setup
  useEffect(() => {
    if (!socket) return;
    if (!socket.connected) socket.connect();

    const registerUser = () => {
      console.log("✅ Registering user...");
      socket.emit("register", {
        username: user?.name || "Anonymous",
        profileUrl: user?.picture || "",
        lat: currentLocation[0] || 0,
        lng: currentLocation[1] || 0,
      });
    };

    // 🔌 Socket connection lifecycle logging
    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket.id);
      registerUser(); // Register on first connect and reconnect
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

    // 🔄 Receive all locations
    const handleAllLocations = (data) => {
      setClients(data);

      const isPresent = data.some(
        (client) => client.username === (user?.name || "Anonymous")
      );

      if (!isPresent) {
        console.warn("⚠️ User missing from list. Re-registering...");
        registerUser();
      }
    };

    socket.on("allLocations", handleAllLocations);

    // Optional backup fetch
    const fetchClients = async () => {
      try {
        const res = await fetch(`/clients`);
        const data = await res.json();
        setClients(data);
      } catch (err) {
        console.error("Error fetching client list:", err);
      }
    };

    setTimeout(fetchClients, 3000); // Wait for initial socket events

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("reconnect_attempt");
      socket.off("reconnect");
      socket.off("reconnect_failed");
      socket.off("allLocations", handleAllLocations);
    };
  }, [user, currentLocation]);

  return (
    <SocketContext.Provider value={{ clients }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };