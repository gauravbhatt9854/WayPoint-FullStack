// socketHandlers.js
import {
  addClient,
  updateLocation,
  getClient,
  deleteClient,
  getAllClients,
} from "./clients.js";

export function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // 💾 Handle registration
    socket.on("register", ({ username, profileUrl, lat, lng }) => {
      addClient(socket.id, { username, profileUrl, lat, lng });
      setTimeout(() => {
        io.emit("clients", getAllClients());
      }, 500); // 0.5 second baad
    });

    socket.on("getClients", () => {
      socket.emit("clients", getAllClients());
    });


    // 📍 Handle location updates
    socket.on("locationUpdate", ({ lat, lng }) => {
      if (!getClient(socket.id)) {
        console.warn(`⚠️ Location from unregistered user: ${socket.id}`);
        return;
      }
      updateLocation(socket.id, { lat, lng });
    });

    // 💬 Handle chat messages
    socket.on("chatMessage", (message) => {
      const sender = getClient(socket.id);
      if (!sender) {
        console.warn(`⚠️ Chat from unregistered socket: ${socket.id}`);
        return;
      }

      const chatData = {
        id: socket.id,
        username: sender.username,
        profileUrl: sender.profileUrl,
        message,
        timestamp: new Date(),
      };

      socket.broadcast.emit("newChatMessage", chatData);
    });

    // ❌ Handle disconnection
    socket.on("disconnect", () => {
      const user = getClient(socket.id);
      if (user) {
        console.log(`❌ Disconnected: ${user.username}`);
      } else {
        console.log(`❌ Unregistered user disconnected: ${socket.id}`);
      }
      deleteClient(socket.id);
    });
  });
}