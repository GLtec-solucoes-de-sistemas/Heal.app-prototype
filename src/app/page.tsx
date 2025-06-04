'use client';

import { useEffect, useState } from 'react';
import { ConsultationTable } from '@/components/ConsultationTable';
import { ModalAddMedicalConsultation } from '@/components/modals/ModalMedicalConsultation';
import { useModal } from '@/context/modal/useModal';
import { Consultation } from './api/consultations/route';

export default function DashboardPage() {
  const { openModal } = useModal();

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await fetch('/api/consultations');
        const data = await response.json();
        setConsultations(data);
      } catch (error) {
        console.error('Erro ao buscar consultas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <header className="bg-[#1E1E1E] px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Painel de Consultas</h1>
        <div className="flex space-x-4">
          <button
            onClick={openModal}
            className="bg-white text-teal-600 hover:bg-gray-200 px-4 py-2 rounded text-sm cursor-pointer"
          >
            + Adicionar consulta
          </button>
          <button className="bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded text-sm cursor-pointer">
            Sair
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 py-4">
        <ConsultationTable consultations={consultations} loading={loading} />
      </main>

      <footer className="bg-[#1E1E1E] text-center text-sm text-gray-400 py-3">
        © 2025 Heal.app — Todos os direitos reservados
      </footer>

      <ModalAddMedicalConsultation setConsultations={setConsultations} />
    </div>
  );
}
