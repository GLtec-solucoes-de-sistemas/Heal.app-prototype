'use client';

import React, { useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../Modal';
import { useModal } from '@/contexts/ModalContext';
import { Consultation } from '@/models/consultation';
import { formatCPF, formatPhone } from '@/utils/formatters';
import { getTodayDate } from '@/utils/date';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Select from 'react-select';

interface ModalAddMedicalConsultationProps {
  setConsultations: React.Dispatch<React.SetStateAction<Consultation[]>>;
}

const consultationSchema = z.object({
  document: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Digite um CPF válido'),
  patient_email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  consultation_type: z.string().min(1, 'Tipo de consulta é obrigatório'),
  date: z.string().min(1, 'Data é obrigatória'),
  patient_name: z.string().min(1, 'Nome do paciente é obrigatório'),
  patient_phone: z
    .string()
    .regex(
      /^\(\d{2}\) \d{4,5}-\d{4}$/,
      'Telefone deve estar no formato (99) 9 9999-9999'
    ),
  healthcare: z.string().min(1, 'Nome do profissional é obrigatório'),
  time: z.string().min(1, 'Horário é obrigatório'),
});

type ConsultationFormData = z.infer<typeof consultationSchema> & {
  date: string;
  time: string;
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

export const ModalAddMedicalConsultation = ({
  setConsultations,
}: ModalAddMedicalConsultationProps) => {
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

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = formatCPF(e.target.value);
    setValue('document', e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = formatPhone(e.target.value);
    setValue('patient_phone', e.target.value);
  };

  const onSubmit: SubmitHandler<ConsultationFormData> = async (data) => {
    try {
      const { date, time, document, patient_phone, ...rest } = data;

      const cleanedCPF = document.replace(/\D/g, '');
      const cleanedPhone = patient_phone.replace(/\D/g, '');
      const consultationDate = new Date(`${date}T${time}:00`);

      const formattedDate = format(
        consultationDate,
        "dd 'de' MMMM 'às' HH:mm",
        {
          locale: ptBR,
        }
      );

      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...rest,
          document: cleanedCPF,
          patient_phone: cleanedPhone,
          consultationDate,
          status: 'Confirmação Pendente',
        }),
      });

      if (response.ok) {
        const newConsultation = await response.json();
        const confirmationToken = newConsultation.confirmationToken;
        setConsultations((prev) => [newConsultation, ...prev]);
        closeModal();
        reset();

        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL ||
          'https://healapp-prototype.netlify.app';

        const normalizedUrl = baseUrl.startsWith('http')
          ? baseUrl
          : `https://${baseUrl}`;

        const whatsappMessageRaw = [
          `👋 *Olá ${data.patient_name}!*`,
          `📅 *Consulta:* ${formattedDate}`,
          `📍Confirme sua presença acessando o link abaixo:`,
          `${normalizedUrl}/confirm/${confirmationToken}`,
          'Após a confirmação, você pode acompanhar a fila de espera no link a seguir:',
          normalizedUrl,
        ].join('\n\n');

        const encodedMessage = encodeURIComponent(whatsappMessageRaw);

        const isMobile = /iPhone|Android|iPad/i.test(navigator.userAgent);
        const baseUrlWhatsapp = isMobile
          ? 'https://api.whatsapp.com/send'
          : 'https://web.whatsapp.com/send';

        const whatsappURL = `${baseUrlWhatsapp}?phone=55${cleanedPhone}&text=${encodedMessage}`;

        window.open(whatsappURL, '_blank');
      } else {
        const error = await response.json();
        console.error('Erro:', error.error);
      }
    } catch (error) {
      console.error('Erro ao enviar consulta:', error);
    }
  };

  useEffect(() => {
    if (modalType === 'add') {
      setValue('date', getTodayDate());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalType]);

  if (modalType !== 'add') return null;

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
                {...register('document')}
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
                placeholder="(99) 9 9999-9999"
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
