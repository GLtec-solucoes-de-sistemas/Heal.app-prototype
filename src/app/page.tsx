"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ConsultationTable } from "@/components/ConsultationTable";
import { ModalAddMedicalConsultation } from "@/components/modals/ModalMedicalConsultation";
import { useModal } from "@/contexts/ModalContext";
import { Consultation } from "@/models/consultation";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { openModal } = useModal();
  const { logout, loading, user } = useAuth();
  const router = useRouter();

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const fetchConsultations = async () => {
    try {
      const response = await fetch("/api/consultations");
      if (!response.ok) throw new Error("Erro ao buscar consultas");
      const data = await response.json();
      setConsultations(data);
    } catch (error) {
      console.error("Erro ao buscar consultas:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <header className="bg-[#1E1E1E] px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Painel de Consultas</h1>
        {user && !loading && (
          <div className="flex space-x-4">
            <button
              onClick={() => openModal("add")}
              className="bg-white text-teal-600 hover:bg-gray-200 px-4 py-2 rounded text-sm cursor-pointer"
            >
              + Adicionar Consulta
            </button>
            <button
              onClick={logout}
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded text-sm cursor-pointer"
            >
              {loading ? "Saindo…" : "Sair"}
            </button>
          </div>
        )}
        {!user && !loading && (
          <button
            onClick={() => router.replace("/login")}
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded text-sm cursor-pointer"
          >
            {loading ? "Redirecionando..." : "Entrar"}
          </button>
        )}
      </header>

      <main className="flex-1 px-6 py-4">
        <ConsultationTable
          consultations={consultations}
          loading={isLoadingData}
          onDelete={fetchConsultations}
        />
      </main>

      <footer className="bg-[#1E1E1E] text-center text-sm text-gray-400 py-3">
        © 2025 Heal.app — Todos os direitos reservados
      </footer>

      <ModalAddMedicalConsultation setConsultations={setConsultations} />
    </div>
  );
}
