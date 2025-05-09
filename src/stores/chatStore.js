import { create } from "zustand";

const useChatStore = create((set) => ({
  selectedConversation: null,
  openNewConvModal: false,
  selectedUserId: "",

  setSelectedConversation: (id) => set({ selectedConversation: id }),
  setOpenNewConvModal: (value) => set({ openNewConvModal: value }),
  setSelectedUserId: (id) => set({ selectedUserId: id }),

  startConversation: () =>
    set((state) => {
      console.log("✅ Démarrage conversation avec", state.selectedUserId);
      return {
        selectedConversation: state.selectedUserId,
        openNewConvModal: false,
        selectedUserId: "",
      };
    }),
}));

export default useChatStore;
