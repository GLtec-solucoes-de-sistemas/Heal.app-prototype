"use client";

import { useRouter, usePathname } from "next/navigation";
import { Bell, ChevronLeft, ChevronDown, UserCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  sidebarOpen: boolean;
}

export const Header = ({ sidebarOpen }: HeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const routeName = pathname.split("/").filter(Boolean).pop() || "Consultas marcadas";
  const formattedRoute =
    routeName.charAt(0).toUpperCase() + routeName.slice(1).replace(/-/g, " ");

  const sidebarWidth = sidebarOpen ? "16rem" : "4rem";
  const isDashboard = pathname === "/dashboard";

  return (
    <header
      className="fixed top-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 transition-all duration-300 ease-in-out z-30"
      style={{
        left: sidebarWidth,
        width: `calc(100% - ${sidebarWidth})`,
      }}
    >
      <div className="flex items-center gap-4">
        {!isDashboard && (
          <button
            onClick={() => router.back()}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>
        )}
        <h1 className="text-base font-semibold text-gray-800 tracking-tight">
          {formattedRoute}
        </h1>
      </div>

      <div className="flex items-center gap-5">
        <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">
          <Bell className="w-4 h-4 text-gray-700" />
        </button>

        <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 px-3 py-1.5 rounded-full transition">
          <UserCircle className="w-5 h-5 text-gray-700" />
          <span className="text-gray-800 font-medium text-sm truncate max-w-[140px]">
            {user?.displayName || "Secretário"}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </div>
      </div>
    </header>
  );
};
