"use client";

import { ArrowDown } from "lucide-react";
import { useState } from "react";

type RowsPerPageSelectorProps = {
  rowsPerPage: number;
  setRowsPerPage: (value: number) => void;
};

export const RowsPerPageSelector = ({ rowsPerPage, setRowsPerPage }: RowsPerPageSelectorProps) => {
  const options = [5, 10, 15];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex items-center gap-1">
      <span className="text-black text-sm">Mostrar</span>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center border text-black border-[#09121C1A] px-3 py-2 rounded text-sm gap-1"
      >
        {rowsPerPage} <ArrowDown size={15} />
      </button>
      <span className="text-black text-sm ml-1">Linhas por página</span>
      {isOpen && (
        <div className="absolute right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded shadow z-50 w-24">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => { setRowsPerPage(option); setIsOpen(false); }}
              className="w-full text-left px-3 py-2 hover:bg-zinc-700 text-white text-sm"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
