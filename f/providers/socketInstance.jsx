import { io } from "socket.io-client";

const SERVER_URL= import.meta.env.VITE_SOCKET_SERVER;
const socket = io(SERVER_URL,{
  autoConnect: false,
  transports: ["websocket"],
});

export default socket;