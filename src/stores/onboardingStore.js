import { create } from "zustand";

// Onboarding store for dashboard tour (React Joyride)
// - Keeps whether the tour is running
// - Persists whether the user has already seen the tour (localStorage)
// - Exposes actions to start/stop and mark as seen

const storageKey = "dashboardTourSeen";

const safeGet = (key, fallback) => {
  // Guard for SSR/tests environments
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const safeSet = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently ignore storage write errors
  }
};

const useOnboardingStore = create((set, get) => ({
  // Run state for Joyride
  dashboardTourRun: false,
  // Has the user already completed or skipped the tour
  dashboardTourHasSeen: safeGet(storageKey, false),

  // Start the dashboard tour (manual start from menu)
  startDashboardTour: () => set({ dashboardTourRun: true }),
  // Stop the dashboard tour (when finished or skipped)
  stopDashboardTour: () => set({ dashboardTourRun: false }),
  // Mark the tour as seen and persist it
  setDashboardTourSeen: (seen) => {
    safeSet(storageKey, seen);
    set({ dashboardTourHasSeen: seen });
  },
  // Reset helper (useful for debugging/manual replay)
  resetDashboardTour: () => {
    safeSet(storageKey, false);
    set({ dashboardTourHasSeen: false, dashboardTourRun: false });
  },
}));

export default useOnboardingStore;

