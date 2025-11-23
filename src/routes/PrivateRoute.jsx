import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

const PrivateRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
