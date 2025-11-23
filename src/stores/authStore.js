import { create } from "zustand";

const API_URL = import.meta.env.VITE_API_URL;

// --- helper base64url-safe pour lire l'exp du JWT ---
function getJwtPayload(token) {
  try {
    const part = token?.split(".")[1];
    if (!part) return null;

    // base64url -> base64 (+ padding)
    let base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) base64 += "=".repeat(4 - pad);

    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const storedUser = localStorage.getItem("user");
const parsedUser =
  storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

const useAuthStore = create((set, get) => ({
  user: parsedUser,
  token: localStorage.getItem("token") || null,
  tokenTimerId: null, // timer pour la déconnexion auto
  loading: false,
  error: null,
  errorCode: null,

  // --- démarre un timer pour déconnecter à l'expiration du JWT ---
  _startTokenTimer: (token) => {
    const payload = getJwtPayload(token);
    const exp = payload?.exp; // UNIX seconds
    if (!exp) return; // si pas d'exp, on ne programme pas (ou on pourrait forcer logout)

    const skewMs = 5000; // marge anti-dérive (5s)
    const delay = Math.max(exp * 1000 - Date.now() - skewMs, 0);

    // console.debug(
    //   "[auth] exp =",
    //   new Date(exp * 1000).toISOString(),
    //   "delayMs =",
    //   delay,
    // );

    const id = window.setTimeout(() => {
      // console.debug("[auth] auto-logout (token expired)");
      get().logout();
    }, delay);

    set({ tokenTimerId: id });
  },

  _clearTokenTimer: () => {
    const id = get().tokenTimerId;
    if (id) clearTimeout(id);
    set({ tokenTimerId: null });
  },

  loadUserFromStorage: () => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && storedUser !== "undefined") {
      set({ user: JSON.parse(storedUser) });
    }
    if (token) {
      set({ token });
      get()._clearTokenTimer();
      get()._startTokenTimer(token);
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

      // Set deconnection at expiration
      get()._clearTokenTimer();
      get()._startTokenTimer(data.token);

      return data.user;
    } catch (error) {
      if (error.validationErrors) {
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

      // programme la déconnexion à l'expiration
      get()._clearTokenTimer();
      get()._startTokenTimer(data.token);

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

  // LOGOUT (nettoie timer + redirige)
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    const id = get().tokenTimerId;
    if (id) clearTimeout(id);

    set({
      user: null,
      token: null,
      tokenTimerId: null,
      error: null,
      errorCode: null,
    });
  },
}));

// Init store from storage au chargement (reprogramme le timer si token présent)
useAuthStore.getState().loadUserFromStorage();

export default useAuthStore;
