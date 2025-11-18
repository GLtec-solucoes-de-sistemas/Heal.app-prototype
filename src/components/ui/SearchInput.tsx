"use client";

import { Search } from "lucide-react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const SearchInput = ({ value, onChange, placeholder }: SearchInputProps) => {
  return (
    <div className="relative w-full max-w-md mb-4">
      <Search size={24} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#4B5259]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Pesquisar"}
        className="pl-10 pr-3 py-2 w-full rounded-md font-normal border border-[#09121C1A] text-black placeholder-[#4B5259] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B695B]"
      />
    </div>
  );
};
