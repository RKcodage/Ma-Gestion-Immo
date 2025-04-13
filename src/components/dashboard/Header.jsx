import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu } from "lucide-react";
import useAuthStore from "../../stores/authStore";
import useSidebarStore from "../..//stores/sidebarStore";

const Header = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <header className="w-full bg-white shadow px-6 py-4 flex justify-between items-center relative z-50">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-primary">Ma Gestion Immo</h1>
        <button
          onClick={toggleSidebar}
          className="bg-white border rounded-full p-1 shadow-sm hover:shadow transition"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 focus:outline-none"
        >
          <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center text-white font-semibold uppercase">
            {user?.profile?.firstName?.[0] ?? "U"}
          </div>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg text-sm">
            <Link
              to="/compte"
              className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
              onClick={() => setOpen(false)}
            >
              Mon compte
            </Link>
            <button
              onClick={() => {
                logout();
                setOpen(false);
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
