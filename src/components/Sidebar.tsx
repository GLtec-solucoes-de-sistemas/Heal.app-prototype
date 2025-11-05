"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, CalendarHeart, Columns3Cog, LifeBuoy } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import sidebarIcon from "../../public/sidebarIcon.svg";
import subSidebarIcon from "../../public/subSidebarIcon.svg";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();

    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      if (sidebar && !sidebar.contains(e.target as Node) && isMobile) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, setOpen]);

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [pathname, isMobile, setOpen]);

  const items = [
    { label: "Início", icon: Home, path: "/dashboard" },
    { label: "Consultas Marcadas", icon: CalendarHeart, path: "/" },
    { label: "Gestão e Métricas", icon: Columns3Cog, path: "/dashboard/gestao" },
    { label: "Central de Ajuda", icon: LifeBuoy, path: "/dashboard/ajuda" },
  ];

  return (
    <>
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        id="sidebar"
        onClick={() => !isMobile && setOpen(!open)}
        className={`
          fixed top-0 left-0 h-full bg-[#009388] text-white flex flex-col
          transition-all duration-500 ease-in-out z-40
          ${isMobile
            ? open
              ? "translate-x-0 w-64"
              : "-translate-x-64 w-64"
            : open
            ? "w-64"
            : "w-16"}
        `}
      >
        <div className="flex justify-center mt-2 mb-9 select-none pointer-events-none">
          <div className="relative w-56 h-20 transition-all duration-500 ease-in-out">
            <Image
              src={open || isMobile ? sidebarIcon : subSidebarIcon}
              alt="Ícone da sidebar"
              className="object-contain w-full h-full transition-all duration-500"
              priority
            />
          </div>
        </div>

        <nav
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col gap-2 transition-all duration-500"
        >
          {items.map((item) => {
            const active = pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(item.path);
                  if (isMobile) setOpen(false);
                }}
                className={`
                  flex items-center h-12 mx-2 rounded-lg font-light text-sm
                  hover:bg-[#3B695B] transition-all duration-500
                  ${active ? "bg-[#3B695B]" : ""}
                  ${open ? "justify-start px-4" : "justify-center px-0"}
                `}
              >
                <div className="flex w-6 h-6">
                  <item.icon className="w-6 h-6" />
                </div>
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-500 ease-in-out
                    ${open ? "opacity-100 ml-3 w-auto" : "opacity-0 ml-0 w-0"}`
                  }
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
