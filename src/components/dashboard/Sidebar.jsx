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
    <aside className="w-60 h-full bg-white border-l shadow-sm p-6">
      <nav className="flex flex-col gap-2">
        {user.role === "Propriétaire" ? (
          <>
            <Link to="/dashboard" className={commonClasses("/dashboard")}>Tableau de bord</Link>
            <Link to="/dashboard/properties" className={commonClasses("/dashboard/proprietes")}>Propriétés</Link>
            <Link to="/dashboard/locataires" className={commonClasses("/dashboard/locataires")}>Locataires</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className={commonClasses("/dashboard")}>Tableau de bord</Link>
            <Link to="/dashboard/baux" className={commonClasses("/dashboard/baux")}>Baux</Link>
            <Link to="/dashboard/documents" className={commonClasses("/dashboard/documents")}>Documents</Link>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
