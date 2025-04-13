import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

const RoleRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.role) return <Navigate to={user.role === "Propriétaire" ? "/owner" : "/tenant"} replace />;

  return children;
};

export default RoleRoute;
