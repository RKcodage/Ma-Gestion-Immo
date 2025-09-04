import React from "react";
import { NavLink, Link } from "react-router-dom";
import { User } from "lucide-react";
import useAuthStore from "../../stores/authStore";

const Header = ({ className = "" }) => {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = !!token && !!user;

  return (
    <header className={`absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4 z-40 ${className}`}>
      <Link to="/">
        <div className="text-white text-2xl font-bold">
          Ma Gestion Immo
        </div>
      </Link>

      <div className="space-x-6 flex items-center">
        {isAuthenticated ? (
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-white text-lg hover:underline underline-offset-4"
          >
            Revenir à mon espace
            <span className="w-6 h-6 flex items-center justify-center rounded-full border border-white">
              <User size={14} />
            </span>
          </Link>
        ) : (
          <NavLink
            to="/login"
            className="flex items-center gap-2 text-white text-lg hover:underline underline-offset-4"
          >
            Se connecter
            <span className="w-6 h-6 flex items-center justify-center rounded-full border border-white">
              <User size={14} />
            </span>
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Header;
