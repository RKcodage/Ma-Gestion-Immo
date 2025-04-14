import { create } from "zustand";

const useOwnerStore = create((set) => ({
  owner: null,
  setOwner: (owner) => set({ owner }),
  clearOwner: () => set({ owner: null }),
}));

export default useOwnerStore;
