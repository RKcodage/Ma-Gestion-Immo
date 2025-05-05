import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Home } from "lucide-react";
import useAuthStore from "../../stores/authStore";
import useSidebarStore from "../../stores/sidebarStore";

const Header = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <header className="w-full bg-white shadow px-6 py-4 flex justify-between items-center relative z-50">
      <div className="flex items-center gap-4">
      <button
    onClick={toggleSidebar}
    className="w-10 h-10 bg-white border rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition"
    aria-label="Toggle sidebar"
  >
          <Home className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-primary">Ma Gestion Immo</h1>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 focus:outline-none"
        >
          {user?.profile?.avatar ? (
            <img
              src={user.profile.avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold uppercase">
              {(user?.profile?.firstName?.[0] || "U") + (user?.profile?.lastName?.[0] || "")}
            </div>
          )}
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg text-sm">
            <Link
              to="/dashboard/account"
              className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
              onClick={() => setOpen(false)}
            >
              Mon compte
            </Link>
            <button
              onClick={() => {
                logout();
                setOpen(false);
                navigate("/");
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            >
              Se déconnecter
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
