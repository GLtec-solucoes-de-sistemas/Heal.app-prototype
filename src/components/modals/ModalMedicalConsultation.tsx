"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../Modal";
import { useModal } from "@/contexts/ModalContext";
import { Consultation } from "@/models/consultation";
import { formatCPF, formatPhone } from "@/utils/formatters";
import { getTodayDate } from "@/utils/date";

interface ModalAddMedicalConsultationProps {
  setConsultations: React.Dispatch<React.SetStateAction<Consultation[]>>;
}

const consultationSchema = z.object({
  document: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Digite um CPF válido"),
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  consultationType: z.string().min(1, "Tipo de consulta é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  patientName: z.string().min(1, "Nome do paciente é obrigatório"),
  phoneNumber: z
    .string()
    .regex(
      /^\(\d{2}\) \d{4,5}-\d{4}$/,
      "Telefone deve estar no formato (99) 9 9999-9999",
    ),
  professionalName: z.string().min(1, "Nome do profissional é obrigatório"),
  time: z.string().min(1, "Horário é obrigatório"),
});

type ConsultationFormData = z.infer<typeof consultationSchema> & {
  date: string;
  time: string;
};

export const ModalAddMedicalConsultation = ({
  setConsultations,
}: ModalAddMedicalConsultationProps) => {
  const { modalType, closeModal } = useModal();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
  });

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = formatCPF(e.target.value);
    setValue("document", e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = formatPhone(e.target.value);
    setValue("phoneNumber", e.target.value);
  };

  const onSubmit: SubmitHandler<ConsultationFormData> = async (data) => {
    try {
      const { date, time, document, phoneNumber, ...rest } = data;

      const cleanedCPF = document.replace(/\D/g, "");
      const cleanedPhone = phoneNumber.replace(/\D/g, "");
      const consultationDate = new Date(`${date}T${time}:00`);

      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...rest,
          document: cleanedCPF,
          phoneNumber: cleanedPhone,
          consultationDate,
          status: "Confirmação Pendente",
        }),
      });

      if (response.ok) {
        const newConsultation = await response.json();
        setConsultations((prev) => [newConsultation, ...prev]);
        closeModal();
        reset();
      } else {
        const error = await response.json();
        console.error("Erro:", error.error);
      }
    } catch (error) {
      console.error("Erro ao enviar consulta:", error);
    }
  };

  useEffect(() => {
    if (modalType === "add") {
      setValue("date", getTodayDate());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalType]);

  if (modalType !== "add") return null;

  return (
    <Modal>
      <h2 className="text-black text-center text-xl font-semibold mb-2">
        Cadastro de paciente
      </h2>
      <span className="text-black flex justify-center mb-4">
        Adicione as informações do paciente para adicioná-lo à lista.
      </span>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="document" className="mb-1 text-black">
                CPF
              </label>
              <input
                id="document"
                {...register("document")}
                onChange={handleCPFChange}
                className="w-full rounded border px-3 py-2 text-black"
                placeholder="Digite o CPF do paciente"
              />
              {errors.document && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.document.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="mb-1 text-black">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full rounded border px-3 py-2 text-black"
                placeholder="exemplo@dominio.com"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="consultationType" className="mb-1 text-black">
                Tipo de consulta
              </label>
              <input
                id="consultationType"
                {...register("consultationType")}
                className="w-full rounded border px-3 py-2 text-black"
                placeholder="Tipo de consulta"
              />
              {errors.consultationType && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.consultationType.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="date" className="mb-1 text-black">
                Data
              </label>
              <input
                id="date"
                type="date"
                {...register("date")}
                className="w-full rounded border px-3 py-2 text-black"
              />
              {errors.date && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="patientName" className="mb-1 text-black">
                Nome do paciente
              </label>
              <input
                id="patientName"
                {...register("patientName")}
                className="w-full rounded border px-3 py-2 text-black"
                placeholder="Nome completo"
              />
              {errors.patientName && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.patientName.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="mb-1 text-black">
                Telefone
              </label>
              <input
                id="phoneNumber"
                type="tel"
                {...register("phoneNumber")}
                onChange={handlePhoneChange}
                className="w-full rounded border px-3 py-2 text-black"
                placeholder="(99) 9 9999-9999"
              />
              {errors.phoneNumber && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="professionalName" className="mb-1 text-black">
                Profissional
              </label>
              <input
                id="professionalName"
                {...register("professionalName")}
                className="w-full rounded border px-3 py-2 text-black"
                placeholder="Nome do profissional"
              />
              {errors.professionalName && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.professionalName.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="time" className="mb-1 text-black">
                Horário
              </label>
              <input
                id="time"
                type="time"
                {...register("time")}
                className="w-full rounded border px-3 py-2 text-black"
              />
              {errors.time && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.time.message}
                </p>
              )}
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
            Cadastrar
          </button>
        </div>
      </form>
    </Modal>
  );
};
