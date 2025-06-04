import { ConsultationActions } from './ConsultationActions';
import { Consultation } from '@/app/api/consultations/route';

const statusStyles: Record<Consultation['status'], string> = {
  Atendido: 'bg-emerald-600/10 text-emerald-400',
  'Em andamento': 'bg-yellow-400/10 text-yellow-300',
  Cancelado: 'bg-red-500/10 text-red-400',
};

type ConsultationTableProps = {
  consultations: Consultation[];
  loading: boolean;
};

export const ConsultationTable = ({ consultations, loading }: ConsultationTableProps) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg shadow">
      {loading ? (
        <p className="text-white p-4">Carregando consultas...</p>
      ) : (
        <table className="min-w-full table-auto border-collapse text-sm text-white">
          <thead className="bg-[#2A2A2A] text-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">Paciente</th>
              <th className="px-4 py-2 text-left">CPF</th>
              <th className="px-4 py-2 text-left">Telefone</th>
              <th className="px-4 py-2 text-left">Data</th>
              <th className="px-4 py-2 text-left">Horário</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map(({ id, date, time, name, status, cpf, phone }) => (
              <tr key={id} className="even:bg-[#1F1F1F] odd:bg-[#141414]">
                <td className="px-4 py-2">{name}</td>
                <td className="px-4 py-2">{cpf}</td>
                <td className="px-4 py-2">
                  {phone ? phone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3') : phone}
                </td>
                <td className="px-4 py-2">{new Date(date).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-2">{time}</td>
                <td className="px-4 py-2">
                  <span
                    className={`min-w-[110px] text-center px-2 py-1 rounded-2xl text-xs font-medium inline-block ${statusStyles[status]}`}
                  >
                    {status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <ConsultationActions id={id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
