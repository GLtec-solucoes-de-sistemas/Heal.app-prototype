"use client";

import { useRouter } from "next/navigation";
import { LucideIcon, Home, CalendarHeart, Columns3Cog, LifeBuoy, ArrowRightLeft } from "lucide-react";
import Image from "next/image";
import sidebarIcon from "../../public/sidebarIcon.svg";
import subSidebarIcon from "../../public/subSidebarIcon.svg";

interface SidebarItem {
  label: string;
  icon: LucideIcon;
  path?: string;
}

interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ open, toggleSidebar }: SidebarProps) {
  const router = useRouter();

  const items: SidebarItem[] = [
    { label: "Início", icon: Home, path: "/dashboard" },
    { label: "Consultas Marcadas", icon: CalendarHeart, path: "/" },
    { label: "Gestão e Métricas", icon: Columns3Cog, path: "/dashboard" },
    { label: "Central de Ajuda", icon: LifeBuoy, path: "/dashboard" },
  ];

  return (
    <div
      className={`
        fixed top-0 left-0 h-full bg-[#009388] shadow-lg flex flex-col
        transition-all duration-300 group
        ${open ? "w-64" : "w-16"}
      `}
    >
      <div className="flex items-center justify-center mt-6 mb-10 relative">
        <div className="relative w-56 h-20 transition-all duration-300">
          <Image
            src={open ? sidebarIcon : subSidebarIcon}
            alt="Ícone da sidebar"
            className="object-contain w-full h-full transition-all duration-300"
            priority
          />
        </div>

        <button
          onClick={toggleSidebar}
          className="
            absolute -right-12 top-5 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300
          "
        >
          <ArrowRightLeft className="text-[#009388] cursor-pointer w-6 h-6" />
        </button>
      </div>

      <nav className="flex flex-col gap-2 mt-4 px-2">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => router.push(item.path!)}
            className={`
              flex items-center justify-${open ? "start" : "center"} gap-3 text-white font-medium
              h-12 w-full px-4 rounded-lg
              hover:bg-[#3B695B]
              transition-all duration-300
            `}
          >
            <item.icon className="w-6 h-6 flex-shrink-0" />
            {open && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}
