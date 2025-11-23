import { create } from "zustand";

const useChatStore = create((set) => ({
  selectedConversation: null,
  openNewConvModal: false,
  selectedUserId: "",
  realtimeMessages: [], // Messages received by socket.io in real time

  setSelectedConversation: (id) => set({ selectedConversation: id }), // Change active conversation
  setOpenNewConvModal: (value) => set({ openNewConvModal: value }),
  setSelectedUserId: (id) => set({ selectedUserId: id }), // Set selected user in the modal

  // Start conversation with user selected
  startConversation: () =>
    set((state) => {
      console.log("Conversation started with", state.selectedUserId);
      return {
        selectedConversation: state.selectedUserId,
        openNewConvModal: false,
        selectedUserId: "",
      };
    }),

  // Add message received with socket.io in realtimeMessages array
  addRealtimeMessage: (message) =>
    set((state) => {
      const exists = state.realtimeMessages.some(
        (m) =>
          m._id === message._id ||
          (m.content === message.content &&
            m.senderId === message.senderId &&
            m.sentAt === message.sentAt),
      );
      if (exists) return {}; // Verify if message already exists (to avoid duplicated message)
      return {
        realtimeMessages: [...state.realtimeMessages, message],
      };
    }),

  // Clear messages if deconnection or conversation is changed
  clearRealtimeMessages: () => set({ realtimeMessages: [] }),
}));

export default useChatStore;
