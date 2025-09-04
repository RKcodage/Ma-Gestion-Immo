import { create } from "zustand";

const useSidebarStore = create((set) => ({
  sidebarOpen: false, // set to false by default
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
}));

export default useSidebarStore;
