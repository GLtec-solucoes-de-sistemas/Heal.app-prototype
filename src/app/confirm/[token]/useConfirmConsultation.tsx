import { useEffect, useState, useRef } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Consultation, ConsultationStatus } from "@/models/consultation";
import { useModal } from "@/contexts/ModalContext";

type Status = "loading" | "success" | "error";

export function useConfirmConsultation(token: string) {
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  const { openModal } = useModal();
  const modalOpened = useRef(false);

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const q = query(
          collection(db, "consultations"),
          where("confirmationToken", "==", token),
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const docSnap = snapshot.docs[0];
          const data = docSnap.data();

          const consultationData: Consultation = {
            id: docSnap.id,
            consultationType: data.consultationType ?? "",
            document: data.document ?? "",
            email: data.email ?? "",
            patientName: data.patientName ?? "",
            phoneNumber: data.phoneNumber ?? "",
            professionalName: data.professionalName ?? "",
            consultationDate:
              data.consultationDate?.toDate().toISOString() ?? "",
            status: data.status ?? "Pendente",
          };

          setConsultation(consultationData);
          setStatus("success");

          if (!modalOpened.current) {
            openModal("confirm");
            modalOpened.current = true;
          }
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

  async function updateStatus(newStatus: ConsultationStatus) {
    if (!consultation) return;

    try {
      const payload = {
        id: consultation.id,
        status: newStatus,
      };

      const res = await fetch("/api/consultations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Falha ao atualizar status");

      setConsultation({ ...consultation, status: newStatus });
    } catch (error) {
      console.error("Erro ao atualizar status via API:", error);
      throw error;
    }
  }

  return { consultation, status, updateStatus };
}
