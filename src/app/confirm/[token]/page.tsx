"use client";

import { useRouter } from "next/navigation";
import { ConsultationStatus } from "@/models/consultation";
import { useConfirmConsultation } from "./useConfirmConsultation";
import { ConfirmAppointmentModal } from "@/components/modals/ConfirmAppointmentModal";
import { use } from "react";

export default function ConfirmPage(props: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(props.params);
  const router = useRouter();

  const { consultation, status, updateStatus } = useConfirmConsultation(token);

  async function handleConfirm(updatedStatus: ConsultationStatus) {
    try {
      await updateStatus(updatedStatus);
      alert(`Status atualizado para: ${updatedStatus}`);
      router.push("/");
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
