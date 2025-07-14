"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useModal } from "@/contexts/ModalContext";
import { Consultation } from "@/models/consultation";
import { ConfirmAppointmentModal } from "@/components/modals/ConfirmAppointmentModal";

export default function ConfirmPage({ params }: { params: { token: string } }) {
  const { token } = params;
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  const { openModal } = useModal();

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const q = query(
          collection(db, "consultations"),
          where("confirmationToken", "==", token)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          await updateDoc(doc.ref, { status: "Aguardando" });

          setConsultation(doc.data() as Consultation);
          setStatus("success");
          openModal("confirm");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Erro ao confirmar consulta:", error);
        setStatus("error");
      }
    };

    fetchConsultation();
  }, [token, openModal]);

  const handleConfirm = () => {
    // lógica
  };

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
        <p className="text-red-600">❌ Link inválido ou consulta não encontrada.</p>
      )}
    </div>
  );
}
