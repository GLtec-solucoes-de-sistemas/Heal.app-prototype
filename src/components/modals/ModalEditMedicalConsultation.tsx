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
  selectedConsultation: Consultation | null;
  onClose?: () => void;
}

type ConsultationFormData = Omit<Consultation, 'id' | 'consultationDate'> & {
  date: string;
  time: string;
  status: ConsultationStatus;
};

type Option = { value: string; label: string };

const consultationOptions: Option[] = [
  { value: 'ced', label: 'Consulta de Crescimento e Desenvolvimento (CeD)' },
  { value: 'citologia_oncotica', label: 'Consulta para coleta de citologia oncótica' },
  { value: 'pre_natal', label: 'Pré-natal' },
  { value: 'procedimentos', label: 'Procedimentos' },
];

const statusOptions: Option[] = [
  { value: 'Confirmação Pendente', label: 'Confirmação Pendente' },
  { value: 'Atendido', label: 'Atendido' },
  { value: 'Cancelado', label: 'Cancelado' },
  { value: 'Aguardando', label: 'Aguardando' },
];

const consultationSchema = z.object({
  document: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Digite um CPF válido'),
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  consultationType: z.string().min(1, 'Tipo de consulta é obrigatório'),
  date: z.string().min(1, 'Data é obrigatória'),
  patientName: z.string().min(1, 'Nome do paciente é obrigatório'),
  phoneNumber: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone deve estar no formato (99) 9 9999-9999'),
  professionalName: z.string().min(1, 'Nome do profissional é obrigatório'),
  time: z.string().min(1, 'Horário é obrigatório'),
  status: z.enum(['Atendido', 'Cancelado', 'Aguardando', 'Confirmação Pendente']),
});

export function ModalEditMedicalConsultation({
  selectedConsultation,
}: ModalEditMedicalConsultationProps) {
  const { modalType, closeModal } = useModal();

  const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
  });

  useEffect(() => {
    if (selectedConsultation) {
      const dateObj = new Date(selectedConsultation.consultationDate);
      const date = dateObj.toISOString().slice(0, 10);
      const time = dateObj.toTimeString().slice(0, 5);

      setValue('patientName', selectedConsultation.patientName);
      setValue('document', formatCPF(selectedConsultation.document));
      setValue('email', selectedConsultation.email);
      setValue('phoneNumber', formatPhone(selectedConsultation.phoneNumber));
      setValue('professionalName', selectedConsultation.professionalName);
      setValue('consultationType', selectedConsultation.consultationType);
      setValue('date', date);
      setValue('time', time);
      setValue('status', selectedConsultation.status);
    }
  }, [selectedConsultation, setValue]);

  const handleEditConsultation: SubmitHandler<ConsultationFormData> = async (data) => {
    if (!selectedConsultation) return;

    try {
      const { date, time, document, phoneNumber, ...rest } = data;
      const cleanedCPF = document.replace(/\D/g, '');
      const cleanedPhone = phoneNumber.replace(/\D/g, '');
      const consultationDate = new Date(`${date}T${time}:00`);

      await fetch('/api/consultations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedConsultation.id,
          ...rest,
          document: cleanedCPF,
          phoneNumber: cleanedPhone,
          consultationDate,
        }),
      });

      closeModal();
      reset();
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
    setValue('phoneNumber', e.target.value);
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
              <label htmlFor="email" className="mb-1 text-black">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
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
              <Controller
                name="consultationType"
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
                {...register('date')}
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
                {...register('patientName')}
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
                {...register('phoneNumber')}
                onChange={handlePhoneChange}
                className="w-full rounded border px-3 py-2 text-black"
                placeholder="(XX) XXXXX-XXXX"
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
                {...register('professionalName')}
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
