"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Modal } from "../Modal";
import { useModal } from "@/contexts/ModalContext";
import { Consultation } from "@/models/consultation";

interface ModalEditMedicalConsultationProps {
  setConsultations: React.Dispatch<React.SetStateAction<Consultation[]>>;
  selectedConsultation: Consultation | null;
  onClose?: () => void;
}

type ConsultationFormData = Omit<
  Consultation,
  "id" | "consultationDate" | "status"
> & {
  date: string;
  time: string;
};

export function ModalEditMedicalConsultation ({
  setConsultations,
  selectedConsultation,
}: ModalEditMedicalConsultationProps) {
  const { modalType, closeModal } = useModal();
  const { register, handleSubmit, reset, setValue } =
    useForm<ConsultationFormData>();

  useEffect(() => {
    if (selectedConsultation) {
      const dateObj = new Date(selectedConsultation.consultationDate);
      const date = dateObj.toISOString().slice(0, 10);
      const time = dateObj.toTimeString().slice(0, 5);

      setValue("patientName", selectedConsultation.patientName);
      setValue("document", selectedConsultation.document);
      setValue("email", selectedConsultation.email);
      setValue("phoneNumber", selectedConsultation.phoneNumber);
      setValue("professionalName", selectedConsultation.professionalName);
      setValue("consultationType", selectedConsultation.consultationType);
      setValue("date", date);
      setValue("time", time);
    }
  }, [selectedConsultation, setValue]);

  const handleEditConsultation: SubmitHandler<ConsultationFormData> = async (data) => {
    if (!selectedConsultation) return;

    try {
      const { date, time, ...rest } = data;
      const consultationDate = new Date(`${date}T${time}:00`);

      const response = await fetch("/api/consultations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedConsultation.id,
          ...rest,
          consultationDate,
        }),
      });

      if (response.ok) {
        const updatedConsultation = {
          ...selectedConsultation,
          ...rest,
          consultationDate: consultationDate.toISOString(),
        };

        setConsultations((prev) =>
          prev.map((c) =>
            c.id === selectedConsultation.id ? updatedConsultation : c
          )
        );
        closeModal();
        reset();
      } else {
        const error = await response.json();
        console.error("Erro:", error.error);
      }
    } catch (error) {
      console.error("Erro ao atualizar consulta:", error);
    }
  };

  if (modalType !== "edit") return null;

  return (
    <Modal>
      <h2 className="text-black text-center text-xl font-semibold mb-2">
        Editar dados do paciente
      </h2>
      <span className="text-black flex justify-center mb-4">
        Altere as informações necessárias e salve as alterações.
      </span>

      <form onSubmit={handleSubmit(handleEditConsultation)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="document" className="mb-1 text-black">
                CPF
              </label>
              <input
                id="document"
                {...register("document", { required: true })}
                className="w-full rounded border px-3 py-2 text-black"
                placeholder="Digite seu CPF"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 text-black">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email", { required: true })}
                className="w-full rounded border px-3 py-2 text-black"
                placeholder="exemplo@dominio.com"
                required
              />
            </div>

            <div>
              <label htmlFor="consultationType" className="mb-1 text-black">
                Tipo de consulta
              </label>
              <input
                id="consultationType"
                {...register("consultationType", { required: true })}
                className="w-full rounded border px-3 py-2 text-black"
                placeholder="Tipo de consulta"
                required
              />
            </div>

            <div>
              <label htmlFor="date" className="mb-1 text-black">
                Data
              </label>
              <input
                id="date"
                type="date"
                {...register("date", { required: true })}
                className="w-full rounded border px-3 py-2 text-black"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="patientName" className="mb-1 text-black">
                Nome do paciente
              </label>
              <input
                id="patientName"
                {...register("patientName", { required: true })}
                className="w-full rounded border px-3 py-2 text-black"
                placeholder="Nome completo"
                required
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="mb-1 text-black">
                Telefone
              </label>
              <input
                id="phoneNumber"
                type="tel"
                {...register("phoneNumber", { required: true })}
                className="w-full rounded border px-3 py-2 text-black"
                placeholder="(XX) XXXXX-XXXX"
                required
              />
            </div>

            <div>
              <label htmlFor="professionalName" className="mb-1 text-black">
                Profissional
              </label>
              <input
                id="professionalName"
                {...register("professionalName", { required: true })}
                className="w-full rounded border px-3 py-2 text-black"
                placeholder="Nome do profissional"
                required
              />
            </div>

            <div>
              <label htmlFor="time" className="mb-1 text-black">
                Horário
              </label>
              <input
                id="time"
                type="time"
                {...register("time", { required: true })}
                className="w-full rounded border px-3 py-2 text-black"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-2">
          <button
            type="button"
            onClick={() => {
              reset();
              closeModal();
            }}
            className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-400 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700 cursor-pointer"
          >
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
};
