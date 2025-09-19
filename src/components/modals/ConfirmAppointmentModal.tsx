"use client";

import { useModal } from "@/contexts/ModalContext";
import { Consultation, ConsultationStatus } from "@/models/consultation";
import { Modal } from "../Modal";
import { formatCPF, formatPhone } from "@/utils/formatters";

type ConfirmAppointmentModalProps = {
  consultation: Consultation;
  onConfirm: (updatedStatus: ConsultationStatus) => void;
};

export function ConfirmAppointmentModal({
  consultation,
  onConfirm,
}: ConfirmAppointmentModalProps) {
  const { closeModal } = useModal();

  const dateObj = consultation.consultationDate
    ? new Date(consultation.consultationDate)
    : null;

  return (
    <Modal>
      <h2 className="text-black text-center text-xl font-semibold mb-4">
        Confirmação da Consulta
      </h2>
      <span className="text-black flex justify-center mb-6 text-sm">
        Verifique as informações antes de confirmar a consulta.
      </span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black text-sm mb-6 text-start">
        <div className="space-y-4">
          <div>
            <label htmlFor="document" className="font-medium block mb-1">
              CPF
            </label>
            <input
              id="document"
              type="text"
              value={formatCPF(consultation.document) || ""}
              disabled
              className="w-full rounded border px-3 py-2 bg-gray-100 text-black cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="email" className="font-medium block mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={consultation.email || ""}
              disabled
              className="w-full rounded border px-3 py-2 bg-gray-100 text-black cursor-not-allowed"
            />
          </div>

          <div>
            <label
              htmlFor="consultationType"
              className="font-medium block mb-1"
            >
              Tipo de consulta
            </label>
            <input
              id="consultationType"
              type="text"
              value={consultation.consultationType || ""}
              disabled
              className="w-full rounded border px-3 py-2 bg-gray-100 text-black cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="date" className="font-medium block mb-1">
              Data
            </label>
            <input
              id="date"
              type="date"
              value={dateObj ? dateObj.toISOString().split("T")[0] : ""}
              disabled
              className="w-full rounded border px-3 py-2 bg-gray-100 text-black cursor-not-allowed"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="patientName" className="font-medium block mb-1">
              Nome do Paciente
            </label>
            <input
              id="patientName"
              type="text"
              value={consultation.patientName || ""}
              disabled
              className="w-full rounded border px-3 py-2 bg-gray-100 text-black cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="font-medium block mb-1">
              Telefone
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={formatPhone(consultation.phoneNumber) || ""}
              disabled
              className="w-full rounded border px-3 py-2 bg-gray-100 text-black cursor-not-allowed"
            />
          </div>

          <div>
            <label
              htmlFor="professionalName"
              className="font-medium block mb-1"
            >
              Profissional
            </label>
            <input
              id="professionalName"
              type="text"
              value={consultation.professionalName || ""}
              disabled
              className="w-full rounded border px-3 py-2 bg-gray-100 text-black cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="time" className="font-medium block mb-1">
              Horário
            </label>
            <input
              id="time"
              type="time"
              value={dateObj ? dateObj.toTimeString().slice(0, 5) : ""}
              disabled
              className="w-full rounded border px-3 py-2 bg-gray-100 text-black cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          type="button"
          onClick={() => {
            onConfirm("Cancelado");
            closeModal();
          }}
          className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-400 text-white cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm("Aguardando");
            closeModal();
          }}
          className="px-4 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
        >
          Confirmar
        </button>
      </div>
    </Modal>
  );
}
