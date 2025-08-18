'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ConsultationTable } from '@/components/ConsultationTable';
import { ModalAddMedicalConsultation } from '@/components/modals/ModalMedicalConsultation';
import { useModal } from '@/contexts/ModalContext';
import { Consultation } from '@/models/consultation';
import { useRouter } from 'next/navigation';
import { ModalEditMedicalConsultation } from '@/components/modals/ModalEditMedicalConsultation';
import { ConsultationFilters } from '@/components/ConsultationFilters';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function DashboardPage() {
  const { openModal, modalType } = useModal();
  const { logout, loading, user } = useAuth();
  const router = useRouter();

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [filters, setFilters] = useState({
    patientName: '',
    email: '',
    cpf: '',
    consultationType: '',
    professionalName: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const consultationsRef = collection(db, 'consultations');

    const unsubscribe = onSnapshot(
      consultationsRef,
      (snapshot) => {
        const consultationsData = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            consultationType: data.consultationType ?? '',
            document: data.document ?? '',
            email: data.email ?? '',
            patientName: data.patientName ?? '',
            phoneNumber: data.phoneNumber ?? '',
            professionalName: data.professionalName ?? '',
            consultationDate:
              data.consultationDate?.toDate?.().toISOString() ?? '',
            status: data.status ?? 'Pendente',
          };
        });

        setConsultations(consultationsData);
        setIsLoadingData(false);
      },
      (error) => {
        console.error('Erro ao escutar consultas:', error);
        setIsLoadingData(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredConsultations = useMemo(() => {
    return consultations.filter((consultation) => {
      const matchesName = filters.patientName
        ? consultation.patientName
            .toLowerCase()
            .includes(filters.patientName.toLowerCase())
        : true;

      const matchesCpf = filters.cpf
        ? consultation.document
            .replace(/\D/g, '')
            .includes(filters.cpf.replace(/\D/g, ''))
        : true;

      const matchesDate = (() => {
        if (!filters.startDate && !filters.endDate) return true;

        const consultationDate = new Date(consultation.consultationDate);
        const consultationDay = consultationDate.toISOString().split('T')[0];

        const startDay = filters.startDate
          ? new Date(filters.startDate).toISOString().split('T')[0]
          : null;

        const endDay = filters.endDate
          ? new Date(filters.endDate).toISOString().split('T')[0]
          : null;

        return (
          (!startDay || consultationDay >= startDay) &&
          (!endDay || consultationDay <= endDay)
        );
      })();

      const matchesEmail = filters.email
        ? consultation.email?.toLowerCase().includes(filters.email.toLowerCase())
        : true;

      const matchesConsultationType = filters.consultationType
        ? consultation.consultationType
            .toLowerCase()
            .includes(filters.consultationType.toLowerCase())
        : true;

      const matchesProfessionalName = filters.professionalName
        ? consultation.professionalName
            .toLowerCase()
            .includes(filters.professionalName.toLowerCase())
        : true;

      return (
        matchesName &&
        matchesCpf &&
        matchesDate &&
        matchesEmail &&
        matchesConsultationType &&
        matchesProfessionalName
      );
    });
  }, [consultations, filters]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <header className="bg-[#1E1E1E] px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Painel de Consultas</h1>
        {user && !loading && (
          <div className="flex space-x-4">
            <button
              onClick={() => openModal('add')}
              className="bg-white text-teal-600 hover:bg-gray-200 px-4 py-2 rounded text-sm cursor-pointer"
            >
              + Adicionar Consulta
            </button>
            <button
              onClick={logout}
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded text-sm cursor-pointer"
            >
              {loading ? 'Saindo…' : 'Sair'}
            </button>
          </div>
        )}
        {!user && !loading && (
          <button
            onClick={() => router.replace('/login')}
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded text-sm cursor-pointer"
          >
            {loading ? 'Redirecionando...' : 'Entrar'}
          </button>
        )}
      </header>

      <main className="flex-1 px-6 py-4">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <ConsultationFilters filters={filters} setFilters={setFilters} />
          <div className="flex-1 w-full overflow-auto">
            <ConsultationTable
              consultations={filteredConsultations}
              loading={isLoadingData}
              setSelectedConsultation={setSelectedConsultation}
              openModal={openModal}
            />
          </div>
        </div>
      </main>

      <footer className="bg-[#1E1E1E] text-center text-sm text-gray-400 py-3">
        © 2025 Heal.app — Todos os direitos reservados
      </footer>

      <ModalAddMedicalConsultation onClose={() => openModal(null)} />

      {selectedConsultation && modalType === 'edit' && (
        <ModalEditMedicalConsultation
          selectedConsultation={selectedConsultation}
          onClose={() => {
            setSelectedConsultation(null);
            openModal(null);
          }}
        />
      )}
    </div>
  );
}
