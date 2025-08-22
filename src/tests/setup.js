import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest"; // matchers custom : to test DOM elements

import { create } from "zustand";

// DOM cleaning after a test
afterEach(() => {
  cleanup();
});

// Dynamic zustand mock for authStore
const useAuthStore = create(() => ({
  token: "fake-token",
  user: { role: "Propriétaire" }, // Role by default, put "Locataire" to test the tenant
}));

/* vi.mock("@/stores/authStore", () => ({
  __esModule: true,
  default: useAuthStore,
}));
 */
