import { Outlet } from "react-router-dom";
// Components
import Header from "../components/dashboard/Header";
import Sidebar from "../components/dashboard/Sidebar";

import useSidebarStore from "../stores/sidebarStore";

const DashboardLayout = () => {
  const sidebarOpen = useSidebarStore((state) => state.sidebarOpen);

  return (
    <div className="flex flex-col h-screen w-full">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
