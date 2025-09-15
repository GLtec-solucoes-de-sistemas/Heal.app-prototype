import { formatCPF, formatPhone } from "@/utils/formatters";
import { ConsultationActions } from "./ConsultationActions";
import { Consultation } from "@/models/consultation";

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
  setSelectedConsultation: React.Dispatch<
    React.SetStateAction<Consultation | null>
  >;
  openModal: (type: "add" | "edit" | null) => void;
};

export const ConsultationTable = ({
  consultations,
  loading,
  onDelete,
  setSelectedConsultation,
  openModal,
}: ConsultationTableProps) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg shadow">
      {loading ? (
        <p className="text-white p-4">Carregando consultas...</p>
      ) : (
        <table className="min-w-full table-auto border-collapse text-sm text-white">
          <thead className="bg-[#2A2A2A] text-gray-300">
            <tr>
              <th scope="col" className="px-4 py-2 text-center">
                Paciente
              </th>
              <th scope="col" className="px-4 py-2 text-center">
                CPF
              </th>
              <th scope="col" className="px-4 py-2 text-center">
                Profissional
              </th>
              <th scope="col" className="px-4 py-2 text-center">
                Telefone
              </th>
              <th scope="col" className="px-4 py-2 text-center">
                Tipo de Consulta
              </th>
              <th scope="col" className="px-4 py-2 text-center">
                Data
              </th>
              <th scope="col" className="px-4 py-2 text-center">
                Horário
              </th>
              <th scope="col" className="px-4 py-2 text-center">
                Status
              </th>
              <ConsultationActions isHeader />
            </tr>
          </thead>
          <tbody>
            {consultations.map(
              ({
                id,
                occurred_at,
                document,
                consultation_type,
                healthcare,
                patient_email,
                patient_name,
                patient_phone,
                status,
              }) => {
                const dateObj = new Date(occurred_at);
                const formattedDate = dateObj.toLocaleDateString("pt-BR");
                const formattedTime = dateObj.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr key={id} className="even:bg-[#1F1F1F] odd:bg-[#141414]">
                    <td className="px-4 py-2 text-center">{patient_name}</td>
                    <td className="px-4 py-2 text-center">
                      {formatCPF(document)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {healthcare}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {formatPhone(patient_phone)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {consultation_type}
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
                    <ConsultationActions
                      id={id}
                      onDelete={onDelete}
                      onEdit={() => {
                        const consultation = consultations.find(
                          (c) => c.id === id,
                        );
                        if (consultation) {
                          setSelectedConsultation(consultation);
                          openModal("edit");
                        }
                      }}
                    />
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};
