"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import MobileMenu from "./MobileMenu";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { currentUser } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Function to handle sidebar state changes
  const handleSidebarStateChange = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Function to close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  if (!currentUser) return children;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar
          onStateChange={handleSidebarStateChange}
          onMobileMenuClose={closeMobileMenu}
        />
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={closeMobileMenu} />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out bg-gray-100 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        } ml-0`}
      >
        {/* Mobile Header with Menu Button */}
        <header className="md:hidden bg-black text-white p-4 flex justify-between items-center shadow-md">
          <h1 className="text-xl font-bold text-amber-500">LogMaster</h1>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md hover:bg-gray-800 text-amber-500 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </header>

        <main className="p-4 md:p-6 h-full overflow-auto pt-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
