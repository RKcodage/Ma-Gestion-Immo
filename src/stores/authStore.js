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
    set({ loading: true, error: null });
    try {
      const bodyData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.profile.firstName,
        lastName: formData.profile.lastName,
        username: formData.profile.username,
        phone: formData.profile.phone,
      };

      // Add invitation token if exists
      if (invitationToken) {
        bodyData.invitationToken = invitationToken;
      }

      const response = await fetch(`${API_URL}/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Sign up error");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      set({ token: data.token, loading: false });
      get().setUser(data.user);
      return data.user;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // LOGIN
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login error");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      set({ token: data.token, loading: false });
      get().setUser(data.user);
      return data.user;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // FORGOT PASSWORD
  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error while sending");
      }

      set({ loading: false });
      return data.message;
    } catch (error) {
      set({ error: error.message, loading: false });
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

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Reset error");
      }

      return res.json();
    } catch (error) {
      throw error;
    }
  },

  // LOGOUT
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },
}));

useAuthStore.getState().loadUserFromStorage();

export default useAuthStore;
