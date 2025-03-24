"use client";

import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) return children;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 bg-gray-100">
        <main className="p-6 h-full overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
