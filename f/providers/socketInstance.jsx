import { io } from "socket.io-client";

// const SERVER_URL = process.env.VITE_SOCKET_SERVER;
// const SERVER_URL = '/socket.io';
const socket = io({
// const socket = io( SERVER_URL,{
  autoConnect: false,
  transports: ["websocket"],
});

export default socket;