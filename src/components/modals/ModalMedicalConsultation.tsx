'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Modal } from '../Modal';
import { useModal } from '@/context/modal/useModal';
import { Consultation } from '@/app/api/consultations/route';

interface ModalAddMedicalConsultationProps {
  setConsultations: React.Dispatch<React.SetStateAction<Consultation[]>>;
}

export const ModalAddMedicalConsultation = ({ setConsultations}: ModalAddMedicalConsultationProps) => {
  const { isOpenModal, closeModal } = useModal();
  const { register, handleSubmit, reset } = useForm<Consultation>();

  const onSubmit: SubmitHandler<Consultation> = async (data) => {
    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          status: 'Em andamento',
        }),
      });

      if (response.ok) {
        const newConsultation = await response.json();

        setConsultations((prev) => [newConsultation, ...prev]);

        closeModal();
        reset();
      } else {
        const error = await response.json();
        console.error('Erro:', error.error);
      }
    } catch (error) {
      console.error('Erro ao enviar consulta:', error);
    }
  };

  if (!isOpenModal) return null;

  return (
    <Modal>
      <h2 className="text-black text-center text-xl font-semibold mb-2">Cadastro de paciente</h2>
      <span className="text-black flex justify-center mb-4">Adicione as informações do paciente para adiciona-lo na lista.</span>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="cpf" className="mb-1 text-black">CPF</label>
              <input
                id="cpf"
                {...register('cpf', { required: true })}
                className="w-full rounded border px-3 py-2 text-black focus:border-teal-600 focus:outline-none"
                placeholder="Digite seu CPF"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 text-black">Email</label>
              <input
                id="email"
                type="email"
                {...register('email', { required: true })}
                className="w-full rounded border px-3 py-2 text-black focus:border-teal-600 focus:outline-none"
                placeholder="exemplo@dominio.com"
                required
              />
            </div>

            <div>
              <label htmlFor="consultationType" className="mb-1 text-black">Tipo de Consulta</label>
              <input
                id="consultationType"
                {...register('consultationType', { required: true })}
                className="w-full rounded border px-3 py-2 text-black focus:border-teal-600 focus:outline-none"
                placeholder="Tipo de consulta"
                required
              />
            </div>

            <div>
              <label htmlFor="date" className="mb-1 text-black">Data</label>
              <input
                id="date"
                type="date"
                {...register('date', { required: true })}
                className="w-full rounded border px-3 py-2 text-black focus:border-teal-600 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 text-black">Nome do paciente</label>
              <input
                id="name"
                {...register('name', { required: true })}
                className="w-full rounded border px-3 py-2 text-black focus:border-teal-600 focus:outline-none"
                placeholder="Nome completo"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-1 text-black">Telefone</label>
              <input
                id="phone"
                type="tel"
                {...register('phone', { required: true })}
                className="w-full rounded border px-3 py-2 text-black focus:border-teal-600 focus:outline-none"
                placeholder="(XX) XXXXX-XXXX"
                required
              />
            </div>

            <div>
              <label htmlFor="professional" className="mb-1 text-black">Profissional</label>
              <input
                id="professional"
                {...register('professional', { required: true })}
                className="w-full rounded border px-3 py-2 text-black focus:border-teal-600 focus:outline-none"
                placeholder="Nome do profissional"
                required
              />
            </div>

            <div>
              <label htmlFor="time" className="mb-1 text-black">Horário</label>
              <input
                id="time"
                type="time"
                {...register('time', { required: true })}
                className="w-full rounded border px-3 py-2 text-black focus:border-teal-600 focus:outline-none"
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
            className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </Modal>
  );
};
