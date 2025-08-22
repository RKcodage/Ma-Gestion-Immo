// Login.test.jsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { create } from "zustand";

// Create a fake Zustand store dynamically
const fakeLogin = vi.fn(() => Promise.resolve({ role: "Locataire" }));

const useAuthStore = create(() => ({
  user: null,
  loading: false,
  error: null,
  login: fakeLogin,
}));

// Replace the real store
vi.mock("@/stores/authStore", () => ({
  __esModule: true,
  default: useAuthStore,
}));

let Login;
beforeEach(async () => {
  const imported = await import("@/pages/Login");
  Login = imported.default;
});

describe("Page Login", () => {
  it("affiche les champs du formulaire", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
  });

  it("appelle login avec les bons identifiants", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/email/i), "test@email.com");
    await user.type(screen.getByLabelText(/mot de passe/i), "motdepasse");

    const button = screen.getByRole("button", { name: /se connecter/i });
    expect(button).not.toBeDisabled();

    await user.click(button);

    expect(fakeLogin).toHaveBeenCalledWith("test@email.com", "motdepasse");
  });
});
