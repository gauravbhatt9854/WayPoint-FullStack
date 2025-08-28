import { useState, createContext, useEffect, useContext, useRef } from "react";
import socket from "./socketInstance";
import { UserContext } from "./UserProvider";

const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [clients, setClients] = useState([]);
  const [currentLocation, setCurrentLocation] = useState([0, 0]);
  const intervalRef = useRef(null);

  // ---------------- Live location tracking ----------------
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => setCurrentLocation([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // ---------------- Socket connection ----------------
  useEffect(() => {
    if (!user) {
      if (socket.connected) socket.disconnect();
      return;
    }

    console.log("🔌 Connecting socket...");
    socket.connect();

    const registerUser = () => {
      socket.emit("register", {
        username: user.name || "Anonymous",
        profileUrl: user.picture || "",
        lat: currentLocation[0],
        lng: currentLocation[1],
      });
    };

    // socket events
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      registerUser();
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected:", reason);
    });

    socket.on("clients", (data) => {
      setClients(data);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("clients");
    };
  }, [user]); // 🔑 location change hone par bhi re-register

  // ---------------- Emit location every 10 seconds ----------------
  useEffect(() => {
    if (!user || !socket.connected) return;

    const id = setInterval(() => {
      socket.emit("locationUpdate", {
        lat: currentLocation[0],
        lng: currentLocation[1],
      });
    }, 10000);

    return () => clearInterval(id);
  }, [currentLocation, user]);

  return (
    <SocketContext.Provider value={{ clients, currentLocation }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
