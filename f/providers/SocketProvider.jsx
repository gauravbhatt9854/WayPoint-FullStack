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
  const { user, isAuthenticated } = useAuth0();
  const [clients, setClients] = useState([]);
  const [currentLocation, setCurrentLocation] = useState([]);

  // Shared timestamp for throttling location updates

  const shareLocation = useCallback(() => {
    if (!navigator.geolocation || !socket) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCurrentLocation((pre)=> [lat , lng]);
        socket.emit("locationUpdate", { lat, lng });
      },
      (err) => {
        console.error("Geolocation error in socket page:", err);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("register", {
      username: user.name || "Anonymous",
      profileUrl: user.picture || "",
      lat: 0,
      lng: 0,
    });

    console.log("user register successfully");


    // Delay fetching full client list
    const fetchClients = async () => {
      try {

        const res = await fetch(`/clients`);
        const data = await res.json(); // ✅ PARSE JSON
        console.log(data);
        setClients(() => data);        // ✅ UPDATE STATE
      } catch (err) {
        console.error("Error fetching client list:", err);
      }
    };

    setTimeout(fetchClients, 3000);
    setTimeout(shareLocation, 1000);


    // Receive updates from all clients
    const handleAllLocations = (data) => {
      setClients(() => data);

      // Check if current user is missing
      const isPresent = data.some(
        (client) => client.username === (user?.name || "Anonymous")
      );

      if (!isPresent) {
        console.warn("⚠️ User not found in client list, re-registering...");
        socket.emit("register", {
          username: user.name || "Anonymous",
          profileUrl: user.picture || "",
          lat: currentLocation[0],
          lng: currentLocation[1],
        });
      }
    };


    socket.on("allLocations", handleAllLocations);

    // Location update every 60 seconds
    const interval = setInterval(() => {
      if (user) shareLocation();
    }, 30 * 1000);

    return () => {
      socket.off("allLocations", handleAllLocations);
      socket.disconnect(); // optional: can skip this if you want socket to persist across routes
      clearInterval(interval);
    };
  }, [socket, isAuthenticated, user]);

  return (
    <SocketContext.Provider
      value={{
        clients
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
