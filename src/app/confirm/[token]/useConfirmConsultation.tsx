"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Consultation, ConsultationStatus } from "@/models/consultation";
import { useModal } from "@/contexts/ModalContext";

type Status = "loading" | "success" | "error";

export function useConfirmConsultation(token: string) {
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  const { closeModal, onConfirmAppointment } = useModal();

  useEffect(() => {
    let mounted = true;

    const fetchConsultation = async () => {
      try {
        const q = query(
          collection(db, "consultations"),
          where("confirmationToken", "==", token)
        );
        const snapshot = await getDocs(q);
        if (!mounted) return;

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
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Erro ao confirmar consulta:", error);
        setStatus("error");
      }
    };

    fetchConsultation();

    return () => { mounted = false; };
  }, [token]);

  async function updateStatus(updatedStatus: ConsultationStatus, router?: any) {
    if (!consultation) return;

    try {
      const res = await fetch("/api/consultations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: consultation.id, status: updatedStatus }),
      });

      if (!res.ok) throw new Error("Falha ao atualizar status");

      setConsultation({ ...consultation, status: updatedStatus });

      closeModal();
      router?.replace("/");
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  function getConfirmAppointmentCallback(router: any) {
    return () => {
      if (consultation) {
        onConfirmAppointment({
          consultation,
          onConfirm: (status) => updateStatus(status, router),
        });
      }
    };
  }

  return { consultation, status, getConfirmAppointmentCallback };
}