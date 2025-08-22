import { create } from "zustand";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "./authStore";
const API_URL = import.meta.env.VITE_API_URL;

// Create store
const useRoleStore = create((set) => ({
  loading: false,
  error: null,
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

// Assign a role
export const useAssignRole = () => {
  const token = useAuthStore.getState().token;
  const setUser = useAuthStore.getState().setUser;
  const { setLoading, setError } = useRoleStore.getState();

  return useMutation({
    mutationFn: async (role) => {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/user/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Erreur assignation rôle");

      return role;
    },
    onSuccess: (role) => {
      const currentUser = useAuthStore.getState().user;
      setUser({ ...currentUser, role }); // Update of user's role
      setLoading(false);
    },
    onError: (error) => {
      setError(error.message);
      setLoading(false);
    },
  });
};

export default useRoleStore;
