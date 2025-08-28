import { io } from "socket.io-client";

const socket = io({
  autoConnect: false,
  transports: ["polling", "websocket"],  // ✅ fallback safe
});

export default socket;