import { create } from "zustand";

// Reusable submit-lock store to prevent double submissions across the app
const useSubmitLockStore = create((set, get) => ({
  locks: {},

  isLocked: (key) => Boolean(get().locks[key]),
  lock: (key) => set((state) => ({ locks: { ...state.locks, [key]: true } })),
  unlock: (key) =>
    set((state) => {
      const next = { ...state.locks };
      delete next[key];
      return { locks: next };
    }),

  // Runs fn while holding a lock for `key`. Optional minHoldMs to absorb UI lag.
  withLock: async (key, fn, minHoldMs = 0) => {
    const { isLocked, lock, unlock } = get();
    if (isLocked(key)) return;
    lock(key);
    const start = Date.now();
    try {
      return await fn();
    } finally {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, minHoldMs - elapsed);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      unlock(key);
    }
  },
}));

export default useSubmitLockStore;

