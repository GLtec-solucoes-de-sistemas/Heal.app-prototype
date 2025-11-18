"use client";

import { ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = sidebarOpen ? "16rem" : "4rem";

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      {user && <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />}
      
      <div className="flex-1 flex flex-col">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isMobile={isMobile} />
        
        <main
          className="flex-1 transition-all duration-500 ease-in-out pt-14"
          style={{
            marginLeft: !isMobile ? sidebarWidth : "0",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
