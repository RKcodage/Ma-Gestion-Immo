import { Outlet } from "react-router-dom";
import Header from "../components/dashboard/Header";
// import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex flex-col h-screen w-full">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
        {/* <Sidebar /> */}
      </div>
    </div>
  );
};

export default DashboardLayout;
