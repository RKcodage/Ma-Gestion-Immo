import { Outlet } from "react-router-dom";
// Components
import Header from "../components/dashboard/Header";
import Sidebar from "../components/dashboard/Sidebar";
import SEO from "../components/SEO/Seo";
import DashboardTour from "../components/onboarding/DashboardTour";

import useSidebarStore from "../stores/sidebarStore";

const DashboardLayout = () => {
  const sidebarOpen = useSidebarStore((state) => state.sidebarOpen);

  return (
    <div className="flex flex-col h-screen w-full">

      {/* Page SEO  */}
      <SEO title="Ma Gestion Immo - Dashboard" noIndex />
      {/* Dashboard onboarding tour (React Joyride) */}
      <DashboardTour />

      <Header />

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && <Sidebar />}
        <main
          id="main-scroll"
          className="flex-1 p-6 overflow-y-auto bg-gray-50"
          data-tour="main-content"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
