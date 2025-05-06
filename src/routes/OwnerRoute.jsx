import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

export default function OwnerRoute({ children }) {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Navigate to="/login" />;

  if (user.role !== "Propriétaire") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}