import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import useSidebarStore from "../../stores/sidebarStore";

const Sidebar = () => {
  const { pathname } = useLocation();
  const user = useAuthStore((state) => state.user);
  const sidebarOpen = useSidebarStore((state) => state.sidebarOpen);

  if (!user?.role) return null;

  const commonClasses = (path) =>
    `block px-4 py-2 rounded hover:bg-gray-100 transition ${
      pathname === path ? "bg-gray-100 font-semibold" : "text-gray-700"
    }`;

    return (
      <aside
        className={`h-full bg-white border-r shadow-sm p-6 transition-all duration-500 ease-in-out ${
          sidebarOpen ? "w-60 opacity-100" : "w-0 opacity-0 overflow-hidden"
        }`}
      >
        <nav className="flex flex-col gap-2">
          {user.role === "Propriétaire" ? (
            <>
              <Link to="/dashboard" className={commonClasses("/dashboard")}>Dashboard</Link>
              <Link to="/dashboard/proprietes" className={commonClasses("/dashboard/proprietes")}>Mes propriétés</Link>
              <Link to="/dashboard/locataires" className={commonClasses("/dashboard/locataires")}>Locataires</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className={commonClasses("/dashboard")}>Mon espace</Link>
              <Link to="/dashboard/baux" className={commonClasses("/dashboard/baux")}>Mes baux</Link>
              <Link to="/dashboard/documents" className={commonClasses("/dashboard/documents")}>Documents</Link>
            </>
          )}
        </nav>
      </aside>
    );
  };
  
  export default Sidebar;
  