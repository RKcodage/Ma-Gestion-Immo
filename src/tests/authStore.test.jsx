// src/tests/authStore.test.jsx
import { describe, it, expect, beforeEach } from "vitest";
import useAuthStore from "@/stores/authStore";

describe("authStore", () => {
  beforeEach(() => {
    // Reset le store avant chaque test
    useAuthStore.setState({ user: null, token: null, error: null });
    localStorage.clear();
  });

  it("met à jour l'utilisateur avec setUser", () => {
    const userMock = { email: "rayan@email.com" };

    const store = useAuthStore.getState();
    store.setUser(userMock);

    expect(useAuthStore.getState().user).toEqual(userMock);
    expect(localStorage.getItem("user")).toBe(JSON.stringify(userMock));
  });

  it("reset tout avec logout", () => {
    // On initialise un user et token
    useAuthStore.setState({
      user: { email: "rayan@email.com" },
      token: "abcd1234",
    });
    localStorage.setItem("user", JSON.stringify({ email: "rayan@email.com" }));
    localStorage.setItem("token", "abcd1234");

    const store = useAuthStore.getState();
    store.logout();

    // Vérifie le state Zustand
    expect(useAuthStore.getState().user).toBe(null);
    expect(useAuthStore.getState().token).toBe(null);

    // Vérifie le localStorage
    expect(localStorage.getItem("user")).toBe(null);
    expect(localStorage.getItem("token")).toBe(null);
  });
});
