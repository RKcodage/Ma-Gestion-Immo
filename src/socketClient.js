// src/lib/socketClient.js
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL;

// Singleton
const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
  path: "/socket.io",
  withCredentials: false,
});

export function connectSocket(token) {
  socket.auth = { token };
  if (!socket.connected) socket.connect();
}

export function disconnectSocket() {
  if (socket.connected) socket.disconnect();
}

export function joinConversation(conversationId, cb) {
  socket.emit("join-conversation", conversationId, cb);
}

export function leaveConversation(conversationId) {
  socket.emit("leave-conversation", conversationId);
}

export function sendWsMessage({ recipientId, content, conversationId }, cb) {
  socket.emit("send-message", { recipientId, content, conversationId }, cb);
}

// Debug
socket.on("connect_error", (err) => {
  console.error("Socket connect_error:", err?.message || err);
});

export default socket;
