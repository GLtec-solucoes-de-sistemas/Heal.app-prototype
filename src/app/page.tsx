import { ConsultationTable } from '@/components/ConsultationTable';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <header className="bg-[#1E1E1E] px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Painel de Consultas</h1>
        <button className="bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded text-sm cursor-pointer">
          Sair
        </button>
      </header>

      <main className="flex-1 px-6 py-4">
        <ConsultationTable />
      </main>

      <footer className="bg-[#1E1E1E] text-center text-sm text-gray-400 py-3">
        © 2025 Heal.app — Todos os direitos reservados
      </footer>
    </div>
  );
}
