import { ConsultationActions } from './ConsultationActions';

type Consultation = {
  id: string;
  date: string;
  time: string;
  patient: string;
  status: 'Atendido' | 'Em andamento' | 'Cancelado';
};

const data: Consultation[] = [
  {
    id: '1',
    date: '29/05/2025',
    time: '12:30',
    patient: 'João',
    status: 'Atendido',
  },
  {
    id: '2',
    date: '29/05/2025',
    time: '13:00',
    patient: 'Maria',
    status: 'Cancelado',
  },
  {
    id: '3',
    date: '30/05/2025',
    time: '09:00',
    patient: 'Carlos',
    status: 'Em andamento',
  },
  {
    id: '4',
    date: '30/05/2025',
    time: '10:15',
    patient: 'Fernanda',
    status: 'Atendido',
  },
  {
    id: '5',
    date: '30/05/2025',
    time: '11:45',
    patient: 'Bruno',
    status: 'Cancelado',
  },
  {
    id: '6',
    date: '31/05/2025',
    time: '08:00',
    patient: 'Paula',
    status: 'Atendido',
  },
  {
    id: '7',
    date: '31/05/2025',
    time: '08:30',
    patient: 'Ricardo',
    status: 'Em andamento',
  },
  {
    id: '8',
    date: '31/05/2025',
    time: '09:15',
    patient: 'Juliana',
    status: 'Cancelado',
  },
  {
    id: '9',
    date: '01/06/2025',
    time: '14:00',
    patient: 'Lucas',
    status: 'Atendido',
  },
  {
    id: '10',
    date: '01/06/2025',
    time: '15:30',
    patient: 'Beatriz',
    status: 'Em andamento',
  },
  {
    id: '11',
    date: '01/06/2025',
    time: '16:00',
    patient: 'Roberta',
    status: 'Atendido',
  },
  {
    id: '12',
    date: '01/06/2025',
    time: '17:00',
    patient: 'Eduardo',
    status: 'Cancelado',
  },
];

const statusStyles: Record<Consultation['status'], string> = {
  Atendido: 'bg-emerald-600/10 text-emerald-400',
  'Em andamento': 'bg-yellow-400/10 text-yellow-300',
  Cancelado: 'bg-red-500/10 text-red-400',
};

export const ConsultationTable = () => {
  return (
    <div className="w-full overflow-x-auto rounded-lg shadow">
      <table className="min-w-full table-auto border-collapse text-sm text-white">
        <thead className="bg-[#2A2A2A] text-gray-300">
          <tr>
            <th className="px-4 py-2 text-left">Data</th>
            <th className="px-4 py-2 text-left">Horário</th>
            <th className="px-4 py-2 text-left">Paciente</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ id, date, time, patient, status }) => (
            <tr key={id} className="even:bg-[#1F1F1F] odd:bg-[#141414]">
              <td className="px-4 py-2">{date}</td>
              <td className="px-4 py-2">{time}</td>
              <td className="px-4 py-2">{patient}</td>
              <td className="px-4 py-2">
                <span
                  className={`min-w-[110px] px-2 py-1 rounded-2xl text-xs font-medium inline-block ${statusStyles[status]}`}
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
    </div>
  );
};
