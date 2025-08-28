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
    console.log(`✅ [Connected] Socket ID: ${socket.id}`);

    // 💾 Handle registration
    socket.on("register", ({ username, profileUrl, lat, lng }) => {
      console.log(`📥 [Register] User: ${username}, Lat: ${lat}, Lng: ${lng}`);
      addClient(socket.id, { username, profileUrl, lat, lng });

      setTimeout(() => {
        console.log(`📤 [Broadcast Clients] Total: ${getAllClients().length}`);
        io.emit("clients", getAllClients());
      }, 500); 
    });

    // 🔄 Client list request
    socket.on("getClients", () => {
      console.log(`📥 [GetClients] Request from ${socket.id}`);
      socket.emit("clients", getAllClients());
    });

    // 📍 Handle location updates
    socket.on("locationUpdate", ({ lat, lng }) => {
      if (!getClient(socket.id)) {
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
    });
  });
}