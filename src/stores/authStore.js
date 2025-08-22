import { create } from "zustand";

const API_URL = import.meta.env.VITE_API_URL;

const storedUser = localStorage.getItem("user");
const parsedUser =
  storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

const useAuthStore = create((set, get) => ({
  user: parsedUser,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
  errorCode: null,

  loadUserFromStorage: () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      set({ user: JSON.parse(storedUser) });
    }
  },

  // SET USER
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  // SIGN UP
  signup: async (formData, invitationToken = null) => {
    set({ loading: true, error: null, errorCode: null });
    try {
      const bodyData = {
        email: formData.email,
        password: formData.password,
        profile: {
          firstName: formData.profile.firstName,
          lastName: formData.profile.lastName,
          username: formData.profile.username,
          phone: formData.profile.phone,
        },
      };

      if (invitationToken) bodyData.invitationToken = invitationToken;

      const response = await fetch(`${API_URL}/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data.errors) {
          set({ error: data.errors, loading: false, errorCode: "AUTH_FAILED" });
          throw { validationErrors: data.errors };
        }
        const msg = data.message || "Sign up error";
        set({ error: msg, loading: false, errorCode: "AUTH_FAILED" });
        throw new Error(msg);
      }

      localStorage.setItem("token", data.token);
      set({ token: data.token, loading: false, error: null, errorCode: null });
      get().setUser(data.user);
      return data.user;
    } catch (error) {
      if (error.validationErrors) {
        // déjà set plus haut
        throw error;
      } else {
        const msg = error?.message || "Sign up error";
        set({ error: msg, loading: false, errorCode: "UNKNOWN" });
        throw error;
      }
    }
  },

  // LOGIN (gère 429 + Retry-After / RateLimit-Reset)
  login: async (email, password) => {
    set({ loading: true, error: null, errorCode: null });
    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Rate limit
      if (response.status === 429) {
        const retryAfterHeader = response.headers.get("Retry-After");
        const rlResetHeader = response.headers.get("RateLimit-Reset");

        let waitMsg = "";
        if (retryAfterHeader && /^\d+$/.test(retryAfterHeader)) {
          const secs = parseInt(retryAfterHeader, 10);
          if (secs > 0) waitMsg = ` (~${Math.ceil(secs / 60)} min)`;
        } else if (rlResetHeader && /^\d+$/.test(rlResetHeader)) {
          const now = Math.floor(Date.now() / 1000);
          const delta = Math.max(0, parseInt(rlResetHeader, 10) - now);
          if (delta > 0) waitMsg = ` (~${Math.ceil(delta / 60)} min)`;
        }

        const data = await response.json().catch(() => ({}));
        const msg =
          data?.error ||
          data?.message ||
          "Trop de tentatives de connexion. Veuillez réessayer plus tard." +
            waitMsg;

        set({ loading: false, error: msg, errorCode: "RATE_LIMITED" });
        throw new Error(msg);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const msg =
          errorData.message || "Identifiant ou mot de passe incorrect";
        set({ error: msg, loading: false, errorCode: "AUTH_FAILED" });
        throw new Error(msg);
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      set({ token: data.token, loading: false, error: null, errorCode: null });
      get().setUser(data.user);
      return data.user;
    } catch (error) {
      const handled =
        get().errorCode === "RATE_LIMITED" || get().errorCode === "AUTH_FAILED";
      if (!handled) {
        const msg = error?.message || "Login error";
        set({ error: msg, loading: false, errorCode: "UNKNOWN" });
      }
      throw error;
    }
  },

  // FORGOT PASSWORD
  forgotPassword: async (email) => {
    set({ loading: true, error: null, errorCode: null });
    try {
      const response = await fetch(`${API_URL}/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const msg = data.message || "Erreur lors de l’envoi";
        set({ loading: false, error: msg, errorCode: "AUTH_FAILED" });
        throw new Error(msg);
      }

      set({ loading: false, error: null, errorCode: null });
      return data.message;
    } catch (error) {
      const msg = error?.message || "Erreur lors de l’envoi";
      set({ error: msg, loading: false, errorCode: "UNKNOWN" });
      throw error;
    }
  },

  // RESET PASSWORD
  resetPassword: async (token, newPassword) => {
    try {
      const res = await fetch(`${API_URL}/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data.message || "Reset error";
        throw new Error(msg);
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // LOGOUT
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null, error: null, errorCode: null });
  },
}));

// Init store from storage au chargement
useAuthStore.getState().loadUserFromStorage();

export default useAuthStore;
