"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ConsultationTable } from "@/components/ConsultationTable";
import { ConsultationFilters } from "@/components/ConsultationFilters";
import { useModal } from "@/contexts/ModalContext";
import { Consultation } from "@/models/consultation";
import { useRouter } from "next/navigation";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DashboardLayout from "./dashboard/layout";
import { CirclePlus, HeartPulse, Sliders } from "lucide-react";
import { SearchInput } from "@/components/SearchInput";
import { RowsPerPageSelector } from "@/components/RowsPerPageSelector";
import { ConsultationCalendar } from "@/components/ConsultationCalendar";

export default function ConsultationsPage() {
  const { onAdd } = useModal();
  const { logout, loading, user } = useAuth();
  const router = useRouter();

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [filters, setFilters] = useState({
    patientName: "",
    email: "",
    cpf: "",
    consultationType: "",
    professionalName: "",
    startDate: "",
    endDate: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const consultationsRef = collection(db, "consultations");

    const unsubscribe = onSnapshot(
      consultationsRef,
      (snapshot) => {
        const consultationsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            consultationType: data.consultationType ?? "",
            document: data.document ?? "",
            email: data.email ?? "",
            patientName: data.patientName ?? "",
            phoneNumber: data.phoneNumber ?? "",
            professionalName: data.professionalName ?? "",
            consultationDate:
              data.consultationDate?.toDate?.().toISOString() ?? "",
            status: data.status ?? "Pendente",
          };
        });
        setConsultations(consultationsData);
        setIsLoadingData(false);
      },
      (error) => {
        console.error("Erro ao escutar consultas:", error);
        setIsLoadingData(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredConsultations = useMemo(() => {
    return consultations
      .filter((consultation) => {
        const matchesSearch = searchQuery
          ? consultation.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            consultation.consultationType.toLowerCase().includes(searchQuery.toLowerCase())
          : true;

        const matchesName = filters.patientName
          ? consultation.patientName
              .toLowerCase()
              .includes(filters.patientName.toLowerCase())
          : true;

        const matchesCpf = filters.cpf
          ? consultation.document
              .replace(/\D/g, "")
              .includes(filters.cpf.replace(/\D/g, ""))
          : true;

        const matchesDate = (() => {
          if (!filters.startDate && !filters.endDate) return true;
          const consultationDate = new Date(consultation.consultationDate);
          const consultationDay = consultationDate.toISOString().split("T")[0];
          const startDay = filters.startDate
            ? new Date(filters.startDate).toISOString().split("T")[0]
            : null;
          const endDay = filters.endDate
            ? new Date(filters.endDate).toISOString().split("T")[0]
            : null;
          return (!startDay || consultationDay >= startDay) &&
            (!endDay || consultationDay <= endDay);
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
          matchesSearch &&
          matchesName &&
          matchesCpf &&
          matchesDate &&
          matchesEmail &&
          matchesConsultationType &&
          matchesProfessionalName
        );
      })
      .slice(0, rowsPerPage);
  }, [consultations, filters, searchQuery, rowsPerPage]);

  return (
    <DashboardLayout>
      <div className="min-h-screen flex flex-col text-white">
        <header className="bg-white px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-normal text-black flex items-center">
            <HeartPulse size={24} className="mr-2" />
            Agenda de consultas
          </h1>

          {user && !loading && (
            <div className="flex space-x-4">
              <button
                onClick={onAdd}
                className="flex items-center text-white bg-[#3B695B] hover:bg-[#3a7764] px-4 py-3 rounded text-sm cursor-pointer"
              >
                <CirclePlus className="mr-2 w-5 h-5" />
                Nova Consulta
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
        </header>

        <main className="flex-1 px-6 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Pesquise por consulta ou paciente..."
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="flex items-center border text-black border-[#09121C1A] px-4 py-2 rounded text-sm"
              >
                <Sliders className="mr-2 w-5 h-5 text-[#09121C]"/>
                Filtrar
              </button>
              <RowsPerPageSelector
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
              />
            </div>
          </div>

          {isFilterModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-zinc-800 p-6 rounded-lg shadow max-w-lg w-full">
                <h2 className="text-lg font-semibold mb-4 text-white">Filtrar Consultas</h2>
                <ConsultationFilters filters={filters} setFilters={setFilters} />
                <div className="flex justify-end mt-4 gap-2">
                  <button
                    onClick={() => setIsFilterModalOpen(false)}
                    className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6 border border-[#09121C1A] rounded-lg">
            <div className="lg:w-1/3">
              <ConsultationCalendar
                consultations={consultations}
                onSelectDate={(date) => {
                  if (!date) {
                    setFilters({ ...filters, startDate: "", endDate: "" });
                    return;
                  }
                  const selectedDate = date.toISOString().split("T")[0];
                  setFilters({ ...filters, startDate: selectedDate, endDate: selectedDate });
                }}
              />
            </div>

            <div className="flex-1 overflow-auto">
              <ConsultationTable
                consultations={filteredConsultations}
                loading={isLoadingData}
              />
            </div>
          </div>
        </main>

        <footer className="bg-[#1E1E1E] text-center text-sm text-gray-400 py-3">
          © 2025 Heal.app — Todos os direitos reservados
        </footer>
      </div>
    </DashboardLayout>
  );
}