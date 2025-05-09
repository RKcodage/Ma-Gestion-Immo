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

export default function Chat() {
  const {
    selectedConversation,
    setSelectedConversation,
    openNewConvModal,
    setOpenNewConvModal,
  } = useChatStore();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const [messageContent, setMessageContent] = useState("");
  const messagesEndRef = useRef(null);

  const { data: conversations = [], isLoading: conversationsLoading } =
    useQuery({
      queryKey: ["conversations"],
      queryFn: () => fetchConversations(token),
      enabled: !!token,
    });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", selectedConversation],
    queryFn: () => fetchMessages(selectedConversation, token),
    enabled: !!selectedConversation && !!token,
  });

  const sendMessageMutation = useMutation({
    mutationFn: () =>
      sendMessage(token, {
        recipientId: selectedConversation,
        content: messageContent,
      }),
    onSuccess: () => {
      setMessageContent("");
      queryClient.invalidateQueries(["messages", selectedConversation]);
      queryClient.invalidateQueries(["conversations"]);
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
    if (messageContent.trim()) {
      sendMessageMutation.mutate();
    }
  };

  const handleSelectConversation = (userId) => {
    setSelectedConversation(userId);
    markMessagesAsReadMutation.mutate(userId);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ block: "end" });
    }
  }, [messages]);

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
            conversations.map((conv) => (
              <li
                key={conv.user._id}
                className={`p-4 cursor-pointer border-b ${
                  selectedConversation === conv.user._id ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
                onClick={() => handleSelectConversation(conv.user._id)}
              >
                <div className="font-medium">
                  {conv.user.profile.firstName} {conv.user.profile.lastName}
                </div>
                <div className="text-sm text-gray-500 truncate">{conv.lastMessage.content}</div>
                <div className="text-xs text-gray-400">
                  {new Date(conv.lastMessage.sentAt).toLocaleString()}
                </div>
              </li>
            ))
          )}
        </ul>
      </aside>

      {/* Zone principale */}
      <main className="flex-1 flex flex-col bg-gray-50">
        <header className="p-4 border-b bg-white h-16 flex items-center">
          <h3 className="font-semibold">
            {selectedConversation ? (() => {
              const convUser = conversations.find(
                (conv) => conv.user._id === selectedConversation
              );
              return convUser
                ? `${convUser.user.profile.firstName} ${convUser.user.profile.lastName}`
                : "Conversation inconnue";
            })() : "Aucune conversation sélectionnée"}
          </h3>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messagesLoading ? (
            <p className="text-center text-gray-400 mt-10">Chargement...</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-gray-400 mt-10">Aucun message</p>
          ) : (
            <>
              {messages.map((msg) => {
                const isOwn = msg.senderId._id === user._id;
                return (
                  <div
                    key={msg._id}
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
          <form
            className="p-4 border-t bg-white flex gap-2"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Écrire un message..."
              className="flex-1 border px-4 py-2 rounded"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            />
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
            >
              Envoyer
            </button>
          </form>
        )}
      </main>

      <NewConversationModal />
    </div>
  );
}
