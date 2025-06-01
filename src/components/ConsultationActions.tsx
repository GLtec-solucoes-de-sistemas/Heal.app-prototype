'use client';

import { Pencil, Trash } from 'lucide-react';

type ConsultationActionsProps = {
  id: string;
};

export const ConsultationActions = ({ id }: ConsultationActionsProps) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => console.log('Editar', id)}
        className="text-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
      >
        <Pencil size={16} />
      </button>
      <button
        onClick={() => console.log('Deletar', id)}
        className="text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
      >
        <Trash size={16} />
      </button>
    </div>
  );
};
