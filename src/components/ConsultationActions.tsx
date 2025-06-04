import { useModal } from "@/context/modal/useModal";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "./modals/ConfirmModal";

type ConsultationActionsProps = {
  id: string;
  onDelete?: () => void;
};

export const ConsultationActions = ({ id, onDelete }: ConsultationActionsProps) => {
  const { modalType, openModal, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteConsultation = async () => {
  setIsLoading(true);
  try {
    const response = await fetch('/api/consultations', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao deletar consulta');
    }

    closeModal();
    onDelete?.();
  } catch (error) {
    console.error('Erro ao deletar consulta:', error);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <>
      <div className="flex justify-center gap-3">
        <button
          onClick={() => console.log('Editar', id)}
          className="text-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => openModal('delete')}
          className="text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
        >
          <Trash size={16} />
        </button>
      </div>

      {modalType === 'delete' && (
        <ConfirmModal
          text="desmarcar"
          function={handleDeleteConsultation}
          isLoading={isLoading}
        />
      )}
    </>
  );
};
