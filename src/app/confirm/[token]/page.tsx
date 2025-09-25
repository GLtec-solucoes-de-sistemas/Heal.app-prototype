"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useConfirmConsultation } from "./useConfirmConsultation";

export default function ConfirmPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const router = useRouter();
  const { consultation, status, getConfirmAppointmentCallback } = useConfirmConsultation(token);

  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    if (status === "success" && consultation && !modalOpened) {
      const openModal = getConfirmAppointmentCallback(router);
      openModal();
      setModalOpened(true);
    }
  }, [status, consultation, modalOpened, getConfirmAppointmentCallback, router]);

  return (
    <div className="p-10 text-center">
      {status === "loading" && <p>Carregando...</p>}
      {status === "error" && <p className="text-red-600">❌ Link inválido ou consulta não encontrada.</p>}
    </div>
  );
}
