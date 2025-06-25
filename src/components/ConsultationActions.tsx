"use client";

import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "./modals/ConfirmModal";
import { useAuth } from "../contexts/AuthContext";

type ConsultationActionsProps = {
  id?: string;
  onDelete?: () => void;
  onEdit?: () => void;
  isHeader?: boolean;
};

export const ConsultationActions = ({
  id,
  onDelete,
  onEdit,
  isHeader = false,
}: ConsultationActionsProps) => {
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!user || loading) return null;

  if (isHeader) {
    return (
      <th scope="col" className="px-4 py-2 text-center">
        Ações
      </th>
    );
  }

  const handleDeleteConsultation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/consultations", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao deletar consulta");
      }

      setShowConfirm(false);
      onDelete?.();
    } catch (error) {
      console.error("Erro ao deletar consulta:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <td className="px-4 py-2 text-center">
      <div className="flex justify-center gap-3">
        <button
          aria-label="Editar consulta"
          onClick={onEdit}
          className="text-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
        >
          <Pencil size={16} />
        </button>
        <button
          aria-label="Excluir consulta"
          onClick={() => setShowConfirm(true)}
          className="text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
        >
          <Trash size={16} />
        </button>
      </div>

      {showConfirm && (
        <ConfirmModal
          text="desmarcar"
          function={handleDeleteConsultation}
          isLoading={isLoading}
          onClose={() => setShowConfirm(false)}
        />
      )}
    </td>
  );
};
