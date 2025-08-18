"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ConsultationStatus } from "@/models/consultation";
import { useConfirmConsultation } from "./useConfirmConsultation";
import { ConfirmAppointmentModal } from "@/components/modals/ConfirmAppointmentModal";

export default function ConfirmPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const router = useRouter();

  const { consultation, status, updateStatus } = useConfirmConsultation(token);

  async function handleConfirm(updatedStatus: ConsultationStatus) {
    try {
      await updateStatus(updatedStatus);
      router.replace("/");
    } catch {
      alert("Erro ao atualizar status, tente novamente.");
    }
  }

  return (
    <div className="p-10 text-center">
      {status === "loading" && <p>Carregando...</p>}

      {status === "success" && consultation && (
        <>
          <p className="text-green-600 mb-4">
            ✅ Link validado! Aguarde a confirmação final.
          </p>
          <ConfirmAppointmentModal
            consultation={consultation}
            onConfirm={handleConfirm}
          />
        </>
      )}

      {status === "error" && (
        <p className="text-red-600">
          ❌ Link inválido ou consulta não encontrada.
        </p>
      )}
    </div>
  );
}
