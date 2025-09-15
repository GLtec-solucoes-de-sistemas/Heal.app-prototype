'use client';

import React, { useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Modal } from '../Modal';
import { useModal } from '@/contexts/ModalContext';
import { Consultation, ConsultationStatus } from '@/models/consultation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatCPF, formatPhone } from '@/utils/formatters';
import Select from 'react-select';

interface ModalEditMedicalConsultationProps {
  setConsultations: React.Dispatch<React.SetStateAction<Consultation[]>>;
  selectedConsultation: Consultation | null;
  onClose?: () => void;
}

type ConsultationFormData = {
  document: string;
  patient_email: string;
  consultation_type: string;
  occurred_at: string;
  patient_name: string;
  patient_phone: string;
  healthcare: string;
  time: string;
  status: ConsultationStatus;
};

type Option = {
  value: string;
  label: string;
};

const consultationOptions: Option[] = [
  { value: 'ced', label: 'Consulta de Crescimento e Desenvolvimento (CeD)' },
  {
    value: 'citologia_oncotica',
    label: 'Consulta para coleta de citologia oncótica',
  },
  { value: 'pre_natal', label: 'Pré-natal' },
  { value: 'procedimentos', label: 'Procedimentos' },
];

const statusOptions: Option[] = [
  { value: 'confirmacao_pendente', label: 'Confirmação Pendente' },
  { value: 'atendido', label: 'Atendido' },
  { value: 'cancelado', label: 'Cancelado' },
  { value: 'aguardando', label: 'Aguardando' },
];

const consultationSchema = z.object({
  document: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Digite um CPF válido'),
  patient_email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  consultation_type: z.string().min(1, 'Tipo de consulta é obrigatório'),
  occurred_at: z.string().min(1, 'Data é obrigatória'),
  patient_name: z.string().min(1, 'Nome do paciente é obrigatório'),
  patient_phone: z
    .string()
    .regex(
      /^\(\d{2}\) \d{4,5}-\d{4}$/,
      'Telefone deve estar no formato (99) 9 9999-9999'
    ),
  healthcare: z.string().min(1, 'Nome do profissional é obrigatório'),
  time: z.string().min(1, 'Horário é obrigatório'),
  status: z.enum([
    'Atendido',
    'Cancelado',
    'Aguardando',
    'Confirmação Pendente',
  ]),
});

