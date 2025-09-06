import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import useAuthStore from "../../stores/authStore";
import useSidebarStore from "../../stores/sidebarStore";

const Sidebar = () => {
  const { pathname } = useLocation();
  const user = useAuthStore((state) => state.user);
  const sidebarOpen = useSidebarStore((state) => state.sidebarOpen);
  const setSidebarOpen = useSidebarStore((state) => state.setSidebarOpen);
  const asideRef = useRef(null);

  if (!user?.role) return null;

  // Light dark bg on menu links if user are on page
  const commonClasses = (path) =>
    `block px-4 py-2 rounded hover:bg-gray-100 transition ${
      pathname === path ? "bg-gray-100 font-semibold" : "text-gray-700"
    }`;

  // Click hook to close sidebar if user click outside
  useClickOutside(asideRef, () => setSidebarOpen(false), sidebarOpen);

  // To close also with Escape key
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e) => e.key === "Escape" && setSidebarOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <>
      {/* Overlay visible only on mobile */}
      <div
        className={`fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        ref={asideRef}
        role="complementary"
        aria-label="Sidebar"
        className={`bg-white shadow-md z-40 p-6 w-60 h-full border-r transition-transform md:static md:translate-x-0 md:z-0 ${
          sidebarOpen ? "fixed left-0 top-18 translate-x-0" : "fixed -translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-2" data-tour="sidebar">
          {/* Dashboard  Links */}
          {user.role === "Propriétaire" ? (
            <>
              <Link to="/dashboard" className={commonClasses("/dashboard")}>Tableau de bord</Link>
              <Link to="/dashboard/properties" className={commonClasses("/dashboard/properties")}>Propriétés</Link>
              <Link to="/dashboard/leases" className={commonClasses("/dashboard/leases")}>Baux</Link>
              <Link to="/dashboard/documents" className={commonClasses("/dashboard/documents")}>Documents</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className={commonClasses("/dashboard")}>Tableau de bord</Link>
              <Link to="/dashboard/leases" className={commonClasses("/dashboard/leases")}>Locations</Link>
              <Link to="/dashboard/documents" className={commonClasses("/dashboard/documents")}>Documents</Link>
            </>
          )}

          {/* Separator */}
          <div className="my-4 border-t border-gray-200" />

          {/* General section */}
          <div className="px-4 text-xs uppercase tracking-wide text-gray-400 mb-1">
            Général
          </div>
          <Link
            to="/"
            className={commonClasses("/")}
            onClick={() => setSidebarOpen(false)}
          >
            Accueil du site
          </Link>
          <Link
            to="/cgu"
            className={commonClasses("/cgu")}
            onClick={() => setSidebarOpen(false)}
          >
            CGU
          </Link>
          <Link
            to="/legal-mentions"
            className={commonClasses("/mentions-legales")}
            onClick={() => setSidebarOpen(false)}
          >
            Mentions légales
          </Link>
          <Link
            to="/privacy-policy"
            className={commonClasses("/confidentialite")}
            onClick={() => setSidebarOpen(false)}
          >
            Politique de confidentialité
          </Link> 
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
