import { formatCPF, formatPhone } from "@/utils/formatters";
import { ConsultationActions } from "./ConsultationActions";
import { Consultation } from "@/models/consultation";
import { useModal } from "@/contexts/ModalContext";

const statusStyles: Record<Consultation["status"], string> = {
  Atendido: "bg-emerald-600/10 text-emerald-400",
  Aguardando: "bg-yellow-400/10 text-yellow-300",
  Cancelado: "bg-red-500/10 text-red-400",
  "Confirmação Pendente": "bg-blue-500/10 text-blue-400",
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
  const { onEdit } = useModal();

  return (
    <div className="w-full overflow-x-auto rounded-lg shadow">
      {loading ? (
        <p className="text-black p-4">Carregando consultas...</p>
      ) : (
        <table className="min-w-full table-auto border-collapse text-sm text-black bg-white">
          <thead className="bg-white text-black">
            <tr>
              <th scope="col" className="px-4 py-3 text-start">Data Consulta</th>
              <th scope="col" className="px-4 py-3 text-start">Nome do Paciente</th>
              <th scope="col" className="px-4 py-3 text-start">CPF</th>
              <th scope="col" className="px-4 py-3 text-start">Profissional de Saúde</th>
              <th scope="col" className="px-4 py-3 text-start">Telefone</th>
              <th scope="col" className="px-4 py-3 text-start">Tipo de Consulta</th>
              <th scope="col" className="px-4 py-3 text-start">Hora da Consulta</th>
              <th scope="col" className="px-4 py-3 text-start">Status</th>
              <ConsultationActions isHeader />
            </tr>
          </thead>
          <tbody>
            {consultations.map(
              ({
                id,
                patientName,
                document,
                professionalName,
                consultationType,
                phoneNumber,
                consultationDate,
                status,
              }) => {
                const dateObj = new Date(consultationDate);
                const formattedDate = dateObj.toLocaleDateString("pt-BR");
                const formattedTime = dateObj.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr key={id} className="bg-white text-black">
                    <td className="px-4 py-3 text-start">{formattedDate}</td>
                    <td className="px-4 py-3 text-start">{patientName}</td>
                    <td className="px-4 py-3 text-start">{formatCPF(document)}</td>
                    <td className="px-4 py-3 text-start">{professionalName}</td>
                    <td className="px-4 py-3 text-start">{formatPhone(phoneNumber)}</td>
                    <td className="px-4 py-3 text-start">{consultationType}</td>
                    <td className="px-4 py-3 text-start">{formattedTime}</td>
                    <td className="px-4 py-3 text-start">
                      <span
                        className={`min-w-[110px] text-start px-2 py-1 rounded-2xl text-xs font-medium inline-block ${statusStyles[status]}`}
                      >
                        {status}
                      </span>
                    </td>
                    <ConsultationActions
                      id={id}
                      onDelete={onDelete}
                      onEdit={() => {
                        const consultation = consultations.find((c) => c.id === id);
                        if (consultation) {
                          onEdit(consultation);
                        }
                      }}
                    />
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