export function ModalEditMedicalConsultation({
  setConsultations,
  selectedConsultation,
}: ModalEditMedicalConsultationProps) {
  const { modalType, closeModal } = useModal();
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
  });

  useEffect(() => {
    if (selectedConsultation) {
      const dateObj = new Date(selectedConsultation.occurred_at);
      const date = dateObj.toISOString().slice(0, 10);
      const time = dateObj.toTimeString().slice(0, 5);

      setValue('patient_name', selectedConsultation.patient_name);
      setValue('document', formatCPF(selectedConsultation.document));
      setValue('patient_email', selectedConsultation.patient_email);
      setValue('patient_phone', formatPhone(selectedConsultation.patient_phone));
      setValue('healthcare', selectedConsultation.healthcare);
      setValue('consultation_type', selectedConsultation.consultation_type);
      setValue('occurred_at', date);
      setValue('time', time);

      const statusMap: Record<string, ConsultationStatus> = {
        'Atendido': 'Atendido',
        'Cancelado': 'Cancelado',
        'Aguardando': 'Aguardando',
        'Confirmação Pendente': 'Confirmação Pendente',
        'confirmacao_pendente': 'Confirmação Pendente',
        'atendido': 'Atendido',
        'cancelado': 'Cancelado',
        'aguardando': 'Aguardando',
      };
      setValue('status', statusMap[selectedConsultation.status] ?? 'Aguardando');
    }
  }, [selectedConsultation, setValue]);

  const handleEditConsultation: SubmitHandler<ConsultationFormData> = async (
    data
  ) => {
    if (!selectedConsultation) return;

    try {
      const { occurred_at, time, document, patient_phone, ...rest } = data;
      const cleanedCPF = document.replace(/\D/g, '');
      const cleanedPhone = patient_phone.replace(/\D/g, '');
      const consultationDate = new Date(`${occurred_at}T${time}:00`);

      const response = await fetch('/api/consultations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedConsultation.id,
          ...rest,
          document: cleanedCPF,
          patient_phone: cleanedPhone,
          consultationDate,
        }),
      });

      if (response.ok) {
        const updatedConsultation = {
          ...selectedConsultation,
          ...rest,
          document: cleanedCPF,
          patient_phone: cleanedPhone,
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
        console.error('Erro:', error.error);
      }
    } catch (error) {
      console.error('Erro ao atualizar consulta:', error);
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = formatCPF(e.target.value);
    setValue('document', e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = formatPhone(e.target.value);
    setValue('patient_phone', e.target.value);
  };

  if (modalType !== 'edit') return null;

  return (
    <Modal>
      <h2 className="text-black text-center text-xl font-semibold mb-2">
        Editar dados do paciente
      </h2>
      <span className="text-black flex justify-center mb-4">
        Altere as informações necessárias e salve as alterações.
      </span>

      <form
        onSubmit={handleSubmit(handleEditConsultation)}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="document" className="mb-1 text-black">
                CPF
              </label>
              <input
                id="document"
                {...register('document')}
                onChange={handleCPFChange}
                className="w-full rounded border px-3 py-2 text-black"
                placeholder="Digite seu CPF"
              />
              {errors.document && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.document.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="patient_email" className="mb-1 text-black">
                Email
              </label>
              <input
                id="patient_email"
                type="patient_email"
                {...register('patient_email')}
                className="w-full rounded border px-3 py-2 text-black"
                placeholder="exemplo@dominio.com"
              />
              {errors.patient_email && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.patient_email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="consultation_type" className="mb-1 text-black">
                Tipo de consulta
              </label>
              <Controller
                name="consultation_type"
                control={control}
                render={({ field }) => (
                  <Select
                    options={consultationOptions}
                    placeholder="Selecione o tipo de consulta"
                    className="text-black"
                    classNamePrefix="react-select"
                    value={consultationOptions.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => field.onChange(option?.value)}
                  />
                )}
              />
              {errors.consultation_type && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.consultation_type.message}
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
                {...register('occurred_at')}
                className="w-full rounded border px-3 py-2 text-black"
              />
              {errors.occurred_at && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.occurred_at.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="patient_name" className="mb-1 text-black">
                Nome do paciente
              </label>
              <input
                id="patient_name"
                {...register('patient_name')}
                className="w-full rounded border px-3 py-2 text-black"
                placeholder="Nome completo"
              />
              {errors.patient_name && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.patient_name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="patient_phone" className="mb-1 text-black">
                Telefone
              </label>
              <input
                id="patient_phone"
                type="tel"
                {...register('patient_phone')}
                onChange={handlePhoneChange}
                className="w-full rounded border px-3 py-2 text-black"
                placeholder="(XX) XXXXX-XXXX"
              />
              {errors.patient_phone && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.patient_phone.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="healthcare" className="mb-1 text-black">
                Profissional
              </label>
              <input
                id="healthcare"
                {...register('healthcare')}
                className="w-full rounded border px-3 py-2 text-black"
                placeholder="Nome do profissional"
              />
              {errors.healthcare && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.healthcare.message}
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
                {...register('time')}
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

        <div>
          <label htmlFor="status" className="mb-1 text-black">
            Status
          </label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                options={statusOptions}
                placeholder="Selecione o status da consulta"
                className="text-black"
                classNamePrefix="react-select"
                value={statusOptions.find(
                  (option) => option.value === field.value
                )}
                onChange={(option) => field.onChange(option?.value)}
              />
            )}
          />
          {errors.status && (
            <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>
          )}
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
}
