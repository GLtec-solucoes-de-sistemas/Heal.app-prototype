"use client";

import { useModal } from "@/contexts/ModalContext";
import { Consultation } from "@/models/consultation";
import { Modal } from "../Modal";

export function ConfirmAppointmentModal({
  consultation,
  onConfirm,
}: {
  consultation: Consultation;
  onConfirm: () => void;
}) {
  const { modalType, closeModal } = useModal();
  const isOpen = modalType === "confirm";

  if (!isOpen) return null;

  return (
    <Modal>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded p-6 max-w-md w-full shadow-lg relative">
          <h2 className="text-lg font-bold mb-4">Confirmar Consulta</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Nome:</strong> {consultation.patientName}</p>
            <p><strong>CPF:</strong> {consultation.document}</p>
            <p><strong>Email:</strong> {consultation.email}</p>
            <p><strong>Telefone:</strong> {consultation.phoneNumber}</p>
            <p><strong>Tipo:</strong> {consultation.consultationType}</p>
            <p><strong>Data:</strong> {consultation.consultationDate}</p>
            {/* <p><strong>Horário:</strong> {consultation.time}</p> */}
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm();
                closeModal();
              }}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
