import { describe, it, expect, beforeEach, vi } from "vitest";
import useAuthStore from "@/stores/authStore";

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null, error: null });
    localStorage.clear();
  });

  it("met à jour l'utilisateur avec setUser", () => {
    const userMock = { email: "rayan@email.com" };
    useAuthStore.getState().setUser(userMock);
    expect(useAuthStore.getState().user).toEqual(userMock);
    expect(localStorage.getItem("user")).toBe(JSON.stringify(userMock));
  });

  it("reset tout avec logout", () => {
    useAuthStore.setState({
      user: { email: "rayan@email.com" },
      token: "abcd1234",
    });
    localStorage.setItem("user", JSON.stringify({ email: "rayan@email.com" }));
    localStorage.setItem("token", "abcd1234");

    useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBe(null);
    expect(useAuthStore.getState().token).toBe(null);
    expect(localStorage.getItem("user")).toBe(null);
    expect(localStorage.getItem("token")).toBe(null);
  });

  describe("signup", () => {
    it("met à jour user et token en cas de succès", async () => {
      const userMock = { email: "test@email.com", role: "Propriétaire" };
      const tokenMock = "token123";

      vi.stubGlobal("fetch", vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ user: userMock, token: tokenMock }),
        })
      ));

      const user = await useAuthStore.getState().signup({
        email: "test@email.com",
        password: "password123",
        profile: {
          firstName: "Rayan",
          lastName: "Kabra",
          username: "rayan",
          phone: "0612345678",
        },
      });

      expect(user).toEqual(userMock);
      expect(useAuthStore.getState().token).toBe(tokenMock);
      expect(localStorage.getItem("token")).toBe(tokenMock);
      expect(JSON.parse(localStorage.getItem("user"))).toEqual(userMock);

      vi.unstubAllGlobals();
    });

    it("gère les erreurs de validation renvoyées par l'API", async () => {
      const validationErrors = [
        { field: "email", message: "Email requis" },
        { field: "password", message: "Mot de passe requis" },
      ];

      vi.stubGlobal("fetch", vi.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ errors: validationErrors }),
        })
      ));

      await expect(useAuthStore.getState().signup({
        email: "",
        password: "",
        profile: {
          firstName: "",
          lastName: "",
          username: "",
          phone: "",
        },
      })).rejects.toMatchObject({ validationErrors });

      expect(useAuthStore.getState().error).toEqual(validationErrors);

      vi.unstubAllGlobals();
    });
  });
});
