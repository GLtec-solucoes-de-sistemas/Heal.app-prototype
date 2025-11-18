"use client";

import { LucideIcon } from "lucide-react";

interface CardHomeProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export function CardHome({ title, description, icon: Icon, onClick }: CardHomeProps) {
  return (
    <button
      onClick={onClick}
      className="
        w-full flex flex-col items-start justify-center text-center gap-4 cursor-pointer
        bg-white border border-gray-200 rounded-2xl
        hover:shadow-[0_0_25px_5px_rgba(0,0,0,0.3)]
        transition-all duration-300 ease-out
        px-6 py-6 min-h-[160px]
      "
    >
      <div>
        <Icon className="text-[#0B1419] w-6 h-6 group-hover:text-teal-600 transition-colors duration-200" />
      </div>

      <span className="text-[#4A4A4A] text-sm group-hover:text-teal-600 transition-colors duration-200">
        {title}
      </span>

      <p className="text-[#9D9D9D] text-sm break-words mt-1">
        {description}
      </p>
    </button>
  );
}
