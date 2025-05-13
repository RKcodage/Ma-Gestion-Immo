import { io } from "socket.io-client";

// Initialize and export a socket.io instance for client side
const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:4000", {
  transports: ["websocket"],
});

export default socket;
