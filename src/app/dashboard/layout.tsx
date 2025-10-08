"use client";

import { ReactNode, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen">
      {user && <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />}

      <main
        className={`
          flex-1 transition-all duration-300 ease-in-out
          ${user ? (sidebarOpen ? "ml-64" : "ml-16") : "ml-0"}
        `}
      >
        {children}
      </main>
    </div>
  );
}
