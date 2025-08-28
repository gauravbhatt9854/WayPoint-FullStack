// socketHandlers.js
import {
  addClient,
  updateLocation,
  getClient,
  deleteClient,
  getAllClients,
} from "./clients.js";

export function registerSocketHandlers(io) {
  let broadcastInterval = null;

  const startBroadcastInterval = () => {
    if (!broadcastInterval && getAllClients().length >= 2) {
      broadcastInterval = setInterval(() => {
        const clients = getAllClients();
        if (clients.length >= 2) {
          console.log(`📤 [Interval Broadcast] Clients: ${clients.length}`);
          io.emit("clients", clients);
        } else {
          clearInterval(broadcastInterval);
          broadcastInterval = null;
        }
      }, 5000); // har 5 second me broadcast
    }
  };

  io.on("connection", (socket) => {
    console.log(`✅ [Connected] Socket ID: ${socket.id}`);

    // 💾 Handle registration
    socket.on("register", ({ username, profileUrl, lat, lng }) => {
      console.log(`📥 [Register] User: ${username}, Lat: ${lat}, Lng: ${lng}`);
      addClient(socket.id, { username, profileUrl, lat, lng });

      // initial broadcast after 0.5 sec
      setTimeout(() => {
        console.log(`📤 [Initial Broadcast] Clients: ${getAllClients().length}`);
        socket.emit("clients", getAllClients());
      }, 500);

      startBroadcastInterval(); // interval start kare agar >=2 clients
    });

    // 📍 Handle location updates
    socket.on("locationUpdate", ({ lat, lng }) => {
      const client = getClient(socket.id);
      if (!client) {
        console.warn(`⚠️ [LocationUpdate] Unregistered user: ${socket.id}`);
        return;
      }
      console.log(`📍 [LocationUpdate] ${socket.id} -> Lat: ${lat}, Lng: ${lng}`);
      updateLocation(socket.id, { lat, lng });
    });

    // 💬 Handle chat messages
    socket.on("chatMessage", (message) => {
      const sender = getClient(socket.id);
      if (!sender) {
        console.warn(`⚠️ [Chat] Unregistered socket: ${socket.id}`);
        return;
      }
      const chatData = {
        id: socket.id,
        username: sender.username,
        profileUrl: sender.profileUrl,
        message,
        timestamp: new Date(),
      };
      console.log(`💬 [ChatMessage] ${sender.username}: ${message}`);
      socket.broadcast.emit("newChatMessage", chatData);
    });

    // ❌ Handle disconnection
    socket.on("disconnect", () => {
      const user = getClient(socket.id);
      if (user) {
        console.log(`❌ [Disconnected] User: ${user.username}, Socket: ${socket.id}`);
      } else {
        console.log(`❌ [Disconnected] Unregistered socket: ${socket.id}`);
      }
      deleteClient(socket.id);

      // stop interval if clients < 2
      if (getAllClients().length < 2 && broadcastInterval) {
        clearInterval(broadcastInterval);
        broadcastInterval = null;
      }
    });
  });
}