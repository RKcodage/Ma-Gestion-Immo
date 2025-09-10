import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useChatStore from "@/stores/chatStore";
import useAuthStore from "@/stores/authStore";
import {
  fetchMessages,
  sendMessage,
  fetchConversations,
  markMessagesAsRead,
} from "@/api/chat";
import NewConversationModal from "../components/modals/NewConversationModal";
import socket from "../socketClient";

export default function Chat() {
  const {
    selectedConversation,
    setSelectedConversation,
    openNewConvModal,
    setOpenNewConvModal,
    realtimeMessages,
    addRealtimeMessage,
    clearRealtimeMessages,
  } = useChatStore();

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const [messageContent, setMessageContent] = useState("");
  const [sendError, setSendError] = useState(null);
  const [cooldown, setCooldown] = useState(0); 
  const messagesEndRef = useRef(null);

  

  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => fetchConversations(token),
    enabled: !!token,
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", selectedConversation],
    queryFn: () => fetchMessages(selectedConversation, token),
    enabled: !!selectedConversation && !!token,
  });

  // helpers pour détecter le rate limit & extraire Retry-After
  const isRateLimitedError = (err) =>
    err?.response?.status === 429 ||
    err?.status === 429 ||
    err?.code === 429 ||
    /rate/i.test(err?.message || "") ||
    err?.data?.error === "RATE_LIMITED";

  const getRetryAfterSeconds = (err) => {
    const headers = err?.response?.headers || {};
    const ra = headers["retry-after"] ?? headers["Retry-After"];
    if (!ra) return 10; // défaut = 10s
    const n = Number(ra);
    if (!Number.isNaN(n)) return Math.max(1, n);
    const dt = new Date(ra);
    if (!Number.isNaN(dt.getTime())) {
      const diff = Math.ceil((dt.getTime() - Date.now()) / 1000);
      return diff > 0 ? diff : 10;
    }
    return 10;
  };

  // décrémente le compte à rebours
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const sendMessageMutation = useMutation({
    mutationFn: () =>
      sendMessage(token, {
        recipientId: selectedConversation,
        content: messageContent,
      }),
    onSuccess: () => {
      setMessageContent("");
      setSendError(null);
      queryClient.invalidateQueries(["messages", selectedConversation]);
      queryClient.invalidateQueries(["conversations"]);
    },
    onError: (err) => {
      if (isRateLimitedError(err)) {
        const secs = getRetryAfterSeconds(err);
        setCooldown(secs); // ⬅️ on (ré)active le cooldown
        setSendError(`Trop de messages envoyés. Réessayez dans ${secs}s.`);
      } else {
        setSendError("Impossible d’envoyer le message. Réessayez.");
      }
      console.warn("sendMessage error:", err);
    },
  });

  const markMessagesAsReadMutation = useMutation({
    mutationFn: (userId) => markMessagesAsRead(userId, token),
    onSuccess: () => {
      queryClient.invalidateQueries(["chat-unread-count"]);
      queryClient.invalidateQueries(["conversations"]);
      queryClient.invalidateQueries(["messages", selectedConversation]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const content = messageContent.trim();
    if (!content || !selectedConversation || sendMessageMutation.isLoading || cooldown > 0) return;
    sendMessageMutation.mutate(); // envoi HTTP ; le serveur émettra "new-message"
  };

  const handleSelectConversation = (userId) => {
    setSelectedConversation(userId);
    markMessagesAsReadMutation.mutate(userId);
    clearRealtimeMessages();
  };

  // Socket listeners
  useEffect(() => {
    if (!socket || !selectedConversation || !user?._id) return;

    socket.emit("join-conversation", selectedConversation, (ack) => {
      if (ack && ack.ok === false) console.warn("join-conversation failed:", ack.error);
    });

    const handleNewMessage = (message) => {
      const msgSender =
        typeof message.senderId === "object" ? message.senderId?._id : message.senderId;
      const msgRecipient =
        typeof message.recipientId === "object" ? message.recipientId?._id : message.recipientId;

      const relevant = msgSender === selectedConversation || msgRecipient === selectedConversation;
      const isOwn = msgSender === user._id;

      if (relevant && !isOwn) addRealtimeMessage(message);
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.emit("leave-conversation", selectedConversation);
      socket.off("new-message", handleNewMessage);
    };
  }, [selectedConversation, user?._id, addRealtimeMessage]);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ block: "end" });
  }, [messages, realtimeMessages]);

  // Refresh conversations list when a new incoming message arrives (to update unread state)
  useEffect(() => {
    if (!socket || !user?._id) return;
    const handler = (message) => {
      const recipient =
        typeof message?.recipientId === "object" ? message?.recipientId?._id : message?.recipientId;
      if (recipient === user._id) {
        queryClient.invalidateQueries(["conversations"]);
      }
    };
    socket.on("new-message", handler);
    return () => socket.off("new-message", handler);
  }, [user?._id, queryClient]);

  // Avoid duplicated messages
  const merged = [...(messages || []), ...realtimeMessages];
  const seen = new Set();
  const allMessages = merged
    .filter((msg) => {
      const sid = typeof msg.senderId === "object" ? msg.senderId?._id : msg.senderId;
      const rid = typeof msg.recipientId === "object" ? msg.recipientId?._id : msg.recipientId;
      const ts = msg.sentAt;
      const key = msg._id || `${sid}-${rid}-${ts}-${msg.content}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));

  return (
    <div className="h-[calc(100vh-120px)] flex border rounded overflow-hidden">
      {/* Sidebar */}
      <aside className="w-1/3 border-r bg-white overflow-y-auto">
        <div className="h-16 p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <button
            className="text-sm text-primary hover:underline"
            onClick={() => setOpenNewConvModal(true)}
          >
            + Nouvelle conversation
          </button>
        </div>
        <ul>
          {conversationsLoading ? (
            <p className="text-sm text-gray-500 p-4">Chargement...</p>
          ) : conversations.length === 0 ? (
            <p className="text-sm text-gray-500 p-4">Aucune conversation pour le moment</p>
          ) : (
            conversations.map((conv) => {
              const peerId = conv?.user?._id;
              const last = conv?.lastMessage || null;
              const lastSenderId = typeof last?.senderId === "object" ? last?.senderId?._id : last?.senderId;
              const hasUnreadCount = typeof conv?.unreadCount === "number" && conv.unreadCount > 0;
              const isUnread =
                hasUnreadCount || (!!last && lastSenderId && lastSenderId !== user?._id && last?.isRead === false);

              return (
                <li
                  key={peerId}
                  className={`p-4 cursor-pointer border-b ${
                    selectedConversation === peerId
                      ? "bg-gray-100"
                      : isUnread
                      ? "bg-indigo-50 hover:bg-indigo-100"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleSelectConversation(peerId)}
                >
                  <div className="flex items-center justify-between">
                    <div className={`font-medium ${isUnread ? "font-semibold" : ""}`}>
                      {conv.user?.profile?.firstName} {conv.user?.profile?.lastName}
                    </div>
                    {isUnread && (
                      <span
                        className="ml-2 inline-block w-2.5 h-2.5 rounded-full bg-primary"
                        aria-label={hasUnreadCount ? `${conv.unreadCount} message(s) non lus` : "Nouveau message non lu"}
                      />
                    )}
                  </div>
                  <div className={`text-sm truncate ${isUnread ? "text-gray-800 font-medium" : "text-gray-500"}`}>
                    {last?.content ?? ""}
                  </div>
                  <div className="text-xs text-gray-400">
                    {last?.sentAt ? new Date(last.sentAt).toLocaleString() : ""}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </aside>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col bg-gray-50">
        <header className="p-4 border-b bg-white h-16 flex items-center">
          <h3 className="font-semibold">
            {selectedConversation
              ? (() => {
                  const convUser = conversations.find((c) => c.user._id === selectedConversation);
                  return convUser
                    ? `${convUser.user.profile.firstName} ${convUser.user.profile.lastName}`
                    : "Conversation inconnue";
                })()
              : "Aucune conversation sélectionnée"}
          </h3>
        </header>

        {sendError && (
          <div className="mx-4 mt-3 mb-0 text-sm text-red-600">{sendError}</div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messagesLoading ? (
            <p className="text-center text-gray-400 mt-10">Chargement...</p>
          ) : allMessages.length === 0 ? (
            <p className="text-center text-gray-400 mt-10">Aucun message</p>
          ) : (
            <>
              {allMessages.map((msg) => {
                const senderId =
                  typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;
                const isOwn = senderId === user._id;

                return (
                  <div
                    key={
                      msg._id ||
                      `${senderId}-${
                        typeof msg.recipientId === "object" ? msg.recipientId._id : msg.recipientId
                      }-${msg.sentAt}-${msg.content}`
                    }
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`text-sm p-2 rounded shadow max-w-[70%] ${
                        isOwn ? "bg-blue-100" : "bg-white"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {selectedConversation && (
          <form className="p-4 border-t bg-white flex gap-2" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Écrire un message..."
              className="flex-1 border px-4 py-2 rounded"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              disabled={sendMessageMutation.isLoading || cooldown > 0}
            />
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 disabled:opacity-60"
              disabled={
                sendMessageMutation.isLoading || cooldown > 0 || !messageContent.trim()
              }
              aria-disabled={sendMessageMutation.isLoading || cooldown > 0}
              title={cooldown > 0 ? `Patientez ${cooldown}s` : "Envoyer"}
            >
              {sendMessageMutation.isLoading
                ? "Envoi..."
                : cooldown > 0
                ? `Patientez ${cooldown}s`
                : "Envoyer"}
            </button>
          </form>
        )}
      </main>

      <NewConversationModal />
    </div>
  );
}
