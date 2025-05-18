import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import useSidebarStore from "../../stores/sidebarStore";

const Sidebar = () => {
  const { pathname } = useLocation();
  const user = useAuthStore((state) => state.user);
  const sidebarOpen = useSidebarStore((state) => state.sidebarOpen);
  const setSidebarOpen = useSidebarStore((state) => state.setSidebarOpen);

  if (!user?.role) return null;

  const commonClasses = (path) =>
    `block px-4 py-2 rounded hover:bg-gray-100 transition ${
      pathname === path ? "bg-gray-100 font-semibold" : "text-gray-700"
    }`;

  return (
    <>
      {/* Overlay visible uniquement sur mobile */}
      <div
        className={`fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`bg-white shadow-md z-40 p-6 w-60 h-full border-r transition-transform md:static md:translate-x-0 md:z-0 ${
          sidebarOpen ? "fixed left-0 top-18 translate-x-0" : "fixed -translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-2">
          {user.role === "Propriétaire" ? (
            <>
              <Link to="/dashboard" className={commonClasses("/dashboard")}>Tableau de bord</Link>
              <Link to="/dashboard/properties" className={commonClasses("/dashboard/proprietes")}>Propriétés</Link>
              <Link to="/dashboard/leases" className={commonClasses("/dashboard/leases")}>Baux</Link>
              <Link to="/dashboard/documents" className={commonClasses("/dashboard/documents")}>Documents</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className={commonClasses("/dashboard")}>Tableau de bord</Link>
              <Link to="/dashboard/leases" className={commonClasses("/dashboard/leases")}>Baux</Link>
              <Link to="/dashboard/documents" className={commonClasses("/dashboard/documents")}>Documents</Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
