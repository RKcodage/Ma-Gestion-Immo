import { create } from "zustand";

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
  signup: async (formData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:4000/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.profile.firstName,
          lastName: formData.profile.lastName,
          username: formData.profile.username,
          phone: formData.profile.phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de l'inscription");
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
      const response = await fetch("http://localhost:4000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la connexion");
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

  // LOGOUT
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },
}));

useAuthStore.getState().loadUserFromStorage();

export default useAuthStore;
