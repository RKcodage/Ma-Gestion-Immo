import { create } from "zustand";

// Global store to manage password visibility per field using string keys
// Example keys:
// - "login.password"
// - "signup.password"
// - "reset.new", "reset.confirm"
const usePasswordVisibilityStore = create((set, get) => ({
  vis: {},

  isVisible: (key) => Boolean(get().vis[key]),
  toggle: (key) =>
    set((state) => ({ vis: { ...state.vis, [key]: !state.vis[key] } })),
  show: (key) => set((state) => ({ vis: { ...state.vis, [key]: true } })),
  hide: (key) => set((state) => ({ vis: { ...state.vis, [key]: false } })),
  reset: (key) =>
    set((state) => {
      const next = { ...state.vis };
      delete next[key];
      return { vis: next };
    }),
  resetAll: () => set({ vis: {} }),
}));

export default usePasswordVisibilityStore;

