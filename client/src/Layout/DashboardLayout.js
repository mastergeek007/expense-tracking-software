import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import BaseButton from "../Components/button/BaseButton";
import { BarIcon } from "../Components/icons/BarIcon";
import Sidebar from "../Components/sidebar/Sidebar";
import logo from "../images/Wordmark_DarkBlue.png";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="relative min-h-screen">
      {/* Mobile header with menu button */}
      <div className="flex justify-between px-6 py-4 lg:hidden items-center bg-white border-b">
        <div className="w-32 sm:w-40">
          <img className="w-full" src={logo} alt="Logo" />
        </div>
        <BaseButton handleClick={toggleSidebar} className="lg:hidden">
          <BarIcon />
        </BaseButton>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden transition-transform duration-300 ease-in-out`}
      >
        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Content */}
        <div className="relative z-50 w-64 h-full bg-white shadow-lg p-4">
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="flex">
        {/* Desktop Sidebar - always visible on large screens */}
        <div className="hidden lg:block lg:w-64 fixed h-full bg-white shadow-md">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 bg-[#F2F2F2] min-h-screen p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
