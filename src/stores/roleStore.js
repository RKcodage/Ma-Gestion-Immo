import { create } from "zustand";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "./authStore";

const useRoleStore = create((set) => ({
  loading: false,
  error: null,
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export const useAssignRole = () => {
  const token = useAuthStore.getState().token;
  const { setLoading, setError } = useRoleStore.getState();

  return useMutation({
    mutationFn: async (role) => {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:4000/user/role", {
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

      return data;
    },
    onSuccess: () => setLoading(false),
    onError: (error) => {
      setError(error.message);
      setLoading(false);
    },
  });
};

export default useRoleStore;
