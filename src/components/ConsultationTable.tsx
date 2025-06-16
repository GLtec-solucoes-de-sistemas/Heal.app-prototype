import { ConsultationActions } from './ConsultationActions';
import { Consultation } from '@/models/consultation';

const statusStyles: Record<Consultation['status'], string> = {
  Atendido: 'bg-emerald-600/10 text-emerald-400',
  Aguardando: 'bg-yellow-400/10 text-yellow-300',
  Cancelado: 'bg-red-500/10 text-red-400',
};

type ConsultationTableProps = {
  consultations: Consultation[];
  loading: boolean;
  onDelete?: () => void;
};

export const ConsultationTable = ({
  consultations,
  loading,
  onDelete,
}: ConsultationTableProps) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg shadow">
      {loading ? (
        <p className="text-white p-4">Carregando consultas...</p>
      ) : (
        <table className="min-w-full table-auto border-collapse text-sm text-white">
          <thead className="bg-[#2A2A2A] text-gray-300">
            <tr>
              <th className="px-4 py-2 text-center">Paciente</th>
              <th className="px-4 py-2 text-center">CPF</th>
              <th className="px-4 py-2 text-center">Profissional</th>
              <th className="px-4 py-2 text-center">Telefone</th>
              <th className="px-4 py-2 text-center">Data</th>
              <th className="px-4 py-2 text-center">Horário</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map(
              ({
                id,
                patientName,
                document,
                professionalName,
                phoneNumber,
                consultationDate,
                status,
              }) => {
                const dateObj = new Date(consultationDate);
                const formattedDate = dateObj.toLocaleDateString('pt-BR');
                const formattedTime = dateObj.toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr key={id} className="even:bg-[#1F1F1F] odd:bg-[#141414]">
                    <td className="px-4 py-2 text-center">{patientName}</td>
                    <td className="px-4 py-2 text-center">{document}</td>
                    <td className="px-4 py-2 text-center">
                      {professionalName}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {phoneNumber
                        ? phoneNumber.replace(
                            /^(\d{2})(\d{5})(\d{4})$/,
                            '($1) $2-$3'
                          )
                        : phoneNumber}
                    </td>
                    <td className="px-4 py-2 text-center">{formattedDate}</td>
                    <td className="px-4 py-2 text-center">{formattedTime}</td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`min-w-[110px] text-center px-2 py-1 rounded-2xl text-xs font-medium inline-block ${statusStyles[status]}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="text-center px-4 py-2">
                      <ConsultationActions id={id} onDelete={onDelete} />
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};
